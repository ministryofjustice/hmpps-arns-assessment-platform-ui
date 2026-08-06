import { access, Format, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { TieringAssessmentEffects } from '../../../../effects/TieringAssessmentEffects'
import { CaseData } from '../../../../../sentence-plan/versions/v1.0/constants'
import { dateOfCurrentSupervisionField } from './fields'
import { continueButton, redirectToCheckYourAnswers } from '../../common'

export const dateOfCurrentSupervisionStep = step({
  path: '/date-of-current-supervision',
  title: Format('What date did %1 current supervision in the community begin?', CaseData.ForenamePossessive),
  onAccess: [
    access({
      effects: [TieringAssessmentEffects.LoadAssessmentData()],
    }),
  ],
  blocks: [dateOfCurrentSupervisionField, continueButton],
  onSubmission: [
    submit({
      validate: true,
      onValid: {
        effects: [
          TieringAssessmentEffects.CalculateRiskActuarialScores(),
          TieringAssessmentEffects.SaveAssessmentData(),
        ],
        next: [redirectToCheckYourAnswers, redirect({ goto: 'offences-since-supervision' })],
      },
    }),
  ],
})
