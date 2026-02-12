import {
  randomCrn,
  randomPnc,
  randomOasysAssessmentPk,
  randomDateOfBirth,
  randomYesNo,
  randomPractitionerName,
  randomScore,
  randomFirstName,
  randomLastName,
  randomGender,
  randomLocation,
  randomPlanAccessMode,
  randomPractitionerIdentifier,
} from './helpers'

/**
 * Configuration for a single scenario field
 */
export interface ScenarioFieldConfig<T> {
  label: string
  group: 'subject' | 'practitioner' | 'criminogenicNeeds'
  randomize: () => T
}

/**
 * Schema defining all scenario fields, their labels, groups, and randomizers.
 * This is the single source of truth for what fields exist and how to randomize them.
 */
export const scenarioFieldSchema = {
  // Subject details
  crn: {
    label: 'CRN',
    group: 'subject',
    randomize: randomCrn,
  },
  pnc: {
    label: 'PNC',
    group: 'subject',
    randomize: randomPnc,
  },
  givenName: {
    label: 'Given name',
    group: 'subject',
    randomize: randomFirstName,
  },
  familyName: {
    label: 'Family name',
    group: 'subject',
    randomize: randomLastName,
  },
  gender: {
    label: 'Gender',
    group: 'subject',
    randomize: randomGender,
  },
  dateOfBirth: {
    label: 'Date of birth',
    group: 'subject',
    randomize: randomDateOfBirth,
  },
  location: {
    label: 'Location',
    group: 'subject',
    randomize: randomLocation,
  },
  sexuallyMotivatedOffenceHistory: {
    label: 'Sexually motivated offence history',
    group: 'subject',
    randomize: randomYesNo,
  },
  oasysAssessmentPk: {
    label: 'OASys Assessment PK',
    group: 'subject',
    randomize: randomOasysAssessmentPk,
  },

  // Practitioner details
  practitionerIdentifier: {
    label: 'Practitioner identifier',
    group: 'practitioner',
    randomize: randomPractitionerIdentifier,
  },
  practitionerDisplayName: {
    label: 'Practitioner name',
    group: 'practitioner',
    randomize: randomPractitionerName,
  },
  planAccessMode: {
    label: 'Access mode',
    group: 'practitioner',
    randomize: randomPlanAccessMode,
  },

  // Criminogenic needs - Accommodation
  accLinkedToHarm: {
    label: 'Accommodation - Linked to harm',
    group: 'criminogenicNeeds',
    randomize: randomYesNo,
  },
  accLinkedToReoffending: {
    label: 'Accommodation - Linked to reoffending',
    group: 'criminogenicNeeds',
    randomize: randomYesNo,
  },
  accStrengths: {
    label: 'Accommodation - Strengths',
    group: 'criminogenicNeeds',
    randomize: randomYesNo,
  },
  accOtherWeightedScore: {
    label: 'Accommodation - Score',
    group: 'criminogenicNeeds',
    randomize: randomScore(6),
  },
  accThreshold: {
    label: 'Accommodation - Threshold',
    group: 'criminogenicNeeds',
    randomize: randomYesNo,
  },

  // Criminogenic needs - Education/Training/Employability
  eteLinkedToHarm: {
    label: 'ETE - Linked to harm',
    group: 'criminogenicNeeds',
    randomize: randomYesNo,
  },
  eteLinkedToReoffending: {
    label: 'ETE - Linked to reoffending',
    group: 'criminogenicNeeds',
    randomize: randomYesNo,
  },
  eteStrengths: {
    label: 'ETE - Strengths',
    group: 'criminogenicNeeds',
    randomize: randomYesNo,
  },
  eteOtherWeightedScore: {
    label: 'ETE - Score',
    group: 'criminogenicNeeds',
    randomize: randomScore(4),
  },
  eteThreshold: {
    label: 'ETE - Threshold',
    group: 'criminogenicNeeds',
    randomize: randomYesNo,
  },

  // Criminogenic needs - Finance
  financeLinkedToHarm: {
    label: 'Finance - Linked to harm',
    group: 'criminogenicNeeds',
    randomize: randomYesNo,
  },
  financeLinkedToReoffending: {
    label: 'Finance - Linked to reoffending',
    group: 'criminogenicNeeds',
    randomize: randomYesNo,
  },
  financeStrengths: {
    label: 'Finance - Strengths',
    group: 'criminogenicNeeds',
    randomize: randomYesNo,
  },

  // Criminogenic needs - Drug Misuse
  drugLinkedToHarm: {
    label: 'Drug misuse - Linked to harm',
    group: 'criminogenicNeeds',
    randomize: randomYesNo,
  },
  drugLinkedToReoffending: {
    label: 'Drug misuse - Linked to reoffending',
    group: 'criminogenicNeeds',
    randomize: randomYesNo,
  },
  drugStrengths: {
    label: 'Drug misuse - Strengths',
    group: 'criminogenicNeeds',
    randomize: randomYesNo,
  },
  drugOtherWeightedScore: {
    label: 'Drug misuse - Score',
    group: 'criminogenicNeeds',
    randomize: randomScore(8),
  },
  drugThreshold: {
    label: 'Drug misuse - Threshold',
    group: 'criminogenicNeeds',
    randomize: randomYesNo,
  },

  // Criminogenic needs - Alcohol Misuse
  alcoholLinkedToHarm: {
    label: 'Alcohol misuse - Linked to harm',
    group: 'criminogenicNeeds',
    randomize: randomYesNo,
  },
  alcoholLinkedToReoffending: {
    label: 'Alcohol misuse - Linked to reoffending',
    group: 'criminogenicNeeds',
    randomize: randomYesNo,
  },
  alcoholStrengths: {
    label: 'Alcohol misuse - Strengths',
    group: 'criminogenicNeeds',
    randomize: randomYesNo,
  },
  alcoholOtherWeightedScore: {
    label: 'Alcohol misuse - Score',
    group: 'criminogenicNeeds',
    randomize: randomScore(4),
  },
  alcoholThreshold: {
    label: 'Alcohol misuse - Threshold',
    group: 'criminogenicNeeds',
    randomize: randomYesNo,
  },

  // Criminogenic needs - Health and Wellbeing
  emoLinkedToHarm: {
    label: 'Health & wellbeing - Linked to harm',
    group: 'criminogenicNeeds',
    randomize: randomYesNo,
  },
  emoLinkedToReoffending: {
    label: 'Health & wellbeing - Linked to reoffending',
    group: 'criminogenicNeeds',
    randomize: randomYesNo,
  },
  emoStrengths: {
    label: 'Health & wellbeing - Strengths',
    group: 'criminogenicNeeds',
    randomize: randomYesNo,
  },

  // Criminogenic needs - Personal Relationships
  relLinkedToHarm: {
    label: 'Relationships - Linked to harm',
    group: 'criminogenicNeeds',
    randomize: randomYesNo,
  },
  relLinkedToReoffending: {
    label: 'Relationships - Linked to reoffending',
    group: 'criminogenicNeeds',
    randomize: randomYesNo,
  },
  relStrengths: {
    label: 'Relationships - Strengths',
    group: 'criminogenicNeeds',
    randomize: randomYesNo,
  },
  relOtherWeightedScore: {
    label: 'Relationships - Score',
    group: 'criminogenicNeeds',
    randomize: randomScore(6),
  },
  relThreshold: {
    label: 'Relationships - Threshold',
    group: 'criminogenicNeeds',
    randomize: randomYesNo,
  },

  // Criminogenic needs - Thinking/Behaviour/Attitudes
  thinkLinkedToHarm: {
    label: 'Thinking & behaviour - Linked to harm',
    group: 'criminogenicNeeds',
    randomize: randomYesNo,
  },
  thinkLinkedToReoffending: {
    label: 'Thinking & behaviour - Linked to reoffending',
    group: 'criminogenicNeeds',
    randomize: randomYesNo,
  },
  thinkStrengths: {
    label: 'Thinking & behaviour - Strengths',
    group: 'criminogenicNeeds',
    randomize: randomYesNo,
  },
  thinkOtherWeightedScore: {
    label: 'Thinking & behaviour - Score',
    group: 'criminogenicNeeds',
    randomize: randomScore(10),
  },
  thinkThreshold: {
    label: 'Thinking & behaviour - Threshold',
    group: 'criminogenicNeeds',
    randomize: randomYesNo,
  },

  // Criminogenic needs - Lifestyle and Associates
  lifestyleLinkedToHarm: {
    label: 'Lifestyle - Linked to harm',
    group: 'criminogenicNeeds',
    randomize: randomYesNo,
  },
  lifestyleLinkedToReoffending: {
    label: 'Lifestyle - Linked to reoffending',
    group: 'criminogenicNeeds',
    randomize: randomYesNo,
  },
  lifestyleStrengths: {
    label: 'Lifestyle - Strengths',
    group: 'criminogenicNeeds',
    randomize: randomYesNo,
  },
  lifestyleOtherWeightedScore: {
    label: 'Lifestyle - Score',
    group: 'criminogenicNeeds',
    randomize: randomScore(6),
  },
  lifestyleThreshold: {
    label: 'Lifestyle - Threshold',
    group: 'criminogenicNeeds',
    randomize: randomYesNo,
  },
} as const satisfies Record<string, ScenarioFieldConfig<unknown>>

/**
 * All valid scenario field keys
 */
export type ScenarioFieldKey = keyof typeof scenarioFieldSchema

/**
 * Array of all field keys for iteration
 */
export const scenarioFieldKeys = Object.keys(scenarioFieldSchema) as ScenarioFieldKey[]

/**
 * Infer the value type for a specific field from the schema
 */
type InferFieldType<K extends ScenarioFieldKey> = ReturnType<(typeof scenarioFieldSchema)[K]['randomize']>

/**
 * Resolved scenario values - all fields with their actual values
 */
export type ScenarioValues = {
  [K in ScenarioFieldKey]: InferFieldType<K>
}

/**
 * Partial scenario values - for presets that only define some fields
 */
export type PartialScenarioValues = Partial<ScenarioValues>
