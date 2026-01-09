import { Data, journey, loadTransition } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { planOverviewJourney } from './journeys/plan-overview'
import { goalManagementJourney } from './journeys/goal-management'
import { planHistoryJourney } from './journeys/plan-history'
import { aboutPersonStep } from './steps/about-person/step'
import { mpopAccessStep } from '../../access-steps/mpop-access/step'
import { oasysAccessStep } from '../../access-steps/oasys-access/step'
import { actorLabels, areasOfNeed } from './constants'
import { SentencePlanEffects } from '../../effects'

export const sentencePlanV1Journey = journey({
  code: 'sentence-plan-v1',
  title: 'Sentence Plan',
  path: '/v1.0',
  view: {
    template: 'sentence-plan/views/sentence-plan-step',
    locals: {
      basePath: '/forms/sentence-plan/v1.0',
      hmppsHeaderServiceNameLink: '/forms/sentence-plan/v1.0/plan/overview',
      showPlanHistoryTab: Data('latestAgreementStatus').match(
        Condition.Array.IsIn(['AGREED', 'COULD_NOT_ANSWER', 'DO_NOT_AGREE']),
      ),
    },
  },
  onLoad: [
    loadTransition({
      effects: [
        SentencePlanEffects.loadSystemReturnUrl(),
        SentencePlanEffects.loadPersonByCrn(),
        SentencePlanEffects.loadPlanFromSession(),
        SentencePlanEffects.derivePlanAgreementsFromAssessment(),
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
