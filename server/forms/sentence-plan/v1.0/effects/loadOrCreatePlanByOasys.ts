import { InternalServerError } from 'http-errors'
import { CreateAssessmentCommandResult } from '../../../../interfaces/aap-api/commandResult'
import { EffectFunction } from './index'

/**
 * Load or create a sentence plan for the OASys path
 *
 * Checks session for existing assessment UUID. If found, loads that assessment.
 * If not found (or invalid), creates a new assessment and stores UUID in session.
 */
export const loadOrCreatePlanByOasys: EffectFunction = deps => async context => {
  const user = context.getState('user')
  const session = context.getSession()

  if (!user) {
    throw new InternalServerError('User is required to load or create a sentence plan')
  }

  // Check session for existing assessment UUID
  const sessionUuid = session?.sentencePlanAssessmentUuid

  if (sessionUuid) {
    const queryResponse = await deps.api.executeQueries({
      queries: [
        {
          type: 'AssessmentVersionQuery',
          user,
          assessmentIdentifier: { type: 'UUID', uuid: sessionUuid },
        },
      ],
    })

    const queryResult = queryResponse.queries[0]?.result

    if (queryResult?.type === 'AssessmentVersionQueryResult') {
      context.setData('assessment', queryResult)
      context.setData('assessmentUuid', queryResult.assessmentUuid)
      return
    }
  }

  // TODO: Everything below is just placeholder, should be handled by the Coordinator
  //  on first access.
  // No valid session UUID - create new assessment
  const commandResponse = await deps.api.executeCommands({
    commands: [
      {
        type: 'CreateAssessmentCommand',
        assessmentType: 'SENTENCE_PLAN',
        formVersion: '1.0',
        user,
      },
    ],
  })

  const commandResult = commandResponse.commands[0]?.result as CreateAssessmentCommandResult | undefined

  if (!commandResult?.success) {
    throw new InternalServerError(`Failed to create sentence plan: ${commandResult?.message ?? 'Unknown error'}`)
  }

  context.setData('assessment', commandResult)
  context.setData('assessmentUuid', commandResult.assessmentUuid)

  // Store UUID in session for subsequent requests
  if (session) {
    session.sentencePlanAssessmentUuid = commandResult.assessmentUuid
  }
}
