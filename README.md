# slack-quotes-bot
Bot that sends random quotes to a Slack incoming webhook

## Parameters
| name             | required | description                                                                                                       |
|------------------|----------|-------------------------------------------------------------------------------------------------------------------|
| incoming-webhook | **yes**  | Slack incoming webhook URL                                                                                        |
| message-format   | no       | Format of the message to be sent to Slack, where a `%quote%` string is replaced by the actual quote                 |
| quotes-url       | no       | URL to get the quotes from. By default, it fetches them from https://your-fortune.github.io/data/murphys-law.json |

## Example
Send a message every morning at 9AM UTC from Monday to Friday.
```yaml
on:
  schedule:
    - cron: '0 9 * * 1-5'
  
jobs:
  send-slack-message:
    runs-on: ubuntu-latest
    name: Send Slack message
    steps:
      - name: Get weekday
        id: weekday
        run: echo "::set-output name=weekday::`date +%A`"
      - name: Send message
        uses: alonsohki/slack-quotes-bot@v1
        with:
          incoming-webhook: 'https://hooks.slack.com/services/xxxxxxxxx/xxxxxxxxxx/xxxxxxxxx'
          message-format: 'Good morning on this beautiful ${{ steps.weekday.outputs.weekday }}. Remember: %quote%'
```
