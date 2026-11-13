import {
  and,
  Answer,
  Condition,
  Data,
  Item,
  Iterator,
  Literal,
  Transformer,
  when,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKDetails } from '@ministryofjustice/hmpps-forge/govuk-components'
import { CollectionBlock, TemplateWrapper } from '@ministryofjustice/hmpps-forge/core/components'

import { SANGenerators } from '../../../../../../generators'
import {
  drugHowOftenUsed,
  drugHowOftenUsedDetails,
  drugUsedInLastSixMonths,
  drugUsedMoreThanSixMonths,
  drugUseSection,
} from '../../section'
import { contentFor } from '../../locales'
import { Question } from '../../constants/question'
import { drugsList } from '../../constants'
import { Option } from '../../constants/option'

// --- Conditions ---

const anyDrugUsedInLastSix = Data('drugsUsedInLastSix').match(Condition.IsRequired())
export const anyDrugUsedMoreThanSix = Data('drugsUsedMoreThanSix').match(Condition.IsRequired())

// --- Used in the last 6 months ---

const drugValueLower = Item().path('value').pipe(Transformer.String.ToLowerCase())

export const usedInLastSixMonthsSection = TemplateWrapper({
  template: '<h2 class="govuk-heading-l">{{heading}}</h2>{{slot:content}}',
  values: { heading: contentFor('option.LAST_SIX') },
  slots: {
    content: [
      GovUKDetails({
        summaryText: contentFor('question.how_often_used.summaryText'),
        html: contentFor('question.how_often_used.summaryHtml'),
      }),
      CollectionBlock({
        collection: Literal(drugsList).each(
          Iterator.Map(
            TemplateWrapper({
              template: '<h2 class="govuk-heading-m">{{heading}}</h2>{{slot:fields}}',
              values: {
                heading: when(
                  Item()
                    .path('value')
                    .pipe(Transformer.String.EscapeHtml())
                    .match(Condition.Equals(Option.other_drug)),
                )
                  .then(Answer(Question.other_drug_name).pipe(Transformer.String.EscapeHtml()))
                  .else(
                    SANGenerators.getTextFromListDefinition(
                      drugUseSection.questions.selectMisusedDrugs.content.options,
                      Item().path('value').pipe(Transformer.String.EscapeHtml()),
                    ),
                  ),
              },
              slots: {
                fields: [drugHowOftenUsed.over(drugValueLower), drugHowOftenUsedDetails.over(drugValueLower)],
              },
              visibleWhen: drugUsedInLastSixMonths(drugValueLower),
            }),
          ),
        ),
      }),
    ],
  },
  visibleWhen: anyDrugUsedInLastSix,
})

// --- Section divider ---

export const sectionDivider = TemplateWrapper({
  template: '<hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">',
  visibleWhen: and(anyDrugUsedInLastSix, anyDrugUsedMoreThanSix),
})

// --- Not used in the last 6 months ---

export const usedMoreThanSixMonthsSection = TemplateWrapper({
  template: '<h2 class="govuk-heading-l">{{heading}}</h2>{{slot:content}}',
  values: { heading: contentFor('heading.used_more_than_six_months_ago') },
  slots: {
    content: [
      GovUKDetails({
        summaryText: contentFor('question.how_often_used.summaryText'),
        html: contentFor('question.how_often_used.summaryHtml'),
      }),
      CollectionBlock({
        collection: Literal(drugsList).each(
          Iterator.Map(
            TemplateWrapper({
              template: '<h2 class="govuk-heading-m">{{heading}}</h2>{{slot:fields}}',
              values: {
                heading: when(
                  Item()
                    .path('value')
                    .pipe(Transformer.String.EscapeHtml())
                    .match(Condition.Equals(Option.other_drug)),
                )
                  .then(Answer(Question.other_drug_name).pipe(Transformer.String.EscapeHtml()))
                  .else(
                    SANGenerators.getTextFromListDefinition(
                      drugUseSection.questions.selectMisusedDrugs.content.options,
                      Item().path('value').pipe(Transformer.String.EscapeHtml()),
                    ),
                  ),
              },
              slots: {
                fields: [drugHowOftenUsed.over(drugValueLower), drugHowOftenUsedDetails.over(drugValueLower)],
              },
              visibleWhen: drugUsedMoreThanSixMonths(drugValueLower),
            }),
          ),
        ),
      }),
    ],
  },
  visibleWhen: anyDrugUsedMoreThanSix,
})
