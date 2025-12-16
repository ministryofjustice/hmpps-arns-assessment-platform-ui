import { block } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'

export const pageHeading = block<HtmlBlock>({
  variant: 'html',
  content: '<h1 class="govuk-heading-l">Plan Overview</h1>',
})

export const blankPlanOverviewContent = block<HtmlBlock>({
  variant: 'html',
  content: `<p class="govuk-!-display-none-print"> Name does not have any goals to work on now.</p>
  <ul class="govuk-!-display-none-print">
  <li><a href="/forms/sentence-plan/v1.0/crn/XYZ12345/goal/uuid/add-goal/areaOfNeed">Create a goal with NAME</a></li>
  <li><a href="/about" >View Information from NAMES assessment</a></li>
  </ul>`,
})
