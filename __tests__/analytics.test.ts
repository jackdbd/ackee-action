import { gql } from 'graphql-request'
import { getBearerToken } from '../src/auth'
import { makeAnalyticsClient, NUM_TOP_PAGES } from '../src/analytics'

const QUERY_TOP10_BROWSERS = gql`
  query getTop10BrowsersOfLast6Months {
    domains {
      statistics {
        browsers(
          sorting: TOP
          type: WITH_VERSION
          range: LAST_6_MONTHS
          limit: 10
        ) {
          id
          count
        }
      }
    }
  }
`

const QUERY_EVENTS = gql`
  query getEvents {
    events {
      id
      title
      statistics {
        chart(interval: DAILY, type: TOTAL) {
          id
          count
        }
        list(sorting: TOP, type: TOTAL) {
          id
          count
        }
      }
    }
  }
`

describe('makeAnalyticsClient', () => {
  it('throws when numTopPages is not a number', () => {
    const numTopPages = parseInt('foo', 10)

    expect(() => {
      makeAnalyticsClient({
        endpoint: '',
        domainId: '',
        token: '',
        numTopPages
      })
    }).toThrowError(`numTopPages is not a number: ${numTopPages}`)
  })

  it('returns the expected properties', () => {
    const client = makeAnalyticsClient({
      endpoint: '',
      domainId: '',
      token: ''
    })

    expect(client).toHaveProperty('domains')
    expect(client).toHaveProperty('events')
    expect(client).toHaveProperty('facts')
    expect(client.resultFromQuery).toBeUndefined()
    expect(client).toHaveProperty('topPages')
  })
})

describe('domains', () => {
  const ackeeAuthConfig = {
    endpoint: process.env.INPUT_ENDPOINT as string,
    username: process.env.INPUT_USERNAME as string,
    password: process.env.INPUT_PASSWORD as string
  }

  it('throws when Bearer token is missing', async () => {
    const client = makeAnalyticsClient({
      endpoint: process.env.INPUT_ENDPOINT as string,
      domainId: process.env.INPUT_DOMAIN_ID as string,
      token: ''
    })

    await expect(client.domains()).rejects.toThrowError(/Token missing/)
  })

  it('each domain has `id` and `title`', async () => {
    const token = await getBearerToken(ackeeAuthConfig)
    const client = makeAnalyticsClient({
      endpoint: process.env.INPUT_ENDPOINT as string,
      domainId: process.env.INPUT_DOMAIN_ID as string,
      token
    })

    const domains = await client.domains()
    for (const domain of domains) {
      expect(domain).toHaveProperty('id')
      expect(domain).toHaveProperty('title')
    }
  })
})

describe('facts', () => {
  const ackeeAuthConfig = {
    endpoint: process.env.INPUT_ENDPOINT as string,
    username: process.env.INPUT_USERNAME as string,
    password: process.env.INPUT_PASSWORD as string
  }

  it('returns the expected data', async () => {
    const token = await getBearerToken(ackeeAuthConfig)
    const client = makeAnalyticsClient({
      endpoint: process.env.INPUT_ENDPOINT as string,
      domainId: process.env.INPUT_DOMAIN_ID as string,
      token
    })

    const facts = await client.facts()
    expect(facts).toHaveProperty('activeVisitors')
    expect(facts).toHaveProperty('averageDuration')
    expect(facts).toHaveProperty('averageViews')
    expect(facts).toHaveProperty('viewsToday')
    expect(facts).toHaveProperty('viewsMonth')
    expect(facts).toHaveProperty('viewsYear')
  })
})

describe('events', () => {
  const ackeeAuthConfig = {
    endpoint: process.env.INPUT_ENDPOINT as string,
    username: process.env.INPUT_USERNAME as string,
    password: process.env.INPUT_PASSWORD as string
  }

  it('returns the expected data', async () => {
    const token = await getBearerToken(ackeeAuthConfig)
    const client = makeAnalyticsClient({
      endpoint: process.env.INPUT_ENDPOINT as string,
      domainId: process.env.INPUT_DOMAIN_ID as string,
      token
    })

    const events = await client.events()

    for (const event of events) {
      expect(event).toHaveProperty('id')
      expect(event).toHaveProperty('title')
      expect(event).toHaveProperty('statistics')
    }
  })
})

describe('topPages', () => {
  const ackeeAuthConfig = {
    endpoint: process.env.INPUT_ENDPOINT as string,
    username: process.env.INPUT_USERNAME as string,
    password: process.env.INPUT_PASSWORD as string
  }

  it('returns the expected data', async () => {
    const token = await getBearerToken(ackeeAuthConfig)
    const client = makeAnalyticsClient({
      endpoint: process.env.INPUT_ENDPOINT as string,
      domainId: process.env.INPUT_DOMAIN_ID as string,
      token
    })

    const topPages = await client.topPages()

    expect(topPages).toHaveLength(NUM_TOP_PAGES)
    for (const metric of topPages) {
      expect(metric).toHaveProperty('id')
      expect(metric).toHaveProperty('count')
    }
  })
})

describe('resultFromQuery', () => {
  const ackeeAuthConfig = {
    endpoint: process.env.INPUT_ENDPOINT as string,
    username: process.env.INPUT_USERNAME as string,
    password: process.env.INPUT_PASSWORD as string
  }

  it('is defined when the GraphQL client is created with a custom `query`', async () => {
    const token = await getBearerToken(ackeeAuthConfig)
    const client = makeAnalyticsClient({
      endpoint: process.env.INPUT_ENDPOINT as string,
      domainId: process.env.INPUT_DOMAIN_ID as string,
      query: QUERY_TOP10_BROWSERS,
      token
    })

    expect(client.resultFromQuery).toBeDefined()
  })

  it('returns data according to the `query` used to create the GraphQL client', async () => {
    const token = await getBearerToken(ackeeAuthConfig)
    const clientA = makeAnalyticsClient({
      endpoint: process.env.INPUT_ENDPOINT as string,
      domainId: process.env.INPUT_DOMAIN_ID as string,
      query: QUERY_TOP10_BROWSERS,
      token
    })
    const clientB = makeAnalyticsClient({
      endpoint: process.env.INPUT_ENDPOINT as string,
      domainId: process.env.INPUT_DOMAIN_ID as string,
      query: QUERY_EVENTS,
      token
    })

    const resultA = await clientA.resultFromQuery!()
    const resultB = await clientB.resultFromQuery!()

    expect(resultA).toHaveProperty('domains')
    expect(resultB).toHaveProperty('events')
  })
})
