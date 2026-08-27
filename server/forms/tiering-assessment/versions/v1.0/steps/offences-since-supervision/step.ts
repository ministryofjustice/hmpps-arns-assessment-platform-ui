import {
  access,
  Answer,
  Condition,
  Conditional,
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
    'Has %1 committed any offences since %2?',
    CaseData.Forename,
    Conditional({
      when: Answer('date-of-current-supervision-field').match(Condition.Date.IsValid()),
      then: Answer('date-of-current-supervision-field').pipe(Transformer.String.FormatDate({ dateStyle: 'long' })),
      else: 'the date of current supervision',
    }),
  ),
  onAccess: [
    access({
      effects: [TieringAssessmentEffects.LoadAssessmentData(), TieringAssessmentEffects.LoadCaseData()],
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
