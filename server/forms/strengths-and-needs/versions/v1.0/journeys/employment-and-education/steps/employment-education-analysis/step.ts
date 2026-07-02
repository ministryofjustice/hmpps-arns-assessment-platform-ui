import { step } from '@ministryofjustice/hmpps-forge/core/authoring'
import { employmentStatusAnalysisSummaryTab } from './fields'
import { Step } from '../../constants/step'

export const employmentEducationAnalysisStep = step({
  path: `/${Step.employment_education_analysis.path}`,
  title: 'Employment and Education Analysis', // TODO: contentFor('step.employment_education_analysis')
  blocks: [employmentStatusAnalysisSummaryTab],
})
