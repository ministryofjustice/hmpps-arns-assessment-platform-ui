import { Condition, Data, journey, Query } from '@ministryofjustice/hmpps-forge/core/authoring'
import { thinkingBehavioursStep } from './steps/thinking-behaviours/step'
import { thinkingBehavioursSexualHarmStep } from './steps/thinking-behaviours-sexual-harm/step'
import { thinkingBehavioursSummaryStep } from './steps/thinking-behaviours-summary/step'
import { thinkingBehavioursAnalysisStep } from './steps/thinking-behaviours-analysis/step'
import { Section } from '../../constants/section'
import { commonContentFor } from '../../locales'

/**
 * Thinking, Behaviours and Attitudes Journey
 *
 * Flow:
 * thinking-behaviours → (branching based on risk of sexual harm)
 *   ├── thinking-behaviours            → thinking-behaviours-sexual-harm  (if YES)
 *   ├── thinking-behaviours            → thinking-behaviours-summary     (if NO)
 *   ├── thinking-behaviours-sexual-harm → thinking-behaviours-summary
 *   ├── thinking-behaviours-summary    → thinking-behaviours-analysis
 *   ├── thinking-behaviours-analysis   →
 */
export const thinkingBehavioursAndAttitudesJourney = journey({
  code: Section.thinking_behaviours_and_attitudes.code,
  path: Section.thinking_behaviours_and_attitudes.path,
  title: 'Thinking, behaviours and attitudes', // TODO: commonContentFor('sectionTitle.thinking-behaviours-and-attitudes')
  reachability: { resumeWhen: Query('resume').match(Condition.Equals('true')) },
  view: {
    locals: {
      sectionTitle: commonContentFor('sectionTitle.thinking-behaviours-and-attitudes'),
      sectionStatus: Data(Section.thinking_behaviours_and_attitudes.statusKey),
    },
  },
  steps: [
    thinkingBehavioursStep,
    thinkingBehavioursSexualHarmStep,
    thinkingBehavioursSummaryStep,
    thinkingBehavioursAnalysisStep,
  ],
})
