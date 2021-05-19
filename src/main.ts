import { inspect } from 'util'
import * as core from '@actions/core'
import { getBearerToken } from './auth'
import { makeAnalyticsClient, NUM_TOP_PAGES } from './analytics'

const NAME = '🚀 [ackee-action]'

export async function run(): Promise<void> {
  try {
    // core.debug() prints only when the secret `ACTIONS_RUNNER_DEBUG` is true

    core.info(`${NAME} Check required inputs`)
    // All of these input parameters are required. We throw if any are missing.
    const endpoint = core.getInput('endpoint', { required: true })
    const username = core.getInput('username', { required: true })
    const password = core.getInput('password', { required: true })
    const domainId = core.getInput('domain_id', { required: true })

    core.info(`${NAME} Process optional inputs, set defaults`)

    const query = core.getInput('query')
    core.info(`${NAME} INPUT[query] = ${query}`)

    const numTopPages = Number(core.getInput('num_top_pages')) || NUM_TOP_PAGES
    core.info(`${NAME} INPUT[num_top_pages] = ${numTopPages}`)

    core.debug(`${NAME} Authenticate with the Ackee GraphQL server`)
    const token = await getBearerToken({ endpoint, username, password })
    core.saveState('tokenObtained', true)
    core.debug(`${NAME} Bearer token obtained from Ackee server`)

    core.debug(`${NAME} Create analytics GraphQL client`)
    const analytics = makeAnalyticsClient({
      endpoint,
      domainId,
      numTopPages,
      token
    })
    core.saveState('clientInitialized', true)

    core.debug(`${NAME} Fetch data from Ackee GraphQL server`)
    core.saveState('fetchStarted', true)
    const domains = await analytics.domains()
    const domainsFacts = await analytics.domainsFacts()
    const events = await analytics.events()
    const facts = await analytics.facts()
    const topPages = await analytics.topPages()
    core.saveState('fetchEnded', true)

    // stringify or not? Probably yes...
    // https://github.com/actions/toolkit/issues/370
    const data = JSON.stringify({
      domains,
      domainsFacts,
      events,
      facts,
      topPages
    })
    core.debug(`${NAME} OUTPUT[data] = ${data}`)
    core.setOutput('data', data)
  } catch (error) {
    core.debug(inspect(error))
    core.setFailed(error.message)
  }
}
// TODO: use saveState('pidToKill') to perform a cleanup
// https://github.com/actions/toolkit/blob/main/packages/core/README.md

run()
