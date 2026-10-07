import { access, Condition, Post, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { SanAuditEvent, StrengthsAndNeedsEffects } from '../../../../../../effects'
import { offenceAnalysisSummaryTab } from './fields'
import { Step } from '../../constants/step'
import { victimsCollection } from '../../constants/collections'
import { isReadOnlyMode } from '../../../../guards';
import { Section } from '../../../../constants/section';
import { auditPageView } from '../../../../audit';
import { summaryPageTitle } from '../../../../locales';

export const offenceAnalysisSummaryStep = step({
  path: `/${Step.offence_analysis_summary.path}`,
  title: summaryPageTitle(Section.offence_analysis),
  blocks: [offenceAnalysisSummaryTab],
  reachability: { entryWhen: isReadOnlyMode },
  onAccess: [
    auditPageView(SanAuditEvent.VIEW_SECTION_SUMMARY, Section.offence_analysis, Step.offence_analysis_summary),
    access({
      effects: [StrengthsAndNeedsEffects.loadAnswersFromCollection(victimsCollection)],
    }),
  ],
  onSubmission: [
    submit({
      when: Post('delete').match(Condition.IsRequired()),
      validate: true,
      onValid: {
        effects: [StrengthsAndNeedsEffects.removeItemFromCollection(victimsCollection, Post('delete'))],
        next: [redirect({ goto: Step.offence_analysis_victim_summary.path })],
      },
    }),
  ],
})
