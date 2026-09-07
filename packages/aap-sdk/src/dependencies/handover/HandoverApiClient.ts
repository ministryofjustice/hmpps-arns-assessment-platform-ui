import { RestClient, asSystem, asUser, type ApiConfig } from '@ministryofjustice/hmpps-rest-client'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import type Logger from 'bunyan'
import type { CreateHandoverLinkRequest, UpdateHandoverContextRequest } from './HandoverRequest.type'
import type { CreateHandoverLinkResponse, HandoverContext } from './HandoverResponse.type'

export default class HandoverApiClient extends RestClient {
  constructor(apiConfig: ApiConfig, authenticationClient: AuthenticationClient, logger: Logger | Console) {
    super('Handover API', apiConfig, logger, authenticationClient)
  }

  /**
   * Get handover context by session ID
   * Requires system-level authentication
   *
   * @param handoverSessionId - UUID of the handover session
   * @returns Full handover context
   */
  async getContext(handoverSessionId: string): Promise<HandoverContext> {
    return this.get({ path: `/context/${handoverSessionId}` }, asSystem())
  }

  /**
   * Get handover context for the currently authenticated user's active session
   *
   * @param token - User's access token
   * @returns Full handover context for the user's active session
   */
  async getCurrentContext(token: string): Promise<HandoverContext> {
    return this.get({ path: '/context' }, asUser(token))
  }

  /**
   * Create a new handover link with  context
   * The returned link can be used once to initiate a handover session
   *
   * @param request - Handover context including user, subject, and assessment data
   * @returns Handover session ID and one-time link URL
   */
  async createHandoverLink(request: CreateHandoverLinkRequest): Promise<CreateHandoverLinkResponse> {
    return this.post(
      {
        path: '/handover',
        data: { ...request },
      },
      asSystem(),
    )
  }

  /**
   * Update an existing handover context
   *
   * @param handoverSessionId - UUID of the handover session to update
   * @param request - Updated context data
   * @returns Updated handover context
   */
  async updateContext(handoverSessionId: string, request: UpdateHandoverContextRequest): Promise<HandoverContext> {
    return this.post(
      {
        path: `/context/${handoverSessionId}`,
        data: { ...request },
      },
      asSystem(),
    )
  }
}
