import type { OasysUserDetails } from './oasysCreate'

export type SignType = 'SELF' | 'COUNTERSIGN'

export interface OasysSignRequest {
  signType: SignType
  userDetails: OasysUserDetails
}

export interface OasysSignResponse {
  sanAssessmentId: string
  sanAssessmentVersion: number
  sentencePlanId: string
  sentencePlanVersion: number
}
