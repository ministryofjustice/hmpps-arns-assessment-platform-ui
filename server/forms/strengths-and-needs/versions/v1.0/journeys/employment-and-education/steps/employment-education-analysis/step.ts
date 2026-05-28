import {step} from '@ministryofjustice/hmpps-forge/core/authoring'
import {employmentStatusAnalysisSummaryTab} from './fields'

export const employmentEducationAnalysisStep = step({
  path: '/employment-education-analysis',
  title: 'Employment and Education Analysis',
  blocks: [employmentStatusAnalysisSummaryTab],
})
