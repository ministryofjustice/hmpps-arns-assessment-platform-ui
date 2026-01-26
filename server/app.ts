import express from 'express'

import createError from 'http-errors'

import FormEngine from '@form-engine/core/FormEngine'
import { ExpressFrameworkAdapter } from '@form-engine-express-nunjucks/index'
import { govukComponents } from '@form-engine-govuk-components/index'
import { mojComponents } from '@form-engine-moj-components/index'
import nunjucksSetup from './utils/nunjucksSetup'
import errorHandler from './routes/error/errorHandler'
import { appInsightsMiddleware } from './utils/azureAppInsights'
import authorisationMiddleware from './middleware/authorisationMiddleware'

import setUpAuthentication from './middleware/setUpAuthentication'
import setUpCsrf from './middleware/setUpCsrf'
import setUpCurrentUser from './middleware/setUpCurrentUser'
import setUpHealthChecks from './middleware/setUpHealthChecks'
import setUpStaticResources from './middleware/setUpStaticResources'
import setUpWebRequestParsing from './middleware/setupRequestParsing'
import setUpWebSecurity from './middleware/setUpWebSecurity'
import setUpWebSession from './middleware/setUpWebSession'
import setUpPreferencesCookie from './middleware/setUpPreferencesCookie'

import routes from './routes'
import type { Services } from './services'
import logger from '../logger'

// Form packages
import formEngineDeveloperGuide from './forms/form-engine-developer-guide'
import accessFormPackage from './forms/access'
import sentencePlanFormPackage from './forms/sentence-plan'
import trainingSessionLauncher from './forms/training-session-launcher'

export default function createApp(services: Services): express.Application {
  const app = express()

  app.set('json spaces', 2)
  app.set('trust proxy', true)
  app.set('port', process.env.PORT || 3000)

  const nunjucksEnv = nunjucksSetup(app)
  const formEngine = new FormEngine({
    logger,
    basePath: '/forms',
    frameworkAdapter: ExpressFrameworkAdapter.configure({
      nunjucksEnv,
      defaultTemplate: 'partials/form-step',
    }),
  })
    .registerComponents(govukComponents)
    .registerComponents(mojComponents)
    .registerFormPackage(formEngineDeveloperGuide)
    .registerFormPackage(trainingSessionLauncher, {
      coordinatorApiClient: services.coordinatorApiClient,
      handoverApiClient: services.handoverApiClient,
      preferencesStore: services.preferencesStore,
    })
    .registerFormPackage(accessFormPackage, {
      deliusApi: services.deliusApiClient,
      handoverApi: services.handoverApiClient,
    })
    .registerFormPackage(sentencePlanFormPackage, {
      api: services.assessmentPlatformApiClient,
    })

  // Setup middleware
  app.use(appInsightsMiddleware())
  app.use(setUpHealthChecks(services.applicationInfo))
  app.use(setUpWebSecurity())
  app.use(setUpWebSession())
  app.use(setUpWebRequestParsing())
  app.use(setUpPreferencesCookie())
  app.use(setUpStaticResources())
  app.use(
    setUpAuthentication({
      bypassPaths: ['/forms/form-engine-developer-guide', '/forms/training-session-launcher'],
    }),
  )
  app.use(authorisationMiddleware())
  app.use(setUpCsrf())
  app.use(setUpCurrentUser())

  // Mount routes
  app.use(routes(services))
  app.use(formEngine.getRouter() as express.Router)

  app.use((req, res, next) => next(createError(404, 'Not found')))
  app.use(errorHandler(process.env.NODE_ENV === 'production'))

  return app
}
