import { and, Condition, journey, Query } from '@ministryofjustice/hmpps-forge/core/authoring'
import { thinkingBehavioursStep } from './steps/thinking-behaviours/step'
import { thinkingBehavioursSexualHarmStep } from './steps/thinking-behaviours-sexual-harm/step'
import { thinkingBehavioursSummaryStep } from './steps/thinking-behaviours-summary/step'
import { thinkingBehavioursAnalysisStep } from './steps/thinking-behaviours-analysis/step'
import { Section } from '../../constants/section'
import { sectionPageTitle, sectionStatusTag } from '../../locales'
import { thinkingBehavioursRiskOfSexualHarmStep } from './steps/thinking-behaviours-risk-of-sexual-harm/step'
import { isEditMode, redirectToAnalysisIfReadOnly } from '../../guards'
import { Step } from './constants/step'

/**
 * Thinking, Behaviours and Attitudes Journey
 *
 * Flow:
 * thinking-behaviours-attitudes → thinking-behaviours-attitudes-risk-of-sexual-harm
 *   ├── (YES) → thinking-behaviours-attitudes-risk-of-sexual-harm-details → thinking-behaviours-attitudes-summary
 *   └── (NO)  → thinking-behaviours-attitudes-summary
 * thinking-behaviours-attitudes-summary → thinking-behaviours-attitudes-analysis
 */
export const thinkingBehavioursAndAttitudesJourney = journey({
  code: Section.thinking_behaviours_and_attitudes.code,
  path: Section.thinking_behaviours_and_attitudes.path,
  title: sectionPageTitle(Section.thinking_behaviours_and_attitudes),
  reachability: { resumeWhen: and(Query('resume').match(Condition.Equals('true')), isEditMode) },
  onAccess: [
    redirectToAnalysisIfReadOnly(
      Section.thinking_behaviours_and_attitudes.path,
      Step.thinking_behaviours_attitudes_analysis.path,
    ),
  ],
  view: {
    locals: {
      sectionTitle: sectionPageTitle(Section.thinking_behaviours_and_attitudes),
      sectionStatusTag: sectionStatusTag(Section.thinking_behaviours_and_attitudes),
    },
  },
  steps: [
    thinkingBehavioursStep,
    thinkingBehavioursRiskOfSexualHarmStep,
    thinkingBehavioursSexualHarmStep,
    thinkingBehavioursSummaryStep,
    thinkingBehavioursAnalysisStep,
  ],
})
