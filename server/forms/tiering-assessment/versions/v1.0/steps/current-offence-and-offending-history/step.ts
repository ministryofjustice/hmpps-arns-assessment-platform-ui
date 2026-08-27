import {
  access,
  and,
  not,
  Answer,
  Condition,
  Format,
  redirect,
  step,
  submit,
} from '@ministryofjustice/hmpps-forge/core/authoring'
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

export const currentOffenceAndOffendingHistoryStep = step({
  path: '/current-offence-and-offending-history',
  title: 'Current offence and offending history',
  onAccess: [
    access({
      effects: [
        TieringAssessmentEffects.LoadAssessmentData(),
        TieringAssessmentEffects.LoadOffenceCodeDetails(),
        TieringAssessmentEffects.LoadCaseData(),
      ],
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
            when: and(
              checkYourAnswersQuery,
              hasSexualOffenceHistory,
              not(Answer('current-offence-sexually-motivated').match(Condition.IsRequired())),
            ),
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
        ],
      },
    }),
  ],
})
