import { step } from '@ministryofjustice/hmpps-forge/core/authoring'
import { thinkingBehavioursAnalysisSummaryTab } from './fields'
import { Step } from '../../constants/step'

export const thinkingBehavioursAnalysisStep = step({
  path: `/${Step.thinkingBehavioursAnalysis.path}`,
  title: 'Thinking, behaviours and attitudes Analysis', // TODO: contentFor('step.thinking_behaviours_analysis')
  blocks: [thinkingBehavioursAnalysisSummaryTab],
})
