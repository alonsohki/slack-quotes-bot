const { IncomingWebhook } = require('@slack/webhook');
const core = require('@actions/core');

try {
  const url = core.getInput('incoming-webhook');
  const webhook = new IncomingWebhook(url);
  webhook.send('Hello world');
} catch (error) {
  core.setFailed(error.message);
}
