import { RestClient, asSystem } from '@ministryofjustice/hmpps-rest-client'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import config from '../config'
import logger from '../../logger'
import { OasysCreateRequest, OasysCreateResponse } from '../interfaces/coordinator-api/oasysCreate'
import { EntityAssessmentResponse } from '../interfaces/coordinator-api/entityAssessment'
import { PreviousVersionsResponse } from '../interfaces/coordinator-api/previousVersions'

export default class CoordinatorApiClient extends RestClient {
  constructor(authenticationClient: AuthenticationClient) {
    super('Coordinator API', config.apis.coordinatorApi, logger, authenticationClient)
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
   * Get all previous versions of a sentence plan and its associated SAN assessment
   * @param entityUuid
   */
  async getVersionsByEntityId(entityUuid: string): Promise<PreviousVersionsResponse> {
    return this.get({ path: `/entity/versions/${entityUuid}` }, asSystem())
  }
}
