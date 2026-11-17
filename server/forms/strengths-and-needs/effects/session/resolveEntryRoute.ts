import { NotFound } from 'http-errors'
import { DateTime } from 'luxon'
import { sanSession, StrengthsAndNeedsContext, StrengthsAndNeedsEffectsDeps } from '../types'
import { findAssessmentVersion, findVersionCreatedAt } from '../assessment/loadPreviousVersions'
import { currentVersion } from '../../versions/v1.0/constants/path'

export interface EntryRoute {
  mode: 'edit' | 'view'
  versionUuid: string
}

/**
 * Works out where access lands, for the entry step to redirect to (`Data('entryRoute')`):
 * - the version the handover asked for: view of that version
 * - otherwise the current version: edit with READ_WRITE access, view with READ_ONLY
 *
 * A requested version wins over the access mode: initializeSessionFromAccess already makes
 * the session READ_ONLY when the handover carries one.
 */
export const resolveEntryRoute = (deps: StrengthsAndNeedsEffectsDeps) => async (context: StrengthsAndNeedsContext) => {
  const session = context.getSession()
  const san = sanSession(session)
  const { accessMode, assessmentVersion } = san.sessionDetails

  if (!assessmentVersion) {
    context.setData('entryRoute', {
      mode: accessMode === 'READ_WRITE' ? 'edit' : 'view',
      versionUuid: currentVersion,
    } satisfies EntryRoute)
    return
  }

  const previousVersion = await findAssessmentVersion(deps, session, versions =>
    findVersionCreatedAt(versions, assessmentVersion),
  )

  if (!previousVersion) {
    throw new NotFound(
      `No assessment version created at ${DateTime.fromMillis(assessmentVersion, { zone: 'utc' }).toISO()} (${assessmentVersion})`,
    )
  }

  context.setData('entryRoute', { mode: 'view', versionUuid: previousVersion.uuid } satisfies EntryRoute)
}
