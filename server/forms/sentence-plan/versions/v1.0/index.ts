import {
  access,
  and,
  Data,
  Format,
  journey,
  redirect,
  Request,
  Condition,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import { planOverviewJourney } from './journeys/plan-overview'
import { goalManagementJourney } from './journeys/goal-management'
import { aboutPersonStep } from './steps/about-person/step'
import { supervisionPackageStep } from './steps/supervision-package/step'
import { actorLabels, areasOfNeed, formVersion, sentencePlanBasePath, sentencePlanOverviewPath } from './constants'
import { SentencePlanEffects } from '../../effects'
import { NAV_KEY_PATTERNS } from '../../effects/navigation'
import {
  canAccessSanContent,
  canAccessSupervisionPackage,
  hasPostAgreementStatus,
  isSupervisionPackageEnabled,
  redirectIfMergedMpopPlan,
  redirectToPrivacyUnlessAccepted,
} from './guards'
import config from '../../../../config'
import { createPlatformPages } from '../../../platform'

const feedbackUrl = config.nationalRolloutFeedbackUrl

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
  reachability: { disableReachabilityChecks: true },
  view: {
    template: 'sentence-plan/views/sentence-plan-step',
    locals: {
      basePath: sentencePlanBasePath,
      hmppsHeaderServiceNameLink: sentencePlanOverviewPath,
      showAboutTab: canAccessSanContent,
      showPlanHistoryTab: hasPostAgreementStatus,
      showSupervisionPackageTab: canAccessSupervisionPackage,
      feedbackUrl,
    },
  },
  data: {
    areasOfNeed,
    actorLabels,
    formVersion,
  },
  onAccess: [
    access({
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
    access({
      when: and(
        Data('sessionDetails.planVersion').match(Condition.IsRequired()),
        Request.Path().not.match(Condition.String.MatchesRegex('view-historic')),
      ),
      next: [
        redirect({
          goto: Format(
            `${sentencePlanBasePath}/plan/view-historic/%1?type=current`,
            Data('sessionDetails.planVersion'),
          ),
        }),
      ],
    }),
    // MPoP users with a merged plan are blocked from accessing any plan content.
    redirectIfMergedMpopPlan(),
    // READ_ONLY users skip privacy and go straight to overview; edit users must accept privacy first.
    redirectToPrivacyUnlessAccepted(),
    // Load the supervision package (only when the feature is on) so the nav can decide, on every
    // page, whether to show the Supervision package tab based on the case's supervision phase.
    // Runs after the redirects so it is skipped for redirected requests (e.g. privacy not accepted).
    access({
      when: isSupervisionPackageEnabled,
      effects: [SentencePlanEffects.loadSupervisionPackage()],
    }),
  ],
  steps: [
    aboutPersonStep,
    supervisionPackageStep,
    ...createPlatformPages({ baseUrl: sentencePlanBasePath, feedbackUrl }),
  ],
  children: [planOverviewJourney, goalManagementJourney],
})
