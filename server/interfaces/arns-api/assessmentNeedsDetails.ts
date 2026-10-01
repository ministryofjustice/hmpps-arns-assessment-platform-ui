import { AssessmentVersion, OasysThreshold } from './assessmentNeeds'

/**
 * Response of ARNS API `GET /needs/{crn}` (integration-controller), used for OASys users
 * called with a system/client-credentials token — no per-user LAO check is possible for
 * this cohort. Mirrors AssessmentNeedsDetailsDto / AssessmentNeedDetailDto in
 * hmpps-assess-risks-and-needs.
 */
export type NeedStatus = 'IDENTIFIED_NEED' | 'NOT_IDENTIFIED_NEED' | 'UNANSWERED_NEED' | 'UNSCORED_NEED'

export interface AssessmentNeedDetailDto {
  section?: string
  name?: string
  needStatus?: NeedStatus
  riskOfHarm?: boolean
  riskOfReoffending?: boolean
  score?: number
  oasysThreshold?: OasysThreshold
}

export interface AssessmentNeedsDetailsDto {
  needs: AssessmentNeedDetailDto[]
  assessmentVersion: AssessmentVersion
  assessedOn?: string
}
