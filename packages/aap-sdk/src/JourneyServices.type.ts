import type { ArnsApi } from './dependencies/arns/ArnsApi.type'
import type {
  AssessmentPlatformApi,
  AssessmentPlatformApiFactory,
} from './dependencies/assessment-platform/AssessmentPlatformApi.type'
import type { Audit } from './dependencies/audit/Audit.type'
import type { CoordinatorApi } from './dependencies/coordinator/CoordinatorApi.type'
import type { DeliusApi } from './dependencies/delius/DeliusApi.type'
import type { DomainEvents } from './dependencies/domain-events/DomainEvents.type'
import type { FeatureFlags } from './dependencies/feature-flags/FeatureFlags.type'
import type { HandoverApi } from './dependencies/handover/HandoverApi.type'
import type { JourneyLogger } from './dependencies/logging/JourneyLogger.type'
import type { MpopComponents } from './dependencies/mpop/MpopComponents.type'
import type { Preferences } from './dependencies/preferences/Preferences.type'

export interface JourneyServices {
  readonly arnsApi: ArnsApi
  readonly assessmentPlatformApi: AssessmentPlatformApi
  readonly assessmentPlatformApiFactory: AssessmentPlatformApiFactory
  readonly audit: Audit
  readonly coordinatorApi: CoordinatorApi
  readonly deliusApi: DeliusApi
  readonly domainEvents: DomainEvents
  readonly featureFlags: FeatureFlags
  readonly handoverApi: HandoverApi
  readonly logger: JourneyLogger
  readonly mpopComponents: MpopComponents
  readonly preferences: Preferences
}
