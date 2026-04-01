import { and, Data, Format, Item, not, or, Post, Query, when } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { MOJAlert, MOJSubNavigation } from '@form-engine-moj-components/components'
import { Condition } from '@form-engine/registry/conditions'
import { Transformer } from '@form-engine/registry/transformers'
import { CollectionBlock } from '@form-engine/registry/components/collectionBlock'
import { Iterator } from '@form-engine/form/builders/IteratorBuilder'
import { GovUKBody } from '@form-engine-govuk-components/wrappers/govukBody'
import { GoalSummaryCardDraft, GoalSummaryCardAgreed } from '../../../../../../components'
import { CaseData } from '../../../../constants'
import { POST_AGREEMENT_PROCESS_STATUSES } from '../../../../../../effects'
import { hasPostAgreementStatus, isSanSpAssessment } from '../../../../guards'

const isReadOnly = Data('sessionDetails.planAccessMode').match(Condition.Equals('READ_ONLY'))

/**
 * Builds move buttons for goal cards.
 * Hide controls when the goal cannot move:
 * - READ_ONLY users cannot reorder
 * - first item cannot move up
 * - last item cannot move down
 */
function buildMoveButtonProps() {
  return {
    showMoveUp: when(not(or(isReadOnly, Item().path('isFirstInStatus').match(Condition.Equals(true))))),
    showMoveDown: when(not(or(isReadOnly, Item().path('isLastInStatus').match(Condition.Equals(true))))),
    moveUpHref: Format('overview?goalUuid=%1&direction=up&status=%2', Item().path('uuid'), Item().path('status')),
    moveDownHref: Format('overview?goalUuid=%1&direction=down&status=%2', Item().path('uuid'), Item().path('status')),
  }
}

// Calculate goal counts for sub-navigation tabs
// Achieved and removed tabs are conditionally shown only when count > 0
const activeGoalsCount = Data('goals')
  .each(Iterator.Filter(Item().path('status').match(Condition.Equals('ACTIVE'))))
  .pipe(Transformer.Array.Length())

const futureGoalsCount = Data('goals')
  .each(Iterator.Filter(Item().path('status').match(Condition.Equals('FUTURE'))))
  .pipe(Transformer.Array.Length())

const achievedGoalsCount = Data('goals')
  .each(Iterator.Filter(Item().path('status').match(Condition.Equals('ACHIEVED'))))
  .pipe(Transformer.Array.Length())

const removedGoalsCount = Data('goals')
  .each(Iterator.Filter(Item().path('status').match(Condition.Equals('REMOVED'))))
  .pipe(Transformer.Array.Length())

export const planLastUpdatedMessage = GovUKBody({
  hidden: or(
    Data('isUpdatedAfterAgreement').not.match(Condition.Equals(true)),
    and(Data('latestAgreementStatus').match(Condition.Equals('COULD_NOT_ANSWER')), not(isReadOnly)),
  ),
  text: Format(
    'Last updated on %1 by %2. <a href="plan-history" class="govuk-link govuk-link--no-visited-state govuk-!-display-none-print">View plan history</a>',
    Data('lastUpdatedDate').pipe(Transformer.Date.ToUKLongDate()),
    Data('lastUpdatedByName'),
  ),
})

export const planAgreedMessage = GovUKBody({
  hidden: or(
    Data('latestAgreementStatus').not.match(Condition.Array.IsIn(['UPDATED_AGREED', 'AGREED'])),
    Data('isUpdatedAfterAgreement').match(Condition.Equals(true)),
  ),
  text: Format(
    '%1 agreed to their plan on %2. <a href="plan-history" class="govuk-link govuk-link--no-visited-state govuk-!-display-none-print">View plan history</a>',
    CaseData.Forename,
    Data('latestAgreementDate').pipe(Transformer.Date.ToUKLongDate()),
  ),
})

