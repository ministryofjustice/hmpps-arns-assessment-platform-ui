import type { CoordinatorApi } from '@ministryofjustice/hmpps-aap-sdk/dependencies/coordinator/CoordinatorApi.type'
import type { HandoverApi } from '@ministryofjustice/hmpps-aap-sdk/dependencies/handover/HandoverApi.type'
import type { JourneyLogger } from '@ministryofjustice/hmpps-aap-sdk/dependencies/logging/JourneyLogger.type'
import type { Preferences } from '@ministryofjustice/hmpps-aap-sdk/dependencies/preferences/Preferences.type'

export interface TrainingSessionLauncherEffectsDeps {
  handoverApiClient: HandoverApi
  coordinatorApiClient: CoordinatorApi
  logger: JourneyLogger
  preferencesStore: Preferences
}

/**
 * Notification types matching GOV.UK/MOJ alert variants
 */
export type NotificationType = 'information' | 'success' | 'warning' | 'error'

/**
 * Flash notification stored in session and displayed on target pages
 */
export interface TrainingLauncherNotification {
  type: NotificationType
  title?: string
  message: unknown
  target: string
}
