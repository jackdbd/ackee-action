import { getBearerToken } from '../src/auth'

describe('getBearerToken', () => {
  it('throws with invalid credentials', async () => {
    const ackeeAuthConfig = {
      endpoint: process.env.INPUT_ENDPOINT as string,
      username: process.env.INPUT_USERNAME as string,
      password: 'INVALID_PASSWORD'
    }

    await expect(getBearerToken(ackeeAuthConfig)).rejects.toThrowError(
      /Username or password incorrect/
    )
  })

  it('returns a Bearer token', async () => {
    const ackeeAuthConfig = {
      endpoint: process.env.INPUT_ENDPOINT as string,
      username: process.env.INPUT_USERNAME as string,
      password: process.env.INPUT_PASSWORD as string
    }

    const token = await getBearerToken(ackeeAuthConfig)

    expect(token).toBeTruthy()
  })
})
