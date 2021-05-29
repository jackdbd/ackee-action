# Ackee Analytics Action 📊 📈

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release) [![Coventional Commits guidelines](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://www.conventionalcommits.org/en/v1.0.0/) ![ci workflow](https://github.com/jackdbd/ackee-action/actions/workflows/ci.yml/badge.svg) [![Coverage Status](https://coveralls.io/repos/github/jackdbd/ackee-action/badge.svg?branch=main)](https://coveralls.io/github/jackdbd/ackee-action?branch=main) [![CodeFactor](https://www.codefactor.io/repository/github/jackdbd/ackee-action/badge)](https://www.codefactor.io/repository/github/jackdbd/ackee-action)

GitHub action to generate an Ackee analytics report.

## Inputs

### `endpoint`

**Required** — The URL for the /api endpoint of your Ackee GraphQL API server. Example: `https://demo.ackee.electerious.com/api`

### `username`

**Required** — The username that you use to authenticate with your GraphQL API server.

### `password`

**Required** — The password that you use to authenticate with your GraphQL API server.

### `domain_id`

**Required** — The ID of the domain you are monitoring with Ackee.

### `num_top_pages`

Optional — The top-performing N pages of the domain. Defaults to `10`.

### `query`

Optional — A custom GraphQL query. Maybe use the [Ackee demo](https://demo.ackee.electerious.com/api) to come up with your custom GraphQL query.

For example:

```graphql
query getTop10BrowsersOfLast6Months {
  domains {
    statistics {
      browsers(sorting: TOP, type: WITH_VERSION, range: LAST_6_MONTHS, limit: 10) {
        id
        count
      }
    }
  }
}
```

## Outputs

### `data`

The `data` key of the response body received from the Ackee GraphQL API server.

## Basic Usage

```yaml
steps:
  - name: Fetch analytics data from an Ackee GraphQL API server
    id: ackee
    uses: 'TODO-action-version-here'
    with:
      endpoint: ${{ secrets.ACKEE_API_ENDPOINT }}
      username: ${{ secrets.ACKEE_USERNAME }}
      password: ${{ secrets.ACKEE_PASSWORD }}
      domain_id: ${{ secrets.ACKEE_DOMAIN_ID }}
  - name: Dump data
    run: echo ${{ steps.ackee.outputs.data }}
```

*Note*: to access deep values of `outputs.data`, use [fromJSON()](https://docs.github.com/en/actions/reference/context-and-expression-syntax-for-github-actions#fromjson).

## Examples

### Ackee => Telegram weekly report

```yaml
name: 'Ackee to Telegram weekly'

on:
  schedule:
    # https://crontab.guru/once-a-week
    - cron:  '0 0 * * 0'

jobs:
  ackee-weekly-report:
    name: Send weekly report
    runs-on: ubuntu-latest
    steps:
      - name: Fetch data from Ackee
        id: ackee
        uses: 'TODO-action-version-here'
        with:
          endpoint: ${{ secrets.ACKEE_API_ENDPOINT }}
          username: ${{ secrets.ACKEE_USERNAME }}
          password: ${{ secrets.ACKEE_PASSWORD }}
          domain_id: ${{ secrets.ACKEE_DOMAIN_ID }}
      - name: Send report to Telegram
        uses: appleboy/telegram-action@master
        # https://github.com/appleboy/telegram-action
        # This is a container action, so it must run on Linux (it would fail if
        # `runs-on` is either `windows-latest` or `macos-latest`)
        env:
          ACKEE_REPORT: ${{ steps.ackee.outputs.data }}
        with:
          to: ${{ secrets.TELEGRAM_TO }}
          token: ${{ secrets.TELEGRAM_TOKEN }}
          message: |
            🚀 Ackee weekly report!
            ${{ env.ACKEE_REPORT }}
```

### Ackee => Slack on demand report

```yaml
name: 'Ackee to Slack on demand'

on:
  # allow to trigger this workflow manually
  workflow_dispatch:

jobs:
  ackee-on-demand-report:
    name: Send report on demand
    runs-on: ubuntu-latest
    steps:
      - name: Fetch data from Ackee
        id: ackee
        uses: 'TODO-action-version-here'
        with:
          endpoint: ${{ secrets.ACKEE_API_ENDPOINT }}
          username: ${{ secrets.ACKEE_USERNAME }}
          password: ${{ secrets.ACKEE_PASSWORD }}
          domain_id: ${{ secrets.ACKEE_DOMAIN_ID }}
      - name: Send report to Slack
        uses: pullreminders/slack-action@master
        # https://github.com/abinoda/slack-action
        # This is a container action, so it must run on Linux
        env:
          ACKEE_REPORT: ${{ steps.ackee.outputs.data }}
          SLACK_BOT_TOKEN: ${{ secrets.SLACK_BOT_TOKEN }}
          SLACK_CHANNEL_ID: ${{ secrets.SLACK_CHANNEL_ID }}
        with:
          args: '{\"channel\":\"${{ env.SLACK_CHANNEL_ID }}\",\"text\":\"${{ env.ACKEE_REPORT }}\"}'
```

You could use the [GitHub CLI](https://github.com/cli/cli) to trigger the workflow

```sh
# maybe pick a shorter name for your workflow ;-)
gh workflow run 'Ackee to Slack on demand'
```
