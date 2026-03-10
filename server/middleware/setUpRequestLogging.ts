import express, { Router } from 'express'
import { trace, telemetry } from '@ministryofjustice/hmpps-azure-telemetry'

export default function setUpRequestLogging(): Router {
  const router = express.Router()

  router.use((req, res, next) => {
    const requestId = req.id ?? req.state?.requestId
    const traceId = trace.getActiveSpan()?.spanContext().traceId

    // Store support IDs on both req.state and res.locals so backend code,
    // templates, and audit helpers all read the same identifiers.
    req.state = {
      ...req.state,
      requestId,
      traceId,
    }

    res.locals.requestId = requestId
    res.locals.traceId = traceId

    res.on('finish', () => {
      if (res.statusCode >= 500) {
        telemetry.trackEvent('ServerError', {
          statusCode: res.statusCode,
          originalUrl: req.originalUrl,
          method: req.method,
        })
      }
    })

    next()
  })

  return router
}
