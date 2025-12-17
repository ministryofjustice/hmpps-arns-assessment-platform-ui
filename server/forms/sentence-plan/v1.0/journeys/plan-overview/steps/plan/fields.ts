import { block, Data, Format } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'

export const pageHeading = block<HtmlBlock>({
  variant: 'html',
  content: '<h1 class="govuk-heading-l">Plan Overview</h1>',
})

export const blankPlanOverviewContent = block<HtmlBlock>({
  variant: 'html',
  content: Format(
    `<p class="govuk-!-display-none-print"> %1 does not have any goals to work on now.</p>
    <ul class="govuk-!-display-none-print">
      <li><a href="/forms/sentence-plan/v1.0/crn/%2/goal/uuid/add-goal/areaOfNeed">Create a goal with %1</a></li>
      <li><a href="/about">View Information from %1's assessment</a></li>
    </ul>`,
    Data('caseData.name.forename'),
    Data('caseData.crn')
  ),
})
