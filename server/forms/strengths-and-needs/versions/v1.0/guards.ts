import {
  access,
  and,
  Condition,
  Data,
  not,
  or,
  Params,
  redirect,
  Request,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import { createRoute } from '../../generators'
import { baseSanRoute } from './constants/path'

/**
 * Shared access predicates for strengths-and-needs steps.
 *
 * Keeping these in one place means each step reads the same rules for:
 * - who came from OASYS
 * - whether the user is in read-only mode
 */

export const isOasysAccess = Data('sessionDetails.accessType').match(Condition.Equals('OASYS'))

/**
 * True when viewing a previous version (read-only mode based on URL mode parameter).
 * Viewing a historic assessment version is always read-only, regardless of accessMode.
 * Used to conditionally hide editable controls (save buttons, change links)
 * and prevent navigation to editable steps.
 */
export const isViewMode = Params('mode').match(Condition.Equals('view'))

/**
 * True when the session was opened in READ_ONLY access mode, or when viewing
 * a specific assessment version (mode === 'view').
 * Viewing a historic assessment version is always read-only, regardless of accessMode.
 * Used to conditionally hide editable controls (save buttons, change links)
 * and prevent navigation to editable steps.
 */
export const isReadOnlyMode = or(Data('sessionDetails.accessMode').match(Condition.Equals('READ_ONLY')), isViewMode)

/**
 * True when the session is NOT in READ_ONLY mode (i.e. the user can edit).
 * Convenience inverse of {@link isReadOnlyMode}.
 */
export const isEditMode = and(Data('sessionDetails.accessMode').match(Condition.Equals('READ_WRITE')), not(isViewMode))

/**
 * Redirects read-only users away from editable steps to the analysis step.
 *
 * @param sectionPath - The section part of the path to redirect to (e.g., '/drug-use')
 * @param analysisStepPath - The step part of the path to redirect to (e.g., 'drug-use-analysis')
 */
export const redirectToAnalysisIfReadOnly = (sectionPath: string, analysisStepPath: string) => {
  return access({
    when: and(
      isReadOnlyMode,
      not(Request.Path().match(Condition.Equals(createRoute([...baseSanRoute, sectionPath, analysisStepPath])))),
    ),
    next: [redirect({ goto: createRoute([...baseSanRoute, sectionPath, analysisStepPath]) })],
  })
}
