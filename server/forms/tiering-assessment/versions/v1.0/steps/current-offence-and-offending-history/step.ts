import { access, Answer, Condition, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import {
  currentOffenceHeadingField,
  currentOffenceInsetField,
  currentOffenceSummaryListField,
  currentOffenceWarningField,
  dateAtFirstSanction,
  historyInsetField,
  offenceHistoryHeadingField,
  sectionBreakField,
  sexualOffenceHistoryField,
  totalSanctionsField,
  totalViolentSanctionsField,
} from './fields'
import { TieringAssessmentEffects } from '../../../../effects/TieringAssessmentEffects'
import { continueButton, redirectToCheckYourAnswers } from '../../common'

export const currentOffenceAndOffendingHistoryStep = step({
  path: '/current-offence-and-offending-history',
  title: 'Current offence and offending history',
  onAccess: [
    access({
      effects: [TieringAssessmentEffects.LoadAssessmentData(), TieringAssessmentEffects.LoadOffenceCodeDetails()],
    }),
  ],
  blocks: [
    currentOffenceHeadingField,
    currentOffenceInsetField,
    currentOffenceSummaryListField,
    currentOffenceWarningField,
    sectionBreakField,
    offenceHistoryHeadingField,
    historyInsetField,
    dateAtFirstSanction,
    totalSanctionsField,
    totalViolentSanctionsField,
    sexualOffenceHistoryField,
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
        next: [
          redirectToCheckYourAnswers,
          redirect({
            when: Answer('has-ever-committed-sexual-offence').match(Condition.Equals('true')),
            goto: 'sexual-offending',
          }),
          redirect({ goto: 'date-of-current-supervision' }),
        ],
      },
    }),
  ],
})