export const planCreatedMessage = GovUKBody({
  hidden: or(
    Data('latestAgreementStatus').not.match(Condition.Array.IsIn(['DO_NOT_AGREE', 'UPDATED_DO_NOT_AGREE'])),
    Data('isUpdatedAfterAgreement').match(Condition.Equals(true)),
  ),
  text: Format(
    'Plan created on %1. <a href="plan-history" class="govuk-link govuk-link--no-visited-state govuk-!-display-none-print">View plan history</a>',
    Data('latestAgreementDate').pipe(Transformer.Date.ToUKLongDate()),
  ),
})

export const updateAgreementMessage = GovUKBody({
  hidden: or(isReadOnly, Data('latestAgreementStatus').not.match(Condition.Equals('COULD_NOT_ANSWER'))),
  text: Format(
    '<a href="update-agree-plan" class="govuk-link govuk-link--no-visited-state">Update %1\'s agreement</a> when you\'ve shared the plan with them.',
    CaseData.Forename,
  ),
})

const currentGoalsNavigationItem = {
  text: Format('Goals to work on now (%1)', activeGoalsCount),
  href: 'overview?type=current',
  active: when(Query('type').match(Condition.Equals('current'))),
}

const futureGoalsNavigationItem = {
  text: Format('Future goals (%1)', futureGoalsCount),
  href: 'overview?type=future',
  active: when(Query('type').match(Condition.Equals('future'))),
}

const achievedGoalsNavigationItem = {
  text: Format('Achieved goals (%1)', achievedGoalsCount),
  href: 'overview?type=achieved',
  active: when(Query('type').match(Condition.Equals('achieved'))),
}

const removedGoalsNavigationItem = {
  text: Format('Removed goals (%1)', removedGoalsCount),
  href: 'overview?type=removed',
  active: when(Query('type').match(Condition.Equals('removed'))),
}

const hasAchievedGoals = achievedGoalsCount.match(Condition.Number.GreaterThan(0))
const hasRemovedGoals = removedGoalsCount.match(Condition.Number.GreaterThan(0))
const showRemovedGoalsTab = and(hasRemovedGoals, hasPostAgreementStatus)

