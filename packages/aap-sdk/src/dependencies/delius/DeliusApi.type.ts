import type { CaseDetails } from './DeliusCaseDetails.type'

export interface DeliusApi {
  getCaseDetails(crn: string): Promise<CaseDetails>
}
