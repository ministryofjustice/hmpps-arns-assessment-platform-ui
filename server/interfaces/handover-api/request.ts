import { HandoverPrincipalDetails, HandoverSubjectDetails, CriminogenicNeedsData } from './shared'

export interface CreateHandoverLinkRequest {
  user: HandoverPrincipalDetails
  subjectDetails: HandoverSubjectDetails
  oasysAssessmentPk: string
  assessmentVersion?: string
  sentencePlanVersion?: string
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
  assessmentVersion?: string
}

export interface HandoverSentencePlanContext {
  oasysAssessmentPk?: string
  sentencePlanVersion?: string
}
