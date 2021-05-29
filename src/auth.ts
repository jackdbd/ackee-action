import { gql, request } from 'graphql-request'

interface AckeeAuthConfig {
  /**
   * The URL of your Ackee GraphQL API server
   */
  endpoint: string

  /**
   * Your Ackee username
   */
  username: string

  /**
   * Your Ackee password
   */
  password: string
}

type BearerToken = string

type GetBearerToken = (config: AckeeAuthConfig) => Promise<BearerToken>

/**
 * TODO: this is CreateTokenInput. How to get the original GraphQL type?
 * I think the Ackee API server does not allow schema introspection...
 */
interface CreateToken {
  payload: {
    id: string
  }
}

/**
 * Get a Bearer token from an Ackee analytics server.
 */
export const getBearerToken: GetBearerToken = async ({
  endpoint,
  username,
  password
}) => {
  const query = gql`
    mutation createToken($input: CreateTokenInput!) {
      createToken(input: $input) {
        payload {
          id
        }
      }
    }
  `

  const variables = {
    input: {
      username,
      password
    }
  }

  const data = await request<{ createToken: CreateToken }>(
    endpoint,
    query,
    variables
  )
  return data.createToken.payload.id
}
