export const FEATURE_FLAG_NAMESPACE = 'hmpps-arns-assessment-platform'
export const UPDATE_INTERVAL_SECONDS = 120

export interface FeatureFlagConfig {
  url: string
  environment?: string
  namespace: string
  updateInterval?: number
}
