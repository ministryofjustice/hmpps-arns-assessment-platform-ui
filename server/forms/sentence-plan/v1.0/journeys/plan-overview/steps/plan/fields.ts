import { and, Data, Format, Item, or, Query, when } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { MOJAlert, MOJSubNavigation } from '@form-engine-moj-components/components'
import { Condition } from '@form-engine/registry/conditions'
import { Transformer } from '@form-engine/registry/transformers'
import { CollectionBlock } from '@form-engine/registry/components/collectionBlock'
import { Iterator } from '@form-engine/form/builders/IteratorBuilder'
import { GoalSummaryCardDraft, GoalSummaryCardAgreed } from '../../../../../components'
import { CaseData } from '../../../../constants'

export const noActiveGoalsErrorMessage = HtmlBlock({
  hidden: Query('error').not.match(Condition.Equals('no-active-goals')),
  content: `<div class="govuk-error-summary" data-module="govuk-error-summary">
      <div role="alert">
        <h2 class="govuk-error-summary__title">
          There is a problem
        </h2>
        <div class="govuk-error-summary__body">
          <ul class="govuk-list govuk-error-summary__list">
            <li>
              <a href="#blank-plan-content">To agree the plan, create a goal to work on now</a>
            </li>
          </ul>
        </div>
      </div>
    </div>`,
})

export const noStepsErrorMessage = HtmlBlock({
  hidden: Query('error').not.match(Condition.Equals('no-steps')),
  content: Format(
    `<div class="govuk-error-summary" data-module="govuk-error-summary">
      <div role="alert">
        <h2 class="govuk-error-summary__title">
          There is a problem
        </h2>
        <div class="govuk-error-summary__body">
          <ul class="govuk-list govuk-error-summary__list">
            %1
          </ul>
        </div>
      </div>
    </div>`,
    Data('goals')
      .each(
        Iterator.Filter(
          and(
            Item().path('status').match(Condition.Equals('ACTIVE')),
            Item().path('steps').pipe(Transformer.Array.Length()).match(Condition.Equals(0)),
          ),
        ),
      )
      .each(
        Iterator.Map(
          Format('<li><a href="#goal-%1">Add steps to \'%2\'</a></li>', Item().path('uuid'), Item().path('title')),
        ),
      )
      .pipe(Transformer.Array.Join('')),
  ),
})

const activeGoalsCount = Data('goals')
  .each(Iterator.Filter(Item().path('status').match(Condition.Equals('ACTIVE'))))
  .pipe(Transformer.Array.Length())

const futureGoalsCount = Data('goals')
  .each(Iterator.Filter(Item().path('status').match(Condition.Equals('FUTURE'))))
  .pipe(Transformer.Array.Length())

export const planCreatedMessage = HtmlBlock({
  hidden: Data('latestAgreementStatus').not.match(Condition.Array.IsIn(['AGREED', 'DO_NOT_AGREE', 'COULD_NOT_ANSWER'])),
  content: when(Data('latestAgreementStatus').match(Condition.Array.IsIn(['AGREED', 'DO_NOT_AGREE'])))
    .then(
      Format(
        '<p class="govuk-body">Plan created on %1. <a href="#" class="govuk-link">View plan history</a></p>',
        Data('latestAgreementDate').pipe(Transformer.Date.ToUKLongDate()),
      ),
    )
    .else(
      Format(
        '<p class="govuk-body"><a href="#" class="govuk-link">Update %1\'s agreement</a> when you\'ve shared the plan with them.</p>',
        CaseData.Forename,
      ),
    ),
})

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
 * Notification banners - renders any flash notifications from session using MOJ Alert
 */
export const notificationBanners = CollectionBlock({
  collection: Data('notifications').each(
    Iterator.Map(
      MOJAlert({
        alertVariant: Item().path('type'),
        title: Item().path('title'),
        text: Item().path('message'),
        showTitleAsHeading: true,
      }),
    ),
  ),
})

/**
 * Goals section - renders goal summary cards for each goal in the plan
 * Filters goals based on query param: ?type=current shows ACTIVE, ?type=future shows FUTURE
 * Wrapped in an ordered list for numbered display
 */
