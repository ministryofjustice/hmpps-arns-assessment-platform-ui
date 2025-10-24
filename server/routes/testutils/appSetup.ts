import express, { Express } from 'express'
import { NotFound } from 'http-errors'

import { randomUUID } from 'crypto'
import routes from '../index'
import nunjucksSetup from '../../utils/nunjucksSetup'
import errorHandler from '../../errorHandler'
import type { Services, RequestServices } from '../../services'
import AuditService from '../../services/auditService'
import SessionService from '../../services/sessionService'
import { HmppsUser } from '../../interfaces/hmppsUser'
import setUpWebSession from '../../middleware/setUpWebSession'

jest.mock('../../services/auditService')
jest.mock('../../services/sessionService')

export const user: HmppsUser = {
  name: 'FIRST LAST',
  userId: 'id',
  token: 'token',
  username: 'user1',
  displayName: 'First Last',
  authSource: 'nomis',
  staffId: 1234,
  userRoles: [],
}

export const flashProvider = jest.fn()

function appSetup(
  services: Services,
  production: boolean,
  userSupplier: () => HmppsUser,
  mockAuditService?: jest.Mocked<AuditService>,
): Express {
  const app = express()

  app.set('view engine', 'njk')

  nunjucksSetup(app)
  app.use(setUpWebSession())
  app.use((req, res, next) => {
    req.user = userSupplier() as Express.User
    req.flash = flashProvider
    res.locals = {
      user: { ...req.user } as HmppsUser,
    }
    next()
  })
  app.use((req, res, next) => {
    req.id = randomUUID()
    next()
  })

  // Setup request-scoped services for testing
  if (mockAuditService) {
    app.use((req, res, next) => {
      req.services = {
        auditService: mockAuditService,
        sessionService: new SessionService(req) as jest.Mocked<SessionService>,
      } as RequestServices
      next()
    })
  }

  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(routes(services))
  app.use((req, res, next) => next(new NotFound()))
  app.use(errorHandler(production))

  return app
}

export function appWithAllRoutes({
  production = false,
  services = {},
  userSupplier = () => user,
}: {
  production?: boolean
  services?: Partial<Services>
  userSupplier?: () => HmppsUser
}): Express {
  const mockAuditService = new AuditService(null, null, null) as jest.Mocked<AuditService>
  return appSetup(services as Services, production, userSupplier, mockAuditService)
}
