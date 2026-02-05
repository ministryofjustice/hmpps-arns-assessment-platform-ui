import passport from 'passport'
import flash from 'connect-flash'
import { Router, Request } from 'express'
import { Strategy } from 'passport-oauth2'
import { jwtDecode } from 'jwt-decode'
import { VerificationClient, AuthenticatedRequest } from '@ministryofjustice/hmpps-auth-clients'
import config from '../config'
import { HmppsUser } from '../interfaces/hmppsUser'
import generateOauthClientToken from '../utils/clientCredentials'
import logger from '../../logger'

interface AuthenticationOptions {
  bypassPaths?: (string | RegExp)[]
}

function shouldBypassAuth(req: Request, bypassPaths?: (string | RegExp)[]): boolean {
  if (!bypassPaths || bypassPaths.length === 0) {
    return false
  }

  return bypassPaths.some(pattern => {
    if (typeof pattern === 'string') {
      return req.path.startsWith(pattern)
    }

    return pattern.test(req.path)
  })
}

enum AuthStrategy {
  HANDOVER = 'handover-oauth2',
  HMPPS_AUTH = 'hmpps-auth-oauth2',
}

const authPaths = {
  signIn: '/sign-in',
  handover: '/sign-in/handover',
  handoverCallback: '/sign-in/handover/callback',
  hmppsAuth: '/sign-in/hmpps-auth',
  hmppsAuthCallback: '/sign-in/hmpps-auth/callback',
  authError: '/autherror',
  signOut: '/sign-out',
  accountDetails: '/account-details',

  handoverAuthorize: '/oauth2/authorize',
  handoverToken: '/oauth2/token',
  hmppsAuthorize: '/oauth/authorize',
  hmppsToken: '/oauth/token',
}

/**
 * Mapping of service names to their access form entry paths after handover auth.
 * The access form handles loading handover context and redirecting to the target service.
 */
const targetServicePaths: Record<string, string> = {
  'sentence-plan': '/access/sentence-plan/oasys',
}

passport.serializeUser((user, done) => {
  // Not used but required for Passport
  done(null, user)
})

passport.deserializeUser((user, done) => {
  // Not used but required for Passport
  done(null, user as Express.User)
})

passport.use(
  AuthStrategy.HANDOVER,
  new Strategy(
    {
      authorizationURL: `${config.apis.arnsHandover.externalUrl}${authPaths.handoverAuthorize}`,
      tokenURL: `${config.apis.arnsHandover.url}${authPaths.handoverToken}`,
      clientID: config.apis.arnsHandover.clientId,
      clientSecret: config.apis.arnsHandover.clientSecret,
      callbackURL: `${config.ingressUrl}${authPaths.handoverCallback}`,
      state: true,
      customHeaders: {
        Authorization: generateOauthClientToken(
          config.apis.arnsHandover.clientId,
          config.apis.arnsHandover.clientSecret,
        ),
      },
      scope: 'openid profile',
    },
    (token, _refreshToken, _params, _profile, done) => {
      const { user_name: username } = jwtDecode(token) as { user_name?: string }
      return done(null, { token, username, authSource: 'OASYS' })
    },
  ),
)

passport.use(
  AuthStrategy.HMPPS_AUTH,
  new Strategy(
    {
      authorizationURL: `${config.apis.hmppsAuth.externalUrl}${authPaths.hmppsAuthorize}`,
      tokenURL: `${config.apis.hmppsAuth.url}${authPaths.hmppsToken}`,
      clientID: config.apis.hmppsAuth.authClientId,
      clientSecret: config.apis.hmppsAuth.authClientSecret,
      callbackURL: `${config.ingressUrl}${authPaths.hmppsAuthCallback}`,
      state: true,
      customHeaders: {
        Authorization: generateOauthClientToken(
          config.apis.hmppsAuth.authClientId,
          config.apis.hmppsAuth.authClientSecret,
        ),
      },
    },
    (token, _refreshToken, params, _profile, done) => {
      return done(null, { token, username: params.user_name, authSource: 'HMPPS_AUTH' })
    },
  ),
)

