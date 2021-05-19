import { gql, GraphQLClient } from 'graphql-request'

// TODO: how to get the type of the returned value of a GraphQL query?
// https://github.com/prisma-labs/graphql-request#graphql-code-generators-graphql-request-typescript-plugin

type Thunk<T> = () => Promise<T>

interface Domain {
  id: string
  title: string
}

type MakeDomains = (gqlClient: GraphQLClient) => Thunk<Domain[]>

/**
 * TODO: docs
 */
const makeDomains: MakeDomains = (gqlClient) => {
  const query = gql`
    query getDomains {
      domains {
        id
        title
      }
    }
  `

  return async function domains() {
    const data = await gqlClient.request<{ domains: Domain[] }>(query)
    return data.domains
  }
}

/**
 * https://github.com/electerious/Ackee/blob/264df73a506df5f0f01a7b1eddaea17b7d17cd11/src/types/facts.js
 */
interface Facts {
  activeVisitors: number
  averageDuration: number
  averageViews: number
  viewsToday: number
  viewsMonth: number
  viewsYear: number
}

/**
 * Facts of a single domain.
 */
interface DomainIdFacts {
  facts: Facts
}

type MakeFactsByDomainId = (
  gqlClient: GraphQLClient,
  domainId: string
) => Thunk<Facts>

/**
 * TODO: docs
 */
const makeFactsByDomainId: MakeFactsByDomainId = (gqlClient, domainId) => {
  const query = gql`
    query getFactsByDomainId($domainId: ID!) {
      domain(id: $domainId) {
        id
        title
        facts {
          activeVisitors
          averageViews
          averageDuration
          viewsToday
          viewsMonth
          viewsYear
        }
      }
    }
  `

  const variables = {
    domainId
  }

  return async function facts() {
    const data = await gqlClient.request<{ domain: DomainIdFacts }>(
      query,
      variables
    )
    return data.domain.facts
  }
}

interface DomainFacts {
  facts: Facts
  id: string
  title: string
}

type MakeDomainsFacts = (gqlClient: GraphQLClient) => Thunk<DomainFacts[]>

/**
 * TODO: docs
 */
const makeDomainsFacts: MakeDomainsFacts = (gqlClient) => {
  const query = gql`
    query getDomainsFacts {
      domains {
        id
        title
        facts {
          activeVisitors
          averageViews
          averageDuration
          viewsToday
          viewsMonth
          viewsYear
        }
      }
    }
  `
  return async function domainsFacts() {
    const data = await gqlClient.request<{ domains: DomainFacts[] }>(query)
    return data.domains
  }
}

interface Metric {
  id: string
  count: number
}

interface Event {
  id: string
  title: string
  statistics: {
    chart: Metric[]
    list: Metric[]
  }
}

type MakeEvents = (gqlClient: GraphQLClient) => Thunk<Event[]>

/**
 * TODO: docs
 */
const makeEvents: MakeEvents = (gqlClient) => {
  const query = gql`
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

  return async function events() {
    const data = await gqlClient.request<{ events: Event[] }>(query)
    return data.events
  }
}

interface Statistics {
  pages: Metric[]
}

interface DomainStatistics {
  statistics: Statistics
}

type MakeTopPages = (
  gqlClient: GraphQLClient,
  domainId: string,
  numPages: number
) => Thunk<Metric[]>

/**
 * TODO: docs
 */
const makeTopPages: MakeTopPages = (gqlClient, domainId, numPages) => {
  const query = gql`
    query topPagesByDomainId($domainId: ID!, $numPages: Int!) {
      domain(id: $domainId) {
        title
        statistics {
          pages(limit: $numPages, sorting: TOP) {
            id
            count
          }
        }
      }
    }
  `
  const variables = {
    domainId,
    numPages
  }
  return async function topPages() {
    const data = await gqlClient.request<{ domain: DomainStatistics }>(
      query,
      variables
    )
    return data.domain.statistics.pages
  }
}

interface AckeeConfig {
  endpoint: string
  domainId: string
  numTopPages?: number
  token: string
}

type MakeAnalyticsClient = (
  config: AckeeConfig
) => {
  domains: Thunk<Domain[]>
  domainsFacts: Thunk<DomainFacts[]>
  events: Thunk<Event[]>
  facts: Thunk<Facts>
  topPages: Thunk<Metric[]>
}

/**
 * top-performing pages of the domainId monitored by Ackee.
 */
export const NUM_TOP_PAGES = 10

/**
 * Create a client to query the Ackee server GraphQL API.
 */
export const makeAnalyticsClient: MakeAnalyticsClient = ({
  endpoint,
  domainId,
  numTopPages = NUM_TOP_PAGES,
  token
}) => {
  if (isNaN(numTopPages)) {
    throw new Error(`numTopPages is not a number: ${numTopPages}`)
  }
  const gqlClient = new GraphQLClient(endpoint, {
    headers: {
      authorization: `Bearer ${token}`
    }
  })
  return {
    domains: makeDomains(gqlClient),
    domainsFacts: makeDomainsFacts(gqlClient),
    events: makeEvents(gqlClient),
    facts: makeFactsByDomainId(gqlClient, domainId),
    topPages: makeTopPages(gqlClient, domainId, numTopPages)
  }
}
