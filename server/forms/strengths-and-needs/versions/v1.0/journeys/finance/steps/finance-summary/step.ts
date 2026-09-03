import { Condition, Post, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { Step } from '../../constants/step'
import { Section, SectionComplete } from '../../../../constants/section'
import { summaryTab } from './fields'
import { summaryPageTitle } from '../../../../locales'
import { SanAuditEvent, auditPageAction, auditPageView } from '../../../../audit'

export const financeSummaryStep = step({
  path: `/${Step.financeSummary.path}`,
  title: summaryPageTitle(Section.finance),
  blocks: [summaryTab],
  onAccess: [auditPageView(SanAuditEvent.VIEW_SECTION_SUMMARY, Section.finance, Step.financeSummary)],
  onSubmission: [
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress(Section.finance, SectionComplete.yes),
          auditPageAction(SanAuditEvent.MARK_SECTION_COMPLETE, Section.finance, Step.financeSummary),
        ],
        next: [redirect({ goto: Step.financeAnalysis.path })],
      },
    }),
  ],
})
