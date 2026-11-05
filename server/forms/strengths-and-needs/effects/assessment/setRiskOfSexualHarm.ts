import { StrengthsAndNeedsContext, StrengthsAndNeedsEffectsDeps } from '../types'
import { wrapAll } from '../../../../data/aap-api/wrappers'
import { Section, SectionComplete } from '../../versions/v1.0/constants/section'
import { Question } from '../../versions/v1.0/journeys/thinking-behaviours-and-attitudes/constants/question'
import { Commands } from '../../../../interfaces/aap-api/command'
import { CommonOption } from '../../versions/v1.0/constants/commonOption'

export const setRiskOfSexualHarm =
  (deps: StrengthsAndNeedsEffectsDeps) => async (context: StrengthsAndNeedsContext) => {
    const user = context.getState('user')
    const assessmentUuid = context.getData('assessmentUuid')

    const oasysAnswer = context.getSession().caseDetails.sexuallyMotivatedOffenceHistory
    const sanAnswer = context.getAnswer(Question.thinking_behaviours_attitudes_risk_sexual_harm)

    if (oasysAnswer === CommonOption.yes && oasysAnswer !== sanAnswer) {
      const updateAnswers: Commands = {
        type: 'UpdateAssessmentAnswersCommand',
        assessmentUuid,
        user,
        added: wrapAll({ [Question.thinking_behaviours_attitudes_risk_sexual_harm]: CommonOption.yes }),
        removed: [],
      }

      const updateProperties: Commands = {
        type: 'UpdateAssessmentPropertiesCommand',
        assessmentUuid,
        user,
        added: wrapAll({ [Section.thinking_behaviours_and_attitudes.statusKey]: SectionComplete.no }),
        removed: [],
      }

      await deps.api.executeCommands(updateAnswers, updateProperties)

      const { answers, properties, ...rest } = context.getData('assessment')
      context.setData('assessment', {
        ...rest,
        answers: { ...answers, ...updateAnswers.added },
        properties: { ...properties, ...updateProperties.added },
      })
      context.setAnswer(Question.thinking_behaviours_attitudes_risk_sexual_harm, CommonOption.yes)
      context.setData(Section.thinking_behaviours_and_attitudes.statusKey, SectionComplete.no)
    }
  }
