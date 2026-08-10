import { step } from '@ministryofjustice/hmpps-forge/core/authoring'
import { employmentStatusAnalysisSummaryTab } from './fields'
import { Step } from '../../constants/step'
import { analysisPageTitle } from '../../../../locales'
import { Section } from '../../../../constants/section'

export const financeAnalysisStep = step({
  path: `/${Step.financeAnalysis.path}`,
  title: analysisPageTitle(Section.finance),
  blocks: [employmentStatusAnalysisSummaryTab],
})
