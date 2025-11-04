import { Request } from 'express'
import { dataAccess } from '../data'
import AuditService from './auditService'
import SessionService from './sessionService'
import AssessmentService from './assessmentService'

export const services = () => {
  const { applicationInfo, assessmentPlatformApiClient } = dataAccess()

  return {
    applicationInfo,
    assessmentPlatformApiClient,
  }
}

export const requestServices = (appServices: Services) => ({
  sessionService: (req: Request) => new SessionService(req),
  auditService: (req: Request) => new AuditService(appServices.applicationInfo, req.services.sessionService, req.id),
  assessmentService: (req: Request) =>
    new AssessmentService(
      appServices.assessmentPlatformApiClient,
      req.services.sessionService,
      req.services.auditService,
    ),
})

export type RequestServices = {
  [K in keyof ReturnType<typeof requestServices>]: ReturnType<ReturnType<typeof requestServices>[K]>
}

export type Services = ReturnType<typeof services>
