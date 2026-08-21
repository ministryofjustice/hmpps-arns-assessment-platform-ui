import { dataAccess } from '../data'
import config from '../config'
import AuditService from './auditService'
import AssessmentService from './assessmentService'
import FeatureFlagService from './featureFlagService'
import DomainEventsService from './domainEventsService'

export const services = () => {
  const {
    applicationInfo,
    assessmentPlatformApiClient,
    coordinatorApiClient,
    arnsApiClient,
    gotenbergClient,
    handoverApiClient,
    deliusApiClient,
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
    mpopComponents,
    preferencesStore,
    auditService: new AuditService(applicationInfo.applicationName),
    assessmentService: new AssessmentService(assessmentPlatformApiClient),
    featureFlagService: new FeatureFlagService(),
    domainEventsService: new DomainEventsService(config.sns),
  }
}

export type Services = ReturnType<typeof services>
