# Ackee Analytics Action 📊 📈

![ci workflow](https://github.com/jackdbd/ackee-action/actions/workflows/ci.yml/badge.svg) [![Coverage Status](https://coveralls.io/repos/github/jackdbd/ackee-action/badge.svg?branch=main)](https://coveralls.io/github/jackdbd/ackee-action?branch=main) [![CodeFactor](https://www.codefactor.io/repository/github/jackdbd/ackee-action/badge)](https://www.codefactor.io/repository/github/jackdbd/ackee-action)

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

## Features

- pre-push hook with [husky](https://typicode.github.io/husky/#/) so I don't forget to bundle `lib/*` into `dist/index.js` with [ncc](https://github.com/vercel/ncc).
