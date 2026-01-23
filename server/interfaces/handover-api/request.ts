import { HandoverPrincipalDetails, HandoverSubjectDetails, CriminogenicNeedsData } from './shared'

export interface CreateHandoverLinkRequest {
  user: HandoverPrincipalDetails
  subjectDetails: HandoverSubjectDetails
  oasysAssessmentPk: number
  assessmentVersion?: number | null
  planVersion?: number | null
  criminogenicNeedsData?: CriminogenicNeedsData
}

export interface UpdateHandoverContextRequest {
  principal: HandoverPrincipalDetails
  subject: HandoverSubjectDetails
  assessmentContext?: HandoverAssessmentContext
  sentencePlanContext?: HandoverSentencePlanContext
  criminogenicNeedsData?: CriminogenicNeedsData
}

export interface HandoverAssessmentContext {
  oasysAssessmentPk?: string
  assessmentId?: string
  assessmentVersion?: number
}

export interface HandoverSentencePlanContext {
  oasysAssessmentPk?: string
  planId?: string
  planVersion?: number
}
