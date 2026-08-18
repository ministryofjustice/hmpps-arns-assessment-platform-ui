import { Data } from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKWarningText } from '@ministryofjustice/hmpps-forge/govuk-components'
import { SupervisionPackage } from '../../../../components'
import { CaseData } from '../../constants'
import { canDisplaySupervisionPackage, hasSupervisionPackageError } from '../../guards'

export const supervisionPackageSection = SupervisionPackage({
  visibleWhen: canDisplaySupervisionPackage,
  crn: CaseData.Crn,
  tierCalculation: Data('tierCalculation'),
  supervisionPackageDetails: Data('supervisionPackageDetails'),
})

/**
 * Shown when the supervision package could not be loaded (currently the 500/503 error path).
 * The page is only reachable when the package can be displayed OR it errored, so the component
 * and this message are the two mutually exclusive states of the page.
 */
export const supervisionPackageErrorMessage = GovUKWarningText({
  visibleWhen: hasSupervisionPackageError,
  text: 'Supervision package information is currently unavailable while the package is being recalculated.',
})
