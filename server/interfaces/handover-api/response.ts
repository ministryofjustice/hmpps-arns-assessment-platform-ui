import { HandoverPrincipalDetails, HandoverSubjectDetails, CriminogenicNeedsData } from './shared'
import { HandoverAssessmentContext, HandoverSentencePlanContext } from './request'

export interface CreateHandoverLinkResponse {
  handoverSessionId: string
  handoverLink: string
}

export interface HandoverContext {
  handoverSessionId: string
  principal: HandoverPrincipalDetails
  subject: HandoverSubjectDetails
  assessmentContext?: HandoverAssessmentContext
  sentencePlanContext?: HandoverSentencePlanContext
  criminogenicNeedsData?: CriminogenicNeedsData
}
