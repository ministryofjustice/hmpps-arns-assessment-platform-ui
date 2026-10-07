import { Condition, Post, redirect, step, submit, validation } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { Section, SectionComplete } from '../../../../constants/section'
import { Step } from '../../constants/step'
import { summaryTab } from './fields'
import { summaryPageTitle } from '../../../../locales'
import { auditPageAction, auditPageView, SanAuditEvent } from '../../../../audit'
import { autosaveSubmit } from '../../../../autosave'
import { isUserSubmittedCondition } from '../../../../constants/userSubmitted'

export const accommodationSummaryStep = step({
  path: `/${Step.accommodation_summary.path}`,
  title: summaryPageTitle(Section.accommodation),
  blocks: [summaryTab],
  onAccess: [auditPageView(SanAuditEvent.VIEW_SECTION_SUMMARY, Section.accommodation, Step.accommodation_summary)],
  validWhen: [
    validation({
      condition: isUserSubmittedCondition(Step.accommodation_summary.code),
      message: 'This step is not user submitted',
    }),
  ],
  onSubmission: [
    autosaveSubmit(Step.accommodation_summary.code),
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onAlways: {
        effects: [StrengthsAndNeedsEffects.setUserSubmitted(Step.accommodation_summary.code)],
      },
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveAndClearStaleAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress(Section.accommodation, SectionComplete.yes),
          auditPageAction(SanAuditEvent.MARK_SECTION_COMPLETE, Section.accommodation, Step.accommodation_summary),
        ],
        next: [redirect({ goto: `${Step.accommodation_analysis.path}#practitioner-analysis` })],
      },
    }),
  ],
})
