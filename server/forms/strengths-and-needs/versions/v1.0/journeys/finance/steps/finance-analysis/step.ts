import { step } from '@ministryofjustice/hmpps-forge/core/authoring'
import { financePractitionerAnalysisSummaryTab } from './fields'
import { Step } from '../../constants/step'
import { analysisPageTitle } from '../../../../locales'
import { Section } from '../../../../constants/section'
import { isReadOnlyMode } from '../../../../guards'

export const financeAnalysisStep = step({
  path: `/${Step.financeAnalysis.path}`,
  title: analysisPageTitle(Section.finance),
  blocks: [financePractitionerAnalysisSummaryTab],
  reachability: { entryWhen: isReadOnlyMode },
})
