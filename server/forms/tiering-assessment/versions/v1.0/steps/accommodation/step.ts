import { access, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { continueButton } from '../../common'
import { TieringAssessmentEffects } from '../../../../effects/TieringAssessmentEffects'
import { accommodationSection } from './section'
import { sectionPageTitle } from '../../locales'
import { Section } from '../../constants/section'
import { Step } from './constants/step'
import { sectionPath } from '../../constants/path'

export const accommodationStep = step({
  path: `/${Step.accommodation.path}`,
  title: sectionPageTitle(Section.accommodation),
  view: {
    locals: {
      backlink: sectionPath(Section.accommodation),
    },
  },
  onAccess: [
    access({
      effects: [TieringAssessmentEffects.LoadAssessmentData(), TieringAssessmentEffects.LoadCaseData()],
    }),
  ],
  blocks: [
    accommodationSection.questions.whoAreTheyLivingWithQuestion.displayModes.field,
    accommodationSection.questions.suitabilityOfAccommodationQuestion.displayModes.field,
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
