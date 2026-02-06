import { TrainingSessionLauncherContext } from '../../types'
import { TrainingLauncherNotification } from '../types'

/**
 * Add a notification to the session
 *
 * Notifications are stored in session.notifications array and
 * displayed on the target page via loadNotifications effect.
 *
 * Normalizes the notification structure: if no title is provided,
 * the message is promoted to the title for consistent rendering.
 */
export const addNotification =
  () => async (context: TrainingSessionLauncherContext, notification: TrainingLauncherNotification) => {
    const session = context.getSession()

    session.notifications = session.notifications || []

    // Normalize: if no title provided, promote message to title
    const normalized: TrainingLauncherNotification = notification.title
      ? notification
      : { ...notification, title: notification.message as string, message: undefined as unknown as string }

    session.notifications.push(normalized)
  }
