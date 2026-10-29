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
import { formRootPath } from './constants/formVersion'

/**
 * Shared access predicates for strengths-and-needs steps.
 *
 * Keeping these in one place means each step reads the same rules for:
 * - who came from OASYS
 * - whether the user is in read-only mode
 */

export const isOasysAccess = Data('sessionDetails.accessType').match(Condition.Equals('OASYS'))

/**
 * True when viewing the current assessment read-only (URL mode `view`).
 */
export const isViewMode = Params('mode').match(Condition.Equals('view'))

/**
 * True when viewing a previous version (URL mode `view-historic`), which is always read-only.
 */
export const isHistoricView = Params('mode').match(Condition.Equals('view-historic'))

const hasReadWriteAccess = Data('sessionDetails.accessMode').match(Condition.Equals('READ_WRITE'))

/**
 * True when the session has READ_ONLY access, or the URL is in a read-only mode (`view` or `view-historic`).
 * Used to conditionally hide editable controls (save buttons, change links)
 * and prevent navigation to editable steps.
 */
export const isReadOnlyMode = or(
  Data('sessionDetails.accessMode').match(Condition.Equals('READ_ONLY')),
  isViewMode,
  isHistoricView,
)

/**
 * True when the user can edit: READ_WRITE access and URL mode `edit`.
 * Not quite the inverse of {@link isReadOnlyMode}: both are false when the access mode is missing.
 */
export const isEditMode = and(hasReadWriteAccess, not(isViewMode), not(isHistoricView))

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

/**
 * Keeps the URL in line with the access. Anything else is sent to the entry step, which redirects
 * to where the access lands (see resolveEntryRoute):
 * - `edit` needs READ_WRITE access. A handover that asks for a version is READ_ONLY (see initializeSessionFromAccess)
 * - `edit` and `view` must name the assessment loaded for this access. `view-historic` URLs name a version
 *   instead, which resolveHistoricVersion checks belongs to that assessment
 */
export const routeGuards = () => {
  const toEntryRoute = () => redirect({ goto: `${formRootPath}/` })

  return [
    access({
      when: and(Params('mode').match(Condition.Equals('edit')), not(hasReadWriteAccess)),
      next: [toEntryRoute()],
    }),
    access({
      when: and(not(isHistoricView), not(Params('uuid').match(Condition.Equals(Data('assessmentUuid'))))),
      next: [toEntryRoute()],
    }),
  ]
}
