import { Data, Format, Item, match, when } from '@form-engine/form/builders'
import { Iterator } from '@form-engine/form/builders/IteratorBuilder'
import { GovUKAccordion } from '@form-engine-govuk-components/components'
import { Condition } from '@form-engine/registry/conditions'
import { Transformer } from '@form-engine/registry/transformers'
import { GovUKBody } from '@form-engine-govuk-components/wrappers/govukBody'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { GoalSummaryCardHistory } from '../../../../../../components'
import { CaseData } from '../../../../constants'

const GOAL_EVENT_TYPES = ['goal_created', 'goal_achieved', 'goal_removed', 'goal_readded', 'goal_updated']
const INACTIVE_GOAL_STATUSES = ['ACHIEVED', 'REMOVED']

export const subtitleText = GovUKBody({ text: 'View all updates to this plan.' })

// Plan agreement event heading: "<strong>{action}</strong> on {date} by {practitioner}[ and {forename}]"
// The trailing forename is appended only when the practitioner agreed (or updated to agreed) on behalf of the person.
// Note: createdBy and CaseData.Forename are NOT html-escaped here, matching the prior behaviour for agreement events.
const agreementHeadingHtml = Format(
  '<strong>%1</strong> on %2 by %3%4',
  match(Item().path('status'))
    .branch(Condition.Array.IsIn(['UPDATED_AGREED', 'UPDATED_DO_NOT_AGREE']), 'Agreement updated')
    .branch(Condition.Equals('AGREED'), 'Plan agreed')
    .otherwise('Plan created'),
  Item().path('date').pipe(Transformer.Date.ToUKLongDate()),
  when(Item().path('createdBy').match(Condition.IsRequired())).then(Item().path('createdBy')).else('Unknown'),
  when(
    Item().path('status').match(Condition.Array.IsIn(['AGREED', 'UPDATED_AGREED'])),
  )
    .then(Format(' and %1', CaseData.Forename))
    .else(''),
)

// Plan agreement event summary: status statement plus reason, always visible without expanding.
// Free-text notes are in the expandable content
const agreementStatusStatement = match(Item().path('status'))
  .branch(Condition.Array.IsIn(['AGREED', 'UPDATED_AGREED']), Format('%1 agreed to this plan.', CaseData.Forename))
  .branch(
    Condition.Array.IsIn(['DO_NOT_AGREE', 'UPDATED_DO_NOT_AGREE']),
    Format('%1 did not agree to this plan.', CaseData.Forename),
  )
  .otherwise(Format('%1 could not agree to this plan.', CaseData.Forename))

const agreementSummaryHtml = Format(
  '<p class="govuk-body">%1</p>%2',
  agreementStatusStatement,
  when(Item().path('detailsNo').match(Condition.IsRequired()))
    .then(Format('<p class="govuk-body">%1</p>', Item().path('detailsNo').pipe(Transformer.String.EscapeHtml())))
    .else(
      when(Item().path('detailsCouldNotAnswer').match(Condition.IsRequired()))
        .then(
          Format(
            '<p class="govuk-body">%1</p>',
            Item().path('detailsCouldNotAnswer').pipe(Transformer.String.EscapeHtml()),
          ),
        )
        .else(''),
    ),
)

// Plan agreement event content: shown when the accordion section is expanded.
// Only AGREED/UPDATED_AGREED have notes — show them if present, otherwise "No additional notes".
// Other statuses have no notes field so content is empty.
const agreementContentHtml = match(Item().path('status'))
  .branch(
    Condition.Array.IsIn(['AGREED', 'UPDATED_AGREED']),
    when(Item().path('notes').match(Condition.IsRequired()))
      .then(Format('<p class="govuk-body">%1</p>', Item().path('notes').pipe(Transformer.String.EscapeHtml())))
      .else('<p class="govuk-body">No additional notes.</p>'),
  )
  .otherwise('')

// Factory: builds a goal-event heading "<strong>{action}</strong> on {date} by {actorField}".
// The actor field name varies per event (achievedBy, removedBy, readdedBy, etc.) — passed in.
// The actor IS html-escaped, matching the prior behaviour for goal events.
const goalHeading = (action: string, actorField: string) =>
  Format(
    '<strong>%1</strong> on %2 by %3',
    action,
    Item().path('date').pipe(Transformer.Date.ToUKLongDate()),
    when(Item().path(actorField).match(Condition.IsRequired()))
      .then(Item().path(actorField).pipe(Transformer.String.EscapeHtml()))
      .else('Unknown'),
  )

