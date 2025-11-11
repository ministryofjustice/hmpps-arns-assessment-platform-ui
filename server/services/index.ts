import { dataAccess } from '../data'
import AuditService from './auditService'
import AssessmentService from './assessmentService'

export const services = () => {
  const { applicationInfo, assessmentPlatformApiClient } = dataAccess()
  const auditService = new AuditService(applicationInfo)

  return {
    applicationInfo,
    auditService,
    assessmentService: new AssessmentService(assessmentPlatformApiClient, auditService),
  }
}

export type Services = ReturnType<typeof services>
