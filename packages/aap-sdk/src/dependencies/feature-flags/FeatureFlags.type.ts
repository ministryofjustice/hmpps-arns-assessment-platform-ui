import type { BooleanFeatureFlagsResult, FeatureFlagsConfig } from './featureFlags'

export interface FeatureFlags {
  evaluateBooleanFlags(featureFlags: FeatureFlagsConfig, userId?: string): Promise<BooleanFeatureFlagsResult>
}
