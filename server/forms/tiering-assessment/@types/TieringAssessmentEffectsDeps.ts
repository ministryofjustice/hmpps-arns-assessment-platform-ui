import { AssessmentPlatformApiClient, CoordinatorApiClient, DeliusApiClient } from '../../../data'
import RiskActuarialApiClient from '../../../data/riskActuarialApiClient'
import AuditService from '../../../services/auditService'
import FeatureFlagService from '../../../services/featureFlagService'

export interface TieringAssessmentEffectsDeps {
  api: AssessmentPlatformApiClient
  coordinatorApi: CoordinatorApiClient
  deliusApi: DeliusApiClient
  riskActuarialApiClient: RiskActuarialApiClient
  auditService: AuditService
  featureFlagService: FeatureFlagService
}
