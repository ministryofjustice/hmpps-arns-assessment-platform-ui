import { InternalServerError, NotFound } from 'http-errors'
import { SentencePlanContext, SentencePlanEffectsDeps } from '../types'

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

  const previousVersions = await deps.coordinatorApi.getVersionsByEntityId(assessmentUuid)

  if (!previousVersions) {
    throw new NotFound('Previous versions not found')
  }

  // remove today's version from allVersions
  const today = new Date().toISOString().split('T')[0]
  const sortedAllVersions = Object.entries(previousVersions.allVersions).sort((a, b) => b[0].localeCompare(a[0]))
  const trimmedAllVersions = sortedAllVersions[0]?.[0] === today ? sortedAllVersions.slice(1) : sortedAllVersions

  context.setData('previousVersions', {
    ...previousVersions,
    allVersions: Object.fromEntries(trimmedAllVersions),
  })
}
