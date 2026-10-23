import { InternalServerError } from 'http-errors'
import { StrengthsAndNeedsContext, StrengthsAndNeedsEffectsDeps } from '../types'
import { storePreviousVersionsInSession } from '../assessment/loadPreviousVersions'

/**
 * Extracts mode and UUID from the Handover Context
 * - In edit or view mode: uuid is the assessmentUuid
 * - In view-historic mode: uuid is the versionUuid
 */
export const extractModeAndVersionUuidFromHandoverContext =
  (deps: StrengthsAndNeedsEffectsDeps) => async (context: StrengthsAndNeedsContext) => {
    const session = context.getSession()
    const assessmentUuid = context.getData('assessmentUuid')

    if (session.accessDetails.accessMode === 'READ_WRITE') {
      session.mode = 'edit'
      session.uuid = assessmentUuid
      return
    }

    if (!session.sessionDetails.assessmentVersion) {
      session.mode = 'view'
      session.uuid = assessmentUuid
      return
    }

    if (!session.previousVersions) {
      await storePreviousVersionsInSession(deps, assessmentUuid, session)
    }

    const previousVersion = session.previousVersions.find(
      it => it.assessmentUpdatedDate === session.sessionDetails.assessmentVersion,
    )

    if (!previousVersion) {
      const validTimestamps = session.previousVersions.map(it => it.assessmentUpdatedDate).join(', ')
      throw new InternalServerError(
        `Invalid assessment version timestamp: ${session.sessionDetails.assessmentVersion}. Valid timestamps: ${validTimestamps}`,
      )
    }

    session.mode = 'view-historic'
    session.uuid = previousVersion.assessmentVersionId
  }
