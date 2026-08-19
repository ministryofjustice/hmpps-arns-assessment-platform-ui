import { step } from '@ministryofjustice/hmpps-forge/core/authoring'
import { healthWellbeingAnalysisSummaryTab } from './fields'
import { Step } from '../../constants/step'
import { analysisPageTitle } from '../../../../locales'
import { Section } from '../../../../constants/section'

export const healthWellbeingAnalysisStep = step({
  path: `/${Step.health_wellbeing_analysis.path}`,
  title: analysisPageTitle(Section.health_and_wellbeing),
  blocks: [healthWellbeingAnalysisSummaryTab],
  reachability: { entryWhen: true },
})
