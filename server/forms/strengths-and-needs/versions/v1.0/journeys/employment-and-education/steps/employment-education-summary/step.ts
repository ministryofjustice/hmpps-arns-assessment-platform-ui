import { Condition, Post, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { summaryTab } from './fields'
import { Section, SectionComplete } from '../../../../constants/section'
import { Step } from '../../constants/step'
import { summaryPageTitle } from '../../../../locales'

export const employmentEducationSummaryStep = step({
  path: `/${Step.employment_education_summary.path}`,
  title: summaryPageTitle(Section.employment_and_education),
  blocks: [summaryTab],
  onSubmission: [
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress(Section.employment_and_education, SectionComplete.yes),
        ],
        next: [redirect({ goto: `${Step.employment_education_analysis.path}#practitioner-analysis` })],
      },
    }),
  ],
})
