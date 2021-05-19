import { getBearerToken } from '../src/auth'
import { makeAnalyticsClient, NUM_TOP_PAGES } from '../src/analytics'

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
    expect(client).toHaveProperty('domainsFacts')
    expect(client).toHaveProperty('events')
    expect(client).toHaveProperty('facts')
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

describe('domainsFacts', () => {
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

    const domainsFacts = await client.domainsFacts()

    expect(domainsFacts).toHaveLength(1)
    for (const domain of domainsFacts) {
      expect(domain).toHaveProperty('id')
      expect(domain).toHaveProperty('title')
      expect(domain).toHaveProperty('facts')
    }
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
