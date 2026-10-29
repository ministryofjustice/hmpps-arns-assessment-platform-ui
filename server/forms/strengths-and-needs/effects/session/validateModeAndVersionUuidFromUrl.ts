import { BadRequest, NotFound } from 'http-errors'
import { StrengthsAndNeedsContext } from '../types'
import { currentVersion } from '../../versions/v1.0/constants/path'

// UUID format: 8-4-4-4-12 hexadecimal digits
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * Validates the route parameters of /strengths-and-needs/v1.0/{mode}/{assessmentUuid}/{versionUuid}:
 * - mode: `edit` or `view`
 * - assessmentUuid: a UUID
 * - versionUuid: a UUID, or `current` for the latest version
 */
export const validateModeAndVersionUuidFromUrl = () => (context: StrengthsAndNeedsContext) => {
  const mode = context.getRequestParam('mode') as string | undefined
  const assessmentUuid = context.getRequestParam('assessmentUuid') as string | undefined
  const versionUuid = context.getRequestParam('versionUuid') as string | undefined

  if (!mode) {
    // Not an assessment page, e.g. the entry step
    return
  }

  if (mode !== 'edit' && mode !== 'view') {
    throw new BadRequest(`Invalid mode parameter: ${mode}. Must be 'edit' or 'view'`)
  }

  if (!UUID_REGEX.test(assessmentUuid ?? '')) {
    throw new NotFound(`Invalid assessment UUID: ${assessmentUuid}`)
  }

  if (versionUuid !== currentVersion && !UUID_REGEX.test(versionUuid ?? '')) {
    throw new NotFound(`Invalid version UUID: ${versionUuid}. Must be a UUID or '${currentVersion}'`)
  }
}
