import { jwtDecode } from 'jwt-decode'
import express from 'express'
import { convertToTitleCase } from '../utils/utils'
import logger from '../../logger'
import { telemetry } from '../utils/telemetry'

export default function setUpCurrentUser() {
  const router = express.Router()

  router.use((req, res, next) => {
    // Skip if bypassed and no user token (unauthenticated on bypassed path)
    // For authenticated users on bypassed paths, we still want to populate user details
    if (req.authBypassed && !res.locals.user?.token) {
      return next()
    }

    try {
      const {
        name,
        user_id: userId,
        authorities: roles = [],
      } = jwtDecode(res.locals.user.token) as {
        name?: string
        user_id?: string
        authorities?: string[]
      }

      res.locals.user = {
        ...res.locals.user,
        userId,
        name,
        displayName: convertToTitleCase(name),
        userRoles: roles.map(role => role.substring(role.indexOf('_') + 1)),
      }

      req.session.principal = {
        identifier: userId || res.locals.user.username,
        username: res.locals.user.username,
        displayName: convertToTitleCase(name),
      }

      telemetry.helpers.enrichSpanWithUser({
        id: res.locals.user.userId,
        authSource: res.locals.user.authSource,
        roles: res.locals.user.userRoles,
      })

      telemetry.addSpanEvent('UserSessionPopulated', {
        authSource: res.locals.user.authSource || 'unknown',
        hasRoles: roles.length > 0,
      })

      return next()
    } catch (error) {
      logger.error(error, `Failed to populate user details for: ${res.locals.user && res.locals.user.username}`)
      return next(error)
    }
  })

  return router
}
