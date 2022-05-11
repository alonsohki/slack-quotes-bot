const { IncomingWebhook } = require('@slack/webhook');
const core = require('@actions/core');
const axios = require('axios').default;

const getRandomQuote = async (url) => {
  const res = await axios.get(url);
  const quotes = res.data.data;
  const n = Math.floor(Math.random() * quotes.length);
  return quotes[n].quote;
}

(async() => {
  try {
    const url = core.getInput('incoming-webhook');
    const quotesUrl = core.getInput('quotes-url') || 'https://your-fortune.github.io/data/murphys-law.json';
    const messageFormat = core.getInput('message-format') || '%quote%';
    
    const webhook = new IncomingWebhook(url);
    const quote = await getRandomQuote(quotesUrl);
    webhook.send(messageFormat.replaceAll('%quote%', quote));
  } catch (error) {
    core.setFailed(error.message);
  }
})();
