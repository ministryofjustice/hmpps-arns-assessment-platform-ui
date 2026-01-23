import { accessTransition, Data, journey, redirect } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { planOverviewJourney } from './journeys/plan-overview'
import { goalManagementJourney } from './journeys/goal-management'
import { planHistoryJourney } from './journeys/plan-history'
import { aboutPersonStep } from './steps/about-person/step'
import { actorLabels, areasOfNeed } from './constants'
import { SentencePlanEffects } from '../../effects'

/**
 * Sentence Plan v1.0 Journey
 *
 * Access is handled by the access form at /forms/access/sentence-plan/
 * which redirects to plan/overview after setting up session data.
 *
 * The plan overview step loads the plan and initializes session details
 * from the access form data.
 */
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
  data: {
    areasOfNeed,
    actorLabels,
  },
  onAccess: [
    accessTransition({
      effects: [
        SentencePlanEffects.loadSessionData(),
        SentencePlanEffects.initializeSessionFromAccess(),
        SentencePlanEffects.loadPlan(),
        SentencePlanEffects.deriveGoalsWithStepsFromAssessment(),
        SentencePlanEffects.derivePlanAgreementsFromAssessment(),
      ],
      next: [
        // Redirect to privacy screen if privacy not yet accepted this session
        redirect({
          when: Data('session.privacyAccepted').not.match(Condition.Equals(true)),
          goto: '/forms/sentence-plan/privacy',
        }),
      ],
    }),
  ],
  steps: [aboutPersonStep],
  children: [planOverviewJourney, goalManagementJourney, planHistoryJourney],
})
