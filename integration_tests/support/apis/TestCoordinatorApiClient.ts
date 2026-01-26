import { RestClient, asSystem, AgentConfig } from '@ministryofjustice/hmpps-rest-client'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import type { TestInfo } from '@playwright/test'
import type { OasysCreateRequest, OasysCreateResponse } from '../../../server/interfaces/coordinator-api/oasysCreate'
import { noopLogger } from './noopLogger'

export interface TestCoordinatorApiClientConfig {
  baseUrl: string
  authenticationClient: AuthenticationClient
  testInfo?: TestInfo
}

/**
 * API client for coordinator API test data setup.
 * Extends hmpps-rest-client for consistent HTTP handling and auth.
 * Optionally attaches request/response data to Playwright test reports.
 */
export class TestCoordinatorApiClient extends RestClient {
  private readonly testInfo?: TestInfo

  constructor(config: TestCoordinatorApiClientConfig) {
    super(
      'Test Coordinator API Client',
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
   * Create an OASys association.
   * Links an OASys assessment PK to ARNS entities (SAN, Sentence Plan).
   */
  async createOasysAssociation(request: OasysCreateRequest): Promise<OasysCreateResponse> {
    const operation = 'createOasysAssociation'

    try {
      const response: OasysCreateResponse = await this.post({ path: '/oasys/create', data: { ...request } }, asSystem())

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
