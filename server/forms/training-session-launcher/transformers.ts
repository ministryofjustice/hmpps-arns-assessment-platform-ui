import { defineTransformers } from '@form-engine/registry/utils/createRegisterableFunction'
import { assertNumber } from '@form-engine/registry/utils/asserts'

/**
 * Training Session Launcher transformers
 */
export const {
  transformers: TrainingSessionLauncherTransformers,
  registry: TrainingSessionLauncherTransformersRegistry,
} = defineTransformers({
  /**
   * Transform a Unix timestamp (from Date.now()) into a human-readable relative time string
   * Returns strings like:
   * - "Created just now" (< 1 minute)
   * - "Created 5 mins ago" (< 1 hour)
   * - "Created 4 hours ago" (< 24 hours, same day)
   * - "Created yesterday at 13:45" (yesterday)
   * - "Created on 10 Jan at 09:30" (older)
   *
   * @example
   * Item().path('createdAt').pipe(TrainingSessionLauncherTransformers.RelativeTime())
   * // -> "Created 5 mins ago"
   */
  RelativeTime: (value: unknown) => {
    assertNumber(value, 'TrainingSessionLauncherTransformers.RelativeTime')

    const now = Date.now()
    const diff = now - value
    const date = new Date(value)
    const today = new Date()

    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))

    // Less than 1 minute
    if (minutes < 1) {
      return 'Created just now'
    }

    // Less than 1 hour
    if (minutes < 60) {
      return `Created ${minutes} ${minutes === 1 ? 'min' : 'mins'} ago`
    }

    // Check if it's today
    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()

    if (isToday) {
      return `Created ${hours} ${hours === 1 ? 'hour' : 'hours'} ago`
    }

    // Check if it's yesterday
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    const isYesterday =
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear()

    const timeStr = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

    if (isYesterday) {
      return `Created yesterday at ${timeStr}`
    }

    // Older dates
    const dateStr = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })

    return `Created on ${dateStr} at ${timeStr}`
  },
})
