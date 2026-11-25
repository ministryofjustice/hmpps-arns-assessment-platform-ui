import { NotFound } from 'http-errors'
import { DateTime } from 'luxon'
import { sanSession, StrengthsAndNeedsContext, StrengthsAndNeedsEffectsDeps } from '../types'
import { findAssessmentVersion } from './loadPreviousVersions'
import { loadAssessmentQuery } from './loadAssessment'

/**
 * The UUID of the assessment for this access. Loads the current assessment when the session doesn't know
 * it yet (e.g. a bookmarked previous version opened straight after access).
 */
const accessAssessmentUuid = async (deps: StrengthsAndNeedsEffectsDeps, context: StrengthsAndNeedsContext) => {
  const san = sanSession(context.getSession())

  if (!san.assessmentUuid) {
    const assessment = await loadAssessmentQuery(deps, {
      type: 'AssessmentVersionQuery',
      user: context.getState('user'),
      assessmentIdentifier: san.sessionDetails.assessmentIdentifier,
    })
    san.assessmentUuid = assessment?.assessmentUuid
  }

  return san.assessmentUuid
}

/**
 * Resolves the previous version in the URL (`<mode>/<assessmentUuid>/<versionUuid>`), for loadAssessment
 * to load.
 */
export const resolveHistoricVersion =
  (deps: StrengthsAndNeedsEffectsDeps) => async (context: StrengthsAndNeedsContext) => {
    const session = context.getSession()
    const assessmentUuid = context.getRequestParam('assessmentUuid')
    const versionUuid = context.getRequestParam('versionUuid')

    if (assessmentUuid !== (await accessAssessmentUuid(deps, context))) {
      // Another assessment: don't look up its versions. routeGuards sends the user to the entry step.
      return
    }

    const historicVersion = await findAssessmentVersion(deps, session, versions =>
      versions.find(version => version.entityType === 'AAP_SAN' && version.uuid === versionUuid),
    )

    if (!historicVersion) {
      throw new NotFound(`No version ${versionUuid} of assessment ${assessmentUuid}`)
    }

    context.setData('historicVersion', historicVersion)
    // Coordinator timestamps are UTC; don't let an offset-less value be read in the server's time zone.
    context.setData('previousVersionDate', DateTime.fromISO(historicVersion.updatedAt, { zone: 'utc' }).toMillis())
  }
