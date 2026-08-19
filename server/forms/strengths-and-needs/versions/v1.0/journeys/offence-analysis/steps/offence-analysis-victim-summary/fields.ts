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
import { GovUKInsetText, GovUKSummaryList } from '@ministryofjustice/hmpps-forge/govuk-components'
import { CollectionBlock, HtmlBlock } from '@ministryofjustice/hmpps-forge/core/components'
import { Question } from '../../constants/question'
import { contentFor } from '../../locales'
import { SANGenerators } from '../../../../../../generators'
import { victimAge, victimEthnicity, victimSex, victimType } from '../offence-analysis-victim/fields'
import { Step } from '../../constants/step'
import { Modal } from '../../../../../../components/modal/modalComponent'
import { commonContentFor } from '../../../../locales'
import { Option } from '../../constants/option'

export const victimCards = CollectionBlock({
  collection: Data('victims').each(
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
                    visuallyHiddenText: Item().path('contactName'),
                  },
                  {
                    href: '#',
                    text: 'Delete',
                    attributes: {
                      'data-toggle': 'modal',
                      'data-target': Loop.Index(),
                    },
                    visuallyHiddenText: Item().path('contactName'),
                  },
                ],
              },
            },
            rows: [
              {
                key: { text: contentFor('question.offence_analysis_victim_type.text') },
                value: {
                  text: SANGenerators.getTextFromListDefinition(
                    victimType.items,
                    Item().path('answers')
                      .path(Question.offence_analysis_victim_type)
                      .path('value'),
                  ),
                },
              },
              {
                key: { text: contentFor('question.offence_analysis_victim_age.text') },
                value: {
                  text: SANGenerators.getTextFromListDefinition(
                    victimAge.items,
                    Item().path('answers').path(Question.offence_analysis_victim_age).path('value'),
                  ),
                },
              },
              {
                key: { text: contentFor('question.offence_analysis_victim_sex.text') },
                value: {
                  text: SANGenerators.getTextFromListDefinition(
                    victimSex.items,
                    Item().path('answers').path(Question.offence_analysis_victim_sex).path('value'),
                  ),
                },
              },
              {
                key: { text: contentFor('question.offence_analysis_victim_ethnicity.text') },
                value: {
                  text: SANGenerators.getTextFromListDefinition(
                    victimEthnicity.items,
                    Item().path('answers').path(Question.offence_analysis_victim_ethnicity).path('value'),
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
  visibleWhen: Answer(Question.offence_analysis_commited_against).match(
    Condition.Array.Contains(Option.one_or_more_people),
  ),
})
