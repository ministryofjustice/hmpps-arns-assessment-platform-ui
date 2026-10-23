import type { Request, Response } from 'express'
import setUpRequestContext from './setUpRequestContext'
import { requestContext } from '../utils/requestContext'

type MiddlewareStack = Array<{ handle: (req: Request, res: Response, next: () => void) => void }>

describe('setUpRequestContext', () => {
  it('should provide serviceName from session.targetService via lazy getter', () => {
    const router = setUpRequestContext() as unknown as { stack: MiddlewareStack }
    const middleware = router.stack[0].handle
    const req = { session: { targetService: 'sentence-plan' } } as unknown as Request
    const res = {} as Response

    let capturedServiceName: string | undefined

    middleware(req, res, () => {
      capturedServiceName = requestContext.getStore()?.getServiceName()
    })

    expect(capturedServiceName).toBe('sentence-plan')
  })

  it('should return undefined when session has no targetService', () => {
    const router = setUpRequestContext() as unknown as { stack: MiddlewareStack }
    const middleware = router.stack[0].handle
    const req = { session: {} } as unknown as Request
    const res = {} as Response

    let capturedServiceName: string | undefined

    middleware(req, res, () => {
      capturedServiceName = requestContext.getStore()?.getServiceName()
    })

    expect(capturedServiceName).toBeUndefined()
  })

  it('should return undefined when session does not exist', () => {
    const router = setUpRequestContext() as unknown as { stack: MiddlewareStack }
    const middleware = router.stack[0].handle
    const req = {} as unknown as Request
    const res = {} as Response

    let capturedServiceName: string | undefined

    middleware(req, res, () => {
      capturedServiceName = requestContext.getStore()?.getServiceName()
    })

    expect(capturedServiceName).toBeUndefined()
  })

  it('should read targetService lazily so mid-request changes are picked up', () => {
    const router = setUpRequestContext() as unknown as { stack: MiddlewareStack }
    const middleware = router.stack[0].handle
    const session: Record<string, string | undefined> = {}
    const req = { session } as unknown as Request
    const res = {} as Response

    middleware(req, res, () => {
      expect(requestContext.getStore()?.getServiceName()).toBeUndefined()

      session.targetService = 'sentence-plan'

      expect(requestContext.getStore()?.getServiceName()).toBe('sentence-plan')
    })
  })

  it('should isolate concurrent requests', async () => {
    const router = setUpRequestContext() as unknown as { stack: MiddlewareStack }
    const middleware = router.stack[0].handle

    const results: Array<string | undefined> = []

    const run = (service: string | undefined) =>
      new Promise<void>(resolve => {
        const req = { session: { targetService: service } } as unknown as Request

        middleware(req, {} as Response, () => {
          results.push(requestContext.getStore()?.getServiceName())
          resolve()
        })
      })

    await Promise.all([run('sentence-plan'), run('strengths-and-needs'), run(undefined)])

    expect(results).toContain('sentence-plan')
    expect(results).toContain('strengths-and-needs')
    expect(results).toContain(undefined)
  })
})
