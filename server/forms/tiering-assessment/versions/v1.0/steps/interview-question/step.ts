import { access, Answer, Condition, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { TieringAssessmentEffects } from '../../../../effects/TieringAssessmentEffects'
import { Step } from '../../constants/page'
import { continueButton } from '../../common'
import { interviewFields } from './fields'
import { stepTitle } from '../../locales'
import { Question } from './constants/question'
import { CommonOption } from '../../constants/commonOption'

export const interviewQuestionStep = step({
  path: `${Step.interview_question.path}`,
  title: stepTitle(Step.interview_question),
  onAccess: [
    access({
      effects: [TieringAssessmentEffects.LoadAssessmentData(), TieringAssessmentEffects.LoadCaseData()],
    }),
  ],
  blocks: [interviewFields.questions.interviewQuestion.displayModes.field, continueButton],
  onSubmission: [
    submit({
      validate: true,
      onValid: {
        effects: [TieringAssessmentEffects.SaveAssessmentData()],
        next: [
          redirect({
            when: Answer(Question.have_you_done_an_interview).match(Condition.Equals(CommonOption.yes)),
            goto: Step.accommodation.path,
          }),
          redirect({ goto: Step.check_your_answers.path }),
        ],
      },
    }),
  ],
})
