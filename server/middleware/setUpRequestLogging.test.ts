import type { Request, Response } from 'express'
import setUpRequestLogging from './setUpRequestLogging'

const mockTrackEvent = jest.fn()

jest.mock('@ministryofjustice/hmpps-azure-telemetry', () => ({
  trace: {
    getActiveSpan: () => ({
      spanContext: () => ({
        traceId: 'trace-123',
      }),
    }),
  },
  telemetry: {
    trackEvent: (...args: unknown[]) => mockTrackEvent(...args),
  },
}))

type MiddlewareStack = Array<{ handle: (req: Request, res: Response, next: () => void) => void }>

const createMocks = (overrides: { id?: string; statusCode?: number } = {}) => {
  const finishListeners: Record<string, () => void> = {}
  const req = {
    id: overrides.id ?? 'req-123',
    state: {},
    method: 'GET',
    originalUrl: '/test',
  } as unknown as Request
  const res = {
    locals: {},
    statusCode: overrides.statusCode ?? 200,
    on: jest.fn((event: string, listener: () => void) => {
      finishListeners[event] = listener
      return res
    }),
  } as unknown as Response

  return { req, res, finishListeners, next: jest.fn() }
}

describe('setUpRequestLogging', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should populate request state and response locals with support IDs', () => {
    const router = setUpRequestLogging() as unknown as { stack: MiddlewareStack }
    const middleware = router.stack[0].handle
    const { req, res, next } = createMocks()

    middleware(req, res, next)

    expect(req.state).toEqual({ requestId: 'req-123', traceId: 'trace-123' })
    expect(res.locals).toEqual({ requestId: 'req-123', traceId: 'trace-123' })
    expect(next).toHaveBeenCalled()
  })

  it('should send an AppInsights event for 5xx responses', () => {
    const router = setUpRequestLogging() as unknown as { stack: MiddlewareStack }
    const middleware = router.stack[0].handle
    const { req, res, finishListeners, next } = createMocks({ statusCode: 500 })

    middleware(req, res, next)
    finishListeners.finish()

    expect(mockTrackEvent).toHaveBeenCalledWith('ServerError', {
      statusCode: 500,
      originalUrl: '/test',
      method: 'GET',
    })
  })

  it('should not send an AppInsights event for 4xx responses', () => {
    const router = setUpRequestLogging() as unknown as { stack: MiddlewareStack }
    const middleware = router.stack[0].handle
    const { req, res, finishListeners, next } = createMocks({ statusCode: 404 })

    middleware(req, res, next)
    finishListeners.finish()

    expect(mockTrackEvent).not.toHaveBeenCalled()
  })

  it('should not send an AppInsights event for successful responses', () => {
    const router = setUpRequestLogging() as unknown as { stack: MiddlewareStack }
    const middleware = router.stack[0].handle
    const { req, res, finishListeners, next } = createMocks({ statusCode: 200 })

    middleware(req, res, next)
    finishListeners.finish()

    expect(mockTrackEvent).not.toHaveBeenCalled()
  })
})
