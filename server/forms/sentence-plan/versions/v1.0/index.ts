import { accessTransition, and, Data, Format, journey, redirect, Request } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { planOverviewJourney } from './journeys/plan-overview'
import { goalManagementJourney } from './journeys/goal-management'
import { aboutPersonStep } from './steps/about-person/step'
import { actorLabels, areasOfNeed, formVersion } from './constants'
import { SentencePlanEffects } from '../../effects'
import { NAV_KEY_PATTERNS } from '../../effects/navigation'
import {
  hasPostAgreementStatus,
  isSanSpAssessment,
  redirectIfMergedMpopPlan,
  redirectToPrivacyUnlessAccepted,
} from './guards'

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
    formVersion,
  },
  onAccess: [
    accessTransition({
      effects: [
        SentencePlanEffects.loadFeatureFlags(),
        SentencePlanEffects.initializeSessionFromAccess(),
        SentencePlanEffects.loadSessionData(),
        SentencePlanEffects.loadPlan(),
        SentencePlanEffects.deriveGoalsWithStepsFromAssessment(),
        SentencePlanEffects.derivePlanAgreementsFromAssessment(),
        SentencePlanEffects.trackNavigation(NAV_KEY_PATTERNS),
      ],
    }),
    accessTransition({
      when: and(
        Data('sessionDetails.planVersion').match(Condition.IsRequired()),
        Request.Path().not.match(Condition.String.MatchesRegex('view-historic')),
      ),
      next: [
        redirect({
          goto: Format('/sentence-plan/v1.0/plan/view-historic/%1?type=current', Data('sessionDetails.planVersion')),
        }),
      ],
    }),
    // MPoP users with a merged plan are blocked from accessing any plan content.
    redirectIfMergedMpopPlan(),
    // READ_ONLY users skip privacy and go straight to overview; edit users must accept privacy first.
    redirectToPrivacyUnlessAccepted(),
  ],
  steps: [aboutPersonStep],
  children: [planOverviewJourney, goalManagementJourney],
})
