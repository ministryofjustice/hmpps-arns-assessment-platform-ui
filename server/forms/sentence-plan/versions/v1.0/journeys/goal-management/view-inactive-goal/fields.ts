import { Data, Format, Item, when } from '@form-engine/form/builders'
import { GovUKDetails, GovUKTag, GovUKLinkButton } from '@form-engine-govuk-components/components'
import { Transformer } from '@form-engine/registry/transformers'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { CollectionBlock } from '@form-engine/registry/components/collectionBlock'
import { Iterator } from '@form-engine/form/builders/IteratorBuilder'
import { Condition } from '@form-engine/registry/conditions'
import { GovUKHeading } from '@form-engine-govuk-components/wrappers/govukHeading'
import { GovUKBody } from '@form-engine-govuk-components/wrappers/govukBody'

/**
 * Shared fields for viewing inactive goals (achieved or removed)
 */

const relatedAreasOfNeedText = Data('activeGoal.relatedAreasOfNeedLabels').pipe(
  Transformer.Array.Join(', '),
  Transformer.String.ToLowerCase(),
)

export const pageHeading = GovUKHeading({
  caption: when(Data('activeGoal.relatedAreasOfNeedLabels').match(Condition.IsRequired()))
    .then(
      Format(
        '%1 (and %2)',
        Data('activeGoal.areaOfNeedLabel').pipe(Transformer.String.EscapeHtml()),
        relatedAreasOfNeedText.pipe(Transformer.String.EscapeHtml()),
      ),
    )
    .else(Data('activeGoal.areaOfNeedLabel').pipe(Transformer.String.EscapeHtml())),
  text: 'View goal details',
  classes: 'govuk-!-margin-bottom-2',
})

export const goalSubheading = GovUKHeading({
  text: Format('Goal: %1', Data('activeGoal.title').pipe(Transformer.String.EscapeHtml())),
  size: 'm',
  classes: 'govuk-!-margin-bottom-2',
})

export const goalAchievedInfo = GovUKBody({
  hidden: Data('activeGoal.status').not.match(Condition.Equals('ACHIEVED')),
  text: Format('Marked as achieved on %1.', Data('activeGoal.statusDate').pipe(Transformer.Date.ToUKLongDate())),
})

export const goalRemovedInfo = GovUKBody({
  hidden: Data('activeGoal.status').not.match(Condition.Equals('REMOVED')),
  text: Format('Removed on %1.', Data('activeGoal.statusDate').pipe(Transformer.Date.ToUKLongDate())),
})

const reviewStepsTable = TemplateWrapper({
  template: `
    <table class="govuk-table goal-summary-card__steps">
      <thead class="govuk-table__head">
        <tr class="govuk-table__row">
          <th scope="col" class="govuk-table__header">Who will do this</th>
          <th scope="col" class="govuk-table__header">Steps</th>
          <th scope="col" class="govuk-table__header">Status</th>
        </tr>
      </thead>
      <tbody class="govuk-table__body">
        {{slot:steps}}
      </tbody>
    </table>
  `,
  slots: {
    steps: [
      CollectionBlock({
        collection: Data('activeGoal.steps').each(
          Iterator.Map(
            TemplateWrapper({
              template: Format(
                `<tr class="govuk-table__row">
                  <td class="govuk-table__cell">%1</td>
                  <td class="govuk-table__cell">%2</td>
                  <td class="govuk-table__cell">{{slot:statusField}}</td>
                </tr>`,
                Item().path('actorLabel').pipe(Transformer.String.EscapeHtml()),
                Item().path('description').pipe(Transformer.String.EscapeHtml()),
              ),
              slots: {
                statusField: [
                  GovUKTag({
                    text: 'Not started',
                    classes: 'govuk-tag--grey',
                    hidden: Item().path('status').not.match(Condition.Equals('NOT_STARTED')),
                  }),
                  GovUKTag({
                    text: 'In progress',
                    hidden: Item().path('status').not.match(Condition.Equals('IN_PROGRESS')),
                  }),
                  GovUKTag({
                    text: 'Completed',
                    classes: 'govuk-tag--green',
                    hidden: Item().path('status').not.match(Condition.Equals('COMPLETED')),
                  }),
                  GovUKTag({
                    text: 'Cannot be done yet',
                    classes: 'govuk-tag--purple',
                    hidden: Item().path('status').not.match(Condition.Equals('CANNOT_BE_DONE_YET')),
                  }),
                  GovUKTag({
                    text: 'No longer needed',
                    classes: 'govuk-tag--yellow',
                    hidden: Item().path('status').not.match(Condition.Equals('NO_LONGER_NEEDED')),
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

const noStepsMessage = GovUKBody({ text: 'No steps were added to this goal.' })

export const reviewStepsSection = TemplateWrapper({
  template: when(Data('activeGoal.steps.length').match(Condition.Number.GreaterThan(0)))
    .then(
      `<div>
      {{slot:table}}
    </div>`,
    )
    .else(
      `<div>
      {{slot:noStepsMessage}}
    </div>`,
    ),
  slots: {
    table: [reviewStepsTable],
    noStepsMessage: [noStepsMessage],
  },
})

export const viewAllNotesSection = GovUKDetails({
  summaryText: 'View all notes',
  content: [
    TemplateWrapper({
      template: when(Data('activeGoal.notes').not.match(Condition.IsRequired()))
        .then('<p class="govuk-body">There are no notes on this goal yet.</p>')
        .else('{{slot:notesList}}'),
      slots: {
        notesList: [
          CollectionBlock({
            collection: Data('activeGoal.notes').each(
              Iterator.Map(
                TemplateWrapper({
                  template: Format(
                    `<label class="govuk-heading-s">%1 by %2</label>{{slot:typeLabel}}<p class="goal-note">%3</p>`,
                    Item().path('createdAt').pipe(Transformer.Date.ToUKLongDate()),
                    Item().path('createdBy'),
                    Item().path('note').pipe(Transformer.String.EscapeHtml()),
                  ),
                  slots: {
                    typeLabel: [
                      GovUKBody({
                        hidden: Item().path('type').not.match(Condition.Equals('READDED')),
                        text: Format(
                          'Goal added back into plan on %1.',
                          Item().path('createdAt').pipe(Transformer.Date.ToUKLongDate()),
                        ),
                      }),
                      GovUKBody({
                        hidden: Item().path('type').not.match(Condition.Equals('REMOVED')),
                        text: Format(
                          'Goal removed on %1.',
                          Item().path('createdAt').pipe(Transformer.Date.ToUKLongDate()),
                        ),
                      }),
                    ],
                  },
                }),
              ),
            ),
          }),
        ],
      },
    }),
  ],
})

export const addToPlanButton = GovUKLinkButton({
  text: 'Add to plan',
  href: 'confirm-readd-goal',
  classes: 'govuk-button--secondary',
  hidden: Data('activeGoal.status').not.match(Condition.Equals('REMOVED')),
})
