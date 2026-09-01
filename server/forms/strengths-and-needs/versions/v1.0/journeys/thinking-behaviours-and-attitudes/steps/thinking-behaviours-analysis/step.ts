import { step } from '@ministryofjustice/hmpps-forge/core/authoring'
import { thinkingBehavioursAnalysisSummaryTab } from './fields'
import { Step } from '../../constants/step'
import { analysisPageTitle } from '../../../../locales'
import { Section } from '../../../../constants/section'
import { isReadOnlyMode } from '../../../../guards'

export const thinkingBehavioursAnalysisStep = step({
  path: `/${Step.thinkingBehavioursAnalysis.path}`,
  title: analysisPageTitle(Section.thinking_behaviours_and_attitudes),
  blocks: [thinkingBehavioursAnalysisSummaryTab],
  reachability: { entryWhen: isReadOnlyMode },
})
