import express from 'express'

import createError from 'http-errors'

import FormEngine from '@form-engine/core/FormEngine'
import nunjucksSetup from './utils/nunjucksSetup'
import errorHandler from './errorHandler'
import { appInsightsMiddleware } from './utils/azureAppInsights'
import authorisationMiddleware from './middleware/authorisationMiddleware'
import { autosaveMiddleware, prefetchAnswersMiddleware } from './middleware/autosaveMiddleware'

import setUpAuthentication from './middleware/setUpAuthentication'
import setUpCsrf from './middleware/setUpCsrf'
import setUpCurrentUser from './middleware/setUpCurrentUser'
import setUpHealthChecks from './middleware/setUpHealthChecks'
import setUpStaticResources from './middleware/setUpStaticResources'
import setUpWebRequestParsing from './middleware/setupRequestParsing'
import setUpWebSecurity from './middleware/setUpWebSecurity'
import setUpWebSession from './middleware/setUpWebSession'

import routes from './routes'
import type { Services } from './services'
import logger from '../logger'
import ExampleFormShowcase from './forms/example-form'

export default function createApp(services: Services): express.Application {
  const app = express()
  const formEngine = new FormEngine({
    logger,
  }).registerForm(ExampleFormShowcase)

  app.set('json spaces', 2)
  app.set('trust proxy', true)
  app.set('port', process.env.PORT || 3000)

  app.use(appInsightsMiddleware())
  app.use(setUpHealthChecks(services.applicationInfo))
  app.use(setUpWebSecurity())
  app.use(setUpWebSession())
  app.use(setUpWebRequestParsing())
  app.use(setUpStaticResources())
  nunjucksSetup(app)
  app.use(setUpAuthentication())
  app.use(authorisationMiddleware())
  app.use(setUpCsrf())
  app.use(setUpCurrentUser())

  app.use((_req, res, next) => {
    res.locals.assessmentService = services.assessmentService
    next()
  })
  app.use(autosaveMiddleware())
  app.use(prefetchAnswersMiddleware())

  app.use(routes(services))
  app.use(formEngine.getRouter())

  app.use((req, res, next) => next(createError(404, 'Not found')))
  app.use(errorHandler(process.env.NODE_ENV === 'production'))

  return app
}
