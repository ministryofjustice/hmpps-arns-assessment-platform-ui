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

// Shown on a load failure (500/503). We use our own message because MPoP's "unavailable"
// component needs case context we don't have when the call fails.
export const supervisionPackageErrorMessage = GovUKWarningText({
  visibleWhen: hasSupervisionPackageError,
  text: 'There is a problem getting the supervision package information. Reload the page or try again later.',
})
