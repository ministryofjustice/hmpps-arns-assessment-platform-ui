import {
  access,
  and,
  Answer,
  Condition,
  Format,
  Item,
  Iterator,
  or,
  Query,
  redirect,
  Self,
  Session,
  step,
  submit,
  tieBreaker,
  validation,
  when,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import {
  GovUKButton,
  GovUKCheckboxInput,
  GovUKNotificationBanner,
  GovUKSummaryList,
  GovUKTextareaInput,
} from '@ministryofjustice/hmpps-forge/govuk-components'
import { HtmlBlock } from '@ministryofjustice/hmpps-forge/core/components'
import { DataDeletionToolEffects } from '../../../effects'
import { DataDeletionToolTransformers } from '../../../transformers'
import { Outdent } from '../../../components/outdent/outdent'
import { DataDeletionConditions } from '../../../conditions'

export const eventsStep = step({
  path: '/events',
  title: 'Events',
  reachability: {
    entryWhen: Session('currentData').match(Condition.Object.IsObject()),
    tieBreakers: [tieBreaker({ priority: 15 })],
  },
  onAccess: [
    access({
      when: Session('currentData').not.match(Condition.Object.IsObject()),
      next: [redirect({ goto: 'configuration' })],
    }),
  ],
  onSubmission: [
    submit({
      validate: true,
      onAlways: {
        effects: [DataDeletionToolEffects.saveAnswers(), DataDeletionToolEffects.clearDeletionResponse()],
      },
      onValid: {
        effects: [DataDeletionToolEffects.createDeletionRequest(), DataDeletionToolEffects.deletionDryRun()],
        next: [redirect({ goto: 'events?valid=true' })],
      },
    }),
  ],
  blocks: [
    GovUKNotificationBanner({
      visibleWhen: and(
        Query('valid').match(Condition.IsRequired()),
        Session('deletionResponse').path('success').match(Condition.Equals(true)),
      ),
      bannerType: 'success',
      html: `<p>The events deletion data is valid. Continue to <a href="timeline">Timeline</a></p>`,
    }),
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
              .then(
                Format(
                  '<a href="#%1">Could not aggregate %2</a>',
                  Session('deletionResponse').path('exception.eventUuid'),
                  Session('deletionResponse').path('exception.eventName'),
                ),
              )
              .else(Format('<a href="#">%1</a>', Session('deletionResponse').path('exception.cause.developerMessage'))),
          )
          .else(''),
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
                  when(
                    Session('deletionResponse').path('exception.eventUuid').match(Condition.Equals(Item().path('uuid'))),
                  )
                    .then('govuk-summary-card--error').else(''),
                ),
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
                    ],
                  },
                  visibleWhen: Session('deletionResponse').path('exception.eventUuid').match(Condition.Equals(Item().path('uuid'))),
                },
                {
                  key: { text: 'Position' },
                  value: { text: Item().path('position') },
                },
                {
                  key: { text: 'Created' },
                  value: { text: Item().path('createdAt') },
                },
                {
                  key: { text: 'UUID' },
                  value: { text: Item().path('uuid') },
                },
                {
                  key: { text: 'Data' },
                  value: {
                    html: Format(
                      '<pre>\n%1</pre>',
                      Item().path('data').pipe(DataDeletionToolTransformers.JSONStringify()),
                    ),
                  },
                },
                {
                  key: { text: 'Actions' },
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
                              validWhen: [
                                validation({
                                  condition: or(
                                    Answer(Format('event-action-%1', Item().path('uuid'))).not.match(
                                      Condition.Array.Contains('UPDATE'),
                                    ),
                                    Self().match(DataDeletionConditions.IsValidJson()),
                                  ),
                                  message: 'Invalid JSON',
                                }),
                              ],
                            }),
                          },
                        ],
                      }),
                    ],
                  },
                },
              ],
            }),
          }),
        ),
      ),
    }),
    GovUKButton({
      text: 'Validate',
      name: 'action',
      value: 'validate',
      preventDoubleClick: true,
    }),
  ],
})
