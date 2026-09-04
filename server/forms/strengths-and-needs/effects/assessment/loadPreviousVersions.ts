import { InternalServerError, NotFound } from 'http-errors'
import { DateTime } from 'luxon'
import { VersionsTable } from '../../../../interfaces/coordinator-api/previousVersions'
import { StrengthsAndNeedsContext, StrengthsAndNeedsEffectsDeps } from '../types'

export interface PreviousVersionDisplay {
  assessmentUpdatedDate?: number
  assessmentVersionStatus?: string
  assessmentVersionId: string
  date: number
  description: string
  planUpdatedDate?: number
  planVersionId?: string
  planVersionStatus?: string
}

const buildPreviousVersions = (versions: VersionsTable): PreviousVersionDisplay[] =>
  Object.entries(versions)
    .filter(([, entry]) => Boolean(entry.assessmentVersion))
    .sort(([timestampA], [timestampB]) => timestampB.localeCompare(timestampA))
    .map(([date, { description, assessmentVersion, planVersion }]): PreviousVersionDisplay => {
      const toMillis = (updatedAt?: string) => (updatedAt ? DateTime.fromISO(updatedAt).toMillis() : null)
      return {
        assessmentUpdatedDate: toMillis(assessmentVersion?.updatedAt),
        assessmentVersionStatus: assessmentVersion?.status,
        assessmentVersionId: assessmentVersion?.uuid,
        date: toMillis(date),
        description,
        planUpdatedDate: toMillis(planVersion?.updatedAt),
        planVersionId: toMillis(planVersion?.updatedAt)?.toString(),
        planVersionStatus: planVersion?.status,
      }
    })

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

    const session = context.getSession()
    session.countersignedVersions = buildPreviousVersions(previousVersions.countersignedVersions)
    session.previousVersions = buildPreviousVersions(previousVersions.allVersions)
  }
