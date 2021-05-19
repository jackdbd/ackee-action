import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'

/**
 * This test suite shows how a GitHub-hosted runner would run a JS action,
 * namely using environment variables and the stdout protocol.
 * So these are basically integration tests with the GitHub Actions ecosystem.
 * https://docs.github.com/en/actions/using-github-hosted-runners/about-github-hosted-runners#about-github-hosted-runners
 *
 * On my machine I use an `.envrc` file to set these environment variables.
 * On GitHub I use GitHub Secrets.
 * The reason these variables are calles INPUT_* is because how the function
 * `getInput` from the @actions/core package works.
 * https://github.com/actions/toolkit/blob/3bd746139fadc2f9d6e5d8c2593a0be2a44e9c5c/packages/core/src/core.ts#L91
 */
describe('ackee-action', () => {
  // path to the Node.js binary
  const exe = process.execPath
  const action = [path.join(__dirname, '..', 'dist', 'index.js')]

  it('throws when not configured at all', () => {
    const options: cp.ExecFileSyncOptions = {
      env: {
        ...process.env,
        INPUT_ENDPOINT: undefined,
        INPUT_DOMAIN_ID: undefined,
        INPUT_USERNAME: undefined,
        INPUT_PASSWORD: undefined
      }
    }

    expect(() => {
      cp.execFileSync(exe, action, options)
    }).toThrow()
  })

  it('throws when `endpoint` is not set', () => {
    const options: cp.ExecFileSyncOptions = {
      env: { ...process.env, INPUT_ENDPOINT: undefined }
    }

    expect(() => {
      cp.execFileSync(exe, action, options)
    }).toThrow()
  })

  it('throws when `username` is not set', () => {
    const options: cp.ExecFileSyncOptions = {
      env: { ...process.env, INPUT_USERNAME: undefined }
    }

    expect(() => {
      cp.execFileSync(exe, action, options)
    }).toThrow()
  })

  it('throws when `password` is not set', () => {
    const options: cp.ExecFileSyncOptions = {
      env: { ...process.env, INPUT_PASSWORD: undefined }
    }

    expect(() => {
      cp.execFileSync(exe, action, options)
    }).toThrow()
  })

  it('throws when `domain_id` is not set', () => {
    const options: cp.ExecFileSyncOptions = {
      env: { ...process.env, INPUT_DOMAIN_ID: undefined }
    }

    expect(() => {
      cp.execFileSync(exe, action, options)
    }).toThrow()
  })

  it('throws with invalid credentials for the Ackee API server', () => {
    const options: cp.ExecFileSyncOptions = {
      env: {
        ...process.env,
        INPUT_PASSWORD: 'INVALID_ACKEE_PASSWORD',
        INPUT_USERNAME: 'INVALID_ACKEE_USERNAME'
      }
    }

    expect(() => {
      cp.execFileSync(exe, action, options)
    }).toThrow()
  })

  it('saves the expected states during execution', () => {
    const options: cp.ExecFileSyncOptions = {
      env: { ...process.env, INPUT_NUM_TOP_PAGES: '3' }
    }

    const str = cp.execFileSync(exe, action, options).toString()

    expect(str).toMatch(
      new RegExp(`::save-state name=tokenObtained::true`, 'g')
    )
    expect(str).toMatch(
      new RegExp(`::save-state name=clientInitialized::true`, 'g')
    )
    expect(str).toMatch(new RegExp(`::save-state name=fetchStarted::true`, 'g'))
    expect(str).toMatch(new RegExp(`::save-state name=fetchEnded::true`, 'g'))
  })
})
