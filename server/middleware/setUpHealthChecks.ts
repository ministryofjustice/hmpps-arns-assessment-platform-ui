import express, { Router } from 'express'

import { monitoringMiddleware, endpointHealthComponent } from '@ministryofjustice/hmpps-monitoring'
import type { ApplicationInfo } from '../applicationInfo'
import logger from '../../logger'
import config from '../config'

/**
 * APIs deliberately left out of the aggregate health check.
 *
 * /health returns HTTP 500 when any component is DOWN, which alerting treats as this
 * service failing. These three back the feature-flagged supervision package page only,
 * and it renders a usable state without them, so their outages must not page us.
 */
const EXCLUDED_FROM_HEALTH_CHECK = ['tierApi', 'supervisionPackageApi', 'masApi']

export default function setUpHealthChecks(applicationInfo: ApplicationInfo): Router {
  const router = express.Router()

  const apiConfig = Object.entries(config.apis).filter(([name]) => !EXCLUDED_FROM_HEALTH_CHECK.includes(name))

  const middleware = monitoringMiddleware({
    applicationInfo,
    healthComponents: apiConfig.map(([name, options]) => endpointHealthComponent(logger, name, options)),
  })

  router.get('/health', middleware.health)
  router.get('/info', middleware.info)
  router.get('/ping', middleware.ping)

  return router
}
