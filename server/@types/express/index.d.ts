import { HmppsUser } from '@ministryofjustice/hmpps-aap-sdk/types/authentication/HmppsUser.type'
import { HandoverContext } from '@ministryofjustice/hmpps-aap-sdk/dependencies/handover/HandoverResponse.type'
import { CaseDetails } from '@ministryofjustice/hmpps-aap-sdk/dependencies/delius/DeliusCaseDetails.type'
import { SessionDetails } from '@ministryofjustice/hmpps-aap-sdk/types/authentication/SessionDetails.type'
import { AccessDetails } from '@ministryofjustice/hmpps-aap-sdk/types/authentication/AccessDetails.type'
import { PractitionerDetails } from '@ministryofjustice/hmpps-aap-sdk/types/authentication/PractitionerDetails.type'

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
    handoverContext?: HandoverContext
    caseDetails?: CaseDetails
    practitionerDetails?: PractitionerDetails
    accessDetails?: AccessDetails
    sessionDetails?: SessionDetails
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
        displayName: string
        authSource: string
        token: string
        userRoles: string[]
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
      userContext?: string
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
