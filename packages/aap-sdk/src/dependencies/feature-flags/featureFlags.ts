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
  ENABLE_PRINT_AND_SHARE: {
    fliptKey: 'sp-enable-print-and-share',
    nunjucksKey: 'printAndShareEnabled',
    fallbackState: false,
  },
  ENABLE_SUPERVISION_PACKAGE: {
    fliptKey: 'sp-enable-supervision-package',
    nunjucksKey: 'supervisionPackageEnabled',
    fallbackState: false,
  },
  DOWNTIME_NOTIFICATION_BANNER: {
    fliptKey: 'sp-downtime-notification-banner',
    nunjucksKey: 'downtimeNotificationBanner',
    fallbackState: false,
  },
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

  Object.values(featureFlags).forEach(flag => {
    booleanFeatureFlags[flag.nunjucksKey] = flag.fallbackState
  })

  return booleanFeatureFlags
}
