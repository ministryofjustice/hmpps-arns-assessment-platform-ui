import { Condition, Post, redirect, step, submit, validation } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { summaryTab } from './fields'
import { Section, SectionComplete } from '../../../../constants/section'
import { Step } from '../../constants/step'
import { summaryPageTitle } from '../../../../locales'
import { auditPageAction, auditPageView, SanAuditEvent } from '../../../../audit'
import { autosaveSubmit } from '../../../../autosave'
import { isUserSubmittedCondition } from '../../../../constants/userSubmitted'

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
  validWhen: [
    validation({
      condition: isUserSubmittedCondition(Step.employment_education_summary.code),
      message: 'This step is not user submitted',
    }),
  ],
  onSubmission: [
    autosaveSubmit(Step.employment_education_summary.code, Section.employment_and_education),
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onAlways: {
        effects: [StrengthsAndNeedsEffects.setUserSubmitted(Step.employment_education_summary.code)],
      },
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveAndClearStaleAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress(Section.employment_and_education, SectionComplete.yes),
          StrengthsAndNeedsEffects.setUserSubmitted(Step.employment_education_summary.code),
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
