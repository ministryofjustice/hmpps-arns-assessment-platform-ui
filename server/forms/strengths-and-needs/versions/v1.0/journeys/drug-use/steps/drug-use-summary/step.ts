import { access, Condition, Post, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { drugsSummaryTab } from './fields'
import { Step } from '../../constants/step'
import { Section, SectionComplete } from '../../../../constants/section'
import { summaryPageTitle } from '../../../../locales'
import { SanAuditEvent, auditPageAction, auditPageView } from '../../../../audit'

export const drugUseSummaryStep = step({
  path: `/${Step.drug_use_summary.path}`,
  title: summaryPageTitle(Section.drug_use),
  onAccess: [
    access({
      effects: [StrengthsAndNeedsEffects.deriveDrugCategories()],
    }),
    auditPageView(SanAuditEvent.VIEW_SECTION_SUMMARY, Section.drug_use, Step.drug_use_summary),
  ],
  blocks: [drugsSummaryTab],
  onSubmission: [
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress(Section.drug_use, SectionComplete.yes),
          auditPageAction(SanAuditEvent.MARK_SECTION_COMPLETE, Section.drug_use, Step.drug_use_summary),
        ],
        next: [redirect({ goto: Step.drug_use_analysis.path })],
      },
    }),
  ],
})
