export interface OasysMergeTransferAssociation {
  oldOasysAssessmentPK: string
  newOasysAssessmentPK: string
}

export interface OasysMergeUserDetails {
  id: string
  name: string
}

export interface OasysMergeRequest {
  merge: OasysMergeTransferAssociation[]
  userDetails: OasysMergeUserDetails
}

export interface OasysMergeResponse {
  message: string
}
