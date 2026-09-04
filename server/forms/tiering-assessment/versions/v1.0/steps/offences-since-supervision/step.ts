import { access, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { TieringAssessmentEffects } from '../../../../effects/TieringAssessmentEffects'
import { continueButton, redirectToCheckYourAnswers } from '../../common'
import { stepTitle } from '../../locales'
import { Step } from '../../constants/page'
import { offencesSinceSupervisionFields } from './fields'

export const offencesSinceSupervisionStep = step({
  path: `/${Step.offences_since_community_date.path}`,
  title: stepTitle(Step.offences_since_community_date),
  onAccess: [
    access({
      effects: [TieringAssessmentEffects.LoadAssessmentData(), TieringAssessmentEffects.LoadCaseData()],
    }),
  ],
  blocks: [offencesSinceSupervisionFields.questions.offenceHistoryQuestion.displayModes.field, continueButton],
  onSubmission: [
    submit({
      validate: true,
      onValid: {
        effects: [
          TieringAssessmentEffects.CalculateRiskActuarialScores(),
          TieringAssessmentEffects.SaveAssessmentData(),
        ],
        next: [redirectToCheckYourAnswers, redirect({ goto: 'interview-question' })],
      },
    }),
  ],
})
