import { access, Condition, Data, and, not, or, redirect, Request } from '@ministryofjustice/hmpps-forge/core/authoring'
import { basePath } from './constants/formVersion'

/**
 * Shared access predicates for strengths-and-needs steps.
 *
 * Keeping these in one place means each step reads the same rules for:
 * - who came from OASYS
 * - whether the user is in read-only mode
 */

export const isOasysAccess = Data('sessionDetails.accessType').match(Condition.Equals('OASYS'))

/**
 * True when the session has a locked assessment version.
 * A version is present only when it is a positive unix timestamp
 * (null or 0 mean no version / current assessment).
 */
export const hasAssessmentVersion = Data('sessionDetails.assessmentVersion').match(Condition.Number.GreaterThan(0))

/**
 * True when the session was opened in READ_ONLY access mode, or when a
 * specific assessment version is being viewed.
 * Viewing a historic assessment version is always read-only, regardless of accessMode.
 * Used to conditionally hide editable controls (save buttons, change links)
 * and prevent navigation to editable steps.
 */
export const isReadOnlyMode = or(
  Data('sessionDetails.accessMode').match(Condition.Equals('READ_ONLY')),
  hasAssessmentVersion,
)

/**
 * True when the session is NOT in READ_ONLY mode (i.e. the user can edit).
 * Convenience inverse of {@link isReadOnlyMode}.
 */
export const isEditMode = not(isReadOnlyMode)

/**
 * Redirects read-only users away from editable steps to the analysis step.
 *
 * @param sectionPath - The section part of the path to redirect to (e.g., '/drug-use')
 * @param analysisStepPath - The step part of the path to redirect to (e.g., 'drug-use-analysis')
 */
export const redirectToAnalysisIfReadOnly = (sectionPath: string, analysisStepPath: string) => {
  const fullPath = `${basePath}${sectionPath}/${analysisStepPath}`
  return access({
    when: and(isReadOnlyMode, not(Request.Path().match(Condition.Equals(fullPath)))),
    next: [redirect({ goto: fullPath })],
  })
}
