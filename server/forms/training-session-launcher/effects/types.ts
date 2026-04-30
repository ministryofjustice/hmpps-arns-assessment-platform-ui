import AssessmentPlatformApiClient from '../../../data/assessmentPlatformApiClient'
import CoordinatorApiClient from '../../../data/coordinatorApiClient'
import HandoverApiClient from '../../../data/handoverApiClient'
import PreferencesStore from '../../../data/preferencesStore'

export interface TrainingSessionLauncherEffectsDeps {
  assessmentPlatformApiClient: AssessmentPlatformApiClient
  handoverApiClient: HandoverApiClient
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
