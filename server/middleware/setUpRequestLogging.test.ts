import type { Request, Response } from 'express'
import setUpRequestLogging from './setUpRequestLogging'

jest.mock('../../logger', () => {
  const childLogger = {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  }

  return {
    __esModule: true,
    createChildLogger: jest.fn(() => childLogger),
    runWithLogger: jest.fn((_logger, callback: () => unknown) => callback()),
  }
})

jest.mock('@ministryofjustice/hmpps-azure-telemetry', () => ({
  trace: {
    getActiveSpan: () => ({
      spanContext: () => ({
        traceId: 'trace-123',
      }),
    }),
  },
}))

const loggerModule = jest.requireMock('../../logger') as {
  createChildLogger: jest.Mock
  runWithLogger: jest.Mock
}

describe('setUpRequestLogging', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should expose support ids and log request completion', () => {
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

    expect(loggerModule.createChildLogger).toHaveBeenCalledWith({
      requestId: 'req-123',
      traceId: 'trace-123',
      requestMethod: 'GET',
      requestPath: '/test',
    })
    expect(loggerModule.runWithLogger).toHaveBeenCalled()

    const childLogger = loggerModule.createChildLogger.mock.results[0].value as {
      info: jest.Mock
    }

    expect(childLogger.info).toHaveBeenCalledWith(
      expect.objectContaining({
        event: 'request.completed',
        statusCode: 200,
        originalUrl: '/test',
      }),
      'Request completed',
    )
  })
})
