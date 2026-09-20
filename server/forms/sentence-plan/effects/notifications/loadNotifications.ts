import { SentencePlanContext, PlanNotification } from '../types'

/**
 * Load notifications for a specific target page
 *
 * Reads notifications from session that match the target,
 * sets them as data for rendering, and removes them from session.
 *
 */
export const loadNotifications = () => async (context: SentencePlanContext, target: string) => {
  const session = context.getSession()
  const all = (session.notifications || []) as PlanNotification[]

  // Get matching notifications for this target
  const matching = all.filter(n => n.target === target)

  // Clear matched ones from session
  session.notifications = all.filter(n => n.target !== target)

  // Make available for rendering
  context.setData('notifications', matching)
}
