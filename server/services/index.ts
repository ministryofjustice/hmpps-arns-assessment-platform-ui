import { dataAccess } from '../data'
import AuditService from './auditService'
import AssessmentService from './assessmentService'
import FeatureFlagService from './featureFlagService'
import { RiskActuarialService } from '../forms/tiering-assessment/effects/RiskActuarialService'

export const services = () => {
  const {
    applicationInfo,
    assessmentPlatformApiClient,
    coordinatorApiClient,
    handoverApiClient,
    deliusApiClient,
    riskActuarialApiClient,
    arnsComponents,
    preferencesStore,
  } = dataAccess()

  return {
    applicationInfo,
    assessmentPlatformApiClient,
    deliusApiClient,
    coordinatorApiClient,
    handoverApiClient,
    riskActuarialApiClient,
    riskActuarialService: new RiskActuarialService(riskActuarialApiClient),
    arnsComponents,
    preferencesStore,
    auditService: new AuditService(applicationInfo.applicationName),
    assessmentService: new AssessmentService(assessmentPlatformApiClient),
    featureFlagService: new FeatureFlagService(),
  }
}

export type Services = ReturnType<typeof services>
