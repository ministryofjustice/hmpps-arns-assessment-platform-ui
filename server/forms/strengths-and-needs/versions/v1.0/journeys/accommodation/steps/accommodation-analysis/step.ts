import { step } from '@ministryofjustice/hmpps-forge/core/authoring'

export const accommodationAnalysisStep = step({
  path: '/accommodation-analysis',
  title: 'Accommodation analysis',
  // TODO: Add template for read-only analysis display
  // view: { template: 'strengths-and-needs/views/analysis-complete' },
  blocks: [],
})
