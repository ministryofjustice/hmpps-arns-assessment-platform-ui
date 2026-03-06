import express, { Router } from 'express'
import { trace } from '@ministryofjustice/hmpps-azure-telemetry'
import { createChildLogger, runWithLogger } from '../../logger'

const roundDurationMs = (durationMs: number): number => Number(durationMs.toFixed(1))

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

    const requestLogger = createChildLogger({
      requestId,
      traceId,
      requestMethod: req.method,
      requestPath: req.path,
    })

    const startTime = process.hrtime.bigint()

    return runWithLogger(requestLogger, () => {
      // Logging on `finish` captures the final status code after all downstream
      // middleware and routes have had a chance to handle the request.
      res.on('finish', () => {
        const durationMs = roundDurationMs(Number(process.hrtime.bigint() - startTime) / 1_000_000)
        const fields = {
          event: 'request.completed',
          statusCode: res.statusCode,
          durationMs,
          originalUrl: req.originalUrl,
          userId: res.locals.user?.username,
          authSource: res.locals.user?.authSource,
        }

        if (res.statusCode >= 500) {
          requestLogger.error(fields, 'Request completed')
          return
        }

        if (res.statusCode >= 400) {
          requestLogger.warn(fields, 'Request completed')
          return
        }

        requestLogger.info(fields, 'Request completed')
      })

      next()
    })
  })

  return router
}
