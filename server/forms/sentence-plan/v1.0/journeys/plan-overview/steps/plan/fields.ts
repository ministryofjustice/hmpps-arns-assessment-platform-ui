import { and, Data, Format, Item, or, Query, when } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { MOJSubNavigation } from '@form-engine-moj-components/components'
import { Condition } from '@form-engine/registry/conditions'
import { Transformer } from '@form-engine/registry/transformers'
import { CollectionBlock } from '@form-engine/registry/components/collectionBlock'
import { Iterator } from '@form-engine/form/builders/IteratorBuilder'
import { GoalSummaryCardDraft } from '../../../../../components'

const activeGoalsCount = Data('goals')
  .each(Iterator.Filter(Item().path('status').match(Condition.Equals('ACTIVE'))))
  .pipe(Transformer.Array.Length())

const futureGoalsCount = Data('goals')
  .each(Iterator.Filter(Item().path('status').match(Condition.Equals('FUTURE'))))
  .pipe(Transformer.Array.Length())

export const subNavigation = MOJSubNavigation({
  label: 'Plan sections',
  items: [
    {
      text: Format('Goals to work on now (%1)', activeGoalsCount),
      href: 'overview?type=current',
      active: when(Query('type').match(Condition.Equals('current')))
        .then(true)
        .else(false),
    },
    {
      text: Format('Future goals (%1)', futureGoalsCount),
      href: 'overview?type=future',
      active: when(Query('type').match(Condition.Equals('future')))
        .then(true)
        .else(false),
    },
  ],
})

/**
 * Goals section - renders goal summary cards for each goal in the plan
 * Filters goals based on query param: ?type=current shows ACTIVE, ?type=future shows FUTURE
 * Wrapped in an ordered list for numbered display
 */
export const goalsSection = TemplateWrapper({
  hidden: Data('goals').not.match(Condition.IsRequired()),
  template: '<ol class="goal-list">{{slot:items}}</ol>',
  slots: {
    items: [
      CollectionBlock({
        collection: Data('goals')
          .each(
            Iterator.Filter(
              or(
                and(
                  Query('type').not.match(Condition.Equals('future')),
                  Item().path('status').match(Condition.Equals('ACTIVE')),
                ),
                and(
                  Query('type').match(Condition.Equals('future')),
                  Item().path('status').match(Condition.Equals('FUTURE')),
                ),
              ),
            ),
          )
          .each(
            Iterator.Map(
              TemplateWrapper({
                template: '<li class="goal-list__item">{{slot:card}}</li>',
                slots: {
                  card: [
                    GoalSummaryCardDraft({
                      goalTitle: Item().path('title'),
                      goalStatus: Item().path('status'),
                      goalUuid: Item().path('uuid'),
                      targetDate: Item().path('targetDate').pipe(Transformer.Date.ToUKLongDate()),
                      statusDate: Item().path('statusDate'),
                      areaOfNeed: Item().path('areaOfNeed'),
                      relatedAreasOfNeed: Item().path('relatedAreasOfNeed'),
                      steps: Item().path('steps'),
                      actions: [
                        {
                          text: 'Change goal',
                          href: Format('../goal/%1/change-goal', Item().path('uuid')),
                        },
                        {
                          text: 'Add or change steps',
                          href: Format('../goal/%1/add-steps', Item().path('uuid')),
                        },
                        {
                          text: 'Delete',
                          href: Format('../goal/%1/confirm-delete-goal', Item().path('uuid')),
                        },
                      ],
                      index: Item().index(),
                    }),
                  ],
                },
              }),
            ),
          ),
      }),
    ],
  },
})

export const blankPlanOverviewContent = HtmlBlock({
  hidden: or(
    Query('type').match(Condition.Equals('future')),
    Data('goals')
      .each(Iterator.Filter(Item().path('status').match(Condition.Equals('ACTIVE'))))
      .match(Condition.IsRequired()),
  ),
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

export const futureGoalsContent = HtmlBlock({
  hidden: or(
    Query('type').not.match(Condition.Equals('future')),
    Data('goals')
      .each(Iterator.Filter(Item().path('status').match(Condition.Equals('FUTURE'))))
      .match(Condition.IsRequired()),
  ),
  content: Format(
    `<p class="govuk-!-display-none-print"> %1 does not have any future goals in their plan.</p>`,
    Data('caseData.name.forename'),
  ),
})
