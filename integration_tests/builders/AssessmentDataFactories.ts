import type { MotivationLevel } from '@server/interfaces/coordinator-api/entityAssessment'
import type { SanAssessmentData } from '../mockApis/coordinatorApi'

export type AssessmentCompleteness = 'complete' | 'incomplete'

export interface AreaConfig {
  complete?: boolean
  linkedToHarm?: boolean
  linkedToReoffending?: boolean
  hasStrengths?: boolean
  motivation?: NonNullable<MotivationLevel>
}

export type AreaKey =
  | 'accommodation'
  | 'employment_education'
  | 'finance'
  | 'drug_use'
  | 'alcohol_use'
  | 'health_wellbeing'
  | 'personal_relationships_community'
  | 'thinking_behaviours_attitudes'
  | 'lifestyle_associates'

export type AreaOverrides = Partial<Record<AreaKey, AreaConfig>>

const areaNames: Record<AreaKey, string> = {
  accommodation: 'Accommodation',
  employment_education: 'ETE',
  finance: 'Finance',
  drug_use: 'Drug',
  alcohol_use: 'Alcohol',
  health_wellbeing: 'Health',
  personal_relationships_community: 'Relationships',
  thinking_behaviours_attitudes: 'Thinking',
  lifestyle_associates: 'Lifestyle',
}

const defaultMotivations: Record<AreaKey, NonNullable<MotivationLevel>> = {
  accommodation: 'WANT_TO_MAKE_CHANGES',
  employment_education: 'MAKING_CHANGES',
  finance: 'MAKING_CHANGES',
  drug_use: 'NEEDS_HELP_TO_MAKE_CHANGES',
  alcohol_use: 'MADE_CHANGES',
  health_wellbeing: 'WANT_TO_MAKE_CHANGES',
  personal_relationships_community: 'MAKING_CHANGES',
  thinking_behaviours_attitudes: 'THINKING_ABOUT_MAKING_CHANGES',
  lifestyle_associates: 'MAKING_CHANGES',
}

const getDefaultAreaConfigs = (isComplete: boolean): Record<AreaKey, Required<AreaConfig>> => ({
  accommodation: {
    complete: true,
    linkedToHarm: true,
    linkedToReoffending: true,
    hasStrengths: true,
    motivation: defaultMotivations.accommodation,
  },
  employment_education: {
    complete: isComplete,
    linkedToHarm: false,
    linkedToReoffending: true,
    hasStrengths: true,
    motivation: defaultMotivations.employment_education,
  },
  finance: {
    complete: isComplete,
    linkedToHarm: false,
    linkedToReoffending: false,
    hasStrengths: true,
    motivation: defaultMotivations.finance,
  },
  drug_use: {
    complete: isComplete,
    linkedToHarm: true,
    linkedToReoffending: true,
    hasStrengths: false,
    motivation: defaultMotivations.drug_use,
  },
  alcohol_use: {
    complete: true,
    linkedToHarm: true,
    linkedToReoffending: true,
    hasStrengths: true,
    motivation: defaultMotivations.alcohol_use,
  },
  health_wellbeing: {
    complete: isComplete,
    linkedToHarm: false,
    linkedToReoffending: false,
    hasStrengths: true,
    motivation: defaultMotivations.health_wellbeing,
  },
  personal_relationships_community: {
    complete: true,
    linkedToHarm: true,
    linkedToReoffending: true,
    hasStrengths: true,
    motivation: defaultMotivations.personal_relationships_community,
  },
  thinking_behaviours_attitudes: {
    complete: isComplete,
    linkedToHarm: true,
    linkedToReoffending: true,
    hasStrengths: false,
    motivation: defaultMotivations.thinking_behaviours_attitudes,
  },
  lifestyle_associates: {
    complete: isComplete,
    linkedToHarm: true,
    linkedToReoffending: true,
    hasStrengths: true,
    motivation: defaultMotivations.lifestyle_associates,
  },
})

const buildAreaData = (areaKey: AreaKey, config: Required<AreaConfig>): SanAssessmentData => {
  const data: SanAssessmentData = {}
  const areaName = areaNames[areaKey]

  data[`${areaKey}_section_complete`] = { value: config.complete ? 'YES' : 'NO' }

  data[`${areaKey}_practitioner_analysis_risk_of_serious_harm`] = { value: config.linkedToHarm ? 'YES' : 'NO' }
  if (config.linkedToHarm) {
    data[`${areaKey}_practitioner_analysis_risk_of_serious_harm_yes_details`] = { value: `${areaName} harm details` }
  }

  data[`${areaKey}_practitioner_analysis_risk_of_reoffending`] = { value: config.linkedToReoffending ? 'YES' : 'NO' }
  if (config.linkedToReoffending) {
    data[`${areaKey}_practitioner_analysis_risk_of_reoffending_yes_details`] = {
      value: `${areaName} reoffending details`,
    }
  }

  data[`${areaKey}_practitioner_analysis_strengths_or_protective_factors`] = {
    value: config.hasStrengths ? 'YES' : 'NO',
  }
  if (config.hasStrengths) {
    data[`${areaKey}_practitioner_analysis_strengths_or_protective_factors_yes_details`] = {
      value: `${areaName} strengths`,
    }
  }

  data[`${areaKey}_changes`] = { value: config.motivation }

  return data
}

// creates SAN assessment data using completeness flag and allows for overrides
// @example
// // all sections complete:
// createAssessmentData('complete')
// //some sections incomplete:
// createAssessmentData('incomplete')
// //override specific areas:
// createAssessmentData('complete', {
//   accommodation: { linkedToHarm: false },
//   drug_use: { complete: false, hasStrengths: true },
// })
export const createAssessmentData = (
  completeness: AssessmentCompleteness = 'complete',
  overrides: AreaOverrides = {},
): SanAssessmentData => {
  const isComplete = completeness === 'complete'
  const defaultConfigs = getDefaultAreaConfigs(isComplete)

  let data: SanAssessmentData = {}

  for (const areaKey of Object.keys(defaultConfigs) as AreaKey[]) {
    const defaultConfig = defaultConfigs[areaKey]
    const areaOverride = overrides[areaKey] || {}
    const mergedConfig: Required<AreaConfig> = { ...defaultConfig, ...areaOverride }

    data = { ...data, ...buildAreaData(areaKey, mergedConfig) }
  }

  return data
}
