import type { Request, Response } from 'express'
import setUpFeatureFlags from './setUpFeatureFlags'
import { BooleanFeatureFlags } from '../utils/featureFlagsUtils'

type MiddlewareStack = Array<{ handle: (req: Request, res: Response, next: () => void) => unknown }>

const createMocks = (userId?: string) => {
  const req = {} as Request
  const res = {
    locals: {
      user: userId ? { userId } : undefined,
    },
  } as unknown as Response
  const next = jest.fn()

  return { req, res, next }
}

describe('setUpFeatureFlags', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should evaluate the configured boolean feature flags for the current user and store them in locals', async () => {
    const evaluateBooleanFlags = jest.fn().mockResolvedValue({
      booleanFeatureFlags: {
        smartSurveyInNationalRolloutEnabled: true,
      },
    })
    const featureFlagService = { evaluateBooleanFlags }

    const router = setUpFeatureFlags(featureFlagService as never) as unknown as { stack: MiddlewareStack }
    const middleware = router.stack[0].handle
    const { req, res, next } = createMocks('user-123')

    await middleware(req, res, next)

    expect(evaluateBooleanFlags).toHaveBeenCalledWith(BooleanFeatureFlags, 'user-123')
    expect(res.locals.featureFlags).toEqual({
      smartSurveyInNationalRolloutEnabled: true,
    })
    expect(next).toHaveBeenCalled()
  })

  it('should pass an undefined user ID when there is no current user', async () => {
    const evaluateBooleanFlags = jest.fn().mockResolvedValue({
      booleanFeatureFlags: {
        smartSurveyInNationalRolloutEnabled: false,
      },
    })
    const featureFlagService = { evaluateBooleanFlags }

    const router = setUpFeatureFlags(featureFlagService as never) as unknown as { stack: MiddlewareStack }
    const middleware = router.stack[0].handle
    const { req, res, next } = createMocks()

    await middleware(req, res, next)

    expect(evaluateBooleanFlags).toHaveBeenCalledWith(BooleanFeatureFlags, undefined)
    expect(res.locals.featureFlags).toEqual({
      smartSurveyInNationalRolloutEnabled: false,
    })
    expect(next).toHaveBeenCalled()
  })
})
