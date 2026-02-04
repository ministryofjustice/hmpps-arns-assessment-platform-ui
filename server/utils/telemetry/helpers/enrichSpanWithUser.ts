import { telemetry } from '../client'
import type { UserContext } from '../types/UserContext'

/**
 * Enrich the current span with user context.
 *
 * @param user - User context to add to the span
 *
 * @example
 * telemetry.helpers.enrichSpanWithUser({
 *   id: res.locals.user?.userId,
 *   authSource: res.locals.user?.authSource,
 *   roles: res.locals.user?.userRoles,
 * })
 */
export function enrichSpanWithUser(user: UserContext | undefined): void {
  const attributes: Record<string, string | number | boolean> = {
    'enduser.authenticated': !!user,
  }

  if (user?.id) {
    attributes['enduser.id'] = user.id
  }

  if (user?.authSource) {
    attributes['enduser.authSource'] = user.authSource
  }

  if (user?.roles?.length) {
    attributes['enduser.roles'] = user.roles.join(',')
  }

  telemetry.setSpanAttributes(attributes)
}
