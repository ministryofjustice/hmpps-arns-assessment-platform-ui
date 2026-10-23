import { and, Condition, journey, Query } from '@ministryofjustice/hmpps-forge/core/authoring'
import { thinkingBehavioursAttitudesStep } from './steps/thinking-behaviours-attitudes/step'
import { thinkingBehavioursAttitudesRiskOfSexualHarmDetailsStep } from './steps/thinking-behaviours-attitudes-risk-of-sexual-harm-details/step'
import { thinkingBehavioursAttitudesSummaryStep } from './steps/thinking-behaviours-attitudes-summary/step'
import { thinkingBehavioursAttitudesAnalysisStep } from './steps/thinking-behaviours-attitudes-analysis/step'
import { Section } from '../../constants/section'
import { sectionPageTitle, sectionStatusTag } from '../../locales'
import { thinkingBehavioursAttitudesRiskOfSexualHarmStep } from './steps/thinking-behaviours-attitudes-risk-of-sexual-harm/step'
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
    thinkingBehavioursAttitudesStep,
    thinkingBehavioursAttitudesRiskOfSexualHarmStep,
    thinkingBehavioursAttitudesRiskOfSexualHarmDetailsStep,
    thinkingBehavioursAttitudesSummaryStep,
    thinkingBehavioursAttitudesAnalysisStep,
  ],
})
