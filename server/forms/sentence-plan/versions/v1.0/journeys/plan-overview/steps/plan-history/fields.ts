import { Data, Format, Item, when } from '@form-engine/form/builders'
import { Iterator } from '@form-engine/form/builders/IteratorBuilder'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { CollectionBlock } from '@form-engine/registry/components/collectionBlock'
import { Condition } from '@form-engine/registry/conditions'
import { Transformer } from '@form-engine/registry/transformers'
import { CaseData } from '../../../../constants'

export const subtitleText = HtmlBlock({
  content: '<p class="govuk-body">View all updates and changes made to this plan.</p>',
})

export const sectionBreak = HtmlBlock({
  content: '<hr class="govuk-section-break govuk-section-break--m govuk-section-break--visible">',
})

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
  when(
    Item()
      .path('status')
      .match(Condition.Array.IsIn(['UPDATED_AGREED', 'UPDATED_DO_NOT_AGREE'])),
  )
    .then('Agreement updated')
    .else(
      when(Item().path('status').match(Condition.Equals('AGREED')))
        .then('Plan agreed')
        .else('Plan created'),
    ),
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
  when(
    Item()
      .path('status')
      .match(Condition.Array.IsIn(['AGREED', 'UPDATED_AGREED'])),
  )
    .then(Format('%1 agreed to this plan.', CaseData.Forename))
    .else(
      when(
        Item()
          .path('status')
          .match(Condition.Array.IsIn(['DO_NOT_AGREE', 'UPDATED_DO_NOT_AGREE'])),
      )
        .then(Format('%1 did not agree to this plan.', CaseData.Forename))
        .else(Format('%1 could not answer.', CaseData.Forename)),
    ),
  // %6: Reason details and optional notes combined in a single paragraph
  when(Item().path('detailsNo').match(Condition.IsRequired()))
    .then(
      when(Item().path('notes').match(Condition.IsRequired()))
        .then(Format('<p class="govuk-body">%1<br>%2</p>', Item().path('detailsNo'), Item().path('notes')))
        .else(Format('<p class="govuk-body">%1</p>', Item().path('detailsNo'))),
    )
    .else(
      when(Item().path('detailsCouldNotAnswer').match(Condition.IsRequired()))
        .then(
          when(Item().path('notes').match(Condition.IsRequired()))
            .then(
              Format('<p class="govuk-body">%1<br>%2</p>', Item().path('detailsCouldNotAnswer'), Item().path('notes')),
            )
            .else(Format('<p class="govuk-body">%1</p>', Item().path('detailsCouldNotAnswer'))),
        )
        .else(
          when(Item().path('notes').match(Condition.IsRequired()))
            .then(Format('<p class="govuk-body">%1</p>', Item().path('notes')))
            .else(''),
        ),
    ),
)

/**
 * Renders a goal achieved history entry.
 * Shows: heading (bold), goal title (bold), optional notes, and view goal link.
 */
const goalAchievedEntryContent = Format(
  `<div class="govuk-!-margin-bottom-6">
    <p class="govuk-body"><strong>Goal marked as achieved</strong> on %1 by %2</p>
    <p class="govuk-body"><strong>%3</strong></p>
    %4
    <p class="govuk-body"><a href="%5" class="govuk-link govuk-link--no-visited-state">View goal</a></p>
  </div>`,
  // %1: Date
  Item().path('date').pipe(Transformer.Date.ToUKLongDate()),
  // %2: Achieved by
  when(Item().path('achievedBy').match(Condition.IsRequired())).then(Item().path('achievedBy')).else('Unknown'),
  // %3: Goal title
  Item().path('goalTitle'),
  // %4: Optional notes
  when(Item().path('notes').match(Condition.IsRequired()))
    .then(Format('<p class="govuk-body">%1</p>', Item().path('notes')))
    .else(''),
  // %5: View goal link (relative to /v1.0/plan/, so ../goal/ resolves to /v1.0/goal/)
  Format('../goal/%1/view-inactive-goal', Item().path('goalUuid')),
)

/**
 * Displays the unified plan history as a list of entries.
 * Combines plan agreement events and goal achieved events in chronological order.
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
          when(Item().path('type').match(Condition.Equals('goal_achieved')))
            .then(goalAchievedEntryContent)
            .else(agreementEntryContent),
        ),
      }),
    ),
  ),
})

/**
 * Link to update the person's agreement - shown when latest status is COULD_NOT_ANSWER
 */
export const updateAgreementLink = HtmlBlock({
  hidden: Data('latestAgreementStatus').not.match(Condition.Equals('COULD_NOT_ANSWER')),
  content: Format(
    '<p class="govuk-body"><a href="#" class="govuk-link govuk-link--no-visited-state">Update %1\'s agreement</a></p>',
    CaseData.Forename,
  ),
})

export const backToTopLink = HtmlBlock({
  content: '<p class="govuk-body"><a href="#" class="govuk-link">↑ Back to top</a></p>',
})
