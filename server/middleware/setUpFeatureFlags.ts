import express from 'express'
import { BooleanFeatureFlags } from '@ministryofjustice/hmpps-aap-sdk/dependencies/feature-flags/featureFlags'
import type FeatureFlagService from '../services/featureFlagService'

export default function setUpFeatureFlags(featureFlagService: FeatureFlagService) {
  const router = express.Router()

  router.use(async (_req, res, next) => {
    const userId = res.locals.user?.userId

    // Flags can be targeted to a specific user, so we pass the current user ID when we have one.
    const result = await featureFlagService.evaluateBooleanFlags(BooleanFeatureFlags, userId)

    res.locals.featureFlags = result.booleanFeatureFlags
    return next()
  })

  return router
}
