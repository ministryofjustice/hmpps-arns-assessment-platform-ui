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
  submit, validation,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import {
  GovUKButton, GovUKCheckboxInput, GovUKSummaryList,
  GovUKTextareaInput, GovUKTextInput,
} from '@ministryofjustice/hmpps-forge/govuk-components'
import { DataDeletionToolEffects } from '../../../effects'
import { HtmlBlock } from '@ministryofjustice/hmpps-forge/core/components'
import { DataDeletionToolTransformers } from '../../../transformers'
import { Outdent } from '../../../components/outdent/outdent'

export const timelineStep = step({
  path: '/timeline',
  title: 'Timeline',
  onSubmission: [
    submit({
      validate: true,
      onAlways: {
        effects: [
          DataDeletionToolEffects.saveAnswers(),
          DataDeletionToolEffects.createDeletionRequest(),
          DataDeletionToolEffects.deletionDryRun(),
        ],
      },
      onValid: {
        next: [redirect({ goto: 'summary' })],
      },
    })
  ],
  validWhen: [
    validation({
      condition: Session('deletionResponse').path('success').match(Condition.Equals(true)),
      message: 'Data deletion exception',
    }),
  ],
  blocks: [
    HtmlBlock({
      visibleWhen: Session('deletionResponse').path('exception').match(Condition.Object.IsObject()),
      content: Format(
        `
        <div class="govuk-error-summary" data-module="govuk-error-summary">
          <div role="alert">
            <h2 class="govuk-error-summary__title">
              There is a problem
            </h2>
            <div class="govuk-error-summary__body">
              <ul class="govuk-list govuk-error-summary__list">
                <li>
                  <a href="#">%1</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        `,
        Session('deletionResponse').path('exception.cause.developerMessage'),
      ),
    }),
    HtmlBlock({
      classes: 'data-list',
      content: Session('currentData.timeline').each(
        Iterator.Map(
          Outdent({
            outdentBy: 10,
            block: GovUKSummaryList({
              card: {
                title: { text: Item().path('event') },
              },
              rows: [
                {
                  key: {text: 'Position'},
                  value: {text: Item().path('position')},
                },
                {
                  key: {text: 'Created'},
                  value: {text: Item().path('timestamp')},
                },
                {
                  key: {text: 'UUID'},
                  value: {text: Item().path('uuid')},
                },
                {
                  key: {text: 'Data'},
                  value: {html: Format("<pre>\n%1</pre>", Item().path('data').pipe(DataDeletionToolTransformers.JSONStringify()))},
                },
                {
                  key: {text: 'Custom type'},
                  value: {text: Item().path('customType')},
                },
                {
                  key: {text: 'Custom data'},
                  value: {html: Format("<pre>\n%1</pre>", Item().path('customData').pipe(DataDeletionToolTransformers.JSONStringify()))},
                },
                {
                  key: {text: 'Actions'},
                  value: {
                    blocks: [
                      GovUKCheckboxInput({
                        code: Format('timeline-action-%1', Item().path('uuid')),
                        classes: 'govuk-checkboxes--small',
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
                                rows: 12,
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
                                rows: 12,
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
                },
              ],
            })
          })
        )
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
