import { dataAccess } from '../data'
import config from '../config'
import AuditService from './auditService'
import AssessmentService from './assessmentService'
import FeatureFlagService from './featureFlagService'
import DomainEventsService from './domainEventsService'
import { RiskActuarialService } from '../forms/tiering-assessment/effects/RiskActuarialService'

export const services = () => {
  const {
    applicationInfo,
    assessmentPlatformApiClient,
    coordinatorApiClient,
    arnsApiClient,
    gotenbergClient,
    handoverApiClient,
    deliusApiClient,
    riskActuarialApiClient,
    arnsComponents,
    mpopComponents,
    preferencesStore,
  } = dataAccess()

  return {
    applicationInfo,
    assessmentPlatformApiClient,
    deliusApiClient,
    coordinatorApiClient,
    arnsApiClient,
    gotenbergClient,
    handoverApiClient,
    riskActuarialApiClient,
    arnsComponents,
    mpopComponents,
    preferencesStore,
    auditService: new AuditService(applicationInfo.applicationName),
    assessmentService: new AssessmentService(assessmentPlatformApiClient),
    featureFlagService: new FeatureFlagService(),
    domainEventsService: new DomainEventsService(config.sns),
    riskActuarialService: new RiskActuarialService(riskActuarialApiClient),
  }
}

export type Services = ReturnType<typeof services>
