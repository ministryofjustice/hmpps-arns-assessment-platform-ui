import { access, Answer, Condition, Post, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { SanAuditEvent, StrengthsAndNeedsEffects } from '../../../../../../effects'
import { offenceAnalysisSummaryTab } from './fields'
import { Step } from '../../constants/step'
import { victimsCollection } from '../../constants/collections'
import { isReadOnlyMode } from '../../../../guards'
import { Section } from '../../../../constants/section'
import { auditPageView } from '../../../../audit'
import { summaryPageTitle } from '../../../../locales'
import { Question } from '../../constants/question'
import { Option } from '../../constants/option'

export const offenceAnalysisSummaryStep = step({
  path: `/${Step.offence_analysis_summary.path}`,
  title: summaryPageTitle(Section.offence_analysis),
  blocks: [offenceAnalysisSummaryTab],
  reachability: { entryWhen: isReadOnlyMode },
  onAccess: [
    auditPageView(SanAuditEvent.VIEW_SECTION_SUMMARY, Section.offence_analysis, Step.offence_analysis_summary),
  ],
  onSubmission: [
    submit({
      when: Post('delete').match(Condition.IsRequired()),
      validate: true,
      onValid: {
        effects: [StrengthsAndNeedsEffects.removeItemFromCollection(victimsCollection, Post('delete'))],
        next: [
          redirect({
            when: Answer(Question.offence_analysis_who_was_the_victim).match(
              Condition.Array.Contains(Option.one_or_more_person),
            ),
            goto: Step.offence_analysis_victim_summary.path,
          }),
        ],
      },
    }),
  ],
})
