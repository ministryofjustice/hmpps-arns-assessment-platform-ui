import { Condition, Post, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { Section, SectionComplete } from '../../../../constants/section'
import { Step } from '../../constants/step'
import { summaryTab } from './fields'
import { summaryPageTitle } from '../../../../locales'

export const alcoholUseSummaryStep = step({
  path: `/${Step.alcohol_use_summary.path}`,
  title: summaryPageTitle(Section.alcohol_use),
  blocks: [summaryTab],
  onSubmission: [
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress(Section.alcohol_use, SectionComplete.yes),
        ],
        next: [redirect({ goto: `${Step.alcohol_use_analysis.path}#practitioner-analysis` })],
      },
    }),
  ],
})
