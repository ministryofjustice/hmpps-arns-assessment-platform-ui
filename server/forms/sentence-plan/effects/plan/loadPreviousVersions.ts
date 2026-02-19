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

  // remove the latest(current) version from allVersions
  const trimmedAllVersions = Object.fromEntries(
    Object.entries(previousVersions.allVersions)
      .sort((a, b) => b[0].localeCompare(a[0]))
      .slice(1),
  )

  context.setData('previousVersions', {
    ...previousVersions,
    allVersions: trimmedAllVersions,
  })
}
