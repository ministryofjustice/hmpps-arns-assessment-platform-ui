import { HmppsUser } from '../../interfaces/hmppsUser'

export declare module 'express-session' {
  // Declare that the session will potentially contain these additional fields
  interface SessionData {
    returnTo: string
    nowInMinutes: number
    pageHistory?: string[]
    crn?: string
    assessmentUuid?: string
    assessmentVersion?: number
    principal?: {
      identifier: string
      username: string
      displayName: string
    }
    targetService?: string
    csrfToken?: string
    telemetryId?: string
  }
}

declare global {
  namespace Express {
    interface RequestState {
      cspNonce?: string
      csrfToken?: string
      pageHistory?: string[]
      previousPageUrl?: string
      preferencesId?: string
      requestId?: string
      traceId?: string
      user?: {
        id: string
        name: string
        authSource: string
        token: string
      }
    }

    interface User {
      username: string
      token: string
      authSource: string
    }

    interface Request {
      verified?: boolean
      id: string
      logout(done: (err: unknown) => void): void
      state: RequestState
      authBypassed?: boolean
    }

    interface Locals {
      user: HmppsUser
      pageHistory?: string[]
      previousPageUrl?: string
      requestId?: string
      traceId?: string
      telemetryId?: string
      cspNonce?: string
      targetService?: string
      csrfToken?: string
      message?: string
      status?: number
      stack?: string | null
    }
  }
}
