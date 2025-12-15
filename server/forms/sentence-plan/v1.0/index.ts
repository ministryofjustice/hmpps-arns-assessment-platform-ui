import { journey, createFormPackage } from '@form-engine/form/builders'
import { SentencePlanEffectsDeps, SentencePlanV1Registry } from './effects'
import { planOverviewJourney } from './journeys/plan-overview'
import { goalManagementJourney } from './journeys/goal-management'
import { planHistoryJourney } from './journeys/plan-history'
import { aboutPersonStep } from './steps/about-person/step'

// Add a journey for users coming from MPOP
const sentencePlanMPOPSplit = journey({
  code: 'sentence-plan',
  title: 'Sentence Plan',
  path: '/crn/:crn',
  steps: [aboutPersonStep],
  children: [planOverviewJourney, goalManagementJourney, planHistoryJourney],
})

// Add a journey for users coming from OASys
const sentencePlanOASysSplit = journey({
  code: 'sentence-plan',
  title: 'Sentence Plan',
  path: '/oasys',
  steps: [aboutPersonStep],
  children: [planOverviewJourney, goalManagementJourney, planHistoryJourney],
})

const sentencePlanJourney = journey({
  code: 'sentence-plan',
  title: 'Sentence Plan',
  path: '/sentence-plan/v1.0',
  view: {
    template: 'sentence-plan/views/sentence-plan-step',
  },
  children: [sentencePlanMPOPSplit, sentencePlanOASysSplit],
})

// Export form package
export const sentencePlanV1FormPackage = createFormPackage({
  journey: sentencePlanJourney,
  createRegistries: (deps: SentencePlanEffectsDeps) => ({
    ...SentencePlanV1Registry(deps),
  }),
})

// Re-export effects for use in steps
export { SentencePlanV1Effects, SentencePlanV1Registry } from './effects'
