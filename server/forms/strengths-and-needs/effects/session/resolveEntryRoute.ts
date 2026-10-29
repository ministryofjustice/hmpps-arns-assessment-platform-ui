import { NotFound } from 'http-errors'
import { DateTime } from 'luxon'
import { sanSession, StrengthsAndNeedsContext, StrengthsAndNeedsEffectsDeps } from '../types'
import { findAssessmentVersion, findVersionCreatedAt } from '../assessment/loadPreviousVersions'

export interface EntryRoute {
  mode: 'edit' | 'view' | 'view-historic'
  uuid: string
}

/**
 * Works out where access lands, for the entry step to redirect to (`Data('entryRoute')`):
 * - the version the handover asked for: view-historic of that version
 * - otherwise the current assessment: edit with READ_WRITE access, view with READ_ONLY
 *
 * A requested version wins over the access mode: initializeSessionFromAccess already makes
 * the session READ_ONLY when the handover carries one.
 */
export const resolveEntryRoute = (deps: StrengthsAndNeedsEffectsDeps) => async (context: StrengthsAndNeedsContext) => {
  const session = context.getSession()
  const { sessionDetails, assessmentUuid } = sanSession(session)
  const { accessMode, assessmentVersion } = sessionDetails

  if (!assessmentVersion) {
    context.setData('entryRoute', {
      mode: accessMode === 'READ_WRITE' ? 'edit' : 'view',
      uuid: assessmentUuid,
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

  context.setData('entryRoute', { mode: 'view-historic', uuid: previousVersion.uuid } satisfies EntryRoute)
}
