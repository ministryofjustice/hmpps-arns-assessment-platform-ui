export type AccessMode = 'READ_ONLY' | 'READ_WRITE'

export type Location = 'PRISON' | 'COMMUNITY'

export type YesNoNull = 'YES' | 'NO' | 'NULL'

export type YesNoNullOrNA = YesNoNull | 'N/A'

/**
 * Practitioner/user details for handover
 */
export interface HandoverPrincipalDetails {
  identifier: string
  displayName: string
  accessMode: AccessMode
  returnUrl?: string
}

/**
 * Subject (person of interest) details
 */
export interface HandoverSubjectDetails {
  crn: string
  pnc?: string
  nomisId?: string
  givenName: string
  familyName: string
  gender?: string
  dateOfBirth?: string
  location?: Location
  sexuallyMotivatedOffenceHistory?: YesNoNull
}

/**
 * Accommodation need (Section 3)
 */
interface AccommodationNeed {
  accLinkedToHarm?: YesNoNullOrNA
  accLinkedToReoffending?: YesNoNullOrNA
  accStrengths?: YesNoNullOrNA
  accOtherWeightedScore?: string
  accThreshold?: YesNoNullOrNA
}

/**
 * Education, Training and Employability need (Section 4)
 */
interface EducationTrainingEmployabilityNeed {
  eteLinkedToHarm?: YesNoNullOrNA
  eteLinkedToReoffending?: YesNoNullOrNA
  eteStrengths?: YesNoNullOrNA
  eteOtherWeightedScore?: string
  eteThreshold?: YesNoNullOrNA
}

/**
 * Finance need (Section 5)
 */
interface FinanceNeed {
  financeLinkedToHarm?: YesNoNullOrNA
  financeLinkedToReoffending?: YesNoNullOrNA
  financeStrengths?: YesNoNullOrNA
  financeOtherWeightedScore?: string
  financeThreshold?: YesNoNullOrNA
}

/**
 * Drug Misuse need (Section 8)
 */
interface DrugMisuseNeed {
  drugLinkedToHarm?: YesNoNullOrNA
  drugLinkedToReoffending?: YesNoNullOrNA
  drugStrengths?: YesNoNullOrNA
  drugOtherWeightedScore?: string
  drugThreshold?: YesNoNullOrNA
}

/**
 * Alcohol Misuse need (Section 9)
 */
interface AlcoholMisuseNeed {
  alcoholLinkedToHarm?: YesNoNullOrNA
  alcoholLinkedToReoffending?: YesNoNullOrNA
  alcoholStrengths?: YesNoNullOrNA
  alcoholOtherWeightedScore?: string
  alcoholThreshold?: YesNoNullOrNA
}

/**
 * Health and Wellbeing / Emotional need (Section 10)
 */
interface HealthAndWellbeingNeed {
  emoLinkedToHarm?: YesNoNullOrNA
  emoLinkedToReoffending?: YesNoNullOrNA
  emoStrengths?: YesNoNullOrNA
  emoOtherWeightedScore?: string
  emoThreshold?: YesNoNullOrNA
}

/**
 * Personal Relationships and Community need (Section 6)
 */
interface PersonalRelationshipsAndCommunityNeed {
  relLinkedToHarm?: YesNoNullOrNA
  relLinkedToReoffending?: YesNoNullOrNA
  relStrengths?: YesNoNullOrNA
  relOtherWeightedScore?: string
  relThreshold?: YesNoNullOrNA
}

/**
 * Thinking, Behaviour and Attitudes need (Section 11)
 */
interface ThinkingBehaviourAndAttitudesNeed {
  thinkLinkedToHarm?: YesNoNullOrNA
  thinkLinkedToReoffending?: YesNoNullOrNA
  thinkStrengths?: YesNoNullOrNA
  thinkOtherWeightedScore?: string
  thinkThreshold?: YesNoNullOrNA
}

/**
 * Lifestyle and Associates need (Section 7)
 */
interface LifestyleAndAssociatesNeed {
  lifestyleLinkedToHarm?: YesNoNullOrNA
  lifestyleLinkedToReoffending?: YesNoNullOrNA
  lifestyleStrengths?: YesNoNullOrNA
  lifestyleOtherWeightedScore?: string
  lifestyleThreshold?: YesNoNullOrNA
}

/**
 * All criminogenic needs data from OASys assessment
 */
export interface CriminogenicNeedsData {
  accommodation?: AccommodationNeed
  educationTrainingEmployability?: EducationTrainingEmployabilityNeed
  finance?: FinanceNeed
  drugMisuse?: DrugMisuseNeed
  alcoholMisuse?: AlcoholMisuseNeed
  healthAndWellbeing?: HealthAndWellbeingNeed
  personalRelationshipsAndCommunity?: PersonalRelationshipsAndCommunityNeed
  thinkingBehaviourAndAttitudes?: ThinkingBehaviourAndAttitudesNeed
  lifestyleAndAssociates?: LifestyleAndAssociatesNeed
}
