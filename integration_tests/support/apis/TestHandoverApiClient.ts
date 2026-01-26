import { RestClient, asSystem, AgentConfig } from '@ministryofjustice/hmpps-rest-client'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import type { TestInfo } from '@playwright/test'
import type {
  CreateHandoverLinkRequest,
  UpdateHandoverContextRequest,
} from '../../../server/interfaces/handover-api/request'
import type { CreateHandoverLinkResponse, HandoverContext } from '../../../server/interfaces/handover-api/response'
import { noopLogger } from './noopLogger'

export interface TestHandoverApiClientConfig {
  baseUrl: string
  authenticationClient: AuthenticationClient
  testInfo?: TestInfo
}

/**
 * API client for handover service test data setup.
 * Extends hmpps-rest-client for consistent HTTP handling and auth.
 * Optionally attaches request/response data to Playwright test reports.
 */
export class TestHandoverApiClient extends RestClient {
  private readonly testInfo?: TestInfo

  constructor(config: TestHandoverApiClientConfig) {
    super(
      'Test Handover API Client',
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
   * Create a new handover link with context.
   * The returned link can be used once to initiate a handover session.
   */
  async createHandoverLink(request: CreateHandoverLinkRequest): Promise<CreateHandoverLinkResponse> {
    const operation = 'createHandoverLink'

    try {
      const response: CreateHandoverLinkResponse = await this.post(
        { path: '/handover', data: { ...request } },
        asSystem(),
      )

      if (this.testInfo) {
        await this.testInfo.attach(`TEST HANDOVER API SUCCESS: ${operation}`, {
          body: JSON.stringify({ request, response }, null, 2),
          contentType: 'application/json',
        })
      }

      return response
    } catch (error) {
      if (this.testInfo) {
        await this.testInfo.attach(`TEST HANDOVER API ERROR: ${operation}`, {
          body: JSON.stringify({ request, error }, null, 2),
          contentType: 'application/json',
        })
      }

      throw error
    }
  }

  /**
   * Get handover context by session ID.
   */
  async getContext(handoverSessionId: string): Promise<HandoverContext> {
    const operation = 'getContext'

    try {
      const response: HandoverContext = await this.get({ path: `/context/${handoverSessionId}` }, asSystem())

      if (this.testInfo) {
        await this.testInfo.attach(`TEST HANDOVER API SUCCESS: ${operation}`, {
          body: JSON.stringify({ handoverSessionId, response }, null, 2),
          contentType: 'application/json',
        })
      }

      return response
    } catch (error) {
      if (this.testInfo) {
        await this.testInfo.attach(`TEST HANDOVER API ERROR: ${operation}`, {
          body: JSON.stringify({ handoverSessionId, error }, null, 2),
          contentType: 'application/json',
        })
      }

      throw error
    }
  }

  /**
   * Update an existing handover context.
   */
  async updateContext(handoverSessionId: string, request: UpdateHandoverContextRequest): Promise<HandoverContext> {
    const operation = 'updateContext'

    try {
      const response: HandoverContext = await this.post(
        { path: `/context/${handoverSessionId}`, data: { ...request } },
        asSystem(),
      )

      if (this.testInfo) {
        await this.testInfo.attach(`TEST HANDOVER API SUCCESS: ${operation}`, {
          body: JSON.stringify({ handoverSessionId, request, response }, null, 2),
          contentType: 'application/json',
        })
      }

      return response
    } catch (error) {
      if (this.testInfo) {
        await this.testInfo.attach(`TEST HANDOVER API ERROR: ${operation}`, {
          body: JSON.stringify({ handoverSessionId, request, error }, null, 2),
          contentType: 'application/json',
        })
      }

      throw error
    }
  }
}
