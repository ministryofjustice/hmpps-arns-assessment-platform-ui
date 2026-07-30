import { access, Answer, Condition, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKButton } from '@ministryofjustice/hmpps-forge/govuk-components'
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
    GovUKButton({ text: 'Save and continue' }),
  ],
  onSubmission: [
    submit({
      validate: true,
      onValid: {
        effects: [TieringAssessmentEffects.SaveAssessmentData()],
        next: [
          redirect({
            when: Answer('has-ever-commited-sexual-offence').match(Condition.Equals('true')),
            goto: 'sexual-offending',
          }),
          redirect({ goto: 'date-of-current-supervision' }),
        ],
      },
    }),
  ],
})
