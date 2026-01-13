import { dataAccess } from '../data'
import AuditService from './auditService'
import AssessmentService from './assessmentService'

export const services = () => {
  const { applicationInfo, assessmentPlatformApiClient, coordinatorApiClient, handoverApiClient } = dataAccess()

  return {
    applicationInfo,
    assessmentPlatformApiClient,
    coordinatorApiClient,
    handoverApiClient,
    auditService: new AuditService(applicationInfo),
    assessmentService: new AssessmentService(assessmentPlatformApiClient),
  }
}

export type Services = ReturnType<typeof services>
