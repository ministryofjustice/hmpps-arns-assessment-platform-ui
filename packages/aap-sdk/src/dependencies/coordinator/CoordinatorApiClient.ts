import { RestClient, asSystem, type ApiConfig } from '@ministryofjustice/hmpps-rest-client'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import type Logger from 'bunyan'
import type { OasysCreateRequest, OasysCreateResponse } from './CoordinatorOasysCreate.type'
import type { OasysMergeRequest, OasysMergeResponse } from './CoordinatorOasysMerge.type'
import type { EntityAssessmentResponse } from './CoordinatorEntityAssessment.type'
import type { PreviousVersionsResponse } from './CoordinatorPreviousVersions.type'

export default class CoordinatorApiClient extends RestClient {
  constructor(apiConfig: ApiConfig, authenticationClient: AuthenticationClient, logger: Logger | Console) {
    super('Coordinator API', apiConfig, logger, authenticationClient)
  }

  /**
   * Create an OASys association
   * Links an OASys assessment PK to ARNS entities (SAN, Sentence Plan)
   *
   * @param request - OASys assessment details and user info
   * @returns Created entity IDs and versions
   * @throws 409 if association already exists for the OASys Assessment PK
   */
  async createOasysAssociation(request: OasysCreateRequest): Promise<OasysCreateResponse> {
    return this.post(
      {
        path: '/oasys/create',
        data: { ...request },
      },
      asSystem(),
    )
  }

  /**
   * Merge OASys associations (training launcher only)
   * Used by the training launcher to simulate an OASys merge. In production, merges are
   * triggered by OASys directly — the UI never calls this endpoint.
   */
  async mergeOasysAssociation(request: OasysMergeRequest): Promise<OasysMergeResponse> {
    return this.post(
      {
        path: '/oasys/merge',
        data: { ...request },
      },
      asSystem(),
    )
  }

  /**
   * Get assessment data for an entity
   * Retrieves the latest version of the assessment associated with the provided entity UUID
   *
   * @param entityUuid - The UUID of the entity (SAN assessment or Sentence Plan)
   * @returns Assessment data including sanAssessmentData with practitioner analysis
   * @throws 404 if no associated entities were found
   */
  async getEntityAssessment(entityUuid: string): Promise<EntityAssessmentResponse> {
    return this.get({ path: `/entity/${entityUuid}/ASSESSMENT` }, asSystem())
  }

  /**
   * Get previous versions for an entity.
   */
  async getVersionsByEntityId(entityUuid: string): Promise<PreviousVersionsResponse> {
    return this.get({ path: `/entity/versions/${entityUuid}` }, asSystem())
  }
}
