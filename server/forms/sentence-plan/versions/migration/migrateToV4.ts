import { SentencePlanContext, SentencePlanEffectsDeps } from '../../effects/types'
import { AssessmentVersionQueryResult } from '../../../../interfaces/aap-api/queryResult'

/**
 * Migrates from V3 to V4
 *
 * Checks session for existing assessment UUID. If found, check the formVersion against required.
 * If Effects aren't registered, this will SILENTLY fail...
 */
export const migrateFromV3ToV4 = (deps: SentencePlanEffectsDeps) => async (context: SentencePlanContext) => {
  const assessment = context.getData('assessment') as AssessmentVersionQueryResult

  if (assessment.formVersion === '3.0') {
    // Do migration
    const user = context.getState('user')
    // This should be part of the group command... (if possible)
    const form = await deps.api.executeCommand({
      type: 'UpdateFormVersionCommand',
      version: '4.0',
      assessmentUuid: assessment.assessmentUuid,
      user,
    })
    // see which answers need to change, and then UpdateAssessmentAnswersCommand or UpdateCollectionItemAnswersCommand (if possible).
    // do what if not possible? use a 'migrate' page (with questions?)?
    // go to 'next' form version (if there is one).
  }
  // the 'access' steps should send to latest?
  // so to go to v3 from v1, we would have to send back to v2, which should then convert to v2 and then on to v3?
}
