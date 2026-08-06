import {
  access,
  Answer,
  Format,
  redirect,
  step,
  submit,
  Transformer,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import { offenceHistoryField } from './fields'
import { TieringAssessmentEffects } from '../../../../effects/TieringAssessmentEffects'
import { CaseData } from '../../../../../sentence-plan/versions/v1.0/constants'
import { continueButton, redirectToCheckYourAnswers } from '../../common'

export const offencesSinceSupervisionStep = step({
  path: '/offences-since-supervision',
  title: Format(
    'Has %1 commited any offences since %2?',
    CaseData.Forename,
    Answer('date-of-current-supervision').pipe(Transformer.String.FormatDate({ dateStyle: 'long' })),
  ),
  onAccess: [
    access({
      effects: [TieringAssessmentEffects.LoadAssessmentData()],
    }),
  ],
  blocks: [offenceHistoryField, continueButton],
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
