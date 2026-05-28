import { Data } from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKBody } from '@ministryofjustice/hmpps-forge/govuk-components'
import { PreviousVersions } from '../../../../../../components/previous-versions/previousVersions'
import { CaseData } from '../../../../constants'

export const previousVersions = PreviousVersions({
  personName: CaseData.Forename,
  previousVersions: Data('previousVersions'),
  showAssessmentColumn: Data('showAssessmentColumn'),
})

export const backToTopLink = GovUKBody({
  text: '<a href="#" class="govuk-link">↑ Back to top</a>',
})
