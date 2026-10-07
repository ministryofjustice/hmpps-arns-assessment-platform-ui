import { Condition, Post, redirect, step, submit, validation } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { healthWellbeingSummaryTab } from './fields'
import { Step } from '../../constants/step'
import { summaryPageTitle } from '../../../../locales'
import { Section, SectionComplete } from '../../../../constants/section'
import { auditPageAction, auditPageView, SanAuditEvent } from '../../../../audit'
import { autosaveSubmit } from '../../../../autosave'
import { isUserSubmittedCondition } from '../../../../constants/userSubmitted'

export const healthWellbeingSummaryStep = step({
  path: `/${Step.health_wellbeing_summary.path}`,
  title: summaryPageTitle(Section.health_and_wellbeing),
  blocks: [healthWellbeingSummaryTab],
  onAccess: [
    auditPageView(SanAuditEvent.VIEW_SECTION_SUMMARY, Section.health_and_wellbeing, Step.health_wellbeing_summary),
  ],
  validWhen: [
    validation({
      condition: isUserSubmittedCondition(Step.health_wellbeing_summary.code),
      message: 'This step is not user submitted',
    }),
  ],
  onSubmission: [
    autosaveSubmit(Step.health_wellbeing_summary.code),
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onAlways: {
        effects: [StrengthsAndNeedsEffects.setUserSubmitted(Step.health_wellbeing_summary.code)],
      },
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveAndClearStaleAnswers(),
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
