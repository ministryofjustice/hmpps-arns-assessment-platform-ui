import { InternalServerError, NotFound } from 'http-errors'
import { DateTime } from 'luxon'
import { VersionsTable } from '../../../../interfaces/coordinator-api/previousVersions'
import { StrengthsAndNeedsContext, StrengthsAndNeedsEffectsDeps } from '../types'

const buildPreviousVersions = (versions: VersionsTable) =>
  Object.entries(versions)
    .filter(([, entry]) => Boolean(entry.assessmentVersion))
    .sort(([timestampA], [timestampB]) => timestampB.localeCompare(timestampA))
    .map(([_, { assessmentVersion }]) => DateTime.fromISO(assessmentVersion.updatedAt).toMillis())

export const loadPreviousVersions =
  (deps: StrengthsAndNeedsEffectsDeps) => async (context: StrengthsAndNeedsContext) => {
    const assessmentUuid = context.getData('assessmentUuid')

    if (!assessmentUuid) {
      throw new InternalServerError('Assessment UUID is required to load previous versions')
    }

    const previousVersions = await deps.coordinatorApi.getVersionsByEntityId(assessmentUuid)

    if (!previousVersions) {
      throw new NotFound('Previous versions not found')
    }

    context.setData('previousVersions', buildPreviousVersions(previousVersions.allVersions))
  }
