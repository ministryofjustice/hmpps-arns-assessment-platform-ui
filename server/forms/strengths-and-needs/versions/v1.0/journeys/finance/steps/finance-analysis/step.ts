import { step } from '@ministryofjustice/hmpps-forge/core/authoring'
import { employmentStatusAnalysisSummaryTab } from './fields'
import { Step } from '../../constants/step'

export const financeAnalysisStep = step({
  path: '/' + Step.financeAnalysis.path,
  title: 'Finance Analysis', // TODO: contentFor('step.finance-analysis')
  blocks: [employmentStatusAnalysisSummaryTab],
})
