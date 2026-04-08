import { Data, Format, Item, match, or, when } from '@form-engine/form/builders'
import { Iterator } from '@form-engine/form/builders/IteratorBuilder'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { CollectionBlock } from '@form-engine/registry/components/collectionBlock'
import { Condition } from '@form-engine/registry/conditions'
import { Transformer } from '@form-engine/registry/transformers'
import { GovUKBody } from '@form-engine-govuk-components/wrappers/govukBody'
import { GovUKSectionBreak } from '@form-engine-govuk-components/wrappers/govukSectionBreak'
import { CaseData } from '../../../../constants'

const isReadOnly = Data('sessionDetails.planAccessMode').match(Condition.Equals('READ_ONLY'))

export const subtitleText = GovUKBody({ text: 'View all updates and changes made to this plan.' })

export const sectionBreak = GovUKSectionBreak({ size: 'm', visible: true })

/**
 * Renders a plan agreement history entry.
 * Used for: Plan agreed, Plan created, Agreement updated events.
 */
const agreementEntryContent = Format(
  `<div class="govuk-!-margin-bottom-6">
    <p class="govuk-body"><strong>%1</strong> on %2 by %3%4</p>
    <p class="govuk-body">%5</p>
    %6
  </div>`,
  // %1: Status heading
  match(Item().path('status'))
    .branch(Condition.Array.IsIn(['UPDATED_AGREED', 'UPDATED_DO_NOT_AGREE']), 'Agreement updated')
    .branch(Condition.Equals('AGREED'), 'Plan agreed')
    .otherwise('Plan created'),
  // %2: Date
  Item().path('date').pipe(Transformer.Date.ToUKLongDate()),
  // %3: Practitioner
  when(Item().path('createdBy').match(Condition.IsRequired())).then(Item().path('createdBy')).else('Unknown'),
  // %4: Person (only shown for AGREED or UPDATED_AGREED status)
  when(
    Item()
      .path('status')
      .match(Condition.Array.IsIn(['AGREED', 'UPDATED_AGREED'])),
  )
    .then(Format(' and %1', CaseData.Forename))
    .else(''),
  // %5: Description
  match(Item().path('status'))
    .branch(Condition.Array.IsIn(['AGREED', 'UPDATED_AGREED']), Format('%1 agreed to this plan.', CaseData.Forename))
    .branch(
      Condition.Array.IsIn(['DO_NOT_AGREE', 'UPDATED_DO_NOT_AGREE']),
      Format('%1 did not agree to this plan.', CaseData.Forename),
    )
    .otherwise(Format('%1 could not agree to this plan.', CaseData.Forename)),
  // %6: Reason details and optional notes combined in a single paragraph
  when(Item().path('detailsNo').match(Condition.IsRequired()))
    .then(
      when(Item().path('notes').match(Condition.IsRequired()))
        .then(
          Format(
            '<p class="govuk-body">%1<br>%2</p>',
            Item().path('detailsNo').pipe(Transformer.String.EscapeHtml()),
            Item().path('notes').pipe(Transformer.String.EscapeHtml()),
          ),
        )
        .else(Format('<p class="govuk-body">%1</p>', Item().path('detailsNo').pipe(Transformer.String.EscapeHtml()))),
    )
    .else(
      when(Item().path('detailsCouldNotAnswer').match(Condition.IsRequired()))
        .then(
          when(Item().path('notes').match(Condition.IsRequired()))
            .then(
              Format(
                '<p class="govuk-body">%1<br>%2</p>',
                Item().path('detailsCouldNotAnswer').pipe(Transformer.String.EscapeHtml()),
                Item().path('notes').pipe(Transformer.String.EscapeHtml()),
              ),
            )
            .else(
              Format(
                '<p class="govuk-body">%1</p>',
                Item().path('detailsCouldNotAnswer').pipe(Transformer.String.EscapeHtml()),
              ),
            ),
        )
        .else(
          when(Item().path('notes').match(Condition.IsRequired()))
            .then(Format('<p class="govuk-body">%1</p>', Item().path('notes').pipe(Transformer.String.EscapeHtml())))
            .else(''),
        ),
    ),
)

/**
 * Renders a newly created goal history entry.
 * Shows: heading (bold), goal title (bold).
 * For READ_WRITE users, also shows a "View goal" link.
 */
