import type { EntityAssessmentResponse } from './CoordinatorEntityAssessment.type'
import type { OasysCreateRequest, OasysCreateResponse } from './CoordinatorOasysCreate.type'
import type { OasysMergeRequest, OasysMergeResponse } from './CoordinatorOasysMerge.type'
import type { PreviousVersionsResponse } from './CoordinatorPreviousVersions.type'

export interface CoordinatorApi {
  createOasysAssociation(request: OasysCreateRequest): Promise<OasysCreateResponse>
  getEntityAssessment(entityUuid: string): Promise<EntityAssessmentResponse>
  getVersionsByEntityId(entityUuid: string): Promise<PreviousVersionsResponse>
  mergeOasysAssociation(request: OasysMergeRequest): Promise<OasysMergeResponse>
}
