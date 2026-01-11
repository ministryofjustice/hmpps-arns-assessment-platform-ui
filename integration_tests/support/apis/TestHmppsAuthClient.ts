import { AuthenticationClient, InMemoryTokenStore } from '@ministryofjustice/hmpps-auth-clients'
import { AgentConfig } from '@ministryofjustice/hmpps-rest-client'
import type { TestInfo } from '@playwright/test'

export interface TestHmppsAuthClientConfig {
  url: string
  systemClientId: string
  systemClientSecret: string
  timeout?: number
  testInfo?: TestInfo
}

interface JwtPayload {
  sub?: string
  auth_source?: string
  iss?: string
  client_id?: string
  authorities?: string[]
  scope?: string[]
  exp?: number
  iat?: number
  jti?: string
}

function decodeJwtPayload(token: string): JwtPayload {
  const [, payload] = token.split('.')
  const decoded = Buffer.from(payload, 'base64url').toString('utf8')

  return JSON.parse(decoded)
}

/**
 * Proxy wrapper around AuthenticationClient for test usage.
 * Implements the same interface so it can be passed directly to RestClient.
 * Attaches decoded JWT claims to Playwright test reports on first token fetch.
 */
export class TestHmppsAuthClient {
  private readonly client: AuthenticationClient
  private readonly config: TestHmppsAuthClientConfig
  private readonly testInfo?: TestInfo

  private hasAttachedToken = false

  constructor(config: TestHmppsAuthClientConfig) {
    this.config = config
    const timeout = config.timeout ?? 10000

    this.client = new AuthenticationClient(
      {
        url: config.url,
        timeout: { response: timeout, deadline: timeout },
        agent: new AgentConfig(timeout),
        systemClientId: config.systemClientId,
        systemClientSecret: config.systemClientSecret,
      },
      console,
      new InMemoryTokenStore(),
    )

    this.testInfo = config.testInfo
  }

  /**
   * Proxy for AuthenticationClient.getToken().
   * On first fetch, attaches decoded JWT claims to Playwright test report.
   * On error, attaches error details to help debug auth failures.
   */
  async getToken(): Promise<string> {
    try {
      const token = await this.client.getToken()

      if (this.testInfo && !this.hasAttachedToken) {
        this.hasAttachedToken = true

        const claims = decodeJwtPayload(token)

        await this.testInfo.attach('AUTH TOKEN CLAIMS', {
          body: JSON.stringify(
            {
              client_id: claims.client_id,
              authorities: claims.authorities,
              scope: claims.scope,
              expires: claims.exp ? new Date(claims.exp * 1000).toISOString() : undefined,
              issued: claims.iat ? new Date(claims.iat * 1000).toISOString() : undefined,
            },
            null,
            2,
          ),
          contentType: 'application/json',
        })
      }

      return token
    } catch (error) {
      if (this.testInfo) {
        await this.testInfo.attach('AUTH TOKEN ERROR', {
          body: JSON.stringify(
            {
              url: this.config.url,
              clientId: this.config.systemClientId,
              message: error instanceof Error ? error.message : String(error),
              // Include response details if available (superagent attaches these)
              status: (error as any)?.status,
              responseBody: (error as any)?.response?.body,
              responseText: (error as any)?.response?.text,
            },
            null,
            2,
          ),
          contentType: 'application/json',
        })
      }

      throw error
    }
  }
}
