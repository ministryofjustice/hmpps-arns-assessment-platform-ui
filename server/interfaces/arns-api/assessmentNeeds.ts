/**
 * Response of ARNS API `GET /needs/crn/{crn}` (assessment-controller).
 *
 * The API pre-partitions sections into identified / not-identified / unanswered,
 * so the UI consumes those lists directly rather than re-deriving from score/threshold.
 * For a SAN assessment this carries 7 scored sections only (no Finance or Health and
 * wellbeing). Mirrors AssessmentNeedsDto in hmpps-assess-risks-and-needs.
 */
export type AssessmentVersion = 'OASYS' | 'SAN'

export interface OasysThreshold {
  standard?: number
}

export interface AssessmentNeedDto {
  section?: string
  name?: string
  riskOfHarm?: boolean
  riskOfReoffending?: boolean
  score?: number
  oasysThreshold?: OasysThreshold
}

export interface AssessmentNeedsDto {
  identifiedNeeds: AssessmentNeedDto[]
  notIdentifiedNeeds: AssessmentNeedDto[]
  unansweredNeeds: AssessmentNeedDto[]
  assessmentVersion: AssessmentVersion
  assessedOn?: string
}
