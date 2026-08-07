import { step } from '@ministryofjustice/hmpps-forge/core/authoring'
import { Step } from '../../constants/step'
import { accommodationPractitionerAnalysisSummaryTab } from './fields'
import { analysisPageTitle } from '../../../../locales'
import { Section } from '../../../../constants/section'

export const accommodationAnalysisStep = step({
  path: `/${Step.accommodation_analysis.path}`,
  title: analysisPageTitle(Section.accommodation),
  blocks: [accommodationPractitionerAnalysisSummaryTab],
})
