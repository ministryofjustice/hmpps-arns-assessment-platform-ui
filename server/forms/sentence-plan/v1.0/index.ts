import { createFormPackage, Data, journey, loadTransition } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { SentencePlanEffectsDeps, SentencePlanV1Effects, SentencePlanV1Registry } from './effects'
import { planOverviewJourney } from './journeys/plan-overview'
import { goalManagementJourney } from './journeys/goal-management'
import { planHistoryJourney } from './journeys/plan-history'
import { aboutPersonStep } from './steps/about-person/step'
import { mpopAccessStep } from './steps/mpop-access/step'
import { oasysAccessStep } from './steps/oasys-access/step'
import { actorLabels, areasOfNeed } from './constants'

export const sentencePlanV1Journey = journey({
  code: 'sentence-plan-v1',
  title: 'Sentence Plan',
  path: '/sentence-plan/v1.0',
  view: {
    template: 'sentence-plan/views/sentence-plan-step',
    locals: {
      hmppsHeaderServiceNameLink: '/forms/sentence-plan/v1.0/plan/overview',
      showPlanHistoryTab: Data('latestAgreementStatus').match(
        Condition.Array.IsIn(['AGREED', 'COULD_NOT_ANSWER', 'DO_NOT_AGREE']),
      ),
    },
  },
  onLoad: [
    loadTransition({
      effects: [
        SentencePlanV1Effects.loadPersonByCrn(),
        SentencePlanV1Effects.loadPlanFromSession(),
        SentencePlanV1Effects.derivePlanAgreementsFromAssessment(),
      ],
    }),
  ],
  data: {
    areasOfNeed,
    actorLabels,
  },
  steps: [mpopAccessStep, oasysAccessStep, aboutPersonStep],
  children: [planOverviewJourney, goalManagementJourney, planHistoryJourney],
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
