import { and, Data, Format, Item, or, Params, Query, when } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { MOJAlert, MOJSubNavigation } from '@form-engine-moj-components/components'
import { Condition } from '@form-engine/registry/conditions'
import { Transformer } from '@form-engine/registry/transformers'
import { CollectionBlock } from '@form-engine/registry/components/collectionBlock'
import { Iterator } from '@form-engine/form/builders/IteratorBuilder'
import { GoalSummaryCardDraft, GoalSummaryCardAgreed } from '../../../../../../components'
import { CaseData } from '../../../../constants'
import { POST_AGREEMENT_PROCESS_STATUSES } from '../../../../../../effects'

function buildMoveButtonProps() {
  return {
    showMoveUp: false,
    showMoveDown: false,
    moveUpHref: '',
    moveDownHref: '',
  }
}

// Calculate goal counts for sub-navigation tabs
// Achieved and removed tabs are conditionally shown only when count > 0
const activeGoalsCount = Data('historic.goals')
  .each(Iterator.Filter(Item().path('status').match(Condition.Equals('ACTIVE'))))
  .pipe(Transformer.Array.Length())

const futureGoalsCount = Data('historic.goals')
  .each(Iterator.Filter(Item().path('status').match(Condition.Equals('FUTURE'))))
  .pipe(Transformer.Array.Length())

const achievedGoalsCount = Data('historic.goals')
  .each(Iterator.Filter(Item().path('status').match(Condition.Equals('ACHIEVED'))))
  .pipe(Transformer.Array.Length())

const removedGoalsCount = Data('historic.goals')
  .each(Iterator.Filter(Item().path('status').match(Condition.Equals('REMOVED'))))
  .pipe(Transformer.Array.Length())

export const planCreatedMessage = HtmlBlock({
  hidden: or(
    Data('historic.latestAgreementStatus').not.match(Condition.Array.IsIn(POST_AGREEMENT_PROCESS_STATUSES)),
    // In READ_ONLY mode, hide this block for COULD_NOT_ANSWER so we do not show the "Update agreement" action link.
    Data('historic.latestAgreementStatus').match(Condition.Equals('COULD_NOT_ANSWER')),
  ),
  content: when(
    Data('historic.latestAgreementStatus').match(
      Condition.Array.IsIn(['AGREED', 'DO_NOT_AGREE', 'UPDATED_DO_NOT_AGREE', 'UPDATED_AGREED']),
    ),
  )
    .then(
      when(Data('historic.latestAgreementStatus').match(Condition.Equals('UPDATED_AGREED')))
        .then(
          Format(
            '<p class="govuk-body">%1 agreed to their plan on %2.</p>',
            CaseData.Forename,
            Data('historic.latestAgreementDate').pipe(Transformer.Date.ToUKLongDate()),
          ),
        )
        .else(
          Format(
            '<p class="govuk-body">Plan created on %1.</p>',
            Data('historic.latestAgreementDate').pipe(Transformer.Date.ToUKLongDate()),
          ),
        ),
    )
    .else(''),
})

const currentGoalsNavigationItem = {
  text: Format('Goals to work on now (%1)', activeGoalsCount),
  href: Format('%1?type=current', Params('timestamp')),
  active: when(Query('type').match(Condition.Equals('current')))
    .then(true)
    .else(false),
}

const futureGoalsNavigationItem = {
  text: Format('Future goals (%1)', futureGoalsCount),
  href: Format('%1?type=future', Params('timestamp')),
  active: when(Query('type').match(Condition.Equals('future')))
    .then(true)
    .else(false),
}

const achievedGoalsNavigationItem = {
  text: Format('Achieved goals (%1)', achievedGoalsCount),
  href: Format('%1?type=achieved', Params('timestamp')),
  active: when(Query('type').match(Condition.Equals('achieved')))
    .then(true)
    .else(false),
}

const removedGoalsNavigationItem = {
  text: Format('Removed goals (%1)', removedGoalsCount),
  href: Format('%1?type=removed', Params('timestamp')),
  active: when(Query('type').match(Condition.Equals('removed')))
    .then(true)
    .else(false),
}

const hasAchievedGoals = achievedGoalsCount.match(Condition.Number.GreaterThan(0))
const hasRemovedGoals = removedGoalsCount.match(Condition.Number.GreaterThan(0))

