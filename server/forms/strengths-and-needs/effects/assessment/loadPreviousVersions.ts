import { InternalServerError, NotFound } from 'http-errors'
import { DateTime } from 'luxon'
import { VersionDetails, VersionsTable } from '../../../../interfaces/coordinator-api/previousVersions'
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

export const buildPreviousVersions = (versions: VersionsTable): PreviousVersionDisplay[] =>
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

/**
 * Finds the SAN version a handover asked for. OASys identifies it by its `createdAt` as UTC epoch millis
 * (Kotlin: `createdAt.toInstant(ZoneOffset.UTC).toEpochMilli()`), so parse `createdAt` as UTC too: an
 * offset-less value would otherwise be read in the server's time zone. Luxon, like `toEpochMilli()`,
 * truncates sub-millisecond digits, so the values compare exactly.
 */
export const findVersionCreatedAt = (versions: VersionDetails[], createdAtMillis: number): VersionDetails | undefined =>
  versions.find(
    version =>
      version.entityType === 'AAP_SAN' &&
      DateTime.fromISO(version.createdAt, { zone: 'utc' }).toMillis() === createdAtMillis,
  )

export const storePreviousVersionsInSession = async (
  deps: StrengthsAndNeedsEffectsDeps,
  assessmentUuid: string,
  session: any,
): Promise<void> => {
  const previousVersions = await deps.coordinatorApi.getVersionsByEntityId(assessmentUuid)

  if (!previousVersions) {
    throw new NotFound('Previous versions not found')
  }

  session.countersignedVersions = buildPreviousVersions(previousVersions.countersignedVersions)
  session.previousVersions = buildPreviousVersions(previousVersions.allVersions)
  session.unaggregatedVersions = previousVersions.unaggregatedVersions
}

export const loadPreviousVersions =
  (deps: StrengthsAndNeedsEffectsDeps) => async (context: StrengthsAndNeedsContext) => {
    const assessmentUuid = context.getData('assessmentUuid')

    if (!assessmentUuid) {
      throw new InternalServerError('Assessment UUID is required to load previous versions')
    }

    const session = context.getSession()
    await storePreviousVersionsInSession(deps, assessmentUuid, session)
  }
