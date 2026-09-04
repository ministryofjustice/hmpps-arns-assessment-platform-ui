import {
  and,
  Answer,
  Condition,
  Data,
  Format,
  Item,
  Iterator,
  Transformer,
  when,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKDetails, GovUKInsetText } from '@ministryofjustice/hmpps-forge/govuk-components'
import { CollectionBlock, TemplateWrapper } from '@ministryofjustice/hmpps-forge/core/components'

import { CaseData } from '../../../../constants/formVersion'
import { SANGenerators } from '../../../../../../generators'
import { drugHowOftenUsed, drugHowOftenUsedDetails, drugUseSection } from '../../section'
import { contentFor } from '../../locales'
import { Question } from '../../constants/question'
import { CommonOption } from '../../../../constants/commonOption'

// --- Conditions ---

const anyDrugUsedInLastSix = Data('drugsUsedInLastSix').match(Condition.IsRequired())
export const anyDrugUsedMoreThanSix = Data('drugsUsedMoreThanSix').match(Condition.IsRequired())

// --- Used in the last 6 months ---

const drugValueLower = Item().path('value').pipe(Transformer.String.ToLowerCase())

export const usedInLastSixMonthsSection = TemplateWrapper({
  template: '<h2 class="govuk-heading-l">Used in the last 6 months</h2>{{slot:content}}',
  slots: {
    content: [
      GovUKDetails({
        summaryText: contentFor('question.how_often_used_last_six_months.summaryText'),
        html: contentFor('question.how_often_used_last_six_months.summaryHtml'),
      }),
      CollectionBlock({
        collection: Data('drugsUsedInLastSix').each(
          Iterator.Map(
            TemplateWrapper({
              template: '<h2 class="govuk-heading-m">{{heading}}</h2>{{slot:fields}}',
              values: {
                heading: when(
                  Item()
                    .path('value')
                    .pipe(Transformer.String.EscapeHtml())
                    .match(Condition.Equals(CommonOption.other)),
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
  template: '<h2 class="govuk-heading-l">Not used in the last 6 months</h2>{{slot:content}}',
  slots: {
    content: [
      GovUKInsetText({
        text: Format(
          '%1 used %2 more than 6 months ago.',
          CaseData.Forename,
          Data('drugsUsedMoreThanSix')
            .each(
              Iterator.Map(
                when(
                  Item().path('value').pipe(Transformer.String.EscapeHtml()).match(Condition.Equals(CommonOption.other)),
                )
                  .then(Answer(Question.other_drug_name).pipe(Transformer.String.EscapeHtml()))
                  .else(
                    SANGenerators.getTextFromListDefinition(
                      drugUseSection.questions.selectMisusedDrugs.content.options,
                      Item().path('value').pipe(Transformer.String.EscapeHtml()),
                    ).pipe(Transformer.String.ToLowerCase()),
                  ),
              ),
            )
            .pipe(Transformer.Array.Join(', ')),
        ),
      }),
      drugUseSection.questions.moreThanSixMonthsDetails.displayModes.field,
    ],
  },
  visibleWhen: anyDrugUsedMoreThanSix,
})
