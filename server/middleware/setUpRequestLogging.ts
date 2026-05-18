import express, { Router } from 'express'
import { randomUUID } from 'crypto'
import { trace, telemetry } from '@ministryofjustice/hmpps-azure-telemetry'

export default function setUpRequestLogging(): Router {
  const router = express.Router()

  router.use((req, res, next) => {
    const requestId = req.id ?? req.state?.requestId
    const traceId = trace.getActiveSpan()?.spanContext().traceId

    // Generate a fresh telemetry ID per Express session so analytics can
    // dedupe by login without exposing the actual session token.
    if (req.session && !req.session.telemetryId) {
      req.session.telemetryId = randomUUID()
    }

    // Store support IDs on both req.state and res.locals so backend code,
    // templates, and audit helpers all read the same identifiers.
    req.state = {
      ...req.state,
      requestId,
      traceId,
    }

    res.locals.requestId = requestId
    res.locals.traceId = traceId
    res.locals.telemetryId = req.session?.telemetryId

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
