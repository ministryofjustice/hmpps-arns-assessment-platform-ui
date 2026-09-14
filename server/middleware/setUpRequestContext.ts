import express, { Router } from 'express'
import { trace } from '@ministryofjustice/hmpps-azure-telemetry'
import { requestContext } from '../utils/requestContext'

const setUpRequestContext = (): Router => {
  const router = express.Router()

  router.use((req, _res, next) => {
    const serviceName = req.session?.targetService

    if (serviceName) {
      trace.getActiveSpan()?.setAttribute('serviceName', serviceName)
    }

    requestContext.run({ getServiceName: () => req.session?.targetService }, next)
  })

  return router
}

export default setUpRequestContext
