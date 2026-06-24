import { Condition, Data, journey, Query } from '@ministryofjustice/hmpps-forge/core/authoring'
import { financeStep } from './steps/finance/step'
import { financeSummaryStep } from './steps/finance-summary/step'
import { financeAnalysisStep } from './steps/finance-analysis/step'
import { Section } from '../../constants/section'
import { commonContentFor } from '../../locales'

/**
 * Finance Journey
 *
 * Flow:
 * finance → (branching based on type)
 *   ├── finance            → finance
 *   ├── finance-summary    → finance-analysis
 *   ├── finance-analysis   →
 */
export const financeJourney = journey({
  code: Section.finance.code,
  path: Section.finance.path,
  title: 'Finance', // TODO: commonContentFor('sectionTitle.finance')
  reachability: { resumeWhen: Query('resume').match(Condition.Equals('true')) },
  view: {
    locals: {
      sectionTitle: commonContentFor('sectionTitle.finance'),
      sectionStatus: Data(Section.finance.statusKey),
    },
  },
  steps: [financeStep, financeSummaryStep, financeAnalysisStep],
})
