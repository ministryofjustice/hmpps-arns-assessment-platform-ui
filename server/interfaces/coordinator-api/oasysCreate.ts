type PlanType = 'INITIAL' | 'REVIEW'

type UserLocation = 'PRISON' | 'COMMUNITY'

export interface OasysUserDetails {
  id: string
  name: string
  location?: UserLocation
}

export interface OasysCreateRequest {
  oasysAssessmentPk: string
  previousOasysAssessmentPk?: string
  regionPrisonCode?: string
  planType: PlanType
  userDetails: OasysUserDetails
}

export interface OasysCreateResponse {
  sanAssessmentId: string
  sanAssessmentVersion: number
  sentencePlanId: string
  sentencePlanVersion: number
}
