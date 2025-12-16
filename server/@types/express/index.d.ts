import { HmppsUser } from '../../interfaces/hmppsUser'

export declare module 'express-session' {
  // Declare that the session will potentially contain these additional fields
  interface SessionData {
    returnTo: string
    nowInMinutes: number
    crn?: string
    assessmentUuid?: string
    assessmentVersion?: number
    principal?: {
      identifier: string
      username: string
      displayName: string
    }
  }
}

declare global {
  namespace Express {
    interface RequestState {
      cspNonce?: string
      csrfToken?: string
      user?: {
        id: string
        name: string
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
    }

    interface Locals {
      user: HmppsUser
    }
  }
}
