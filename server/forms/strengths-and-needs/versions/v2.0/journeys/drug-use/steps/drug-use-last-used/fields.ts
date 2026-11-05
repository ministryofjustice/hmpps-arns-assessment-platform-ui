import {
  Answer,
  Condition,
  Item,
  Iterator,
  Literal,
  Transformer,
  when,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import { CollectionBlock, TemplateWrapper } from '@ministryofjustice/hmpps-forge/core/components'

import { SANGenerators } from '../../../../../../generators'
import {
  drugLastUsed,
  drugUseSection
} from '../../section'
import { contentFor } from '../../locales'
import { Question } from '../../constants/question'
import { CaseData } from "../../../../constants/formVersion";
import { Option } from "../../constants/option";

const drugValueLower = Item().value().pipe(Transformer.String.ToLowerCase())

export const drugLastUsedSection = TemplateWrapper({
  template: '<h2 class="govuk-heading-l">{{heading}}</h2>{{slot:content}}',
  values: {
    heading: contentFor('heading.when_did_last_use_these_drugs', CaseData.Forename),
  },
  slots: {
    content: [
      CollectionBlock({
        collection: Answer(Question.select_misused_drugs).each(
          Iterator.Map(
            TemplateWrapper({
              template: '<h2 class="govuk-heading-m">{{heading}}</h2>{{slot:fields}}',
              values: {
                heading: when(
                  Item()
                    .value()
                    .match(Condition.Equals(Option.other_drug)))
                  .then(Answer(Question.other_drug_name).pipe(Transformer.String.EscapeHtml()))
                  .else(
                    SANGenerators.getTextFromListDefinition(
                      drugUseSection.questions.selectMisusedDrugs.content.options,
                      Item().value().pipe(Transformer.String.EscapeHtml()),
                    ),
                  ),
              },
              slots: {
                fields: [
                  drugLastUsed.over(drugValueLower),
                ],
              },
            }),
          ),
        ),
      }),
    ],
  },
})
