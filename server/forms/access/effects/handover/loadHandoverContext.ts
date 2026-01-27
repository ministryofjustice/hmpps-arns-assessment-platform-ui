import { AccessContext, AccessEffectsDeps } from '../types'

/**
 * Load handover context from the API and store in session.
 * Skips if context is already cached in session.
 *
 * Requires user to be authenticated with handover auth source.
 * Throws if the API call fails.
 */
export const loadHandoverContext = (deps: AccessEffectsDeps) => async (context: AccessContext) => {
  const user = context.getState('user')
  const session = context.getSession()

  if (session.handoverContext) {
    return
  }

  session.handoverContext = await deps.handoverApi.getCurrentContext(user.token)
}
