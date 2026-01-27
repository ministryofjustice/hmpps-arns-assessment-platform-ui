export interface CaseDetailsName {
  forename: string
  middleName: string
  surname: string
}

export interface CaseDetailsSentence {
  description: string
  startDate: string
  endDate: string
  programmeRequirement: boolean
  unpaidWorkHoursOrdered: number
  unpaidWorkMinutesCompleted: number
  rarDaysOrdered: number
  rarDaysCompleted: number
  rarRequirement: boolean
}

export interface CaseDetails {
  name: CaseDetailsName
  crn: string
  pnc?: string
  tier: string
  dateOfBirth: string
  nomisId: string
  region: string
  location: string
  sexuallyMotivatedOffenceHistory: string
  sentences: CaseDetailsSentence[]
}
