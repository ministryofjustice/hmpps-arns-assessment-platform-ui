import { InternalServerError } from 'http-errors'
import { QueryError } from '../../../../errors/aap-api/QueryError'
import { SentencePlanEffectsDeps } from './index'
import { SentencePlanContext } from './types'

/**
 * Load or create a sentence plan for the OASys path
 *
 * Checks session for existing assessment UUID. If found, loads that assessment.
 * If not found (or invalid), creates a new assessment and stores UUID in session.
 */
export const loadOrCreatePlanByOasys = (deps: SentencePlanEffectsDeps) => async (context: SentencePlanContext) => {
  const user = context.getState('user')
  const session = context.getSession()

  if (!user) {
    throw new InternalServerError('User is required to load or create a sentence plan')
  }

  // Check session for existing assessment UUID
  const sessionUuid = session?.assessmentUuid

  if (sessionUuid) {
    try {
      const assessment = await deps.api.executeQuery({
        type: 'AssessmentVersionQuery',
        user,
        assessmentIdentifier: { type: 'UUID', uuid: sessionUuid },
      })

      context.setData('assessment', assessment)
      context.setData('assessmentUuid', assessment.assessmentUuid)
      session.assessmentUuid = assessment.assessmentUuid

      return
    } catch (error) {
      // If the query failed, the session UUID is invalid - create a new assessment
      if (!(error instanceof QueryError)) {
        throw error
      }
    }
  }

  // TODO: Everything below is just placeholder, should be handled by the Coordinator
  //  on first access.
  // No valid session UUID - create new assessment
  const result = await deps.api.executeCommand({
    type: 'CreateAssessmentCommand',
    assessmentType: 'SENTENCE_PLAN',
    formVersion: '1.0',
    properties: {
      AGREEMENT_STATUS: { type: 'Single', value: 'DRAFT' },
    },
    user,
  })

  context.setData('assessment', result)
  context.setData('assessmentUuid', result.assessmentUuid)
  session.assessmentUuid = result.assessmentUuid
}
