import { access, and, Answer, Condition, Format, not, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { checkYourAnswersQuery, continueButton, returnToAnswersQueryText } from '../../common'
import { TieringAssessmentEffects } from '../../../../effects/TieringAssessmentEffects'
import { sectionPageTitle } from '../../locales'
import { Section } from '../../constants/section'
import { Step } from './constants/step'
import { currentOffenceAndOffendingHistorySection } from './section'

const hasSexualOffenceHistory = Answer('has-ever-committed-sexual-offence').match(Condition.Equals('true'))

export const currentOffenceAndOffendingHistoryStep = step({
  path: `/${Step.current_offence_and_offending_history.path}`,
  title: sectionPageTitle(Section.current_offence_and_offending_history),
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
    // currentOffenceAndOffendingHistorySection.questions.currentOffenceHeadingQuestion.displayModes.field,
    // currentOffenceAndOffendingHistorySection.questions.currentOffenceInsetQuestion.displayModes.field,
    // currentOffenceAndOffendingHistorySection.questions.currentOffenceSummaryListQuestion.displayModes.field,
    // currentOffenceAndOffendingHistorySection.questions.currentOffenceWarningQuestion.displayModes.field,
    // currentOffenceAndOffendingHistorySection.questions.sectionBreakQuestion.displayModes.field,
    // currentOffenceAndOffendingHistorySection.questions.offenceHistoryHeadingQuestion.displayModes.field,
    // currentOffenceAndOffendingHistorySection.questions.historyInsetQuestion.displayModes.field,
    // currentOffenceAndOffendingHistorySection.questions.dateAtFirstSanction.displayModes.field,
    currentOffenceAndOffendingHistorySection.questions.totalSanctionsQuestion.displayModes.field,
    currentOffenceAndOffendingHistorySection.questions.totalViolentSanctionsQuestion.displayModes.field,
    currentOffenceAndOffendingHistorySection.questions.sexualOffenceHistoryQuestion.displayModes.field,
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
