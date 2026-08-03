import { Condition, Post, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { Section, SectionStatus } from '../../../../constants/section'
import { Step } from '../../constants/step'
import { alcoholSummaryTab } from './fields'
import { summaryPageTitle } from '../../../../locales'

export const alcoholUseSummaryStep = step({
  path: `/${Step.alcohol_use_summary.path}`,
  title: summaryPageTitle(Section.alcohol_use),
  blocks: [alcoholSummaryTab],
  onSubmission: [
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress(Section.alcohol_use.statusKey, SectionStatus.complete),
        ],
        next: [redirect({ goto: `${Step.alcohol_use_analysis.path}#practitioner-analysis-summary` })],
      },
    }),
  ],
})
