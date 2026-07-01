import {
  and,
  Answer,
  Condition,
  Format, Item, Iterator,
  redirect,
  Session,
  step,
  submit,
  tieBreaker, Transformer, when
} from '@ministryofjustice/hmpps-forge/core/authoring'
import {
  GovUKButton, GovUKSummaryList, GovUKTabs, GovUKWarningText,
} from '@ministryofjustice/hmpps-forge/govuk-components'
import { DataDeletionToolEffects } from '../../../effects'
import { HtmlBlock } from '@ministryofjustice/hmpps-forge/core/components'
import { DataDeletionToolTransformers } from '../../../transformers'
import { Outdent } from '../../../components/outdent/outdent'

export const summaryStep = step({
  path: '/summary',
  title: 'Summary',
  reachability: {
    entryWhen: Session('deletionResponse').path('success').match(Condition.Equals(true)),
    tieBreakers: [tieBreaker({ priority: 25 })],
  },
  onSubmission: [
    submit({
      validate: true,
      onValid: {
        effects: [
          DataDeletionToolEffects.deletionPersist(),
          DataDeletionToolEffects.clearSession(),
          DataDeletionToolEffects.loadAssessmentData(),
        ],
        next: [redirect({ goto: 'success' })],
      },
    })
  ],
  blocks: [
    Outdent({
      outdentBy: 4,
      block: GovUKTabs({
        id: 'summary',
        items: [
          {
            id: 'events',
            label: 'Events',
            panel: {
              blocks: [
                GovUKWarningText({
                  text: 'No event data to delete',
                  classes: 'govuk-!-margin-0',
                  visibleWhen: Session('deletionRequest.events').match(Condition.Array.ContainsAll(['dummyValue'])),
                }),
                HtmlBlock({
                  classes: 'data-list',
                  content: Session('currentData.events').each(
                    Iterator.Map(
                      GovUKSummaryList({
                        visibleWhen: and(
                          Answer(Format('event-action-%1', Item().path('uuid')))
                            .match(Condition.IsRequired()),
                          Answer(Format('event-action-%1', Item().path('uuid')))
                            .match(Condition.Array.ContainsAny(['UPDATE', 'DELETE']))
                        ),
                        card: {
                          title: { text: Item().path('data.type') },
                        },
                        rows: [
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
                            key: {text: 'Operation'},
                            value: {text: Answer(Format('event-action-%1', Item().path('uuid'))).pipe(Transformer.Array.First())},
                          },
                          {
                            key: {text: 'Data'},
                            value: {html: Item().path('data').pipe(DataDeletionToolTransformers.Diff(
                                when(and(
                                  Answer(Format('event-action-%1', Item().path('uuid'))).match(Condition.IsRequired()),
                                  Answer(Format('event-action-%1', Item().path('uuid'))).match(Condition.Array.Contains('UPDATE'))
                                )).then(Answer(Format('event-data-%1', Item().path('uuid'))).pipe(DataDeletionToolTransformers.JSONParse()))
                                  .else({})
                              ))},
                          },
                        ],
                      })
                    )
                  ),
                }),
              ],
            },
          },
          {
            id: 'timeline',
            label: 'Timeline',
            panel: {
              blocks: [
                GovUKWarningText({
                  text: 'No timeline data to delete',
                  classes: 'govuk-!-margin-0',
                  visibleWhen: Session('deletionRequest.timeline').match(Condition.Array.ContainsAll(['dummyValue'])),
                }),
                HtmlBlock({
                  classes: 'data-list',
                  content: Session('currentData.timeline').each(
                    Iterator.Map(
                      GovUKSummaryList({
                        visibleWhen: and(
                          Answer(Format('timeline-action-%1', Item().path('uuid')))
                            .match(Condition.IsRequired()),
                          Answer(Format('timeline-action-%1', Item().path('uuid')))
                            .match(Condition.Array.ContainsAny(['UPDATE', 'DELETE']))
                        ),
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
                            key: {text: 'Operation'},
                            value: {text: Answer(Format('timeline-action-%1', Item().path('uuid'))).pipe(Transformer.Array.First())},
                          },
                          {
                            key: {text: 'Event'},
                            value: {html: Item().path('event')
                                .pipe(DataDeletionToolTransformers.Diff(
                                  when(and(
                                    Answer(Format('timeline-action-%1', Item().path('uuid'))).match(Condition.IsRequired()),
                                    Answer(Format('timeline-action-%1', Item().path('uuid'))).match(Condition.Array.Contains('UPDATE'))
                                  ))
                                    .then(Answer(Format('timeline-event-%1', Item().path('uuid'))))
                                    .else(
                                      when(Item().value().match(Condition.Object.PropertyHasValue('event')))
                                        .then('')
                                        .else(null)
                                    )
                                ))
                            },
                          },
                          {
                            key: {text: 'Data'},
                            value: {html: Item().path('data')
                                .pipe(DataDeletionToolTransformers.Diff(
                                  when(and(
                                    Answer(Format('timeline-action-%1', Item().path('uuid'))).match(Condition.IsRequired()),
                                    Answer(Format('timeline-action-%1', Item().path('uuid'))).match(Condition.Array.Contains('UPDATE'))
                                  ))
                                    .then(Answer(Format('timeline-data-%1', Item().path('uuid'))).pipe(DataDeletionToolTransformers.JSONParse()))
                                    .else(
                                      when(Item().path('data').match(Condition.Object.IsObject()))
                                        .then({})
                                        .else(null)
                                    )
                                ))
                            },
                          },
                          {
                            key: {text: 'Custom type'},
                            value: {html: Item().path('customType')
                                .pipe(DataDeletionToolTransformers.Diff(
                                  when(and(
                                    Answer(Format('timeline-action-%1', Item().path('uuid'))).match(Condition.IsRequired()),
                                    Answer(Format('timeline-action-%1', Item().path('uuid'))).match(Condition.Array.Contains('UPDATE'))
                                  ))
                                    .then(Answer(Format('timeline-custom-type-%1', Item().path('uuid'))))
                                    .else(
                                      when(Item().value().match(Condition.Object.PropertyHasValue('customType')))
                                        .then('')
                                        .else(null)
                                    )
                                ))
                            },
                          },
                          {
                            key: {text: 'Custom data'},
                            value: {html: Item().path('customData')
                                .pipe(DataDeletionToolTransformers.Diff(
                                  when(and(
                                    Answer(Format('timeline-action-%1', Item().path('uuid'))).match(Condition.IsRequired()),
                                    Answer(Format('timeline-action-%1', Item().path('uuid'))).match(Condition.Array.Contains('UPDATE'))
                                  ))
                                    .then(Answer(Format('timeline-custom-data-%1', Item().path('uuid'))).pipe(DataDeletionToolTransformers.JSONParse()))
                                    .else(
                                      when(Item().path('customData').match(Condition.Object.IsObject()))
                                        .then({})
                                        .else(null)
                                    )
                                ))
                            },
                          },
                        ],
                      })
                    )
                  ),
                }),
              ],
            },
          },
          {
            id: 'request',
            label: 'Request',
            panel: {
              html: Format('<pre>%1</pre>', Session('deletionRequest').pipe(DataDeletionToolTransformers.JSONStringify())),
            },
          },
          {
            id: 'response',
            label: 'Dry-run response',
            panel: {
              html: Format('<pre>%1</pre>', Session('deletionResponse').pipe(DataDeletionToolTransformers.JSONStringify())),
            },
          },
        ],
      })
    }),
    GovUKButton({
      text: 'Persist',
      name: 'action',
      value: 'persist',
      preventDoubleClick: true,
    }),
  ],
})
