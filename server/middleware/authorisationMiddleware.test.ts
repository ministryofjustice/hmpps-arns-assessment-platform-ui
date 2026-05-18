import jwt from 'jsonwebtoken'
import type { Request, Response } from 'express'

import authorisationMiddleware from './authorisationMiddleware'
import { AccessPermissions } from '../interfaces/delius-api/accessPermissions'

function createToken(authorities: string[]) {
  const payload = {
    user_name: 'USER1',
    scope: ['read', 'write'],
    auth_source: 'nomis',
    authorities,
    jti: 'a610a10-cca6-41db-985f-e87efb303aaf',
    client_id: 'clientid',
  }

  return jwt.sign(payload, 'secret', { expiresIn: '1h' })
}

describe('authorisationMiddleware', () => {
  let req: Request
  const next = jest.fn()
  const accessClient = {
    getUserAccess: jest.fn<Promise<AccessPermissions>, [string, string]>(),
  }

  function createResWithToken({
    authorities,
    authSource = 'HMPPS_AUTH',
  }: {
    authorities: string[]
    authSource?: string
  }): Response {
    return {
      locals: {
        user: {
          token: createToken(authorities),
          authSource,
        },
      },
      redirect: jest.fn(),
    } as unknown as Response
  }

  beforeEach(() => {
    jest.resetAllMocks()
    req = {
      authBypassed: false,
      path: '/sentence-plan/v1.0/plan/overview',
    } as unknown as Request
  })

  it('should return next when no required roles', async () => {
    const res = createResWithToken({ authorities: [] })

    await authorisationMiddleware([], accessClient)(req, res, next)

    expect(next).toHaveBeenCalled()
    expect(res.redirect).not.toHaveBeenCalled()
  })

  it('should redirect when user has no authorised roles', async () => {
    const res = createResWithToken({ authorities: [] })

    await authorisationMiddleware(['SOME_REQUIRED_ROLE'], accessClient)(req, res, next)

    expect(next).not.toHaveBeenCalled()
    expect(res.redirect).toHaveBeenCalledWith('/authError')
  })

  it('should return next when user has authorised role', async () => {
    const res = createResWithToken({ authorities: ['ROLE_SOME_REQUIRED_ROLE'] })

    await authorisationMiddleware(['SOME_REQUIRED_ROLE'], accessClient)(req, res, next)

    expect(next).toHaveBeenCalled()
    expect(res.redirect).not.toHaveBeenCalled()
  })

  it('should return next when user has authorised role and middleware created with ROLE_ prefix', async () => {
    const res = createResWithToken({ authorities: ['ROLE_SOME_REQUIRED_ROLE'] })

    await authorisationMiddleware(['ROLE_SOME_REQUIRED_ROLE'], accessClient)(req, res, next)

    expect(next).toHaveBeenCalled()
    expect(res.redirect).not.toHaveBeenCalled()
  })

  it('should return next when authBypassed is true', async () => {
    req.authBypassed = true
    const res = createResWithToken({ authorities: [] })

    await authorisationMiddleware(['SOME_REQUIRED_ROLE'], accessClient)(req, res, next)

    expect(next).toHaveBeenCalled()
    expect(res.redirect).not.toHaveBeenCalled()
  })

  it('should check fine-grained access for crn route and allow when canAccess is true', async () => {
    req = { ...req, path: '/access/sentence-plan/crn/X000001' } as Request
    accessClient.getUserAccess.mockResolvedValue({
      inCaseload: true,
      userExcluded: false,
      userRestricted: false,
      canAccess: true,
    })
    const res = createResWithToken({ authorities: [] })

    await authorisationMiddleware([], accessClient)(req, res, next)

    expect(accessClient.getUserAccess).toHaveBeenCalledWith('USER1', 'X000001')
    expect(next).toHaveBeenCalled()
    expect(res.redirect).not.toHaveBeenCalled()
  })

  it('should redirect to auth error when fine-grained access is denied', async () => {
    req = { ...req, path: '/access/sentence-plan/crn/X123456' } as Request
    accessClient.getUserAccess.mockResolvedValue({
      inCaseload: false,
      userExcluded: false,
      userRestricted: false,
      canAccess: false,
    })
    const res = createResWithToken({ authorities: [] })

    await authorisationMiddleware([], accessClient)(req, res, next)

    expect(accessClient.getUserAccess).toHaveBeenCalledWith('USER1', 'X123456')
    expect(next).not.toHaveBeenCalled()
    expect(res.redirect).toHaveBeenCalledWith('/authError')
  })

  it('should skip fine-grained access check for non-hmpps-auth users', async () => {
    req = { ...req, path: '/access/sentence-plan/crn/X000001' } as Request
    const res = createResWithToken({ authorities: [], authSource: 'OASYS' })

    await authorisationMiddleware([], accessClient)(req, res, next)

    expect(accessClient.getUserAccess).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalled()
    expect(res.redirect).not.toHaveBeenCalled()
  })

  it('should check fine-grained access when crn path has a trailing slash', async () => {
    req = { ...req, path: '/access/sentence-plan/crn/X000001/' } as Request
    accessClient.getUserAccess.mockResolvedValue({
      inCaseload: true,
      userExcluded: false,
      userRestricted: false,
      canAccess: true,
    })
    const res = createResWithToken({ authorities: [] })

    await authorisationMiddleware([], accessClient)(req, res, next)

    expect(accessClient.getUserAccess).toHaveBeenCalledWith('USER1', 'X000001')
    expect(next).toHaveBeenCalled()
    expect(res.redirect).not.toHaveBeenCalled()
  })
})
