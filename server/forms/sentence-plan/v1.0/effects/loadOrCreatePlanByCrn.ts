import { BadRequest, InternalServerError } from 'http-errors'
import { CreateAssessmentCommandResult } from '../../../../interfaces/aap-api/commandResult'
import { EffectFunction } from './index'

/**
 * Load or create a sentence plan for the MPOP path (CRN-based)
 *
 * Queries for existing assessment by CRN. If not found, creates a new
 * assessment with the CRN identifier attached.
 *
 * Requires :crn route parameter.
 */
export const loadOrCreatePlanByCrn: EffectFunction = deps => async context => {
  const crn = context.getRequestParam('crn')
  const user = context.getState('user')

  if (!user) {
    throw new InternalServerError('User is required to load or create a sentence plan')
  }

  if (!crn) {
    throw new BadRequest('CRN is required to load or create a sentence plan')
  }

  // Try to load existing assessment by CRN
  const queryResponse = await deps.api.executeQueries({
    queries: [
      {
        type: 'AssessmentVersionQuery',
        user,
        assessmentIdentifier: {
          type: 'EXTERNAL',
          identifier: crn,
          identifierType: 'CRN',
          assessmentType: 'SENTENCE_PLAN',
        },
      },
    ],
  })

  const queryResult = queryResponse.queries[0]?.result

  if (queryResult?.type === 'AssessmentVersionQueryResult') {
    context.setData('assessment', queryResult)
    context.setData('assessmentUuid', queryResult.assessmentUuid)
    return
  }

  // TODO: Everything below is just placeholder, not sure how we want to do this in PROD.
  // No existing assessment - create with CRN identifier
  const commandResponse = await deps.api.executeCommands({
    commands: [
      {
        type: 'CreateAssessmentCommand',
        assessmentType: 'SENTENCE_PLAN',
        formVersion: '1.0',
        identifiers: { CRN: crn },
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
}
