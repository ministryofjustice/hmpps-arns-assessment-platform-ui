import { RestClient, asSystem, AgentConfig } from '@ministryofjustice/hmpps-rest-client'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import type { TestInfo } from '@playwright/test'
import { noopLogger } from './noopLogger'
import { RiskScoreInput, RiskScores } from '@server/interfaces/risk-actuarial-api/riskScores'

export interface TestRiskActuarialApiClientConfig {
  baseUrl: string
  authenticationClient: AuthenticationClient
  testInfo?: TestInfo
}

/**
 * API client for Risk Actuarial API test data setup.
 * Extends hmpps-rest-client for consistent HTTP handling and auth.
 * Optionally attaches request/response data to Playwright test reports.
 */
export class TestRiskActuarialApiClient extends RestClient {
  private readonly testInfo?: TestInfo

  constructor(config: TestRiskActuarialApiClientConfig) {
    super(
      'Test Risk Actuarial API Client',
      {
        url: config.baseUrl,
        timeout: { response: 30000, deadline: 30000 },
        agent: new AgentConfig(30000),
      },
      noopLogger,
      config.authenticationClient,
    )
    this.testInfo = config.testInfo
  }

  /**
   * Get risk scores
   */
  async getRiskScores(input: RiskScoreInput): Promise<RiskScores> {
    return this.request('getRiskScores', input, () =>
      this.post({ path: `/risk-scores/v1`, data: { ...input } }, asSystem())
    )
  }

  private async request<TRequest, TResponse>(
    operation: string,
    request: TRequest,
    fn: () => Promise<TResponse>,
  ): Promise<TResponse> {
    try {
      const response = await fn()

      if (this.testInfo) {
        await this.testInfo.attach(`TEST COORDINATOR API SUCCESS: ${operation}`, {
          body: JSON.stringify({ request, response }, null, 2),
          contentType: 'application/json',
        })
      }

      return response
    } catch (error) {
      if (this.testInfo) {
        await this.testInfo.attach(`TEST COORDINATOR API ERROR: ${operation}`, {
          body: JSON.stringify({ request, error }, null, 2),
          contentType: 'application/json',
        })
      }

      throw error
    }
  }
}
