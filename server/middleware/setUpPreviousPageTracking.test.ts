import express, { Express } from 'express'
import session from 'express-session'
import request from 'supertest'
import setUpPreviousPageTracking from './setUpPreviousPageTracking'

const sessionCookieName = 'test.session'

const buildApp = (): Express => {
  const app = express()

  app.use(
    session({
      name: sessionCookieName,
      secret: 'test-secret',
      resave: false,
      saveUninitialized: false,
    }),
  )
  app.use(setUpPreviousPageTracking())

  app.get('/page/:slug', (req, res) => {
    return res.type('html').send(`<h1>${req.params.slug}</h1>`)
  })

  app.get('/inspect', (req, res) => {
    return res.json({
      previousPageUrlFromState: req.state.previousPageUrl,
      previousPageUrlFromLocals: res.locals.previousPageUrl,
      pageHistory: req.session.pageHistory ?? [],
    })
  })

  app.get('/health', (_req, res) => {
    return res.type('html').send('<h1>Health</h1>')
  })

  app.get('/json', (_req, res) => {
    return res.json({ ok: true })
  })

  app.get('/redirect', (_req, res) => {
    return res.redirect('/page/redirect-target')
  })

  app.get('/error', (_req, res) => {
    return res.status(500).type('html').send('<h1>Error</h1>')
  })

  app.post('/page/:slug', (req, res) => {
    return res.type('html').send(`<h1>${req.params.slug}</h1>`)
  })

  return app
}

describe('setUpPreviousPageTracking', () => {
  let app: Express

  beforeEach(() => {
    app = buildApp()
  })

  it('should expose the previous page URL from session history in state and locals', async () => {
    const agent = request.agent(app)

    // Arrange
    await agent.get('/page/first')

    // Act
    const response = await agent.get('/inspect')

    // Assert
    expect(response.body.previousPageUrlFromState).toBe('/page/first')
    expect(response.body.previousPageUrlFromLocals).toBe('/page/first')
  })

  it('should record only successful internal HTML GET requests', async () => {
    const agent = request.agent(app)

    // Arrange
    await agent.get('/page/first')
    await agent.get('/json')
    await agent.get('/redirect')
    await agent.get('/error')
    await agent.post('/page/submitted')
    await agent.get('/health')

    // Act
    const response = await agent.get('/inspect')

    // Assert
    expect(response.body.pageHistory).toEqual(['/page/first'])
  })

  it('should preserve query strings when recording previous page URLs', async () => {
    const agent = request.agent(app)

    // Arrange
    await agent.get('/page/first?type=current')

    // Act
    const response = await agent.get('/inspect')

    // Assert
    expect(response.body.previousPageUrlFromState).toBe('/page/first?type=current')
    expect(response.body.pageHistory).toEqual(['/page/first?type=current'])
  })

  it('should not record duplicate consecutive URLs when the page is refreshed', async () => {
    const agent = request.agent(app)

    // Arrange
    await agent.get('/page/first')
    await agent.get('/page/first')

    // Act
    const response = await agent.get('/inspect')

    // Assert
    expect(response.body.pageHistory).toEqual(['/page/first'])
  })

  it('should trim the history on back-navigation instead of appending', async () => {
    const agent = request.agent(app)

    // Arrange — visit three pages in sequence
    await agent.get('/page/first')
    await agent.get('/page/second')
    await agent.get('/page/third')

    // Act — navigate back to the second page
    await agent.get('/page/second')
    const response = await agent.get('/inspect')

    // Assert — third page is trimmed, previous points to first
    expect(response.body.pageHistory).toEqual(['/page/first', '/page/second'])
    expect(response.body.previousPageUrlFromState).toBe('/page/second')
  })

  it('should not loop between two pages when navigating back and forth', async () => {
    const agent = request.agent(app)

    // Arrange — simulate the policy page loop: overview → cookies → accessibility
    await agent.get('/page/overview')
    await agent.get('/page/cookies')
    await agent.get('/page/accessibility')

    // Act — navigate back to cookies, then back to overview
    await agent.get('/page/cookies')
    const afterCookies = await agent.get('/inspect')

    await agent.get('/page/overview')
    const afterOverview = await agent.get('/inspect')

    // Assert — each back-navigation trims correctly, no loop
    expect(afterCookies.body.pageHistory).toEqual(['/page/overview', '/page/cookies'])
    expect(afterCookies.body.previousPageUrlFromState).toBe('/page/cookies')

    expect(afterOverview.body.pageHistory).toEqual(['/page/overview'])
    expect(afterOverview.body.previousPageUrlFromState).toBe('/page/overview')
  })

  it('should keep the most recent ten page visits when history exceeds the limit', async () => {
    const agent = request.agent(app)

    // Arrange
    await Array.from({ length: 12 }, (_, index) => {
      return index + 1
    }).reduce<Promise<void>>(async (previousPromise, pageNumber) => {
      await previousPromise
      await agent.get(`/page/${pageNumber}`)
    }, Promise.resolve())

    // Act
    const response = await agent.get('/inspect')

    // Assert
    expect(response.body.pageHistory).toEqual([
      '/page/3',
      '/page/4',
      '/page/5',
      '/page/6',
      '/page/7',
      '/page/8',
      '/page/9',
      '/page/10',
      '/page/11',
      '/page/12',
    ])
  })
})
