import { dataAccess } from '../data'
import AuditService from './auditService'
import AssessmentService from './assessmentService'
import FeatureFlagService from './featureFlagService'

export const services = () => {
  const {
    applicationInfo,
    assessmentPlatformApiClient,
    coordinatorApiClient,
    handoverApiClient,
    deliusApiClient,
    riskActuarialApiClient,
    preferencesStore,
  } = dataAccess()

  return {
    applicationInfo,
    assessmentPlatformApiClient,
    deliusApiClient,
    coordinatorApiClient,
    handoverApiClient,
    riskActuarialApiClient,
    preferencesStore,
    auditService: new AuditService(applicationInfo.applicationName),
    assessmentService: new AssessmentService(assessmentPlatformApiClient),
    featureFlagService: new FeatureFlagService(),
  }
}

export type Services = ReturnType<typeof services>
