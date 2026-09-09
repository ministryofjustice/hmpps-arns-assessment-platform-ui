import { access, Answer, Condition, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { TieringAssessmentEffects } from '../../../../effects/TieringAssessmentEffects'
import { drugMisuseFields } from './fields'
import { Step } from '../../constants/page'
import { stepTitle } from '../../locales'
import { continueButton } from '../../common'
import { Question } from './constants/question'
import { CommonOption } from '../../constants/commonOption'

export const drugMisuseStep = step({
  path: `/${Step.drug_misuse.path}`,
  title: stepTitle(Step.drug_misuse),
  onAccess: [
    access({
      effects: [TieringAssessmentEffects.LoadAssessmentData(), TieringAssessmentEffects.LoadCaseData()],
    }),
  ],
  blocks: [drugMisuseFields.questions.drugMisuseQuestion.displayModes.field, continueButton],
  onSubmission: [
    submit({
      validate: true,
      onValid: {
        effects: [
          TieringAssessmentEffects.CleardownAssessmentData(),
          TieringAssessmentEffects.CalculateRiskActuarialScores(),
          TieringAssessmentEffects.SaveAssessmentData(),
        ],
        next: [
          redirect({
            when: Answer(Question.ever_misused_drugs).match(Condition.Equals(CommonOption.yes)),
            goto: 'drug-use',
          }),
          redirect({ goto: 'alcohol-ever-used' }),
        ],
      },
    }),
  ],
})
