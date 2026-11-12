import type { Request, Response } from 'express'
import setUpCurrentUser from './setUpCurrentUser'

type MiddlewareStack = Array<{ handle: (req: Request, res: Response, next: (error?: unknown) => void) => void }>

const createToken = (claims: Record<string, unknown>): string => {
  const encode = (value: Record<string, unknown>) => Buffer.from(JSON.stringify(value)).toString('base64url')

  return `${encode({ alg: 'none', typ: 'JWT' })}.${encode(claims)}.signature`
}

const runMiddleware = (token: string, authSource: string): Response => {
  const router = setUpCurrentUser() as unknown as { stack: MiddlewareStack }
  const middleware = router.stack[0].handle
  const req = { session: {}, state: {} } as unknown as Request
  const res = { locals: { user: { token, username: 'user1', authSource } } } as unknown as Response

  middleware(req, res, () => {})

  return res
}

describe('setUpCurrentUser', () => {
  it('should set userUuid from the user_uuid claim when the token is from HMPPS Auth', () => {
    // Arrange
    const token = createToken({
      name: 'FIRST LAST',
      user_id: '1234',
      user_uuid: '11111111-1111-1111-1111-111111111111',
      authorities: ['ROLE_PROBATION'],
    })

    // Act
    const res = runMiddleware(token, 'HMPPS_AUTH')

    // Assert
    expect(res.locals.user.userUuid).toBe('11111111-1111-1111-1111-111111111111')
    expect(res.locals.user.userId).toBe('1234')
  })

  it('should leave userUuid undefined when the token is from the Handover service', () => {
    // Arrange
    const token = createToken({
      name: 'FIRST LAST',
      user_id: 'OASYS_USER',
      user_name: 'OASYS_USER',
      auth_source: 'OASys',
    })

    // Act
    const res = runMiddleware(token, 'OASYS')

    // Assert
    expect(res.locals.user.userUuid).toBeUndefined()
    expect(res.locals.user.userId).toBe('OASYS_USER')
  })
})
