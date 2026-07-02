import { step } from '@ministryofjustice/hmpps-forge/core/authoring'
import { Step } from '../../constants/step'
import { accommodationPractitionerAnalysisSummaryTab } from './fields'

export const accommodationAnalysisStep = step({
  path: `/${Step.accommodation_analysis.path}`,
  title: 'Accommodation analysis', // TODO: contentFor('step.accommodation_analysis')
  blocks: [accommodationPractitionerAnalysisSummaryTab],
})
