import type { Express } from 'express'
import express from 'express'
import request from 'supertest'
import { appWithAllRoutes, user } from './testutils/appSetup'
import sessionRoutes from './session'

let app: Express

afterEach(() => {
  jest.resetAllMocks()
})

describe('POST /session/extend', () => {
  describe('when user is authenticated', () => {
    beforeEach(() => {
      app = appWithAllRoutes({
        userSupplier: () => user,
      })
    })

    it('should return 204 No Content', () => {
      return request(app).post('/session/extend').expect(204)
    })
  })

  describe('when user is not authenticated', () => {
    beforeEach(() => {
      // Create minimal app without session.principal to test unauthenticated case
      app = express()
      app.use(express.json())
      app.use((req, _res, next) => {
        // Simulate express-session without a principal
        req.session = {} as any
        next()
      })
      app.use('/session', sessionRoutes())
    })

    it('should return 401 Unauthorized', () => {
      return request(app)
        .post('/session/extend')
        .expect(401)
        .expect(res => {
          expect(res.body).toEqual({ error: 'Not authenticated' })
        })
    })
  })
})
