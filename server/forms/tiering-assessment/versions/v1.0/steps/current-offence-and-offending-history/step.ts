import { access, and, Answer, Condition, Format, not, or, Query, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
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
import { checkYourAnswersQuery, continueButton, returnToAnswersQueryText } from '../../common'

const hasSexualOffenceHistory = Answer('has-ever-committed-sexual-offence').match(Condition.Equals('true'))
const hasSexualOffencesFieldsPopulated = Answer('current-offence-sexually-motivated').match(Condition.IsRequired())

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
          redirect({
            when: and(checkYourAnswersQuery, hasSexualOffenceHistory, not(hasSexualOffencesFieldsPopulated)),
            goto: Format('sexual-offending%1', returnToAnswersQueryText),
          }),
          redirect({
            when: checkYourAnswersQuery,
            goto: 'check-your-answers',
          }),
          redirect({
            when: hasSexualOffenceHistory,
            goto: 'sexual-offending',
          }),
          redirect({ goto: 'date-of-current-supervision' }),
        ]
      },
    }),
  ],
})
