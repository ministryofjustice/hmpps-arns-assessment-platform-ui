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
import { baseSanRoute, currentVersion } from './constants/path'
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
 * True when viewing read-only what OASys or MPoP opened (URL mode `view`), whichever version.
 */
export const isViewMode = Params('mode').match(Condition.Equals('view'))

/**
 * True in the window the previous versions page opens a version in (URL mode `view-historic`).
 * Read-only, and loads data exactly like `view`: the mode only marks the window, e.g. it isn't the
 * OASys window, so it has no "Return to OASys" button.
 */
export const isHistoricWindow = Params('mode').match(Condition.Equals('view-historic'))

/**
 * Show "Return to OASys" only in the window OASys opened, not in windows the previous versions page opens.
 */
export const showReturnToOasys = and(isOasysAccess, not(isHistoricWindow))

/**
 * True when the URL names a previous version rather than `current`. Previous versions are always read-only.
 */
export const isHistoricVersion = and(
  Params('versionUuid').match(Condition.IsRequired()),
  not(Params('versionUuid').match(Condition.Equals(currentVersion))),
)

/**
 * Show "View previous versions" only on the current version.
 */
export const showPreviousVersionsLink = Params('versionUuid').match(Condition.Equals(currentVersion))

const hasReadWriteAccess = Data('sessionDetails.accessMode').match(Condition.Equals('READ_WRITE'))

/**
 * True when the session has READ_ONLY access, or the URL is read-only (`view` or `view-historic` mode, or a
 * previous version).
 * Used to conditionally hide editable controls (save buttons, change links)
 * and prevent navigation to editable steps.
 */
export const isReadOnlyMode = or(
  Data('sessionDetails.accessMode').match(Condition.Equals('READ_ONLY')),
  isViewMode,
  isHistoricWindow,
  isHistoricVersion,
)

/**
 * True when the user can edit: READ_WRITE access, URL mode `edit` and the current version.
 * Not quite the inverse of {@link isReadOnlyMode}: both are false when the access mode is missing.
 */
export const isEditMode = and(
  hasReadWriteAccess,
  Params('mode').match(Condition.Equals('edit')),
  not(isHistoricVersion),
)

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
 * - `edit` is only for the current version; previous versions are viewed
 * - the URL must name the assessment loaded for this access. resolveHistoricVersion checks that a
 *   previous version belongs to it
 */
export const routeGuards = () => {
  const toEntryRoute = () => redirect({ goto: `${formRootPath}/` })
  const isEditUrl = Params('mode').match(Condition.Equals('edit'))

  return [
    access({
      when: and(isEditUrl, or(not(hasReadWriteAccess), isHistoricVersion)),
      next: [toEntryRoute()],
    }),
    access({
      when: not(Params('assessmentUuid').match(Condition.Equals(Data('assessmentUuid')))),
      next: [toEntryRoute()],
    }),
  ]
}
