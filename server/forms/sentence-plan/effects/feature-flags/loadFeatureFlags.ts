import { BooleanFeatureFlags } from '@ministryofjustice/hmpps-aap-sdk/dependencies/feature-flags/featureFlags'
import { SentencePlanContext, SentencePlanEffectsDeps } from '../types'

export const loadFeatureFlags = (deps: SentencePlanEffectsDeps) => async (context: SentencePlanContext) => {
  try {
    const user = context.getState('user')
    const result = await deps.featureFlagService.evaluateBooleanFlags(BooleanFeatureFlags, user?.id)
    context.setData('featureFlags', result.booleanFeatureFlags)
  } catch (error) {
    deps.logger.error('Error in loadFeatureFlags, failed to load feature flags: ', error)
  }
}
