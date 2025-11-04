import { Request } from 'express'

export interface PrincipalDetails {
  identifier: string
  username: string
  displayName: string
}

export interface SubjectDetails {
  crn: string
}

export default class SessionService {
  constructor(private readonly req: Request) {}

  getPrincipalDetails(): PrincipalDetails | undefined {
    return this.req.session?.principal
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
