import { access, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { TieringAssessmentEffects } from '../../../../effects/TieringAssessmentEffects'
import { personalRelationshipsFields } from './fields'
import { continueButton } from '../../common'
import { Step } from '../../constants/page'
import { stepTitle } from '../../locales'

export const personalRelationshipsAndCommunityStep = step({
  path: `/${Step.personal_relationships_and_community.path}`,
  title: stepTitle(Step.personal_relationships_and_community),
  onAccess: [
    access({
      effects: [TieringAssessmentEffects.LoadAssessmentData(), TieringAssessmentEffects.LoadCaseData()],
    }),
  ],
  blocks: [
    personalRelationshipsFields.questions.importantRelationshipsQuestion.displayModes.field,
    personalRelationshipsFields.questions.relationshipSatisfactionQuestion.displayModes.field,
    continueButton,
  ],
  onSubmission: [
    submit({
      validate: true,
      onValid: {
        effects: [
          TieringAssessmentEffects.CleardownAssessmentData(),
          TieringAssessmentEffects.CalculateRiskActuarialScores(),
          TieringAssessmentEffects.SaveAssessmentData(),
        ],
        next: [redirect({ goto: Step.thinking_attitudes_and_behaviours.path })],
      },
    }),
  ],
})
