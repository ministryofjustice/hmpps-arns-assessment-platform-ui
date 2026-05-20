import {
  and,
  Answer,
  Condition,
  Format,
  Item,
  Iterator,
  redirect,
  Session,
  step,
  submit,
  Transformer, when
} from '@ministryofjustice/hmpps-forge/core/authoring'
import {
  GovUKButton, GovUKCheckboxInput, GovUKGridRow, GovUKTable, GovUKTag,
  GovUKTextareaInput, GovUKTextInput,
} from '@ministryofjustice/hmpps-forge/govuk-components'
import { DataDeletionToolEffects } from '../../../effects'
import { HtmlBlock } from '@ministryofjustice/hmpps-forge/core/components'
import { DataDeletionToolTransformers } from '../../../transformers'

export const timelineStep = step({
  path: '/timeline',
  title: 'Timeline',
  onSubmission: [
    submit({
      validate: true,
      onValid: {
        effects: [
          DataDeletionToolEffects.saveAnswers(),
          DataDeletionToolEffects.deletionDryRun(),
        ],
        next: [redirect({ goto: 'summary' })],
      },
    })
  ],
  blocks: [
    GovUKTable({
      classes: 'timeline-table',
      head: [
        { text: 'Event | Custom type' },
        { text: 'Created at' },
        { text: 'UUID' },
      ],
      rows: Session('currentData.timeline').each(
        Iterator.Map([
          [
            {
              text: Format(
                '%1 | %2',
                when(Item().value().match(Condition.Object.PropertyHasValue('event')))
                  .then(Item().path('event'))
                  .else('n/a'),
                when(Item().value().match(Condition.Object.PropertyHasValue('customType')))
                  .then(Item().path('customType'))
                  .else('n/a'),
              ),
              classes: 'timeline-item-row',
            },
            { text: Item().path('timestamp'), classes: 'timeline-item-row' },
            { text: Item().path('uuid'), classes: 'timeline-item-row' },
          ],
          [
            {
              html: GovUKGridRow({
                columns: [
                  {
                    width: 'one-half',
                    blocks: [
                      HtmlBlock({
                        classes: 'timeline-item-data',
                        visibleWhen: Item().value().match(Condition.Object.PropertyHasValue('data')),
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
                      }),
                      HtmlBlock({
                        classes: 'timeline-item-data',
                        visibleWhen: Item().value().match(Condition.Object.PropertyHasValue('customData')),
                        content: [
                          GovUKTag({
                            text: 'Custom data',
                            classes: 'govuk-tag--grey',
                          }),
                          HtmlBlock({
                            tag: 'pre',
                            content: Item().path('customData').pipe(DataDeletionToolTransformers.JSONStringify())
                          }),
                        ],
                      })
                    ],
                  },
                  {
                    width: 'one-half',
                    blocks: [
                      GovUKCheckboxInput({
                        code: Format('timeline-action-%1', Item().path('uuid')),
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
                            block: [
                              GovUKTextInput({
                                code: Format('timeline-event-%1', Item().path('uuid')),
                                label: {
                                  text: 'Event',
                                  classes: 'govuk-label--s',
                                },
                                defaultValue: Item().path('event'),
                                dependentWhen: and(
                                  Item().value().match(Condition.Object.PropertyHasValue('event')),
                                  Answer(Format('timeline-action-%1', Item().path('uuid')))
                                    .match(Condition.Array.Contains('UPDATE')),
                                ),
                              }),
                              GovUKTextareaInput({
                                code: Format('timeline-data-%1', Item().path('uuid')),
                                label: {
                                  text: 'Data',
                                  classes: 'govuk-label--s',
                                },
                                rows: 8,
                                defaultValue: Item().path('data').pipe(DataDeletionToolTransformers.JSONStringify()),
                                dependentWhen: and(
                                  Item().value().match(Condition.Object.PropertyHasValue('data')),
                                  Answer(Format('timeline-action-%1', Item().path('uuid')))
                                    .match(Condition.Array.Contains('UPDATE')),
                                ),
                              }),
                              GovUKTextInput({
                                code: Format('timeline-custom-type-%1', Item().path('uuid')),
                                label: {
                                  text: 'Custom type',
                                  classes: 'govuk-label--s',
                                },
                                defaultValue: Item().path('customType'),
                                dependentWhen: and(
                                  Item().value().match(Condition.Object.PropertyHasValue('customType')),
                                  Answer(Format('timeline-action-%1', Item().path('uuid')))
                                    .match(Condition.Array.Contains('UPDATE')),
                                ),
                              }),
                              GovUKTextareaInput({
                                code: Format('timeline-custom-data-%1', Item().path('uuid')),
                                label: {
                                  text: 'Custom data',
                                  classes: 'govuk-label--s',
                                },
                                rows: 8,
                                defaultValue: Item().path('customData').pipe(DataDeletionToolTransformers.JSONStringify()),
                                dependentWhen: and(
                                  Item().value().match(Condition.Object.PropertyHasValue('customData')),
                                  Answer(Format('timeline-action-%1', Item().path('uuid')))
                                    .match(Condition.Array.Contains('UPDATE')),
                                ),
                              }),
                            ],
                          }
                        ],
                      })
                    ],
                  },
                ]
              }),
              colspan: 3,
            }
          ],
        ]),
      ).pipe(Transformer.Array.Flatten()),
    }),
    GovUKButton({
      text: 'Next',
      name: 'action',
      value: 'next',
      preventDoubleClick: true,
    }),
  ],
})
