import { InternalServerError } from 'http-errors'
import { wrapAll } from '../../../../data/aap-api/wrappers'
import { buildAnswerDelta } from './answerDelta'
import { StrengthsAndNeedsContext, StrengthsAndNeedsEffectsDeps } from '../types'

export const saveCurrentStepAnswers =
  (deps: StrengthsAndNeedsEffectsDeps) => async (context: StrengthsAndNeedsContext) => {
    const user = context.getState('user')
    const assessmentUuid = context.getData('assessmentUuid')

    if (!user) {
      throw new InternalServerError('User is required to save strengths and needs answers')
    }

    if (!assessmentUuid) {
      throw new InternalServerError('Assessment UUID is required to save strengths and needs answers')
    }

    const delta = buildAnswerDelta(context.getAllAnswerHistories())

    if (!Object.keys(delta.added).length && !delta.removed.length) {
      return
    }

    await deps.api.executeCommand({
      type: 'UpdateAssessmentAnswersCommand',
      assessmentUuid,
      user,
      added: wrapAll(delta.added),
      removed: delta.removed,
    })
  }
