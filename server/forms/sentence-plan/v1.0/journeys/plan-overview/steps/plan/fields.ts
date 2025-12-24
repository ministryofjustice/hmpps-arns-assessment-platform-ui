import { block, Data, Format, Query, when } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { MOJSubNavigation } from '@form-engine-moj-components/components'
import { Condition } from '@form-engine/registry/conditions'

export const subNavigation = block<MOJSubNavigation>({
  variant: 'mojSubNavigation',
  label: 'Plan sections',
  items: [
    {
      text: 'Goals to work on now (0)', // TODO: Get number of current goals count
      href: 'overview?type=current',
      active: when(Query('type').match(Condition.Equals('current')))
        .then(true)
        .else(false),
    },
    {
      text: 'Future goals (0)', // TODO: Get number of future goals count

      href: 'overview?type=future',
      active: when(Query('type').match(Condition.Equals('future')))
        .then(true)
        .else(false),
    },
  ],
})

export const blankPlanOverviewContent = block<HtmlBlock>({
  variant: 'html',
  hidden: Query('type').match(Condition.Equals('future')),
  content: Format(
    `<p class="govuk-!-display-none-print"> %1 does not have any goals to work on now. You can either:</p>
    <ul class="govuk-!-display-none-print">
      <li><a href="/forms/sentence-plan/v1.0/crn/%2/goal/uuid/add-goal/areaOfNeed">create a goal with %1</a></li>
      <li><a href="/about">view information from %1's assessment</a></li>
    </ul>`,
    Data('caseData.name.forename'),
    Data('caseData.crn'),
  ),
})

export const futureGoalsContent = block<HtmlBlock>({
  variant: 'html',
  hidden: Query('type').not.match(Condition.Equals('future')),
  content: Format(
    `<p class="govuk-!-display-none-print"> %1 does not have any future goals in their plan.</p>`,
    Data('caseData.name.forename'),
  ),
})
