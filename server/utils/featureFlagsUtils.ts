export const FEATURE_FLAG_NAMESPACE = 'hmpps-arns-assessment-platform'
export const UPDATE_INTERVAL_SECONDS = 120

export const BooleanFeatureFlags = {
  ENABLE_SMART_SURVEY_IN_BETA: {
    fliptKey: 'sp-enable-smart-survey-in-private-beta',
    nunjucksKey: 'smartSurveyInPrivateBetaEnabled',
    fallbackState: false,
  },
  ENABLE_SMART_SURVEY_IN_NATIONAL_ROLLOUT: {
    fliptKey: 'sp-enable-smart-survey-in-national-rollout',
    nunjucksKey: 'smartSurveyInNationalRolloutEnabled',
    fallbackState: false,
  },
  ENABLE_TEAMS_REPORT_PROBLEM_LINK: {
    fliptKey: 'sp-enable-teams-report-problem-link',
    nunjucksKey: 'teamsReportProblemLinkEnabled',
    fallbackState: false,
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
  fallbackState: boolean
}

export type BooleanFeatureFlagsResult = {
  booleanFeatureFlags: Record<string, boolean>
}

export const getFallbackFeatureFlags = (featureFlags: FeatureFlagsConfig): Record<string, boolean> => {
  const booleanFeatureFlags: Record<string, boolean> = {}
  for (const flag of Object.values(featureFlags)) {
    booleanFeatureFlags[flag.nunjucksKey] = flag.fallbackState
  }
  return booleanFeatureFlags
}
