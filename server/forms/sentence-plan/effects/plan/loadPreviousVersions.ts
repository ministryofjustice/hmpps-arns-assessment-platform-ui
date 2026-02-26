import { InternalServerError, NotFound } from 'http-errors'
import { SentencePlanContext, SentencePlanEffectsDeps } from '../types'
import { PreviousVersionsResponse, VersionsTable } from '../../../../interfaces/coordinator-api/previousVersions'

// The previous-versions page should not show today's entry in the history list.
// Keep this in one helper so all modes (beta + sentence-plan-only) apply the same rule.
const trimTodayVersions = (versions: VersionsTable): VersionsTable => {
  const today = new Date().toISOString().split('T')[0]
  const sortedAllVersions = Object.entries(versions).sort((a, b) => b[0].localeCompare(a[0]))
  const trimmedAllVersions = sortedAllVersions[0]?.[0] === today ? sortedAllVersions.slice(1) : sortedAllVersions

  return Object.fromEntries(trimmedAllVersions)
}

const hasPrivateBetaOasysAccess = (context: SentencePlanContext): boolean => {
  const sessionDetails = context.getData('sessionDetails') as { accessType?: string } | undefined
  const assessment = context.getData('assessment') as { flags?: string[] } | undefined

  return sessionDetails?.accessType === 'OASYS' && Boolean(assessment?.flags?.includes('SAN_BETA'))
}

/**
 * Load previous plan and assessment versions using the plan uuid from context.
 *
 * Must be called after loading a plan.
 */
export const loadPreviousVersions = (deps: SentencePlanEffectsDeps) => async (context: SentencePlanContext) => {
  const assessmentUuid = context.getData('assessmentUuid')

  if (!assessmentUuid) {
    throw new InternalServerError('Assessment UUID is required to load previous versions')
  }

  const showAssessmentColumn = hasPrivateBetaOasysAccess(context)
  context.setData('showAssessmentColumn', showAssessmentColumn)

  // Use coordinator's HMPPS_AUTH mode for all plan-only journeys (including
  // national rollout users who entered via OASYS). This forces coordinator to
  // return PLAN versions only, so we avoid unnecessary SAN lookups/failures.
  const previousVersions = await deps.coordinatorApi.getVersionsByEntityId(
    assessmentUuid,
    showAssessmentColumn ? undefined : 'HMPPS_AUTH',
  )

  if (!previousVersions) {
    throw new NotFound('Previous versions not found')
  }

  const trimmedVersions: PreviousVersionsResponse = {
    ...previousVersions,
    allVersions: trimTodayVersions(previousVersions.allVersions),
  }
  context.setData('previousVersions', trimmedVersions)
}