export const goalsSection = TemplateWrapper({
  hidden: Data('goals').not.match(Condition.IsRequired()),
  template: '<ol class="goal-list govuk-list govuk-list--number">{{slot:items}}</ol>',
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
                template: Format(
                  '<li class="goal-list__item %2" id="goal-%1">%3{{slot:card}}</li>',
                  Item().path('uuid'),
                  when(
                    and(
                      Query('error').match(Condition.Equals('no-steps')),
                      Item().path('steps').pipe(Transformer.Array.Length()).match(Condition.Equals(0)),
                    ),
                  )
                    .then('govuk-form-group govuk-form-group--error')
                    .else(''),
                  when(
                    and(
                      Query('error').match(Condition.Equals('no-steps')),
                      Item().path('steps').pipe(Transformer.Array.Length()).match(Condition.Equals(0)),
                    ),
                  )
                    .then(
                      Format(
                        '<span class="govuk-error-message"><span class="govuk-visually-hidden">Error:</span>Add steps to \'%1\'</span>',
                        Item().path('title'),
                      ),
                    )
                    .else(''),
                ),
                slots: {
                  card: [
                    TemplateWrapper({
                      hidden: Data('latestAgreementStatus').match(
                        Condition.Array.IsIn(['AGREED', 'DO_NOT_AGREE', 'COULD_NOT_ANSWER']),
                      ),
                      template: '{{slot:draftCard}}',
                      slots: {
                        draftCard: [
                          GoalSummaryCardDraft({
                            goalTitle: Item().path('title'),
                            goalStatus: Item().path('status'),
                            goalUuid: Item().path('uuid'),
                            targetDate: Item().path('targetDate').pipe(Transformer.Date.ToUKLongDate()),
                            statusDate: Item().path('statusDate'),
                            areaOfNeed: Item().path('areaOfNeedLabel'),
                            relatedAreasOfNeed: Item().path('relatedAreasOfNeedLabels'),
                            steps: Item()
                              .path('steps')
                              .each(
                                Iterator.Map({
                                  actor: Item().path('actorLabel'),
                                  description: Item().path('description'),
                                  status: Item().path('status'),
                                }),
                              ),
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
                    TemplateWrapper({
                      hidden: Data('latestAgreementStatus').not.match(
                        Condition.Array.IsIn(['AGREED', 'DO_NOT_AGREE', 'COULD_NOT_ANSWER']),
                      ),
                      template: '{{slot:agreedCard}}',
                      slots: {
                        agreedCard: [
                          GoalSummaryCardAgreed({
                            goalTitle: Item().path('title'),
                            goalStatus: Item().path('status'),
                            goalUuid: Item().path('uuid'),
                            targetDate: Item().path('targetDate').pipe(Transformer.Date.ToUKLongDate()),
                            statusDate: Item().path('statusDate'),
                            areaOfNeed: Item().path('areaOfNeedLabel'),
                            relatedAreasOfNeed: Item().path('relatedAreasOfNeedLabels'),
                            steps: Item()
                              .path('steps')
                              .each(
                                Iterator.Map({
                                  actor: Item().path('actorLabel'),
                                  description: Item().path('description'),
                                  status: Item().path('status'),
                                }),
                              ),
                            actions: [
                              {
                                text: 'Update',
                                href: Format('../goal/%1/update-goal-steps', Item().path('uuid')),
                              },
                            ],
                            index: Item().index(),
                          }),
                        ],
                      },
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
    `<div id="blank-plan-content" class="govuk-form-group %2">
      %3
      <p class="govuk-!-display-none-print"> %1 does not have any goals to work on now. You can either:</p>
      <ul class="govuk-!-display-none-print">
        <li><a href="../goal/new/add-goal/accommodation">create a goal with %1</a></li>
        <li><a href="../about-person">view information from %1's assessment</a></li>
      </ul>
    </div>`,
    CaseData.Forename,
    when(Query('error').match(Condition.Equals('no-active-goals')))
      .then('govuk-form-group--error')
      .else(''),
    when(Query('error').match(Condition.Equals('no-active-goals')))
      .then(
        '<span class="govuk-error-message"><span class="govuk-visually-hidden">Error:</span>To agree the plan, create a goal to work on now</span>',
      )
      .else(''),
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
    CaseData.Forename,
  ),
})
