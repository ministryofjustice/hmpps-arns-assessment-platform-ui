import { jwtDecode } from 'jwt-decode'
import type { RequestHandler } from 'express'

import logger from '../../logger'
import { AccessPermissions } from '../interfaces/delius-api/accessPermissions'

type FineGrainedAccessClient = {
  getUserAccess: (username: string, crn: string) => Promise<AccessPermissions>
}

const getCrnFromAccessPath = (path: string): string | undefined => {
  const match = path.match(/^\/access\/[^/]+\/crn\/([^/]+)\/?$/i)
  return match?.[1]
}

export default function authorisationMiddleware(
  authorisedRoles: string[],
  fineGrainedAccessClient: FineGrainedAccessClient,
): RequestHandler {
  return async (req, res, next) => {
    if (req.authBypassed) {
      return next()
    }

    // authorities in the user token will always be prefixed by ROLE_.
    // Convert roles that are passed into this function without the prefix so that we match correctly.
    const authorisedAuthorities = authorisedRoles.map(role => (role.startsWith('ROLE_') ? role : `ROLE_${role}`))
    if (res.locals?.user?.token) {
      const { authorities: roles = [], user_name: username } = jwtDecode(res.locals.user.token) as {
        authorities?: string[]
        user_name?: string
      }

      if (authorisedAuthorities.length && !roles.some(role => authorisedAuthorities.includes(role))) {
        logger.warn({ username, path: req.path }, 'User is not authorised to access this')
        return res.redirect('/authError')
      }

      const crn = getCrnFromAccessPath(req.path)

      if (crn && res.locals.user.authSource === 'HMPPS_AUTH' && username) {
        try {
          const access = await fineGrainedAccessClient.getUserAccess(username, crn)

          if (!access.canAccess) {
            logger.warn({ username, crn }, 'User cannot access requested CRN')
            return res.redirect('/authError')
          }
        } catch (error) {
          logger.error({ err: error, username, crn }, 'Unable to verify fine-grained CRN access')
          return next(error)
        }
      }

      return next()
    }

    req.session.returnTo = req.originalUrl
    return res.redirect('/sign-in')
  }
}
