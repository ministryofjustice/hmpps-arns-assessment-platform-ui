import { telemetry } from '@ministryofjustice/hmpps-azure-telemetry'
import { SentencePlanContext } from '../types'

type TelemetryProperties = Record<string, string | number | boolean>

/**
 * Emit a server-side telemetry event for a business action, tagged with the
 * authenticated user's id and auth source. Lets analytics count distinct users
 * per action, e.g. dcount(authenticatedUserId) where name == 'EDIT_GOAL_ACHIEVED'.
 */
export const trackBusinessEvent = (
  context: SentencePlanContext,
  name: string,
  properties: TelemetryProperties = {},
) => {
  const authenticatedUserId = context.getSession()?.principal?.identifier

  telemetry.trackEvent(name, {
    ...(authenticatedUserId ? { authenticatedUserId } : {}),
    authSource: context.getState('user').authSource,
    ...properties,
  })
}
