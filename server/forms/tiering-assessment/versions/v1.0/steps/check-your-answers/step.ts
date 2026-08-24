import { access, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKButton } from '@ministryofjustice/hmpps-forge/govuk-components'
import { TieringAssessmentEffects } from '../../../../effects/TieringAssessmentEffects'
import {
  communitySupervisionHeadingField,
  communitySupervisionSummaryListField,
  currentOffenceAndOffendingHistoryHeadingField,
  currentOffenceAndOffendingHistorySummaryListField,
  currentOffenceHeadingField,
  currentOffenceSummaryListField,
  directSexualHistoryHeadingField,
  directSexualHistorySummaryListField,
  imagesAndIndirectContactSexualHistoryHeadingField,
  imagesAndIndirectContactSexualHistorySummaryListField,
  offenceSinceSupervisionHeadingField,
  offenceSinceSupervisionSummaryListField,
  sexualHistoryHeadingField,
  sexualHistorySummaryListField,
} from './fields'

export const checkYourAnswersStep = step({
  path: '/check-your-answers',
  title: 'Check your answers',
  onAccess: [
    access({
      effects: [TieringAssessmentEffects.LoadAssessmentData(), TieringAssessmentEffects.LoadCaseData()],
    }),
  ],
  blocks: [
    currentOffenceHeadingField,
    currentOffenceSummaryListField,
    currentOffenceAndOffendingHistoryHeadingField,
    currentOffenceAndOffendingHistorySummaryListField,
    sexualHistoryHeadingField,
    sexualHistorySummaryListField,
    directSexualHistoryHeadingField,
    directSexualHistorySummaryListField,
    imagesAndIndirectContactSexualHistoryHeadingField,
    imagesAndIndirectContactSexualHistorySummaryListField,
    communitySupervisionHeadingField,
    communitySupervisionSummaryListField,
    offenceSinceSupervisionHeadingField,
    offenceSinceSupervisionSummaryListField,
    GovUKButton({ text: 'View reoffending predictors scores' }),
  ],
  onSubmission: [
    submit({
      validate: false,
      onAlways: {
        effects: [TieringAssessmentEffects.CalculateRiskActuarialScores()],
        next: [redirect({ goto: 'reoffending-predictor-scores' })],
      },
    }),
  ],
})
