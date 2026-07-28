import {Data, Format, Item, Iterator, Loop} from '@ministryofjustice/hmpps-forge/core/authoring'
import {GovUKInsetText, GovUKSummaryList} from '@ministryofjustice/hmpps-forge/govuk-components'
import {Question} from '../../constants/question'
import {contentFor} from '../../locales'
import {CollectionBlock, HtmlBlock} from "@ministryofjustice/hmpps-forge/core/components";
import {SANGenerators} from "../../../../../../generators";
import {victimAge, victimEthnicity, victimSex, victimType} from "../offence-analysis-victim/fields";
import {Step} from "../../constants/step";
import {Modal, modalComponent} from "../../../../../../components/modal/modalComponent";


export const victimCards = CollectionBlock({
  collection: Data('victims').each(
    Iterator.Map(
      HtmlBlock({content: [
        Modal({id:Loop.Index0(), title:'Title text test', buttonText:'Delete'}),
        GovUKSummaryList({
          card: {
            title: { text: Loop.Index0() },
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
                    'data-toggle': "modal",
                    'data-target': Loop.Index0(),
                  },
                  visuallyHiddenText: Item().path('contactName'),
                },
              ],
            },
          },
          rows: [
            {
              key: { text: contentFor('question.offence_analysis_victim_type.text') },
              value: { text:
                  SANGenerators.getTextFromListDefinition(
                    victimType.items,
                    Item().path('answers')
                      .path(Question.offence_analysis_victim_type)
                      .path('value')
                  )
              },
            },
            {
              key: { text: contentFor('question.offence_analysis_victim_age.text') },
              value: { text:
                  SANGenerators.getTextFromListDefinition(
                    victimAge.items,
                    Item().path('answers').path(Question.offence_analysis_victim_age).path('value')
                  )
              },
            },
            {
              key: { text: contentFor('question.offence_analysis_victim_sex.text') },
              value: { text:
                  SANGenerators.getTextFromListDefinition(
                    victimSex.items,
                    Item().path('answers').path(Question.offence_analysis_victim_sex).path('value')
                  )},
            },
            {
              key: {text: contentFor('question.offence_analysis_victim_ethnicity.text')},
              value: {
                text:
                  SANGenerators.getTextFromListDefinition(
                    victimEthnicity.items,
                    Item().path('answers').path(Question.offence_analysis_victim_ethnicity).path('value')
                  )
              },
            },
          ],
        }),
        ]}),

    ),
  ),
  fallback: [GovUKInsetText({ text: 'You have not added any emergency contacts yet.' })],
})
