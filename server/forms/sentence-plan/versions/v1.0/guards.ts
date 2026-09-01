import {
  access,
  and,
  Data,
  Item,
  Iterator,
  not,
  or,
  redirect,
  Condition,
  Request,
  Transformer,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import { POST_AGREEMENT_PROCESS_STATUSES } from '../../effects'
import { GOTENBERG_RENDER_HEADER, GOTENBERG_RENDER_HEADER_VALUE } from '../../../../data/gotenbergClient'
import { sentencePlanOverviewPath } from './constants'

/**
 * Shared access predicates for sentence-plan steps.
 *
 * Keeping these in one place means each step reads the same rules for:
 * - who came from OASYS
 * - who is read-only
 * - whether a plan has passed agreement
 * - which assessment type is active
 */

export const isOasysAccess = Data('sessionDetails.accessType').match(Condition.Equals('OASYS'))

export const isReadOnlyAccess = Data('sessionDetails.planAccessMode').match(Condition.Equals('READ_ONLY'))

export const isPrintAndShareEnabled = Data('featureFlags.printAndShareEnabled').match(Condition.Equals(true))

export const isSupervisionPackageEnabled = Data('featureFlags.supervisionPackageEnabled').match(Condition.Equals(true))

/**
 * MPoP only displays the supervision package component for three supervision phases:
 * INIT (Early Engagement), STD (Standard Supervision) and FTHRD (Final Third). All other
 * phases — in custody (SENT), SPNA, no package yet, etc. — render nothing, so we hide the
 * tab for them too (an allowlist, so new non-renderable phases need no change here).
 * TODO: add the 4th "In flight" phase code once MPoP finalise it.
 */
export const isSupervisionPackageDisplayable = Data('supervisionPackageDetails.currentPhase.phase.code').match(
  Condition.Array.IsIn(['INIT', 'STD', 'FTHRD']),
)

/**
 * True when the feature is enabled AND the case is in a phase MPoP renders the component for.
 * Drives whether the component itself is rendered on the page.
 */
export const canDisplaySupervisionPackage = and(isSupervisionPackageEnabled, isSupervisionPackageDisplayable)

/**
 * True when loading the supervision package failed (500/503). Drives showing an error message
 * rather than hiding the tab.
 */
export const hasSupervisionPackageError = Data('supervisionPackageError').match(Condition.Equals(true))

/**
 * True when the tab should be reachable: the component can be displayed, OR there was an error
 * (so the user can see the error message). A missing package or non-renderable phase is neither,
 * so the tab hides.
 */
export const canAccessSupervisionPackage = and(
  isSupervisionPackageEnabled,
  or(isSupervisionPackageDisplayable, hasSupervisionPackageError),
)

export const isMpopAssessmentInfoEnabled = Data('featureFlags.mpopAssessmentInfoEnabled').match(Condition.Equals(true))

/**
 * True when Gotenberg is loading this page to build a PDF, rather than a person viewing it.
 *
 * This only picks which label the audit event gets, never whether one is sent. A faked header
 * can mislabel an event but cannot remove it.
 */
export const isPdfRenderRequest = Request.Headers(GOTENBERG_RENDER_HEADER).match(
  Condition.Equals(GOTENBERG_RENDER_HEADER_VALUE),
)

export const hasPostAgreementStatus = Data('latestAgreementStatus').match(
  Condition.Array.IsIn(POST_AGREEMENT_PROCESS_STATUSES),
)

export const hasCouldNotAnswerStatus = Data('latestAgreementStatus').match(Condition.Equals('COULD_NOT_ANSWER'))

/**
 * Redirect users with READ_ONLY access to plan overview.
 */
export const redirectToOverviewIfReadOnly = () =>
  access({
    when: isReadOnlyAccess,
    next: [redirect({ goto: sentencePlanOverviewPath })],
  })

/**
 * Redirect users to plan overview when print and share is disabled.
 */
export const redirectToOverviewUnlessPrintAndShareEnabled = () =>
  access({
    when: not(isPrintAndShareEnabled),
    next: [redirect({ goto: sentencePlanOverviewPath })],
  })

export const redirectToOverviewUnlessSupervisionPackageAccessible = () =>
  access({
    when: not(canAccessSupervisionPackage),
    next: [redirect({ goto: sentencePlanOverviewPath })],
  })

/**
 * Redirect users unless plan status is in post-agreement states.
 */
export const redirectIfNotPostAgreement = (goto: string) =>
  access({
    when: not(hasPostAgreementStatus),
    next: [redirect({ goto })],
  })

// redirects users unless plan status is not in post-agreement states (draft plan):
export const redirectIfPostAgreement = (goto: string) =>
  access({
    when: hasPostAgreementStatus,
    next: [redirect({ goto })],
  })

// redirects users if goal is not found:
export const redirectIfGoalNotFound = (goto: string) =>
  access({
    when: Data('activeGoal').not.match(Condition.IsRequired()),
    next: [redirect({ goto })],
  })

/**
 * True when the active goal has at least one step and every step is COMPLETED.
 * Derived from the saved goal (not form answers), so it also holds on a direct page load.
 */
export const allActiveGoalStepsCompleted = and(
  Data('activeGoal.steps').match(Condition.IsRequired()),
  Data('activeGoal.steps')
    .each(Iterator.Filter(Item().path('status').not.match(Condition.Equals('COMPLETED'))))
    .pipe(Transformer.Array.Length())
    .match(Condition.Equals(0)),
)

/**
 * Redirect users unless every step on the active goal is completed.
 * Stops the confirm-if-achieved page being reached directly before a goal is ready to be achieved.
 */
export const redirectUnlessAllStepsCompleted = (goto: string) =>
  access({
    when: not(allActiveGoalStepsCompleted),
    next: [redirect({ goto })],
  })

/**
 * Redirect users unless latest status is COULD_NOT_ANSWER.
 */
export const redirectUnlessCouldNotAnswer = (goto: string) =>
  access({
    when: not(hasCouldNotAnswerStatus),
    next: [redirect({ goto })],
  })

/**
 * True when the plan has the SAN_BETA flag (private beta).
 */
export const isSanSpAssessment = Data('assessment.flags').match(Condition.Array.Contains('SAN_BETA'))

/**
 * True when the user entered via MPoP (CRN-based access).
 */
export const isMpopAccess = Data('sessionDetails.accessType').match(Condition.Equals('HMPPS_AUTH'))

/**
 * True when the case has a CRN. MPoP access is always CRN-based; ~10% of OASys handovers are not,
 * and those users get no assessment info (the ARNS needs endpoints are keyed by CRN).
 */
export const hasCrn = Data('caseData.crn').match(Condition.IsRequired())

/**
 * True when the user can access SAN-specific content.
 * Requires a SAN_SP assessment, a CRN, AND either non-MPoP access (i.e. OASys),
 * or MPoP access with the assessment-info feature flag enabled.
 */
export const canAccessSanContent = and(isSanSpAssessment, hasCrn, or(not(isMpopAccess), isMpopAssessmentInfoEnabled))

/**
 * Redirect users unless they can access SAN content (see canAccessSanContent):
 * blocks non-SAN_SP assessments, cases with no CRN, and MPoP users without the
 * assessment-info feature flag.
 */
export const redirectUnlessSanSp = (goto: string) =>
  access({
    when: not(canAccessSanContent),
    next: [redirect({ goto })],
  })

/**
 * True when the plan has been flagged as merged.
 * The coordinator sets assessment.properties.MERGED when an OASys offender record has been merged.
 */
export const isMergedPlan = Data('assessment.properties.MERGED').match(Condition.IsRequired())

/**
 * Redirect MPoP users with a merged plan to the warning page.
 * This prevents access to any plan content when the underlying data may be inconsistent.
 */
export const redirectIfMergedMpopPlan = () =>
  access({
    when: and(isMpopAccess, isMergedPlan),
    next: [redirect({ goto: '/sentence-plan/merged-plan-warning' })],
  })

/**
 * Redirect READ_WRITE users to privacy until they have accepted it.
 * READ_ONLY users are not sent through the privacy screen.
 */
export const redirectToPrivacyUnlessAccepted = () =>
  access({
    when: and(Data('privacyAccepted').not.match(Condition.Equals(true)), not(isReadOnlyAccess)),
    next: [redirect({ goto: '/sentence-plan/privacy' })],
  })
