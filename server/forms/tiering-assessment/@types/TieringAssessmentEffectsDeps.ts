import { AssessmentPlatformApiClient, CoordinatorApiClient, DeliusApiClient } from '../../../data'
import AuditService from '../../../services/auditService'
import FeatureFlagService from '../../../services/featureFlagService'

export interface TieringAssessmentEffectsDeps {
  api: AssessmentPlatformApiClient
  coordinatorApi: CoordinatorApiClient
  deliusApi: DeliusApiClient
  auditService: AuditService
  featureFlagService: FeatureFlagService
}
