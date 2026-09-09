import { access, Answer, Condition, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { continueButton } from '../../common'
import { TieringAssessmentEffects } from '../../../../effects/TieringAssessmentEffects'
import { stepTitle } from '../../locales'
import { Step } from '../../constants/page'
import {
  currentOffenceAndOffendingHistoryFields,
  currentOffenceHeadingQuestion,
  currentOffenceInsetQuestion,
  currentOffenceSummaryListQuestion,
  currentOffenceWarningQuestion,
  historyInsetQuestion,
  offenceHistoryHeadingQuestion,
  sectionBreakQuestion,
} from './fields'

const hasSexualOffenceHistory = Answer('has_ever_committed_sexual_offence').match(Condition.Equals('YES'))

export const currentOffenceAndOffendingHistoryStep = step({
  path: `/${Step.current_offence_and_offending_history.path}`,
  title: stepTitle(Step.current_offence_and_offending_history),
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
    currentOffenceHeadingQuestion,
    currentOffenceInsetQuestion,
    currentOffenceSummaryListQuestion,
    currentOffenceWarningQuestion,
    sectionBreakQuestion,
    offenceHistoryHeadingQuestion,
    historyInsetQuestion,
    currentOffenceAndOffendingHistoryFields.questions.dateAtFirstSanctionQuestion.displayModes.field,
    currentOffenceAndOffendingHistoryFields.questions.totalSanctionsQuestion.displayModes.field,
    currentOffenceAndOffendingHistoryFields.questions.totalViolentSanctionsQuestion.displayModes.field,
    currentOffenceAndOffendingHistoryFields.questions.sexualOffenceHistoryQuestion.displayModes.field,
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
        next: [
          redirect({
            when: hasSexualOffenceHistory,
            goto: Step.sexual_offending.path,
          }),
          redirect({ goto: Step.date_of_current_supervision.path }),
        ],
      },
    }),
  ],
})
