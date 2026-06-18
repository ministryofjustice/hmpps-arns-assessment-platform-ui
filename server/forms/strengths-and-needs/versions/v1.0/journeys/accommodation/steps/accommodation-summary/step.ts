import { step, submit, redirect, Post, Condition } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { Section, SectionStatus } from '../../../../constants/section'
import { Step } from '../../constants/step'
import { locale } from '../../constants/locale'
import { accommodationSummaryTab } from './fields';

export const accommodationSummaryStep = step({
  path: '/' + Step.accommodation_summary.path,
  title: locale.step[Step.accommodation_summary.code],
  blocks: [accommodationSummaryTab],
  onSubmission: [
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress(
            Section.accommodation.statusKey,
            SectionStatus.complete,
          ),
        ],
        next: [redirect({ goto: Step.accommodation_analysis.path })],
      },
    }),
  ],
})
