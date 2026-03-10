export const FEATURE_FLAG_NAMESPACE = 'hmpps-arns-assessment-platform'
export const UPDATE_INTERVAL_SECONDS = 120

export const BooleanFeatureFlags = {
  ENABLE_SMART_SURVEY_IN_BETA: {
    fliptKey: 'sp-enable-smart-survey-in-private-beta',
    nunjucksKey: 'smartSurveyInPrivateBetaEnabled',
  },
  ENABLE_SMART_SURVEY_IN_NATIONAL_ROLLOUT: {
    fliptKey: 'sp-enable-smart-survey-in-national-rollout',
    nunjucksKey: 'smartSurveyInNationalRolloutEnabled',
  },
}

export interface FeatureFlagConfig {
  url: string
  environment?: string
  namespace: string
  updateInterval?: number
}

export type FeatureFlagsConfig = Record<string, FeatureFlag>

export type FeatureFlag = {
  fliptKey: string
  nunjucksKey: string
}

export type BooleanFeatureFlagsResult = {
  booleanFeatureFlags: Record<string, boolean>
}
