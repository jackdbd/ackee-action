import { gql, GraphQLClient } from 'graphql-request'
import {
  Facts,
  Metric,
  SizesForDomainId,
  ViewsAndDurationsForDomainId
} from './interfaces'

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
  durations: Metric[]
  pages: Metric[]
  sizes: Metric[]
  views: Metric[]
}

interface DomainStatistics {
  statistics: Statistics
  title: string
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

type MakeDailyUniqueViewsAndDurations = (
  gqlClient: GraphQLClient,
  domainId: string,
  days: number
) => Thunk<ViewsAndDurationsForDomainId>

const makeDailyUniqueViewsAndDurations: MakeDailyUniqueViewsAndDurations = (
  gqlClient,
  domainId,
  numDays
) => {
  const requestDocument = gql`
    query getDailyUniqueViewsAndDurations($domainId: ID!, $limit: Int!) {
      domain(id: $domainId) {
        title
        statistics {
          durations(interval: DAILY, limit: $limit) {
            id
            count
          }
          views(interval: DAILY, type: UNIQUE, limit: $limit) {
            id
            count
          }
        }
      }
    }
  `

  const variables = {
    domainId,
    limit: numDays
  }

  return async function dailyUniqueViewsAndDurations() {
    const data = await gqlClient.request<{ domain: DomainStatistics }>(
      requestDocument,
      variables
    )

    return {
      title: data.domain.title,
      views: data.domain.statistics.views,
      durations: data.domain.statistics.durations
    }
  }
}

/**
 * HOF that accepts any GraphQL query from the caller, and POST the query to the
 * Ackee server. The caller must provide a query which satisfies the Ackee
 * GraphQL schema.
 */
const makeResultFromQuery = (gqlClient: GraphQLClient, query: string) => {
  return async function customQuery() {
    const data: string = await gqlClient.request(query)
    return data
  }
}

interface AckeeConfig {
  endpoint: string
  domainId: string
  numTopPages?: number
  query?: string
  token: string
}

type MakeAnalyticsClient = (
  config: AckeeConfig
) => {
  dailyUniqueViewsAndDurations: Thunk<ViewsAndDurationsForDomainId>
  domains: Thunk<Domain[]>
  events: Thunk<Event[]>
  facts: Thunk<Facts>
  resultFromQuery?: Thunk<string>
  topPages: Thunk<Metric[]>
  topSizesInSixMonths: Thunk<SizesForDomainId>
}

/**
 * top-performing pages of the domainId monitored by Ackee.
 */
export const NUM_TOP_PAGES = 10

const NUM_DAYS_REPORT = 7

type MakeTopSizesInSixMonths = (
  gqlClient: GraphQLClient,
  domainId: string
) => Thunk<SizesForDomainId>

const makeTopSizesInSixMonths: MakeTopSizesInSixMonths = (
  gqlClient,
  domainId
) => {
  const requestDocument = gql`
    query getTopSizesInRange($domainId: ID!, $range: Range, $limit: Int!) {
      domain(id: $domainId) {
        title
        statistics {
          sizes(
            sorting: TOP
            type: SCREEN_RESOLUTION
            range: $range
            limit: $limit
          ) {
            id
            count
          }
        }
      }
    }
  `

  const variables = {
    domainId,
    limit: 5,
    range: 'LAST_6_MONTHS'
  }

  return async function topSizesInSixMonths() {
    const data = await gqlClient.request<{ domain: DomainStatistics }>(
      requestDocument,
      variables
    )

    return {
      title: data.domain.title,
      sizes: data.domain.statistics.sizes
    }
  }
}

/**
 * Create a client to query the Ackee server GraphQL API.
 */
export const makeAnalyticsClient: MakeAnalyticsClient = ({
  endpoint,
  domainId,
  query,
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

  const domains = makeDomains(gqlClient)
  const events = makeEvents(gqlClient)
  const facts = makeFactsByDomainId(gqlClient, domainId)
  const topPages = makeTopPages(gqlClient, domainId, numTopPages)
  const dailyUniqueViewsAndDurations = makeDailyUniqueViewsAndDurations(
    gqlClient,
    domainId,
    NUM_DAYS_REPORT
  )
  const topSizesInSixMonths = makeTopSizesInSixMonths(gqlClient, domainId)

  let resultFromQuery: Thunk<string> | undefined = undefined
  if (query) {
    resultFromQuery = makeResultFromQuery(gqlClient, query)
  }

  return {
    dailyUniqueViewsAndDurations,
    domains,
    events,
    facts,
    resultFromQuery,
    topPages,
    topSizesInSixMonths
  }
}
