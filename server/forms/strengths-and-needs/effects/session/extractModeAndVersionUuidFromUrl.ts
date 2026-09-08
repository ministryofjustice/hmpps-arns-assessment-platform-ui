import { StrengthsAndNeedsContext } from '../types'

// UUID v4 format: 8-4-4-4-12 hexadecimal digits
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * Extracts mode and UUID from the URL path: /strengths-and-needs/v1.0/{mode}/{uuid}
 * Validates mode is 'edit', 'view', or 'view-historic', and stores both in session.
 *
 * - In edit or view mode: uuid is the assessmentUuid
 * - In view-historic mode: uuid is the versionUuid
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

  // Validate UUID structure
  if (!UUID_REGEX.test(uuid)) {
    throw new Error(
      `Invalid UUID format: ${uuid}. Must be a valid UUID v4 (e.g., 550e8400-e29b-41d4-a716-446655440000)`,
    )
  }

  session.mode = mode
  session.uuid = uuid

  if (mode === 'view-historic') {
    session.versionUuid = uuid
  }
}
