import { RestClient, asSystem, AgentConfig } from '@ministryofjustice/hmpps-rest-client'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import type { TestInfo } from '@playwright/test'
import type {
  OasysCreateRequest,
  OasysCreateResponse,
  OasysUserDetails,
} from '../../../server/interfaces/coordinator-api/oasysCreate'
import type { OasysSignRequest, OasysSignResponse } from '../../../server/interfaces/coordinator-api/oasysSign'
import type { PreviousVersionsResponse } from '../../../server/interfaces/coordinator-api/previousVersions'
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
    return await this.request('createOasysAssociation', request, () =>
      this.post({ path: '/oasys/create', data: { ...request } }, asSystem()),
    )
  }

  /**
   * Lock an OASys assessment.
   * Must be called before signing.
   */
  async lock(oasysAssessmentPk: string, userDetails: OasysUserDetails): Promise<void> {
    const request = { userDetails }

    return await this.request('lock', request, () =>
      this.post({ path: `/oasys/${oasysAssessmentPk}/lock`, data: request }, asSystem()),
    )
  }

  /**
   * Sign an OASys assessment.
   * Creates a new version and returns the updated version numbers.
   */
  async sign(oasysAssessmentPk: string, request: OasysSignRequest): Promise<OasysSignResponse> {
    return await this.request('sign', request, () =>
      this.post({ path: `/oasys/${oasysAssessmentPk}/sign`, data: { ...request } }, asSystem()),
    )
  }

  /**
   * Get previous versions for an entity.
   */
  async getVersionsByEntityId(entityUuid: string): Promise<PreviousVersionsResponse> {
    return await this.request('getVersionsByEntityId', { entityUuid }, () =>
      this.get({ path: `/entity/versions/${entityUuid}` }, asSystem()),
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
