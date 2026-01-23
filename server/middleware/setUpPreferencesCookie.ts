import { Router, Request, Response, NextFunction } from 'express'
import { randomUUID } from 'crypto'
import config from '../config'

const COOKIE_NAME = 'hmpps-arns-assessment-platform-preferences'
const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000

/**
 * Middleware that manages a long-lived preferences cookie.
 * Used to persist user preferences (like training sessions) across auth sessions.
 */
export default function setUpPreferencesCookie(): Router {
  const router = Router()

  router.use((req: Request, res: Response, next: NextFunction) => {
    let preferencesId = req.cookies?.[COOKIE_NAME]

    if (!preferencesId) {
      preferencesId = randomUUID()

      res.cookie(COOKIE_NAME, preferencesId, {
        httpOnly: true,
        secure: config.https,
        sameSite: 'lax',
        maxAge: ONE_YEAR_MS,
      })
    }

    if (!req.state) {
      req.state = {}
    }

    // Give access to the preferencesId in the form engine.
    req.state.preferencesId = preferencesId
    next()
  })

  return router
}
