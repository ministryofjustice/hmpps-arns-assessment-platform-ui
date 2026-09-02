import { access, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { continueButton } from '../../common'
import { TieringAssessmentEffects } from '../../../../effects/TieringAssessmentEffects'
import { accommodationFields } from './fields'
import { sectionPageTitle } from '../../locales'
import { Step } from '../../constants/page'
import { Field } from './constants/field'

export const accommodationStep = step({
  path: `/${Step.accommodation.path}`,
  title: sectionPageTitle(Step.accommodation),
  onAccess: [
    access({
      effects: [TieringAssessmentEffects.LoadAssessmentData(), TieringAssessmentEffects.LoadCaseData()],
    }),
  ],
  blocks: [
    accommodationFields.questions.whoAreTheyLivingWithQuestion.displayModes.field,
    accommodationFields.questions.suitabilityOfAccommodationQuestion.displayModes.field,
    continueButton,
  ],
  onSubmission: [
    submit({
      validate: true,
      onValid: {
        effects: [
          TieringAssessmentEffects.CalculateRiskActuarialScores(),
          TieringAssessmentEffects.SaveAssessmentData(),
        ],
        next: [redirect({ goto: 'employment' })],
      },
    }),
  ],
})
