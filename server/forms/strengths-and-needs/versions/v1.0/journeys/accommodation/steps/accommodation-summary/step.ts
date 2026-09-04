import { step, submit, redirect, Post, Condition } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { Section, SectionComplete } from '../../../../constants/section'
import { Step } from '../../constants/step'
import { summaryTab } from './fields'
import { summaryPageTitle } from '../../../../locales'
import { SanAuditEvent, auditPageAction, auditPageView } from '../../../../audit'

export const accommodationSummaryStep = step({
  path: `/${Step.accommodation_summary.path}`,
  title: summaryPageTitle(Section.accommodation),
  blocks: [summaryTab],
  onAccess: [auditPageView(SanAuditEvent.VIEW_SECTION_SUMMARY, Section.accommodation, Step.accommodation_summary)],
  onSubmission: [
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress(Section.accommodation, SectionComplete.yes),
          auditPageAction(SanAuditEvent.MARK_SECTION_COMPLETE, Section.accommodation, Step.accommodation_summary),
        ],
        next: [redirect({ goto: `${Step.accommodation_analysis.path}#practitioner-analysis` })],
      },
    }),
  ],
})