const goalAddedEntryContent = Format(
  `<div class="govuk-!-margin-bottom-6">
    <p class="govuk-body"><strong>Goal created</strong> on %1 by %2</p>
    <p class="govuk-body"><strong>%3</strong></p>
    %4
  </div>`,
  // %1: Date
  Item().path('date').pipe(Transformer.Date.ToUKLongDate()),
  // %2: created by
  when(Item().path('createdBy').match(Condition.IsRequired()))
    .then(Item().path('createdBy').pipe(Transformer.String.EscapeHtml()))
    .else('Unknown'),
  // %3: Goal title
  Item().path('goalTitle').pipe(Transformer.String.EscapeHtml()),
  // %4: View goal link (shown only in READ_WRITE mode)
  when(isReadOnly)
    .then('')
    .else(
      Format(
        '<p class="govuk-body"><a href="../goal/%1/update-goal-steps" class="govuk-link govuk-link--no-visited-state govuk-!-display-none-print">View goal</a></p>',
        Item().path('goalUuid'),
      ),
    ),
)

/**
 * Renders a goal achieved history entry.
 * Shows: heading (bold), goal title (bold), and optional notes.
 * For READ_WRITE users, also shows a "View goal" link.
 */
const goalAchievedEntryContent = Format(
  `<div class="govuk-!-margin-bottom-6">
    <p class="govuk-body"><strong>Goal marked as achieved</strong> on %1 by %2</p>
    <p class="govuk-body"><strong>%3</strong></p>
    %4
    %5
  </div>`,
  // %1: Date
  Item().path('date').pipe(Transformer.Date.ToUKLongDate()),
  // %2: Achieved by
  when(Item().path('achievedBy').match(Condition.IsRequired()))
    .then(Item().path('achievedBy').pipe(Transformer.String.EscapeHtml()))
    .else('Unknown'),
  // %3: Goal title
  Item().path('goalTitle').pipe(Transformer.String.EscapeHtml()),
  // %4: Optional notes
  when(Item().path('notes').match(Condition.IsRequired()))
    .then(Format('<p class="govuk-body">%1</p>', Item().path('notes').pipe(Transformer.String.EscapeHtml())))
    .else(''),
  // %5: View goal link (shown only in READ_WRITE mode)
  when(isReadOnly)
    .then('')
    .else(
      Format(
        '<p class="govuk-body"><a href="../goal/%1/view-inactive-goal" class="govuk-link govuk-link--no-visited-state govuk-!-display-none-print">View goal</a></p>',
        Item().path('goalUuid'),
      ),
    ),
)

/**
 * Renders a goal removed history entry.
 * Shows: heading (bold), goal title (bold), and removal reason.
 * For READ_WRITE users, also shows:
 * - "View latest version" when the goal is currently active
 * - "View goal" otherwise
 */
const goalRemovedEntryContent = Format(
  `<div class="govuk-!-margin-bottom-6">
    <p class="govuk-body"><strong>Goal removed</strong> on %1 by %2</p>
    <p class="govuk-body"><strong>%3</strong></p>
    %4
    %5
  </div>`,
  // %1: Date
  Item().path('date').pipe(Transformer.Date.ToUKLongDate()),
  // %2: Removed by
  when(Item().path('removedBy').match(Condition.IsRequired()))
    .then(Item().path('removedBy').pipe(Transformer.String.EscapeHtml()))
    .else('Unknown'),
  // %3: Goal title
  Item().path('goalTitle').pipe(Transformer.String.EscapeHtml()),
  // %4: Removal reason
  when(Item().path('reason').match(Condition.IsRequired()))
    .then(Format('<p class="govuk-body">%1</p>', Item().path('reason').pipe(Transformer.String.EscapeHtml())))
    .else(''),
  // %5: View link (shown only in READ_WRITE mode)
  when(isReadOnly)
    .then('')
    .else(
      when(Item().path('isCurrentlyActive').match(Condition.Equals(true)))
        .then(
          Format(
            '<p class="govuk-body"><a href="../goal/%1/update-goal-steps" class="govuk-link govuk-link--no-visited-state govuk-!-display-none-print">View latest version</a></p>',
            Item().path('goalUuid'),
          ),
        )
        .else(
          Format(
            '<p class="govuk-body"><a href="../goal/%1/view-inactive-goal" class="govuk-link govuk-link--no-visited-state govuk-!-display-none-print">View goal</a></p>',
            Item().path('goalUuid'),
          ),
        ),
    ),
)

/**
 * Renders a goal re-added history entry.
 * Shows: heading (bold), goal title (bold), and reason for re-adding.
 * For READ_WRITE users, also shows a "View latest version" link.
 */
