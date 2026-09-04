import { Condition, Post, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { healthWellbeingSummaryTab } from './fields'
import { Step } from '../../constants/step'
import { summaryPageTitle } from '../../../../locales'
import { Section, SectionComplete } from '../../../../constants/section'
import { SanAuditEvent, auditPageAction, auditPageView } from '../../../../audit'

export const healthWellbeingSummaryStep = step({
  path: `/${Step.health_wellbeing_summary.path}`,
  title: summaryPageTitle(Section.health_and_wellbeing),
  blocks: [healthWellbeingSummaryTab],
  onAccess: [
    auditPageView(SanAuditEvent.VIEW_SECTION_SUMMARY, Section.health_and_wellbeing, Step.health_wellbeing_summary),
  ],
  onSubmission: [
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress(Section.health_and_wellbeing, SectionComplete.yes),
          auditPageAction(
            SanAuditEvent.MARK_SECTION_COMPLETE,
            Section.health_and_wellbeing,
            Step.health_wellbeing_summary,
          ),
        ],
        next: [redirect({ goto: `${Step.health_wellbeing_analysis.path}#practitioner-analysis` })],
      },
    }),
  ],
})
