const { IncomingWebhook } = require('@slack/webhook');
const core = require('@actions/core');
const axios = require('axios').default;
const path = require('path');
const csv = require('csv-parser');
const fastContentTypeParse = require('fast-content-type-parse');
const { PassThrough } = require('stream');

const inferContentTypeFromExt = (url) => {
  switch (path.extname(url)) {
    case '.csv': return 'text/csv';
    case '.json':
    default:
      return 'application/json';
  }
}

const getQuoteArray = async (data, contentType) => {
  switch (contentType) {
    case 'application/json':
      return data.data.map(({quote}) => quote);
    case 'text/csv':
      return new Promise((res) => {
        const passthru = new PassThrough();
        const results = [];
        passthru
          .pipe(csv())
          .on('data', ({quote}) => results.push(quote))
          .on('end', () => res(results))
        ;
        passthru.push(data);
        passthru.end();
      });
    default:
      throw new Error(`Unknown content type ${contentType}`);
  }
}

const getRandomQuote = async (url) => {
  const res = await axios.get(url);
  const contentType = res.headers['content-type'] || inferContentTypeFromExt(res.config.url);
  const quotes = await getQuoteArray(res.data, fastContentTypeParse.parse(contentType).type);
  const n = Math.floor(Math.random() * quotes.length);
  return quotes[n];
}

(async() => {
  try {
    const url = process.env.INCOMING_WEBHOOK || core.getInput('incoming-webhook');
    const quotesUrl = process.env.QUOTES_URL || core.getInput('quotes-url') || 'https://your-fortune.github.io/data/murphys-law.json';
    const messageFormat = process.env.MESSAGE_FORMAT || core.getInput('message-format') || '%quote%';
    
    const webhook = new IncomingWebhook(url);
    const quote = await getRandomQuote(quotesUrl);
    webhook.send(messageFormat.replaceAll('%quote%', quote));
  } catch (error) {
    core.setFailed(error.message);
  }
})();
