import { Data } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { PreviousVersions } from '../../../../../../components/previous-versions/previousVersions'
import { CaseData } from '../../../../constants'

export const previousVersions = PreviousVersions({
  personName: CaseData.Forename,
  previousVersions: Data('previousVersions'),
  showAssessmentColumn: Data('showAssessmentColumn'),
})

export const backToTopLink = HtmlBlock({
  content: '<p class="govuk-body"><a href="#" class="govuk-link">↑ Back to top</a></p>',
})
