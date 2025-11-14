import { dataAccess } from '../data'
import AuditService from './auditService'
import AssessmentService from './assessmentService'

export const services = () => {
  const { applicationInfo, assessmentPlatformApiClient } = dataAccess()

  return {
    applicationInfo,
    auditService: new AuditService(applicationInfo),
    assessmentService: new AssessmentService(assessmentPlatformApiClient),
  }
}

export type Services = ReturnType<typeof services>
