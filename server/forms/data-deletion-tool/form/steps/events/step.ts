import {
  Answer,
  Condition,
  Format,
  Item,
  Iterator,
  redirect,
  Session,
  step,
  submit,
  Transformer, validation
} from '@ministryofjustice/hmpps-forge/core/authoring'
import {
  GovUKButton, GovUKCheckboxInput, GovUKGridRow, GovUKHeading, GovUKSummaryList, GovUKTable, GovUKTag,
  GovUKTextareaInput,
} from '@ministryofjustice/hmpps-forge/govuk-components'
import { DataDeletionToolEffects } from '../../../effects'
import { BlockDefinition, HtmlBlock, ResolvableString } from '@ministryofjustice/hmpps-forge/core/components'
import { DataDeletionToolTransformers } from '../../../transformers'

const cardItem = (key: ResolvableString, value: ResolvableString | BlockDefinition) => HtmlBlock({
  classes: 'govuk-summary-list__row',
  content: [
    HtmlBlock({
      tag: 'dt',
      classes: 'govuk-summary-list__key',
      content: key,
    }),
    HtmlBlock({
      tag: 'dd',
      classes: 'govuk-summary-list__value',
      content: value
    }),
  ]
})

export const eventsStep = step({
  path: '/events',
  title: 'Events',
  onSubmission: [
    submit({
      validate: true,
      onValid: {
        effects: [
          DataDeletionToolEffects.saveAnswers(),
          DataDeletionToolEffects.deletionDryRun(),
        ],
        next: [redirect({ goto: 'timeline' })],
      },
    })
  ],
  blocks: [
    GovUKGridRow({
      classes: 'events-table',
      columns: [
        {
          width: 'one-half',
          blocks: [
            // {{ govukSummaryList({
            //   card: {
            //     title: {
            //       text: "University of Gloucestershire"
            //     },
            //     actions: {
            //       items: [
            //         {
            //           href: "#",
            //           text: "Delete choice"
            //         },
            //         {
            //           href: "#",
            //           text: "Withdraw"
            //         }
            //       ]
            //     }
            //   },
            //   rows: [
            //     {
            //       key: {
            //         text: "Course"
            //       },
            //       value: {
            //         html: "English (3DMD)<br>PGCE with QTS full time"
            //       }
            //     },
            //     {
            //       key: {
            //         text: "Location"
            //       },
            //       value: {
            //         html: "School name<br>Road, City, SW1 1AA"
            //       }
            //     }
            //   ]
            // }) }}
          ]
        }
      ],
    }),
    HtmlBlock({
      classes: 'events-table',
      content: Session('currentData.events').each(
        Iterator.Map(
          HtmlBlock({
            classes: 'govuk-summary-card',
            content: [
              HtmlBlock({
                classes: 'govuk-summary-card__title-wrapper',
                content: HtmlBlock({
                  tag: 'h2',
                  classes: 'govuk-summary-card__title',
                  content: Item().path('data.type'),
                })
              }),
              HtmlBlock({
                classes: 'govuk-summary-card__content',
                content: HtmlBlock({
                  tag: 'dl',
                  classes: 'govuk-summary-list',
                  content: [
                    cardItem('Position', Item().path('position')),
                    cardItem('Created', Item().path('createdAt')),
                    cardItem('UUID', Item().path('uuid')),
                    cardItem('Data', HtmlBlock({
                      tag: 'pre',
                      content: Item().path('data').pipe(DataDeletionToolTransformers.JSONStringify())
                    })),
                    cardItem('Actions', )
                  ],
                })
              }),
            ],
          })
        )
      ),
    }),
    GovUKTable({
      head: [
        { text: 'Event type' },
        { text: 'Position' },
        { text: 'Created at' },
        { text: 'UUID' },
      ],
      rows: Session('currentData.events').each(
        Iterator.Map([
          [
            { text: Item().path('data.type'), classes: 'event-row' },
            { text: Item().path('position'), classes: 'event-row' },
            { text: Item().path('createdAt'), classes: 'event-row' },
            { text: Item().path('uuid'), classes: 'event-row' },
          ],
          [
            {
              html: GovUKGridRow({
                columns: [
                  {
                    width: 'one-half',
                    blocks: [
                      HtmlBlock({
                        classes: 'event-data',
                        content: [
                          GovUKTag({
                            text: 'Data',
                            classes: 'govuk-tag--grey',
                          }),
                          HtmlBlock({
                            tag: 'pre',
                            content: Item().path('data').pipe(DataDeletionToolTransformers.JSONStringify())
                          })
                        ],
                      })
                    ],
                  },
                  {
                    width: 'one-half',
                    blocks: [
                      GovUKCheckboxInput({
                        code: Format('event-action-%1', Item().path('uuid')),
                        classes: 'govuk-checkboxes--small',
                        formGroup: {
                          classes: 'govuk-!-static-margin-0',
                        },
                        fieldset: {
                          legend: {
                            text: 'Actions',
                            isPageHeading: false,
                            classes: 'govuk-fieldset__legend--s',
                          }
                        },
                        items: [
                          {
                            value: 'DELETE',
                            text: 'Delete',
                            behaviour: 'exclusive',
                          },
                          {
                            value: 'UPDATE',
                            text: 'Edit',
                            behaviour: 'exclusive',
                            block: GovUKTextareaInput({
                              code: Format('event-data-%1', Item().path('uuid')),
                              label: {
                                text: 'Data',
                                classes: 'govuk-label--s',
                              },
                              rows: 8,
                              defaultValue: Item().path('data').pipe(DataDeletionToolTransformers.JSONStringify()),
                              dependentWhen: Answer(Format('event-action-%1', Item().path('uuid')))
                                .match(Condition.Array.Contains('UPDATE')),
                            }),
                          }
                        ],
                      })
                    ],
                  },
                ]
              }),
              colspan: 4,
            }
          ],
        ]),
      ),
    }),
    GovUKButton({
      text: 'Next',
      name: 'action',
      value: 'next',
      preventDoubleClick: true,
    }),
  ],
})
