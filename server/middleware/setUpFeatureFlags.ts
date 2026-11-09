import express from 'express'
import type FeatureFlagService from '../services/featureFlagService'
import { BooleanFeatureFlags } from '../utils/featureFlagsUtils'

export default function setUpFeatureFlags(featureFlagService: FeatureFlagService) {
  const router = express.Router()

  router.use(async (_req, res, next) => {
    const userId = res.locals.user?.userId

    // Flags can be targeted to a specific user, so we pass the current user ID when we have one.
    const result = await featureFlagService.evaluateBooleanFlags(BooleanFeatureFlags, userId)

    res.locals.featureFlags = result.booleanFeatureFlags
    res.locals.downtimeBanner = result.booleanFeatureFlags.downtimeNotificationBanner
      ? await featureFlagService.getDowntimeBannerContent(userId)
      : undefined
    return next()
  })

  return router
}
