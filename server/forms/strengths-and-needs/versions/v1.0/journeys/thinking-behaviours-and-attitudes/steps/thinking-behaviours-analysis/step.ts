import { step } from '@ministryofjustice/hmpps-forge/core/authoring'
import { thinkingBehavioursAnalysisSummaryTab } from './fields'
import { Step } from '../../constants/step'
import { contentFor } from '../../locales'

export const thinkingBehavioursAnalysisStep = step({
  path: `/${Step.thinkingBehavioursAnalysis.path}`,
  title: contentFor('step.thinking_behaviours_analysis'),
  blocks: [thinkingBehavioursAnalysisSummaryTab],
})