export const subNavigation = MOJSubNavigation({
  label: 'Plan sections',
  items: when(hasAchievedGoals)
    .then(
      when(hasRemovedGoals)
        .then([
          currentGoalsNavigationItem,
          futureGoalsNavigationItem,
          achievedGoalsNavigationItem,
          removedGoalsNavigationItem,
        ])
        .else([currentGoalsNavigationItem, futureGoalsNavigationItem, achievedGoalsNavigationItem]),
    )
    .else(
      when(hasRemovedGoals)
        .then([currentGoalsNavigationItem, futureGoalsNavigationItem, removedGoalsNavigationItem])
        .else([currentGoalsNavigationItem, futureGoalsNavigationItem]),
    ),
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
  hidden: Data('historic.goals').not.match(Condition.IsRequired()),
  template: '<ol class="goal-list govuk-list govuk-list--number">{{slot:items}}</ol>',
  slots: {
    items: [
      CollectionBlock({
        collection: Data('historic.goals')
          .each(
            Iterator.Filter(
              or(
                and(
                  Query('type').match(Condition.Equals('current')),
                  Item().path('status').match(Condition.Equals('ACTIVE')),
                ),
                and(
                  Query('type').match(Condition.Equals('future')),
                  Item().path('status').match(Condition.Equals('FUTURE')),
                ),
                and(
                  Query('type').match(Condition.Equals('achieved')),
                  Item().path('status').match(Condition.Equals('ACHIEVED')),
                ),
                and(
                  Query('type').match(Condition.Equals('removed')),
                  Item().path('status').match(Condition.Equals('REMOVED')),
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
                      // Before any agreement status exists, render the draft card variant.
                      hidden: Data('historic.latestAgreementStatus').match(
                        Condition.Array.IsIn(POST_AGREEMENT_PROCESS_STATUSES),
                      ),
                      template: '{{slot:draftCard}}',
                      slots: {
                        draftCard: [
                          GoalSummaryCardDraft({
                            goalTitle: Item().path('title'),
                            goalStatus: Item().path('status'),
                            goalUuid: Item().path('uuid'),
                            targetDate: Item().path('targetDate').pipe(Transformer.Date.ToUKLongDate()),
                            statusDate: Item().path('statusDate').pipe(Transformer.Date.ToUKLongDate()),
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
                            actions: [],
                            isReadOnly: true,
                            index: Item().index(),
                            ...buildMoveButtonProps(),
                          }),
                        ],
                      },
                    }),
                    TemplateWrapper({
                      // Once an agreement status exists (including "could not answer"), use the agreed variant.
                      hidden: Data('historic.latestAgreementStatus').not.match(
                        Condition.Array.IsIn(POST_AGREEMENT_PROCESS_STATUSES),
                      ),
                      template: '{{slot:agreedCard}}',
                      slots: {
                        agreedCard: [
                          GoalSummaryCardAgreed({
                            goalTitle: Item().path('title'),
                            goalStatus: Item().path('status'),
                            goalUuid: Item().path('uuid'),
                            targetDate: Item().path('targetDate').pipe(Transformer.Date.ToUKLongDate()),
                            statusDate: Item().path('statusDate').pipe(Transformer.Date.ToUKLongDate()),
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
                            actions: [],
                            isReadOnly: true,
                            index: Item().index(),
                            ...buildMoveButtonProps(),
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

const hideBlankPlanOverviewContent = or(
  Query('type').match(Condition.Equals('future')),
  Query('type').match(Condition.Equals('achieved')),
  Query('type').match(Condition.Equals('removed')),
  Data('historic.goals')
    .each(Iterator.Filter(Item().path('status').match(Condition.Equals('ACTIVE'))))
    .match(Condition.IsRequired()),
)

export const blankPlanOverviewContentReadOnly = HtmlBlock({
  hidden: hideBlankPlanOverviewContent,
  content: Format(
    `<div id="blank-plan-content">
      <p class="govuk-body">%1 does not have any goals to work on now.</p>
    </div>`,
    CaseData.Forename,
  ),
})

export const futureGoalsContent = HtmlBlock({
  hidden: or(
    Query('type').not.match(Condition.Equals('future')),
    Data('historic.goals')
      .each(Iterator.Filter(Item().path('status').match(Condition.Equals('FUTURE'))))
      .match(Condition.IsRequired()),
  ),
  content: Format(
    `<p class="govuk-body govuk-!-display-none-print"> %1 does not have any future goals in their plan.</p>`,
    CaseData.Forename,
  ),
})
