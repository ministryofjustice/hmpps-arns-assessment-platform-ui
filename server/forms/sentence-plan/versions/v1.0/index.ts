import { accessTransition, and, Data, journey, redirect } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { planHistoryJourney } from './journeys/plan-history'
import { planOverviewJourney } from './journeys/plan-overview'
import { goalManagementJourney } from './journeys/goal-management'
import { aboutPersonStep } from './steps/about-person/step'
import { actorLabels, areasOfNeed } from './constants'
import { SentencePlanEffects } from '../../effects'
import { hasPostAgreementStatus, isSanSpAssessment, isReadWriteAccess } from './guards'

/**
 * Sentence Plan v1.0 Journey
 *
 * Access is handled by the access form at /access/sentence-plan/
 * which redirects to plan/overview after setting up session data.
 *
 * The plan overview step loads the plan and initializes session details
 * from the access form data.
 */
export const sentencePlanV1Journey = journey({
  code: 'sentence-plan-v1',
  title: 'Sentence plan',
  path: '/v1.0',
  view: {
    template: 'sentence-plan/views/sentence-plan-step',
    locals: {
      basePath: '/sentence-plan/v1.0',
      hmppsHeaderServiceNameLink: '/sentence-plan/v1.0/plan/overview',
      showAboutTab: isSanSpAssessment,
      showPlanHistoryTab: hasPostAgreementStatus,
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
        // READ_ONLY users skip privacy and go straight to overview; edit users must accept privacy first.
        redirect({
          when: and(Data('session.privacyAccepted').not.match(Condition.Equals(true)), isReadWriteAccess),
          goto: '../../privacy',
        }),
      ],
    }),
  ],
  steps: [aboutPersonStep],
  children: [planOverviewJourney, goalManagementJourney, planHistoryJourney],
})
