import { StrengthsAndNeedsContext } from '../types'

/**
 * Extracts mode and UUID from the URL path: /strengths-and-needs/v1.0/{mode}/{uuid}
 * Validates mode is 'edit' or 'view', and stores both in session.
 *
 * - In edit mode: uuid is the assessmentUuid
 * - In view mode: uuid is the versionUuid
 */
export const extractModeAndVersionUuidFromUrl = () => (context: StrengthsAndNeedsContext) => {
  const session = context.getSession()

  // Extract from URL path, e.g. /strengths-and-needs/v1.0/{mode}/{uuid}
  // The forge framework will handle :mode/:uuid route parameters
  const mode = context.getRequestParam('mode') as string | undefined
  const uuid = context.getRequestParam('uuid') as string | undefined

  if (!mode || !uuid) {
    // No URL parameters - session should already have mode/uuid or neither (entry point)
    // If neither is set, default to 'edit' mode
    if (!session.mode) {
      session.mode = 'edit'
    }
    return
  }

  // Validate mode
  if (mode !== 'edit' && mode !== 'view' && mode !== 'view-historic') {
    throw new Error(`Invalid mode parameter: ${mode}. Must be 'edit', 'view', or 'view-historic'`)
  }

  session.mode = mode
  session.uuid = uuid

  if (mode === 'view-historic') {
    session.versionUuid = uuid
  }
}
