import { access, Answer, Condition, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { TieringAssessmentEffects } from '../../../../effects/TieringAssessmentEffects'
import { continueButton } from '../../common'
import { alcoholEverUsedFields } from './fields'
import { Option } from './constants/option'
import { Step } from '../../constants/page'
import { stepTitle } from '../../locales'
import { Question } from './constants/question'

export const alcoholEverUsedStep = step({
  path: `/${Step.alcohol_ever_used.path}`,
  title: stepTitle(Step.alcohol_ever_used),
  onAccess: [
    access({
      effects: [TieringAssessmentEffects.LoadAssessmentData(), TieringAssessmentEffects.LoadCaseData()],
    }),
  ],
  blocks: [alcoholEverUsedFields.questions.hasEverDrunkAlcoholQuestion.displayModes.field, continueButton],
  onSubmission: [
    submit({
      validate: true,
      onValid: {
        effects: [TieringAssessmentEffects.SaveAssessmentData()],
        next: [
          redirect({
            when: Answer(Question.has_ever_drunk_alcohol).match(Condition.Equals(Option.YES_IN_LAST_THREE_MONTHS)),
            goto: Step.alcohol.path,
          }),
          redirect({
            when: Answer(Question.has_ever_drunk_alcohol).match(Condition.Equals(Option.YES_NOT_IN_LAST_THREE_MONTHS)),
            goto: Step.binge_drinking.path,
          }),
          redirect({ goto: Step.personal_relationships_and_community.path }),
        ],
      },
    }),
  ],
})
