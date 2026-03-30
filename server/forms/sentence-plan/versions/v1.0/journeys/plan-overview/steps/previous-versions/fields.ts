import { Data } from '@form-engine/form/builders'
import { GovUKBody } from '@form-engine-govuk-components/wrappers/govukBody'
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
