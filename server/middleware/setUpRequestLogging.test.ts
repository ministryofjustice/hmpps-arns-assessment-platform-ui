import type { Request, Response } from 'express'
import logger from '../../logger'
import setUpRequestLogging from './setUpRequestLogging'

jest.mock('../../logger', () => ({
  __esModule: true,
  default: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}))

jest.mock('@ministryofjustice/hmpps-azure-telemetry', () => ({
  trace: {
    getActiveSpan: () => ({
      spanContext: () => ({
        traceId: 'trace-123',
      }),
    }),
  },
}))

const mockLogger = jest.mocked(logger)

describe('setUpRequestLogging', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should expose support ids without logging successful requests', () => {
    const router = setUpRequestLogging() as unknown as {
      stack: Array<{ handle: (req: Request, res: Response, next: () => void) => void }>
    }
    const middleware = router.stack[0].handle
    const finishListeners: Record<string, () => void> = {}
    const next = jest.fn()
    const req = {
      id: 'req-123',
      state: {},
      method: 'GET',
      path: '/test',
      originalUrl: '/test',
    } as unknown as Request
    const res = {
      locals: {},
      statusCode: 200,
      on: jest.fn((event: string, listener: () => void) => {
        finishListeners[event] = listener
        return res
      }),
    } as unknown as Response

    middleware(req, res, next)

    expect(req.state).toEqual({
      requestId: 'req-123',
      traceId: 'trace-123',
    })
    expect(res.locals).toEqual({
      requestId: 'req-123',
      traceId: 'trace-123',
    })
    expect(next).toHaveBeenCalled()

    finishListeners.finish()

    expect(mockLogger.info).not.toHaveBeenCalled()
    expect(mockLogger.warn).not.toHaveBeenCalled()
    expect(mockLogger.error).not.toHaveBeenCalled()
  })

  it('should log 4xx request completion as a warning', () => {
    const router = setUpRequestLogging() as unknown as {
      stack: Array<{ handle: (req: Request, res: Response, next: () => void) => void }>
    }
    const middleware = router.stack[0].handle
    const finishListeners: Record<string, () => void> = {}
    const next = jest.fn()
    const req = {
      id: 'req-123',
      state: {},
      method: 'GET',
      path: '/missing-page',
      originalUrl: '/missing-page',
    } as unknown as Request
    const res = {
      locals: {},
      statusCode: 404,
      on: jest.fn((event: string, listener: () => void) => {
        finishListeners[event] = listener
        return res
      }),
    } as unknown as Response

    middleware(req, res, next)

    expect(next).toHaveBeenCalled()

    finishListeners.finish()

    expect(mockLogger.warn).toHaveBeenCalledWith(
      expect.objectContaining({
        event: 'request.completed',
        statusCode: 404,
        originalUrl: '/missing-page',
      }),
      'Request completed',
    )
  })

  it('should log 5xx request completion as an error', () => {
    const router = setUpRequestLogging() as unknown as {
      stack: Array<{ handle: (req: Request, res: Response, next: () => void) => void }>
    }
    const middleware = router.stack[0].handle
    const finishListeners: Record<string, () => void> = {}
    const next = jest.fn()
    const req = {
      id: 'req-123',
      state: {},
      method: 'GET',
      path: '/error',
      originalUrl: '/error',
    } as unknown as Request
    const res = {
      locals: {},
      statusCode: 500,
      on: jest.fn((event: string, listener: () => void) => {
        finishListeners[event] = listener
        return res
      }),
    } as unknown as Response

    middleware(req, res, next)

    expect(next).toHaveBeenCalled()

    finishListeners.finish()

    expect(mockLogger.error).toHaveBeenCalledWith(
      expect.objectContaining({
        event: 'request.completed',
        statusCode: 500,
        originalUrl: '/error',
      }),
      'Request completed',
    )
  })
})