export const subNavigation = MOJSubNavigation({
  label: 'Plan sections',
  items: when(hasAchievedGoals)
    .then(
      when(showRemovedGoalsTab)
        .then([
          currentGoalsNavigationItem,
          futureGoalsNavigationItem,
          achievedGoalsNavigationItem,
          removedGoalsNavigationItem,
        ])
        .else([currentGoalsNavigationItem, futureGoalsNavigationItem, achievedGoalsNavigationItem]),
    )
    .else(
      when(showRemovedGoalsTab)
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
                      Post('action').match(Condition.Equals('agree-plan')),
                      Item().path('status').match(Condition.Equals('ACTIVE')),
                      Item().path('steps').pipe(Transformer.Array.Length()).match(Condition.Equals(0)),
                    ),
                  )
                    .then('govuk-form-group govuk-form-group--error')
                    .else(''),
                  when(
                    and(
                      Post('action').match(Condition.Equals('agree-plan')),
                      Item().path('status').match(Condition.Equals('ACTIVE')),
                      Item().path('steps').pipe(Transformer.Array.Length()).match(Condition.Equals(0)),
                    ),
                  )
                    .then(
                      Format(
                        '<span class="govuk-error-message"><span class="govuk-visually-hidden">Error:</span>Add steps to \'%1\'</span>',
                        Item().path('title').pipe(Transformer.String.EscapeHtml()),
                      ),
                    )
                    .else(''),
                ),
                slots: {
                  card: [
                    TemplateWrapper({
                      // Before any agreement status exists, render the draft card variant.
                      hidden: Data('latestAgreementStatus').match(
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
                            notes: Item()
                              .path('notes')
                              .each(
                                Iterator.Map({
                                  type: Item().path('type'),
                                  note: Item().path('note'),
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
                                hidden: when(
                                  Item().path('steps').pipe(Transformer.Array.Length()).match(Condition.Equals(0)),
                                ),
                              },
                              {
                                text: 'Delete',
                                href: Format('../goal/%1/confirm-delete-goal', Item().path('uuid')),
                              },
                            ],
                            isReadOnly: when(isReadOnly),
                            index: Item().index(),
                            ...buildMoveButtonProps(),
                          }),
                        ],
                      },
                    }),
                    TemplateWrapper({
                      // Once an agreement status exists (including "could not answer"), use the agreed variant.
                      hidden: Data('latestAgreementStatus').not.match(
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
                            notes: Item()
                              .path('notes')
                              .each(
                                Iterator.Map({
                                  type: Item().path('type'),
                                  note: Item().path('note'),
                                }),
                              ),
                            actions: [
                              {
                                text: when(
                                  Item()
                                    .path('status')
                                    .match(Condition.Array.IsIn(['ACHIEVED', 'REMOVED'])),
                                )
                                  .then('View details')
                                  .else('Update'),
                                href: when(
                                  Item()
                                    .path('status')
                                    .match(Condition.Array.IsIn(['ACHIEVED', 'REMOVED'])),
                                )
                                  .then(Format('../goal/%1/view-inactive-goal', Item().path('uuid')))
                                  .else(Format('../goal/%1/update-goal-steps', Item().path('uuid'))),
                              },
                            ],
                            isReadOnly: when(isReadOnly),
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
  Data('goals')
    .each(Iterator.Filter(Item().path('status').match(Condition.Equals('ACTIVE'))))
    .match(Condition.IsRequired()),
)

export const blankPlanOverviewContentReadOnly = HtmlBlock({
  hidden: or(not(isReadOnly), hideBlankPlanOverviewContent),
  content: Format(
    `<div id="blank-plan-content">
      <p class="govuk-body">%1 does not have any goals to work on now.</p>
    </div>`,
    CaseData.Forename,
  ),
})

export const blankPlanOverviewContent = HtmlBlock({
  hidden: or(isReadOnly, hideBlankPlanOverviewContent),
  content: Format(
    '<div id="blank-plan-content" class="%1">%2%3</div>',
    when(Post('action').match(Condition.Equals('agree-plan')))
      .then('govuk-form-group govuk-form-group--error')
      .else(''),
    when(Post('action').match(Condition.Equals('agree-plan')))
      .then(
        '<p class="govuk-error-message"><span class="govuk-visually-hidden">Error:</span> To agree the plan, create a goal to work on now</p>',
      )
      .else(''),
    when(isSanSpAssessment)
      .then(
        Format(
          `<p class="govuk-body govuk-!-display-none-print">%1 does not have any goals to work on now. You can either:</p>
      <ul class="govuk-list govuk-list--bullet govuk-!-display-none-print">
        <li><a href="../goal/new/add-goal/accommodation" class="govuk-link govuk-link--no-visited-state">create a goal with %1</a></li>
        <li><a href="../about-person" class="govuk-link govuk-link--no-visited-state">view information from %1's assessment</a></li>
      </ul>`,
          CaseData.Forename,
        ),
      )
      .else(
        Format(
          '<p class="govuk-body govuk-!-display-none-print">%1 does not have any goals to work on now. You can <a href="../goal/new/add-goal/accommodation" class="govuk-link govuk-link--no-visited-state">create a goal with %1</a>.</p>',
          CaseData.Forename,
        ),
      ),
  ),
})

export const futureGoalsContent = GovUKBody({
  hidden: or(
    Query('type').not.match(Condition.Equals('future')),
    Data('goals')
      .each(Iterator.Filter(Item().path('status').match(Condition.Equals('FUTURE'))))
      .match(Condition.IsRequired()),
  ),
  text: Format('%1 does not have any future goals in their plan.', CaseData.Forename),
  classes: 'govuk-!-display-none-print',
})
