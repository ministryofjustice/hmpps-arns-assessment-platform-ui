import { Condition, journey, Query } from '@ministryofjustice/hmpps-forge/core/authoring'
import { thinkingBehavioursStep } from './steps/thinking-behaviours/step'
import { thinkingBehavioursSexualHarmStep } from './steps/thinking-behaviours-sexual-harm/step'
import { thinkingBehavioursSummaryStep } from './steps/thinking-behaviours-summary/step'
import { thinkingBehavioursAnalysisStep } from './steps/thinking-behaviours-analysis/step'
import { Section } from '../../constants/section'
import { sectionPageTitle, sectionStatusTag } from '../../locales'
import { thinkingBehavioursRiskOfSexualHarmStep } from './steps/thinking-behaviours-risk-of-sexual-harm/step'

/**
 * Thinking, Behaviours and Attitudes Journey
 *
 * Flow:
 * thinking-behaviours → (branching based on risk of sexual harm)
 *   ├── thinking-behaviours                       → thinking-behaviours-risk-of-sexual-harm
 *   ├── thinking-behaviours-risk-of-sexual-harm   → thinking-behaviours-sexual-harm  (if YES)
 *   ├── thinking-behaviours-risk-of-sexual-harm   → thinking-behaviours-summary      (if NO)
 *   ├── thinking-behaviours-sexual-harm           → thinking-behaviours-summary
 *   ├── thinking-behaviours-summary               → thinking-behaviours-analysis
 *   ├── thinking-behaviours-analysis
 */
export const thinkingBehavioursAndAttitudesJourney = journey({
  code: Section.thinking_behaviours_and_attitudes.code,
  path: Section.thinking_behaviours_and_attitudes.path,
  title: sectionPageTitle(Section.thinking_behaviours_and_attitudes),
  reachability: { resumeWhen: Query('resume').match(Condition.Equals('true')) },
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