const goalReaddedEntryContent = Format(
  `<div class="govuk-!-margin-bottom-6">
    <p class="govuk-body"><strong>Goal added back into plan</strong> on %1 by %2</p>
    <p class="govuk-body"><strong>%3</strong></p>
    %4
    %5
  </div>`,
  // %1: Date
  Item().path('date').pipe(Transformer.Date.ToUKLongDate()),
  // %2: Re-added by
  when(Item().path('readdedBy').match(Condition.IsRequired()))
    .then(Item().path('readdedBy').pipe(Transformer.String.EscapeHtml()))
    .else('Unknown'),
  // %3: Goal title
  Item().path('goalTitle').pipe(Transformer.String.EscapeHtml()),
  // %4: Reason for re-adding
  when(Item().path('reason').match(Condition.IsRequired()))
    .then(Format('<p class="govuk-body">%1</p>', Item().path('reason').pipe(Transformer.String.EscapeHtml())))
    .else(''),
  // %5: View latest version link (shown only in READ_WRITE mode)
  when(isReadOnly)
    .then('')
    .else(
      Format(
        '<p class="govuk-body"><a href="../goal/%1/update-goal-steps" class="govuk-link govuk-link--no-visited-state govuk-!-display-none-print">View latest version</a></p>',
        Item().path('goalUuid'),
      ),
    ),
)

/**
 * Renders a goal updated history entry.
 * Shows: heading (bold), goal title (bold), and optional notes.
 * For READ_WRITE users, also shows a "View latest version" link.
 * Used for: Step status updates and progress note additions.
 */
const goalUpdatedEntryContent = Format(
  `<div class="govuk-!-margin-bottom-6">
    <p class="govuk-body"><strong>Goal updated</strong> on %1 by %2</p>
    <p class="govuk-body"><strong>%3</strong></p>
    %4
    %5
  </div>`,
  // %1: Date
  Item().path('date').pipe(Transformer.Date.ToUKLongDate()),
  // %2: Updated by
  when(Item().path('updatedBy').match(Condition.IsRequired()))
    .then(Item().path('updatedBy').pipe(Transformer.String.EscapeHtml()))
    .else('Unknown'),
  // %3: Goal title
  Item().path('goalTitle').pipe(Transformer.String.EscapeHtml()),
  // %4: Optional notes
  when(Item().path('notes').match(Condition.IsRequired()))
    .then(Format('<p class="govuk-body">%1</p>', Item().path('notes').pipe(Transformer.String.EscapeHtml())))
    .else(''),
  // %5: View latest version link (shown only in READ_WRITE mode)
  when(isReadOnly)
    .then('')
    .else(
      Format(
        '<p class="govuk-body"><a href="../goal/%1/update-goal-steps" class="govuk-link govuk-link--no-visited-state govuk-!-display-none-print">View latest version</a></p>',
        Item().path('goalUuid'),
      ),
    ),
)

/**
 * Displays the unified plan history as a list of entries.
 * Combines plan agreement events, goal achieved events, goal removed events, goal re-added and goal-updated events
 * in chronological order.
 */
export const agreementHistory = CollectionBlock({
  collection: Data('planHistoryEntries').each(
    Iterator.Map(
      HtmlBlock({
        content: Format(
          '%1%2',
          // %1: Section break (shown between entries, not before the first)
          when(Item().index().match(Condition.Equals(0)))
            .then('')
            .else('<hr class="govuk-section-break govuk-section-break--m govuk-section-break--visible">'),
          // %2: Entry content based on type
          match(Item().path('type'))
            .branch(Condition.Equals('goal_achieved'), goalAchievedEntryContent)
            .branch(Condition.Equals('goal_created'), goalAddedEntryContent)
            .branch(Condition.Equals('goal_removed'), goalRemovedEntryContent)
            .branch(Condition.Equals('goal_readded'), goalReaddedEntryContent)
            .branch(Condition.Equals('goal_updated'), goalUpdatedEntryContent)
            .otherwise(agreementEntryContent),
        ),
      }),
    ),
  ),
})

/**
 * Link to update the person's agreement - shown when latest status is COULD_NOT_ANSWER
 */
export const updateAgreementLink = GovUKBody({
  hidden: or(isReadOnly, Data('latestAgreementStatus').not.match(Condition.Equals('COULD_NOT_ANSWER'))),
  text: Format(
    '<a href="update-agree-plan" class="govuk-link govuk-link--no-visited-state govuk-!-display-none-print">Update %1\'s agreement</a>',
    CaseData.Forename,
  ),
})

export const backToTopLink = GovUKBody({
  text: '<a href="#" class="govuk-link govuk-!-display-none-print">↑ Back to top</a>',
})
