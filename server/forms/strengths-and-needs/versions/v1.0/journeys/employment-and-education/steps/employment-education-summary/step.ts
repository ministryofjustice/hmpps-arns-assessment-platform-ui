import { Condition, Post, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { employmentStatusSummaryTab } from './fields'
import { Section, SectionStatus } from '../../../../constants/section'
import { Step } from '../../constants/step'

export const employmentEducationSummaryStep = step({
  path: `/${Step.employment_education_summary.path}`,
  title: 'Employment and Education Summary', // TODO: contentFor('step.employment-education-summary')
  blocks: [employmentStatusSummaryTab],
  onSubmission: [
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress(
            Section.employment_and_education.statusKey,
            SectionStatus.complete,
          ),
        ],
        next: [redirect({ goto: Step.employment_education_analysis.path })],
      },
    }),
  ],
})
