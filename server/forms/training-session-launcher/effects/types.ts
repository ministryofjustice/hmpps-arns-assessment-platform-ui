import { CoordinatorApiClient, HandoverApiClient, PreferencesStore, WiremockAdminClient } from '../../../data'

export interface TrainingSessionLauncherEffectsDeps {
  handoverApiClient: HandoverApiClient
  wiremockAdminClient: WiremockAdminClient
  coordinatorApiClient: CoordinatorApiClient
  preferencesStore: PreferencesStore
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
