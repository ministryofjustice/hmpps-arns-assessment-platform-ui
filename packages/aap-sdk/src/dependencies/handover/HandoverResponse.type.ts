import { HandoverPrincipalDetails, HandoverSubjectDetails } from './HandoverShared.type'
import { HandoverAssessmentContext, HandoverSentencePlanContext } from './HandoverRequest.type'

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
}
