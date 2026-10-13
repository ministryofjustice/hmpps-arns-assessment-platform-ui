import type { AssessmentNeedsDto } from './ArnsAssessmentNeeds.type'
import type { AssessmentNeedsDetailsDto } from './ArnsAssessmentNeedsDetails.type'

export interface ArnsApi {
  getCriminogenicNeeds(crn: string, token: string): Promise<AssessmentNeedsDto>
  getCriminogenicNeedsDetails(crn: string): Promise<AssessmentNeedsDetailsDto>
}
