import { Request } from 'express'

export interface PrincipalDetails {
  identifier: string
  username?: string
}

export interface SubjectDetails {
  crn: string
}

export default class SessionService {
  constructor(private readonly req: Request) {}

  getPrincipalDetails(): PrincipalDetails | undefined {
    const user = this.req.res?.locals?.user
    return user
      ? {
          identifier: user.userId || user.username,
          username: user.username,
        }
      : undefined
  }

  getSubjectDetails(): SubjectDetails | undefined {
    // Get CRN from wherever it's stored (session, params, etc.)
    const crn = this.req.session?.crn || this.req.params?.crn
    return crn ? { crn } : undefined
  }

  getAssessmentUuid(): string | undefined {
    return this.req.params?.assessmentUuid || this.req.session?.assessmentUuid
  }

  getAssessmentVersion(): number | undefined {
    return this.req.session?.assessmentVersion
  }
}
