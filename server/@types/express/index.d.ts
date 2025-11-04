import { HmppsUser } from '../../interfaces/hmppsUser'
import { RequestServices } from '../../services'

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

export declare global {
  namespace Express {
    interface User {
      username: string
      token: string
      authSource: string
    }

    interface Request {
      verified?: boolean
      id: string
      logout(done: (err: unknown) => void): void
      services: RequestServices
    }

    interface Locals {
      user: HmppsUser
    }
  }
}
