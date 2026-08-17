import { Data } from '@ministryofjustice/hmpps-forge/core/authoring'
import { SupervisionPackage } from '../../../../components'
import { CaseData } from '../../constants'

export const supervisionPackageSection = SupervisionPackage({
  crn: CaseData.Crn,
  tierCalculation: Data('tierCalculation'),
  supervisionPackageDetails: Data('supervisionPackageDetails'),
})
