import { SentencePlanContext, SentencePlanEffectsDeps } from '../types'
import logger from '../../../../../logger'
import { BooleanFeatureFlags } from '../../../../utils/featureFlagsUtils'

export const loadFeatureFlags = (deps: SentencePlanEffectsDeps) => async (context: SentencePlanContext) => {
  try {
    const user = context.getState('user')
    const result = await deps.featureFlagService.evaluateBooleanFlags(BooleanFeatureFlags, user?.id)
    context.setData('featureFlags', result.booleanFeatureFlags)
  } catch (error) {
    logger.error('Error in loadFeatureFlags, failed to load feature flags: ', error)
  }
}