export default function setupAuthentication(options: AuthenticationOptions = {}) {
  const router = Router()
  const tokenVerificationClient = new VerificationClient(config.apis.tokenVerification, logger)

  router.use(passport.initialize())
  router.use(passport.session())
  router.use(flash())

  router.get(authPaths.authError, (_req, res) => {
    res.status(401)
    return res.render('autherror')
  })

  router.get(authPaths.handover, (req, res, next) => {
    const service = req.query.service as string | undefined

    if (service) {
      req.session.targetService = service
    }

    passport.authenticate(AuthStrategy.HANDOVER)(req, res, next)
  })

  router.get(authPaths.handoverCallback, (req, res, next) => {
    // Preserve values across session regeneration
    const csrfToken = req.session.csrfToken
    const targetService = req.session.targetService

    passport.authenticate(AuthStrategy.HANDOVER, (err: Error, user: Express.User) => {
      if (err) {
        return next(err)
      }

      if (!user) {
        return res.redirect(authPaths.authError)
      }

      return req.logIn(user, loginErr => {
        if (loginErr) {
          return next(loginErr)
        }

        // Restore CSRF token to the new session
        if (csrfToken) {
          req.session.csrfToken = csrfToken
        }

        // Redirect to the service path, or fallback to root
        const redirectPath = targetService ? targetServicePaths[targetService] : '/'

        return res.redirect(redirectPath)
      })
    })(req, res, next)
  })

  router.get(authPaths.hmppsAuth, passport.authenticate(AuthStrategy.HMPPS_AUTH))

  router.get(authPaths.hmppsAuthCallback, (req, res, next) => {
    // Preserve values across session regeneration
    const csrfToken = req.session.csrfToken
    const returnTo = req.session.returnTo

    passport.authenticate(AuthStrategy.HMPPS_AUTH, (err: Error, user: Express.User) => {
      if (err) {
        return next(err)
      }

      if (!user) {
        return res.redirect(authPaths.authError)
      }

      return req.logIn(user, loginErr => {
        if (loginErr) {
          return next(loginErr)
        }

        // Restore CSRF token to the new session
        if (csrfToken) {
          req.session.csrfToken = csrfToken
        }

        return res.redirect(returnTo || '/')
      })
    })(req, res, next)
  })

  router.get(authPaths.signIn, passport.authenticate(AuthStrategy.HMPPS_AUTH))

  const authUrl = config.apis.hmppsAuth.externalUrl
  const authParameters = `client_id=${config.apis.hmppsAuth.authClientId}&redirect_uri=${config.ingressUrl}`

  router.use(authPaths.signOut, (req, res, next) => {
    const authSignOutUrl = `${authUrl}${authPaths.signOut}?${authParameters}`
    if (req.user) {
      req.logout(err => {
        if (err) return next(err)
        return req.session.destroy(() => res.redirect(authSignOutUrl))
      })
    } else res.redirect(authSignOutUrl)
  })

  router.use(authPaths.accountDetails, (_req, res) => {
    res.redirect(`${authUrl}${authPaths.accountDetails}?${authParameters}`)
  })

  router.use(async (req, res, next) => {
    if (shouldBypassAuth(req, options.bypassPaths)) {
      req.authBypassed = true
      return next()
    }

    if (req.isAuthenticated() && req.user.authSource === 'OASYS') {
      return next()
    }

    if (req.isAuthenticated() && (await tokenVerificationClient.verifyToken(req as unknown as AuthenticatedRequest))) {
      return next()
    }

    req.session.returnTo = req.originalUrl
    return res.redirect(authPaths.signIn)
  })

  router.use((req, res, next) => {
    if (!req.isAuthenticated()) {
      return next()
    }

    const hmppsUser = req.user as HmppsUser
    res.locals.user = hmppsUser

    req.state = {
      ...req.state,
      user: {
        id: hmppsUser.username,
        name: hmppsUser.displayName ?? hmppsUser.username,
        authSource: hmppsUser.authSource,
        token: hmppsUser.token,
      },
    }

    return next()
  })

  return router
}
