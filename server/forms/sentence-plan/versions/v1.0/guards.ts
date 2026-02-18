import { accessTransition, Data, not, redirect } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
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

/**
 * Redirect users with READ_ONLY access to plan overview.
 */
export const redirectToOverviewIfReadOnly = () =>
  accessTransition({
    when: isReadOnlyAccess,
    next: [redirect({ goto: sentencePlanOverviewPath })],
  })

/**
 * Redirect users unless plan status is in post-agreement states.
 */
export const redirectIfNotPostAgreement = (goto: string) =>
  accessTransition({
    when: lacksPostAgreementStatus,
    next: [redirect({ goto })],
  })

/**
 * Redirect users unless latest status is COULD_NOT_ANSWER.
 */
export const redirectUnlessCouldNotAnswer = (goto: string) =>
  accessTransition({
    when: lacksCouldNotAnswerStatus,
    next: [redirect({ goto })],
  })

/**
 * True when the plan has the SAN_BETA flag (private beta).
 * Used to conditionally show features only available to SAN/SP users (e.g. About tab).
 */
export const isSanSpAssessment = Data('assessment.flags').match(Condition.Array.Contains('SAN_BETA'))

/**
 * Redirect users unless the assessment type is SAN_SP.
 */
export const redirectUnlessSanSp = (goto: string) =>
  accessTransition({
    when: not(isSanSpAssessment),
    next: [redirect({ goto })],
  })
