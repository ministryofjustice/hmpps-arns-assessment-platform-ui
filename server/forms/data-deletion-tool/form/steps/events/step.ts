import {
  Answer,
  Condition,
  Format,
  Item,
  Iterator,
  redirect,
  Session,
  step,
  submit, tieBreaker, validation, when,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import {
  GovUKButton, GovUKCheckboxInput, GovUKSummaryList,
  GovUKTextareaInput,
} from '@ministryofjustice/hmpps-forge/govuk-components'
import { DataDeletionToolEffects } from '../../../effects'
import { HtmlBlock } from '@ministryofjustice/hmpps-forge/core/components'
import { DataDeletionToolTransformers } from '../../../transformers'
import { Outdent } from '../../../components/outdent/outdent';

export const eventsStep = step({
  path: '/events',
  title: 'Events',
  reachability: {
    entryWhen: Session('currentData').match(Condition.Object.IsObject()),
    tieBreakers: [tieBreaker({ priority: 20 })],
  },
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
        next: [redirect({ goto: 'timeline' })],
      }
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
                <li>%1</li>
              </ul>
            </div>
          </div>
        </div>
        `,
        when(Session('deletionResponse').path('exception').match(Condition.Object.IsObject()))
          .then(
            when(Session('deletionResponse').path('exception').match(Condition.Object.PropertyHasValue('eventUuid')))
              .then(Format('<a href="#%1">Could not aggregate %2</a>', Session('deletionResponse').path('exception.eventUuid'), Session('deletionResponse').path('exception.eventName')))
              .else(Format('<a href="#">%1</a>', Session('deletionResponse').path('exception.cause.developerMessage')))
          )
          .else('')
      ),
    }),
    HtmlBlock({
      classes: 'data-list',
      content: Session('currentData.events').each(
        Iterator.Map(
          Outdent({
            outdentBy: 10,
            block: GovUKSummaryList({
              card: {
                title: { text: Item().path('data.type') },
                attributes: { id: Item().path('uuid') },
                classes: Format(
                  'govuk-summary-card %1',
                  when(Session('deletionResponse').path('exception.eventUuid').match(Condition.Equals(Item().path('uuid'))))
                    .then('govuk-summary-card--error').else('')
                )
              },
              rows: [
                {
                  key: { text: 'Error' },
                  value: {
                    blocks: [
                      HtmlBlock({
                        tag: 'p',
                        classes: 'govuk-error-message',
                        content: Session('deletionResponse').path('exception.cause.developerMessage'),
                      }),
                    ]
                  },
                  visibleWhen: Session('deletionResponse').path('exception.eventUuid').match(Condition.Equals(Item().path('uuid'))),
                },
                {
                  key: {text: 'Position'},
                  value: {text: Item().path('position')},
                },
                {
                  key: {text: 'Created'},
                  value: {text: Item().path('createdAt')},
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
                  key: {text: 'Actions'},
                  value: {
                    blocks: [
                      GovUKCheckboxInput({
                        code: Format('event-action-%1', Item().path('uuid')),
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
                            block: GovUKTextareaInput({
                              code: Format('event-data-%1', Item().path('uuid')),
                              label: {
                                text: 'Data',
                                classes: 'govuk-label--s',
                              },
                              rows: 12,
                              defaultValue: Item().path('data').pipe(DataDeletionToolTransformers.JSONStringify()),
                              dependentWhen: Answer(Format('event-action-%1', Item().path('uuid')))
                                .match(Condition.Array.Contains('UPDATE')),
                            }),
                          }
                        ],
                      })
                    ]
                  },
                }
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
