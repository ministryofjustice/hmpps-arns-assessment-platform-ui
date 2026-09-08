import {
  Answer,
  Condition,
  Data,
  Format,
  Item,
  Iterator,
  Loop,
  Transformer,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKBody, GovUKInsetText, GovUKSummaryList } from '@ministryofjustice/hmpps-forge/govuk-components'
import { CollectionBlock, HtmlBlock } from '@ministryofjustice/hmpps-forge/core/components'
import { Question } from '../../constants/question'
import { contentFor } from '../../locales'
import { SANGenerators } from '../../../../../../generators'
import { victimQuestions } from '../../section'
import { Step } from '../../constants/step'
import { Modal } from '../../../../../../components/modal/modalComponent'
import { commonContentFor } from '../../../../locales'
import { Option } from '../../constants/option'
import { victimsCollection } from '../../constants/collections'

export const victimCards = CollectionBlock({
  collection: Data(victimsCollection.name).each(
    Iterator.Map(
      HtmlBlock({
        content: [
          Modal({
            id: Loop.Index(),
            title: contentFor('are_you_sure_you_want_to_delete'),
            buttonText: commonContentFor('delete'),
          }),
          GovUKSummaryList({
            card: {
              title: {
                text: contentFor(
                  'victim_card_title',
                  commonContentFor(Format('ordinals.%1', Loop.Index()) as any),
                ).pipe(Transformer.String.Capitalize()),
              },
              actions: {
                items: [
                  {
                    href: Format(Step.offence_analysis_victim_edit.path, Loop.Index0()),
                    text: 'Change',
                  },
                  {
                    href: '#',
                    text: 'Delete',
                    attributes: {
                      'data-toggle': 'modal',
                      'data-target': Loop.Index(),
                    },
                  },
                ],
              },
            },
            rows: [
              {
                key: { text: contentFor('question.offence_analysis_victim_relationship.text') },
                value: {
                  blocks: [
                    GovUKBody({
                      text: SANGenerators.getTextFromListDefinition(
                        victimQuestions.victimType.content.options,
                        Item().path('answers')
                          .path(Question.offence_analysis_victim_relationship)
                          .path('value'),
                      ),
                    }),
                    GovUKBody({
                      text: Item().path('answers')
                        .path(Question.offence_analysis_victim_relationship_other_details)
                        .path('value'),
                      size: 's',
                    }),
                  ],
                },
              },
              {
                key: { text: contentFor('question.offence_analysis_victim_age.text') },
                value: {
                  text: SANGenerators.getTextFromListDefinition(
                    victimQuestions.victimAge.content.options,
                    Item().path('answers').path(Question.offence_analysis_victim_age).path('value'),
                  ),
                },
              },
              {
                key: { text: contentFor('question.offence_analysis_victim_sex.text') },
                value: {
                  text: SANGenerators.getTextFromListDefinition(
                    victimQuestions.victimSex.content.options,
                    Item().path('answers').path(Question.offence_analysis_victim_sex).path('value'),
                  ),
                },
              },
              {
                key: { text: contentFor('question.offence_analysis_victim_race.text') },
                value: {
                  text: SANGenerators.getTextFromListDefinition(
                    victimQuestions.victimEthnicity.content.options,
                    Item().path('answers').path(Question.offence_analysis_victim_race).path('value'),
                  ),
                },
              },
            ],
          }),
        ],
      }),

    ),
  ),
  fallback: [GovUKInsetText({ text: contentFor('fallback.there_are_no_victims') })],
  visibleWhen: Answer(Question.offence_analysis_who_was_the_victim).match(
    Condition.Array.Contains(Option.one_or_more_person),
  ),
})
