import { FormatExpr } from '@form-engine/form/types/expressions.type'
import { CoordinatorApiClient, HandoverApiClient, PreferencesStore } from '../../../data'

export interface TrainingSessionLauncherEffectsDeps {
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
  message: string | FormatExpr
  target: string
}
