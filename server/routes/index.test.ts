import type { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes, user } from './testutils/appSetup'

let app: Express

beforeEach(() => {
  app = appWithAllRoutes({
    userSupplier: () => user,
  })
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('GET /', () => {
  it('should render index page', () => {
    return request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('ROSH Screening')
        expect(res.text).toContain('This site is under construction...')
      })
  })
})

describe('Error handling', () => {
  it('should render 400 page for bad requests', () => {
    return request(app)
      .get('/test/bad-request')
      .expect('Content-Type', /html/)
      .expect(400)
      .expect(res => {
        expect(res.text).toContain('There was an issue with your request')
        expect(res.text).toContain('Try performing your request again.')
      })
  })

  it('should render 403 page for forbidden requests', () => {
    return request(app)
      .get('/test/forbidden')
      .expect('Content-Type', /html/)
      .expect(403)
      .expect(res => {
        expect(res.text).toContain('There was an issue with your request')
        expect(res.text).toContain('Try performing your request again.')
      })
  })

  it('should render 404 page for non-existent routes', () => {
    return request(app)
      .get('/non-existent-route')
      .expect('Content-Type', /html/)
      .expect(404)
      .expect(res => {
        expect(res.text).toContain('Page not found')
        expect(res.text).toContain('If you typed the web address, check it is correct.')
      })
  })
})
