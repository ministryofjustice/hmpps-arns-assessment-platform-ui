import { telemetry } from '@ministryofjustice/hmpps-azure-telemetry'
import { SentencePlanContext } from '../types'
import { getUserContext } from './getUserContext'

type TelemetryProperties = Record<string, string | number | boolean>

/**
 * Emit a server-side telemetry event for a business action, tagged with the
 * authenticated user's id, auth source and user context, plus the request id for
 * correlation. Lets analytics count distinct users per action, e.g.
 * dcount(authenticatedUserId) where name == 'EDIT_GOAL_ACHIEVED', and break down
 * actions by userContext (PRISON/PROBATION/COMMUNITY).
 */
export const trackBusinessEvent = (
  context: SentencePlanContext,
  name: string,
  properties: TelemetryProperties = {},
) => {
  const authenticatedUserId = context.getSession()?.principal?.identifier
  const requestId = context.getState('requestId')

  telemetry.trackEvent(name, {
    ...(authenticatedUserId ? { authenticatedUserId } : {}),
    ...(requestId ? { requestId } : {}),
    authSource: context.getState('user').authSource,
    userContext: getUserContext(context),
    ...properties,
  })
}
