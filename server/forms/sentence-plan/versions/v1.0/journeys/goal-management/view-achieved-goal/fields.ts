import { block, Data, Format, Item, when } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { GovUKDetails } from '@form-engine-govuk-components/components'
import { Transformer } from '@form-engine/registry/transformers'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { CollectionBlock } from '@form-engine/registry/components/collectionBlock'
import { Iterator } from '@form-engine/form/builders/IteratorBuilder'
import { Condition } from '@form-engine/registry/conditions'

export const pageHeading = block<HtmlBlock>({
  variant: 'html',
  content: Format(
    `<span class="govuk-caption-l">%1</span>
    <h1 class="govuk-heading-l">View goal details</h1>
    <h2 class="govuk-heading-m">Goal: %2</h2>`,
    Data('activeGoal.areaOfNeedLabel'),
    Data('activeGoal.title'),
  ),
})

export const goalInfo = block<HtmlBlock>({
  variant: 'html',
  content: Format(
    `<p class="govuk-body">Marked as achieved on %1.`,
    Data('achieved.statusDate').pipe(Transformer.Date.ToUKLongDate()),
    Data('activeGoal.uuid'),
  ),
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
                Item().path('actorLabel'),
                Item().path('description'),
              ),
              slots: {
                statusField: [
                  block<HtmlBlock>({
                    variant: 'html',
                    content: when(Item().path('status').match(Condition.Equals('NOT_STARTED')))
                      .then('<strong class="govuk-tag govuk-tag--grey">Not started</strong>')
                      .else(
                        when(Item().path('status').match(Condition.Equals('IN_PROGRESS')))
                          .then('<strong class="govuk-tag">In progress</strong>')
                          .else(
                            when(Item().path('status').match(Condition.Equals('COMPLETED')))
                              .then('<strong class="govuk-tag govuk-tag--green">Completed</strong>')
                              .else(
                                when(Item().path('status').match(Condition.Equals('CANNOT_BE_DONE_YET')))
                                  .then('<strong class="govuk-tag govuk-tag--purple">Cannot be done yet</strong>')
                                  .else(
                                    when(Item().path('status').match(Condition.Equals('NO_LONGER_NEEDED')))
                                      .then('<strong class="govuk-tag govuk-tag--yellow">No longer needed</strong>')
                                      .else('<strong class="govuk-tag govuk-tag--grey">Unknown</strong>'),
                                  ),
                              ),
                          ),
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
})

export const reviewStepsSection = TemplateWrapper({
  template: `
    <div>
      {{slot:heading}}
      {{slot:table}}
    </div>
  `,
  slots: {
    table: [reviewStepsTable],
  },
})

export const viewAllNotesSection = block<GovUKDetails>({
  variant: 'govukDetails',
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
                    `<label class="govuk-heading-s">%1 by %2</label>
                    <p class="goal-note">%3</p>`,
                    Item().path('createdAt').pipe(Transformer.Date.ToUKLongDate()),
                    Item().path('createdBy'),
                    Item().path('note'),
                  ),
                  slots: {},
                }),
              ),
            ),
          }),
        ],
      },
    }),
  ],
})
