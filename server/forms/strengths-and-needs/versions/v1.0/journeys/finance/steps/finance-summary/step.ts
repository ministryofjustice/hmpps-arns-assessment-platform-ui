import { Condition, Post, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { Step } from '../../constants/step'
import { Section, SectionStatus } from '../../../../constants/section'
import {summaryTab} from "./fields";

export const financeSummaryStep = step({
  path: `/${Step.financeSummary.path}`,
  title: 'Finance Summary', // TODO: contentFor('step.finance_summary')
  blocks: [summaryTab],
  onSubmission: [
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress(Section.finances.statusKey, SectionStatus.complete),
        ],
        next: [redirect({ goto: Step.financeAnalysis.path })],
      },
    }),
  ],
})
