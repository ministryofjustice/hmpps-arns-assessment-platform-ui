import { Data } from '@ministryofjustice/hmpps-forge/core/authoring'
import { PreviousVersions } from '../../../../../../components/previous-versions/previousVersions'
import { CaseData } from '../../../../constants'

export const previousVersions = PreviousVersions({
  personName: CaseData.Forename,
  previousVersions: Data('previousVersions'),
  showAssessmentColumn: Data('showAssessmentColumn'),
})
