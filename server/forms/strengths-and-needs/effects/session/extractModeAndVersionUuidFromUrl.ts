import { NotFound } from 'http-errors'
import { StrengthsAndNeedsContext } from '../types'
import { formConfigsByVersion } from '../../constants/formConfigRegistry'

// UUID v4 format: 8-4-4-4-12 hexadecimal digits
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * Extracts form version, mode and UUID from the URL path: /strengths-and-needs/{formVersion}/{mode}/{uuid}
 * Exposes the form version and its config as data, and stores mode and UUID in session after validating
 * mode is 'edit', 'view', or 'view-historic'.
 *
 * - In edit or view mode: uuid is the assessmentUuid
 * - In view-historic mode: uuid is the versionUuid
 */
export const extractModeAndVersionUuidFromUrl = () => (context: StrengthsAndNeedsContext) => {
  const session = context.getSession()
  const formVersion = context.getRequestParam('formVersion')

  if (formVersion) {
    if (!formConfigsByVersion[formVersion]) {
      throw new NotFound(`Unknown strengths and needs form version: ${formVersion}`)
    }

    context.setData('formVersion', formVersion)
    context.setData('formConfig', formConfigsByVersion[formVersion])
  }

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
