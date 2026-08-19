import { step } from '@ministryofjustice/hmpps-forge/core/authoring'
import { Step } from '../../constants/step'
import { alcoholPractitionerAnalysisSummaryTab } from './fields'
import { analysisPageTitle } from '../../../../locales'
import { Section } from '../../../../constants/section'

export const alcoholUseAnalysisStep = step({
  path: `/${Step.alcohol_use_analysis.path}`,
  title: analysisPageTitle(Section.alcohol_use),
  blocks: [alcoholPractitionerAnalysisSummaryTab],
  reachability: { entryWhen: true },
})
