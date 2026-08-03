import { step } from '@ministryofjustice/hmpps-forge/core/authoring'
import { Step } from '../../constants/step'
import { alcoholPractitionerAnalysisSummaryTab } from './fields'
import { contentFor } from '../../locales'

export const alcoholUseAnalysisStep = step({
  path: `/${Step.alcohol_use_analysis.path}`,
  title: contentFor('step.alcohol_use_analysis'),
  blocks: [alcoholPractitionerAnalysisSummaryTab],
})
