import { dataAccess } from '../data'
import AuditService from './auditService'
import AssessmentService from './assessmentService'

export const services = () => {
  const { applicationInfo, assessmentPlatformApiClient, coordinatorApiClient, handoverApiClient, deliusApiClient } =
    dataAccess()

  return {
    applicationInfo,
    assessmentPlatformApiClient,
    deliusApiClient,
    coordinatorApiClient,
    handoverApiClient,
    auditService: new AuditService(applicationInfo),
    assessmentService: new AssessmentService(assessmentPlatformApiClient),
  }
}

export type Services = ReturnType<typeof services>
