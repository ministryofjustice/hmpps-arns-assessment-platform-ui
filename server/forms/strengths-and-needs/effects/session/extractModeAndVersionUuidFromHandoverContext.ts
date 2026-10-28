import { NotFound } from 'http-errors'
import { DateTime } from 'luxon'
import { StrengthsAndNeedsContext, StrengthsAndNeedsEffectsDeps } from '../types'
import { findVersionCreatedAt, storePreviousVersionsInSession } from '../assessment/loadPreviousVersions'

/**
 * Extracts mode and UUID from the Handover Context
 * - In edit or view mode: uuid is the assessmentUuid
 * - In view-historic mode: uuid is the versionUuid
 *
 * A requested version wins over the access mode: initializeSessionFromAccess already makes
 * the session READ_ONLY when the handover carries one.
 */
export const extractModeAndVersionUuidFromHandoverContext =
  (deps: StrengthsAndNeedsEffectsDeps) => async (context: StrengthsAndNeedsContext) => {
    const session = context.getSession()
    const assessmentUuid = context.getData('assessmentUuid')
    const { accessMode, assessmentVersion } = session.sessionDetails

    if (!assessmentVersion) {
      session.mode = accessMode === 'READ_WRITE' ? 'edit' : 'view'
      session.uuid = assessmentUuid
      return
    }

    if (!session.unaggregatedVersions) {
      await storePreviousVersionsInSession(deps, assessmentUuid, session)
    }

    let previousVersion = findVersionCreatedAt(session.unaggregatedVersions, assessmentVersion)

    if (!previousVersion) {
      // The cached list may predate the requested version, so refresh once before giving up.
      await storePreviousVersionsInSession(deps, assessmentUuid, session)
      previousVersion = findVersionCreatedAt(session.unaggregatedVersions, assessmentVersion)
    }

    if (!previousVersion) {
      throw new NotFound(
        `No assessment version created at ${DateTime.fromMillis(assessmentVersion, { zone: 'utc' }).toISO()} (${assessmentVersion})`,
      )
    }

    session.mode = 'view-historic'
    session.uuid = previousVersion.uuid
  }