// Factory: builds a goal-event summary with the goal title (bold) followed by an optional notes/reason paragraph.
// The notes field name varies (notes for achieved/updated, reason for removed/readded) — passed in.
const goalSummaryWithNotes = (notesField: string) =>
  Format(
    '<p class="govuk-body"><strong>%1</strong></p>%2',
    Item().path('goalTitle').pipe(Transformer.String.EscapeHtml()),
    when(Item().path(notesField).match(Condition.IsRequired()))
      .then(Format('<p class="govuk-body">%1</p>', Item().path(notesField).pipe(Transformer.String.EscapeHtml())))
      .else(''),
  )

const goalAchievedHeadingHtml = goalHeading('Goal marked as achieved', 'achievedBy')
const goalAchievedSummaryHtml = goalSummaryWithNotes('notes')

const goalAddedHeadingHtml = goalHeading('Goal created', 'createdBy')
// goal_created has no notes/reason, so it doesn't fit the factory shape.
const goalAddedSummaryHtml = Format(
  '<p class="govuk-body"><strong>%1</strong></p>',
  Item().path('goalTitle').pipe(Transformer.String.EscapeHtml()),
)

const goalRemovedHeadingHtml = goalHeading('Goal removed', 'removedBy')
const goalRemovedSummaryHtml = goalSummaryWithNotes('reason')

const goalReaddedHeadingHtml = goalHeading('Goal added back into plan', 'readdedBy')
const goalReaddedSummaryHtml = goalSummaryWithNotes('reason')

const goalUpdatedHeadingHtml = goalHeading('Goal updated', 'updatedBy')
const goalUpdatedSummaryHtml = goalSummaryWithNotes('notes')

// `Item()` here resolves against the `Iterator.Map` over `planHistoryEntries`
// below. Each block is scoped to a matching event type via `hidden`; the
// form-engine filters hidden nested blocks out before joining their HTML.
const goalSummaryCardForHistory = GoalSummaryCardHistory({
  hidden: Item().path('type').not.match(Condition.Array.IsIn(GOAL_EVENT_TYPES)),
  goalTitle: Item().path('goalTitle'),
  goalStatus: Item().path('goalStatus'),
  goalUuid: Item().path('goalUuid'),
  targetDate: when(Item().path('targetDate').match(Condition.IsRequired()))
    .then(Item().path('targetDate').pipe(Transformer.Date.ToUKLongDate()))
    .else(''),
  statusDate: when(Item().path('statusDate').match(Condition.IsRequired()))
    .then(Item().path('statusDate').pipe(Transformer.Date.ToUKLongDate()))
    .else(''),
  areaOfNeed: Item().path('areaOfNeedLabel'),
  relatedAreasOfNeed: Item().path('relatedAreasOfNeedLabels'),
  steps: Item().path('steps'),
  actions: [
    {
      text: 'View goal',
      // Use `currentGoalStatus`, not the snapshot status — routing must follow
      // the goal as it exists today, not its state at the time of this event.
      href: when(Item().path('currentGoalStatus').match(Condition.Array.IsIn(INACTIVE_GOAL_STATUSES)))
        .then(Format('../goal/%1/view-inactive-goal', Item().path('goalUuid')))
        .else(Format('../goal/%1/update-goal-steps', Item().path('goalUuid'))),
    },
  ],
})

const agreementContentBlock = HtmlBlock({
  hidden: Item().path('type').not.match(Condition.Equals('agreement')),
  content: agreementContentHtml,
})

export const agreementHistory = GovUKAccordion({
  id: 'plan-history-accordion',
  rememberExpanded: false,
  items: Data('planHistoryEntries').each(
    Iterator.Map({
      heading: {
        html: match(Item().path('type'))
          .branch(Condition.Equals('goal_achieved'), goalAchievedHeadingHtml)
          .branch(Condition.Equals('goal_created'), goalAddedHeadingHtml)
          .branch(Condition.Equals('goal_removed'), goalRemovedHeadingHtml)
          .branch(Condition.Equals('goal_readded'), goalReaddedHeadingHtml)
          .branch(Condition.Equals('goal_updated'), goalUpdatedHeadingHtml)
          .otherwise(agreementHeadingHtml),
      },
      summary: {
        html: match(Item().path('type'))
          .branch(Condition.Equals('goal_achieved'), goalAchievedSummaryHtml)
          .branch(Condition.Equals('goal_created'), goalAddedSummaryHtml)
          .branch(Condition.Equals('goal_removed'), goalRemovedSummaryHtml)
          .branch(Condition.Equals('goal_readded'), goalReaddedSummaryHtml)
          .branch(Condition.Equals('goal_updated'), goalUpdatedSummaryHtml)
          .otherwise(agreementSummaryHtml),
      },
      content: {
        blocks: [goalSummaryCardForHistory, agreementContentBlock],
      },
    }),
  ),
})

export const backToTopLink = GovUKBody({
  text: '<a href="#" class="govuk-link govuk-!-display-none-print">↑ Back to top</a>',
})
