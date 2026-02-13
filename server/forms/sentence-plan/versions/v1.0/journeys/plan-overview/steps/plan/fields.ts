import { and, Data, Format, Item, not, or, Query, when } from '@form-engine/form/builders'
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
import { isSanSpAssessment } from '../../../../guards'

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
    showMoveUp: when(or(isReadOnly, Item().path('isFirstInStatus').match(Condition.Equals(true))))
      .then(false)
      .else(true),
    showMoveDown: when(or(isReadOnly, Item().path('isLastInStatus').match(Condition.Equals(true))))
      .then(false)
      .else(true),
    moveUpHref: Format('reorder-goal?goalUuid=%1&direction=up&status=%2', Item().path('uuid'), Item().path('status')),
    moveDownHref: Format(
      'reorder-goal?goalUuid=%1&direction=down&status=%2',
      Item().path('uuid'),
      Item().path('status'),
    ),
  }
}

// Error visibility conditions - reused by both error blocks and hasErrors flag
// Temporary solution until agree button can trigger validationErrors nodes to be available on Plan overview page
export const hasMissingActiveGoalError = Query('error').match(Condition.Equals('no-active-goals'))
export const hasMissingStepsError = Query('error').match(Condition.Equals('no-steps'))

export const noActiveGoalsErrorMessage = HtmlBlock({
  hidden: or(isReadOnly, not(hasMissingActiveGoalError)),
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
  hidden: or(isReadOnly, not(hasMissingStepsError)),
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

export const planCreatedMessage = HtmlBlock({
  hidden: or(
    Data('latestAgreementStatus').not.match(Condition.Array.IsIn(POST_AGREEMENT_PROCESS_STATUSES)),
    // In READ_ONLY mode, hide this block for COULD_NOT_ANSWER so we do not show the "Update agreement" action link.
    and(isReadOnly, Data('latestAgreementStatus').match(Condition.Equals('COULD_NOT_ANSWER'))),
  ),
  content: when(
    Data('latestAgreementStatus').match(
      Condition.Array.IsIn(['AGREED', 'DO_NOT_AGREE', 'UPDATED_DO_NOT_AGREE', 'UPDATED_AGREED']),
    ),
  )
    .then(
      when(Data('latestAgreementStatus').match(Condition.Equals('UPDATED_AGREED')))
        .then(
          Format(
            '<p class="govuk-body">%1 agreed to their plan on %2. <a href="plan-history" class="govuk-link govuk-link--no-visited-state">View plan history</a></p>',
            CaseData.Forename,
            Data('latestAgreementDate').pipe(Transformer.Date.ToUKLongDate()),
          ),
        )
        .else(
          Format(
            '<p class="govuk-body">Plan created on %1. <a href="plan-history" class="govuk-link govuk-link--no-visited-state">View plan history</a></p>',
            Data('latestAgreementDate').pipe(Transformer.Date.ToUKLongDate()),
          ),
        ),
    )
    .else(
      Format(
        '<p class="govuk-body"><a href="update-agree-plan" class="govuk-link govuk-link--no-visited-state">Update %1\'s agreement</a> when you\'ve shared the plan with them.</p>',
        CaseData.Forename,
      ),
    ),
})

const currentGoalsNavigationItem = {
  text: Format('Goals to work on now (%1)', activeGoalsCount),
  href: 'overview?type=current',
  active: when(Query('type').match(Condition.Equals('current')))
    .then(true)
    .else(false),
}

const futureGoalsNavigationItem = {
  text: Format('Future goals (%1)', futureGoalsCount),
  href: 'overview?type=future',
  active: when(Query('type').match(Condition.Equals('future')))
    .then(true)
    .else(false),
}

const achievedGoalsNavigationItem = {
  text: Format('Achieved goals (%1)', achievedGoalsCount),
  href: 'overview?type=achieved',
  active: when(Query('type').match(Condition.Equals('achieved')))
    .then(true)
    .else(false),
}

const removedGoalsNavigationItem = {
  text: Format('Removed goals (%1)', removedGoalsCount),
  href: 'overview?type=removed',
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
                            isReadOnly: when(isReadOnly).then(true).else(false),
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
                            isReadOnly: when(isReadOnly).then(true).else(false),
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
    `<div id="blank-plan-content" class="govuk-form-group %2">
      %3
      <p class="govuk-body govuk-!-display-none-print">%1 does not have any goals to work on now. You can either:</p>
      <ul class="govuk-list govuk-list--bullet govuk-!-display-none-print">
        <li><a href="../goal/new/add-goal/accommodation" class="govuk-link govuk-link--no-visited-state">create a goal with %1</a></li>
        %4
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
    when(isSanSpAssessment)
      .then(
        Format(
          '<li><a href="../about-person" class="govuk-link govuk-link--no-visited-state">view information from %1\'s assessment</a></li>',
          CaseData.Forename,
        ),
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
    `<p class="govuk-body govuk-!-display-none-print"> %1 does not have any future goals in their plan.</p>`,
    CaseData.Forename,
  ),
})
