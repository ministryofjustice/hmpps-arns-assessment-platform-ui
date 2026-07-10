import {
  access,
  and,
  Data,
  Item,
  Iterator,
  not,
  redirect,
  Condition,
  Transformer,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import { POST_AGREEMENT_PROCESS_STATUSES } from '../../effects'
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

export const isReadWriteAccess = Data('sessionDetails.planAccessMode').not.match(Condition.Equals('READ_ONLY'))

export const hasPostAgreementStatus = Data('latestAgreementStatus').match(
  Condition.Array.IsIn(POST_AGREEMENT_PROCESS_STATUSES),
)

export const lacksPostAgreementStatus = Data('latestAgreementStatus').not.match(
  Condition.Array.IsIn(POST_AGREEMENT_PROCESS_STATUSES),
)

export const hasCouldNotAnswerStatus = Data('latestAgreementStatus').match(Condition.Equals('COULD_NOT_ANSWER'))

export const lacksCouldNotAnswerStatus = Data('latestAgreementStatus').not.match(Condition.Equals('COULD_NOT_ANSWER'))
export const isCouldNotAnswerStatus = Data('latestAgreementStatus').match(Condition.Equals('COULD_NOT_ANSWER'))

/**
 * Redirect users with READ_ONLY access to plan overview.
 */
export const redirectToOverviewIfReadOnly = () =>
  access({
    when: isReadOnlyAccess,
    next: [redirect({ goto: sentencePlanOverviewPath })],
  })

/**
 * Redirect users unless plan status is in post-agreement states.
 */
export const redirectIfNotPostAgreement = (goto: string) =>
  access({
    when: lacksPostAgreementStatus,
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
    when: lacksCouldNotAnswerStatus,
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
 * True when the user can access SAN-specific content.
 * Requires both a SAN_SP assessment AND non-MPoP access, because MPoP users
 * cannot reach the SAN data APIs needed to populate this content.
 */
export const canAccessSanContent = and(isSanSpAssessment, not(isMpopAccess))

/**
 * Redirect users unless they can access SAN content.
 * Blocks both non-SAN_SP assessments and MPoP users.
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
    when: and(Data('privacyAccepted').not.match(Condition.Equals(true)), isReadWriteAccess),
    next: [redirect({ goto: '/sentence-plan/privacy' })],
  })
