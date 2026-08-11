import { step, submit, redirect, Post, Condition } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { Section, SectionComplete } from '../../../../constants/section'
import { Step } from '../../constants/step'
import { accommodationSummaryTab } from './fields'
import { summaryPageTitle } from '../../../../locales'

export const accommodationSummaryStep = step({
  path: `/${Step.accommodation_summary.path}`,
  title: summaryPageTitle(Section.accommodation),
  blocks: [accommodationSummaryTab],
  onSubmission: [
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress(Section.accommodation.statusKey, SectionComplete.yes),
        ],
        next: [redirect({ goto: Step.accommodation_analysis.path })],
      },
    }),
  ],
})
