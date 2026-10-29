import { NotFound } from 'http-errors'
import { DateTime } from 'luxon'
import { sanSession, StrengthsAndNeedsContext, StrengthsAndNeedsEffectsDeps } from '../types'
import { findAssessmentVersion } from './loadPreviousVersions'

/**
 * Resolves the previous version in a view-historic URL (`view-historic/<versionUuid>`), for loadAssessment
 * to load. Needs the session's assessment UUID, so a session that hasn't loaded the assessment yet is sent
 * to the entry step first.
 */
export const resolveHistoricVersion =
  (deps: StrengthsAndNeedsEffectsDeps) => async (context: StrengthsAndNeedsContext) => {
    const session = context.getSession()
    const versionUuid = context.getRequestParam('uuid')

    const historicVersion = await findAssessmentVersion(deps, session, versions =>
      versions.find(version => version.entityType === 'AAP_SAN' && version.uuid === versionUuid),
    )

    if (!historicVersion) {
      throw new NotFound(`No version ${versionUuid} of assessment ${sanSession(session).assessmentUuid}`)
    }

    context.setData('historicVersion', historicVersion)
    // Coordinator timestamps are UTC; don't let an offset-less value be read in the server's time zone.
    context.setData('previousVersionDate', DateTime.fromISO(historicVersion.updatedAt, { zone: 'utc' }).toMillis())
  }
