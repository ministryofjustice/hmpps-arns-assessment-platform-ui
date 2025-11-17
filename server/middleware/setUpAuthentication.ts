import passport from 'passport'
import flash from 'connect-flash'
import { Router } from 'express'
import { Strategy } from 'passport-oauth2'
import { VerificationClient, AuthenticatedRequest } from '@ministryofjustice/hmpps-auth-clients'
import config from '../config'
import { HmppsUser } from '../interfaces/hmppsUser'
import generateOauthClientToken from '../utils/clientCredentials'
import logger from '../../logger'

const strategies = {
  handover: 'handover-oauth2',
  hmppsAuth: 'hmpps-auth-oauth2',
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

passport.serializeUser((user, done) => {
  // Not used but required for Passport
  done(null, user)
})

passport.deserializeUser((user, done) => {
  // Not used but required for Passport
  done(null, user as Express.User)
})

passport.use(
  strategies.handover,
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
    (token, _refreshToken, params, _profile, done) => {
      return done(null, { token, username: params.user_name, authSource: 'handover' })
    },
  ),
)

passport.use(
  strategies.hmppsAuth,
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
      return done(null, { token, username: params.user_name, authSource: params.auth_source })
    },
  ),
)

export default function setupAuthentication() {
  const router = Router()
  const tokenVerificationClient = new VerificationClient(config.apis.tokenVerification, logger)

  router.use(passport.initialize())
  router.use(passport.session())
  router.use(flash())

  router.get(authPaths.authError, (_req, res) => {
    res.status(401)
    return res.render('autherror')
  })

  router.get(authPaths.handover, passport.authenticate(strategies.handover))

  router.get(authPaths.handoverCallback, (req, res, next) =>
    passport.authenticate(strategies.handover, {
      successReturnToOrRedirect: req.session.returnTo || '/',
      failureRedirect: authPaths.authError,
    })(req, res, next),
  )

  router.get(authPaths.hmppsAuth, passport.authenticate(strategies.hmppsAuth))

  router.get(authPaths.hmppsAuthCallback, (req, res, next) =>
    passport.authenticate(strategies.hmppsAuth, {
      successReturnToOrRedirect: req.session.returnTo || '/',
      failureRedirect: authPaths.authError,
    })(req, res, next),
  )

  router.get(authPaths.signIn, passport.authenticate(strategies.hmppsAuth))

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
    if (req.isAuthenticated() && req.user.authSource === 'handover') {
      return next()
    }

    if (req.isAuthenticated() && (await tokenVerificationClient.verifyToken(req as unknown as AuthenticatedRequest))) {
      return next()
    }
    req.session.returnTo = req.originalUrl
    return res.redirect(authPaths.signIn)
  })

  router.use((req, res, next) => {
    res.locals.user = req.user as HmppsUser
    next()
  })

  return router
}
