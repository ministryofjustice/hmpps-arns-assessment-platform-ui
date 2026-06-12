import { dataAccess } from '../data'
import AuditService from './auditService'
import AssessmentService from './assessmentService'
import FeatureFlagService from './featureFlagService'
import FormDataStore from '../forms/tiering-assessment/data/formDataStore'

export const services = () => {
  const {
    applicationInfo,
    assessmentPlatformApiClient,
    coordinatorApiClient,
    handoverApiClient,
    deliusApiClient,
    preferencesStore,
    riskActuarialApiClient,
  } = dataAccess()

  return {
    applicationInfo,
    assessmentPlatformApiClient,
    deliusApiClient,
    coordinatorApiClient,
    handoverApiClient,
    preferencesStore,
    auditService: new AuditService(applicationInfo.applicationName),
    assessmentService: new AssessmentService(assessmentPlatformApiClient),
    featureFlagService: new FeatureFlagService(),
    formDataStore: new FormDataStore(),
    riskActuarialApiClient,
  }
}

export type Services = ReturnType<typeof services>
