import {
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
} from '@ministryofjustice/hmpps-forge/core/authoring'
import {
  GovUKButton,
  GovUKCheckboxInput,
  GovUKNotificationBanner,
  GovUKSummaryList,
  GovUKTextareaInput,
  GovUKTextInput,
} from '@ministryofjustice/hmpps-forge/govuk-components'
import { HtmlBlock } from '@ministryofjustice/hmpps-forge/core/components'
import { DataDeletionToolEffects } from '../../../effects'
import { DataDeletionToolTransformers } from '../../../transformers'
import { Outdent } from '../../../components/outdent/outdent'
import { DataDeletionConditions } from '../../../conditions'

export const timelineStep = step({
  path: '/timeline',
  title: 'Timeline',
  reachability: {
    entryWhen: Session('currentData').match(Condition.Object.IsObject()),
    tieBreakers: [tieBreaker({ priority: 20 })],
  },
  onSubmission: [
    submit({
      validate: true,
      onAlways: {
        effects: [DataDeletionToolEffects.saveAnswers(), DataDeletionToolEffects.clearDeletionResponse()],
      },
      onValid: {
        effects: [DataDeletionToolEffects.createDeletionRequest(), DataDeletionToolEffects.deletionDryRun()],
        next: [redirect({ goto: 'timeline?valid=true' })],
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
      html: `<p>The timeline deletion data is valid. Continue to <a href="summary">Summary</a></p>`,
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
                  key: { text: 'Position' },
                  value: { text: Item().path('position') },
                },
                {
                  key: { text: 'Created' },
                  value: { text: Item().path('timestamp') },
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
                  key: { text: 'Custom type' },
                  value: { text: Item().path('customType') },
                },
                {
                  key: { text: 'Custom data' },
                  value: {
                    html: Format(
                      '<pre>\n%1</pre>',
                      Item().path('customData').pipe(DataDeletionToolTransformers.JSONStringify()),
                    ),
                  },
                },
                {
                  key: { text: 'Actions' },
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
                              }),
                              GovUKTextareaInput({
                                code: Format('timeline-data-%1', Item().path('uuid')),
                                label: {
                                  text: 'Data',
                                  classes: 'govuk-label--s',
                                },
                                rows: 12,
                                defaultValue: Item().path('data').pipe(DataDeletionToolTransformers.JSONStringify()),
                                validWhen: [
                                  validation({
                                    condition: or(
                                      Answer(Format('timeline-action-%1', Item().path('uuid'))).not.match(
                                        Condition.Array.Contains('UPDATE'),
                                      ),
                                      Self().match(DataDeletionConditions.IsValidJson()),
                                    ),
                                    message: 'Invalid JSON',
                                  }),
                                ],
                              }),
                              GovUKTextInput({
                                code: Format('timeline-custom-type-%1', Item().path('uuid')),
                                label: {
                                  text: 'Custom type',
                                  classes: 'govuk-label--s',
                                },
                                defaultValue: Item().path('customType'),
                              }),
                              GovUKTextareaInput({
                                code: Format('timeline-custom-data-%1', Item().path('uuid')),
                                label: {
                                  text: 'Custom data',
                                  classes: 'govuk-label--s',
                                },
                                rows: 12,
                                defaultValue: Item()
                                  .path('customData')
                                  .pipe(DataDeletionToolTransformers.JSONStringify()),
                                validWhen: [
                                  validation({
                                    condition: or(
                                      Answer(Format('timeline-action-%1', Item().path('uuid'))).not.match(
                                        Condition.Array.Contains('UPDATE'),
                                      ),
                                      Self().match(DataDeletionConditions.IsValidJson()),
                                    ),
                                    message: 'Invalid JSON',
                                  }),
                                ],
                              }),
                            ],
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
