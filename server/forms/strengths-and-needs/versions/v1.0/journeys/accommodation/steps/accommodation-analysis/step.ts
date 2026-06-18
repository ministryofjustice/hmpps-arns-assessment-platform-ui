import { step } from '@ministryofjustice/hmpps-forge/core/authoring'
import { Step } from '../../constants/step'
import { locale } from '../../constants/locale'
import { accommodationPractitionerAnalysisSummaryTab } from './fields'

export const accommodationAnalysisStep = step({
  path: '/' + Step.accommodation_analysis.path,
  title: locale.step[Step.accommodation_analysis.code],
  blocks: [accommodationPractitionerAnalysisSummaryTab],
})
