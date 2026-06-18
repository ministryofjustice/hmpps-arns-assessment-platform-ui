import { step } from '@ministryofjustice/hmpps-forge/core/authoring'
import { employmentStatusAnalysisSummaryTab } from './fields'

export const financeAnalysisStep = step({
  path: '/finance-analysis',
  title: 'Finance Analysis',
  blocks: [employmentStatusAnalysisSummaryTab],
})
