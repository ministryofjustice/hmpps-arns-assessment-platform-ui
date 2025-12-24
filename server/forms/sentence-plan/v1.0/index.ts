import { createFormPackage, journey, loadTransition } from '@form-engine/form/builders'
import { SentencePlanEffectsDeps, SentencePlanV1Effects, SentencePlanV1Registry } from './effects'
import { planOverviewJourney } from './journeys/plan-overview'
import { goalManagementJourney } from './journeys/goal-management'
import { planHistoryJourney } from './journeys/plan-history'
import { aboutPersonStep } from './steps/about-person/step'
import { loadPersonByCrn } from './effects/loadPersonByCrn'

export const sentencePlanV1Journey = journey({
  code: 'sentence-plan-v1',
  title: 'Sentence Plan',
  path: '/sentence-plan/v1.0',
  view: {
    template: 'sentence-plan/views/sentence-plan-step',
  },
  children: [
    // MPOP Journey
    journey({
      code: 'mpop-entry',
      title: 'Sentence Plan',
      path: '/crn/:crn',
      onLoad: [
        loadTransition({
          effects: [SentencePlanV1Effects.loadPersonByCrn(), SentencePlanV1Effects.loadOrCreatePlanByCrn()],
        }),
      ],
      steps: [aboutPersonStep],
      children: [planOverviewJourney, goalManagementJourney, planHistoryJourney],
    }),

    // OASys Journey
    journey({
      code: 'oasys-entry',
      title: 'Sentence Plan',
      path: '/oasys',
      onLoad: [
        loadTransition({
          // TODO: Adding loadPersonByCrn() until we get source of POP's data from OASys
          effects: [SentencePlanV1Effects.loadPersonByCrn(), SentencePlanV1Effects.loadOrCreatePlanByOasys()],
        }),
      ],
      steps: [aboutPersonStep],
      children: [planOverviewJourney, goalManagementJourney, planHistoryJourney],
    }),
  ],
})

// Export form package
export const sentencePlanV1FormPackage = createFormPackage({
  journey: sentencePlanV1Journey,
  createRegistries: (deps: SentencePlanEffectsDeps) => ({
    ...SentencePlanV1Registry(deps),
  }),
})

// Re-export effects for use in steps
export { SentencePlanV1Effects, SentencePlanV1Registry } from './effects'
