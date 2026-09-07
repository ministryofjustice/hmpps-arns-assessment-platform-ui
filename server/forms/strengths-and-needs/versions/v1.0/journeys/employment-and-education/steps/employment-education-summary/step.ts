import { Condition, Post, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { summaryTab } from './fields'
import { Section, SectionComplete } from '../../../../constants/section'
import { Step } from '../../constants/step'
import { summaryPageTitle } from '../../../../locales'
import { SanAuditEvent, auditPageAction, auditPageView } from '../../../../audit'

export const employmentEducationSummaryStep = step({
  path: `/${Step.employment_education_summary.path}`,
  title: summaryPageTitle(Section.employment_and_education),
  blocks: [summaryTab],
  onAccess: [
    auditPageView(
      SanAuditEvent.VIEW_SECTION_SUMMARY,
      Section.employment_and_education,
      Step.employment_education_summary,
    ),
  ],
  onSubmission: [
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress(Section.employment_and_education, SectionComplete.yes),
          auditPageAction(
            SanAuditEvent.MARK_SECTION_COMPLETE,
            Section.employment_and_education,
            Step.employment_education_summary,
          ),
        ],
        next: [redirect({ goto: `${Step.employment_education_analysis.path}#practitioner-analysis` })],
      },
    }),
  ],
})
