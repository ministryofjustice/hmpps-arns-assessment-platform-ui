// import { Condition, Data, journey, Query } from '@ministryofjustice/hmpps-forge/core/authoring'
// import { financeStep } from './steps/finance/step'
// import { financeSummaryStep } from './steps/finance-summary/step'
// import { financeAnalysisStep } from './steps/finance-analysis/step'
//
// /**
//  * Finance Journey
//  *
//  * Flow:
//  * finance → (branching based on type)
//  *   ├── finance            → finance
//  *   ├── finance-summary    → finance-analysis
//  *   ├── finance-analysis   →
//  */
// export const financeJourney = journey({
//   code: 'finance',
//   path: '/finances',
//   title: 'Finance',
//   reachability: { resumeWhen: Query('resume').match(Condition.Equals('true')) },
//   view: {
//     locals: {
//       sectionTitle: 'Finance',
//       sectionStatus: Data('finance_section_status'),
//     },
//   },
//   steps: [financeStep, financeSummaryStep, financeAnalysisStep],
// })
