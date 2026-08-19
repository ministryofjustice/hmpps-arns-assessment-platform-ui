import {
  and,
  Answer,
  ChainableExpr,
  Condition,
  Data,
  Format,
  Item,
  Iterator,
  PipelineExpr,
  Transformer,
  when,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKBody, GovUKHeading, GovUKSummaryList, GovUKTabs } from '@ministryofjustice/hmpps-forge/govuk-components'

import { CollectionBlock, TemplateWrapper } from '@ministryofjustice/hmpps-forge/core/components'
import { commonContentFor } from '../../../../locales'
import { goToPractitionerAnalysisButton, markAsCompleteButton } from '../../../../constants/buttons'
import { Step } from '../../constants/step'
import { Question } from '../../constants/question'
import { SANGenerators } from '../../../../../../generators'
import { drugHowOftenUsed, drugHowOftenUsedDetails, drugLastUsed, drugUseSection } from '../../section'
import { Option } from '../../constants/option'
import { CommonOption } from '../../../../constants/commonOption'
import { contentFor } from '../../locales'

export const drugsSummaryPartOne = GovUKSummaryList({
  rows: [drugUseSection.questions.drugUse.displayModes.summaryRow],
})

export const drugsSummaryCards = (drugValue: ChainableExpr<PipelineExpr>) => {
  const drugValueLower = drugValue.pipe(Transformer.String.ToLowerCase())

  return GovUKSummaryList({
    card: {
      title: {
        text: when(drugValue.match(Condition.Equals(CommonOption.other)))
          .then(Answer(Question.other_drug_name))
          .else(
            SANGenerators.getTextFromListDefinition(
              drugUseSection.questions.selectMisusedDrugs.content.options,
              drugValue,
            ),
          ),
      },
      actions: {
        items: [{ href: Step.add_drugs.path, text: commonContentFor('change') }],
      },
    },
    rows: [
      drugLastUsed.summaryRowOver(drugValueLower),
      drugHowOftenUsed.summaryRowOver(drugValueLower),
      drugHowOftenUsedDetails.summaryRowOver(drugValueLower),
      // Bespoke row: a composite of the injected answer, the per-drug months
      // answer, and the last-used answer — not a projection of one question.
      {
        key: { text: contentFor('text.injected.text') },
        value: {
          blocks: [
            GovUKBody({
              text: when(
                Answer(Question.drugs_injected)
                  .match(Condition.Array.Contains(drugValue)),
              )
                .then(commonContentFor('option.YES')),
              visibleWhen: Answer(Question.drugs_injected).match(Condition.Array.Contains(drugValue)),
            }),
            GovUKBody({
              text: contentFor('option.IN_THE_LAST_SIX'),
              visibleWhen: and(
                Answer(Question.drugs_injected).match(Condition.Array.Contains(drugValue)),
                and(
                  Answer(Format(Question.drugs_injected_value, SANGenerators.getDrugValueLower(drugValue)))
                    .match(Condition.IsRequired()),
                  Answer(Format(Question.drugs_injected_value, SANGenerators.getDrugValueLower(drugValue)))
                    .match(Condition.Array.Contains(Option.last_six)),
                ),
              ),
            }),
            GovUKBody({
              text: contentFor('option.MORE_THAN_SIX'),
              visibleWhen: and(
                Answer(Question.drugs_injected).match(Condition.Array.Contains(drugValue)),
                and(
                  Answer(Format(Question.drugs_injected_value, SANGenerators.getDrugValueLower(drugValue)))
                    .match(Condition.IsRequired()),
                  Answer(Format(Question.drugs_injected_value, SANGenerators.getDrugValueLower(drugValue)))
                    .match(Condition.Array.Contains(Option.more_than_six)),
                ),
              ),
            }),
            GovUKBody({
              text: contentFor('option.MORE_THAN_SIX'),
              visibleWhen: and(
                Answer(Format(Question.drug_last_used_value, SANGenerators.getDrugValueLower(drugValue))).match(
                  Condition.Equals(Option.more_than_six),
                ),
                Answer(Question.drugs_injected).match(Condition.Array.Contains(drugValue)),
              ),
            }),
          ],
        },
        actions: {
          items: [{ href: Step.drug_details.path, text: commonContentFor('change') }],
        },
        visibleWhen: and(
          Data('injectableSelectedDrugs').match(Condition.IsRequired()),
          Answer(Question.drugs_injected).match(Condition.Array.Contains(drugValue)),
        ),
      },
    ],
  })
}

export const usedInLastSixMonthsSummarySection = TemplateWrapper({
  template: '<h2 class="govuk-heading-m">{{slot:heading}}</h2>{{slot:content}}',
  slots: {
    heading: [
      GovUKHeading({
        text: contentFor('option.LAST_SIX'),
        visibleWhen: Data('drugsUsedInLastSix').match(Condition.IsRequired()),
      }),
    ],
    content: [
      CollectionBlock({
        collection: Data('drugsUsedInLastSix').each(Iterator.Map(drugsSummaryCards(Item().path('value')))),
      }),
    ],
  },
})

export const notUsedInLastSixMonthsSummarySection = TemplateWrapper({
  template: '<h2 class="govuk-heading-m">{{slot:heading}}</h2>{{slot:content}}',
  slots: {
    heading: [
      GovUKHeading({
        text: contentFor('heading.not_used_in_last_six_months'),
        visibleWhen: Data('drugsUsedMoreThanSix').match(Condition.IsRequired()),
      }),
    ],
    content: [
      CollectionBlock({
        collection: Data('drugsUsedMoreThanSix').each(Iterator.Map(drugsSummaryCards(Item().path('value')))),
      }),
    ],
  },
})

export const moreInformationHeading = GovUKHeading({
  text: contentFor('text.more_information'),
  visibleWhen: Answer('drug_use').match(Condition.Equals(CommonOption.yes)),
})

export const drugsSummaryPartTwo = GovUKSummaryList({
  rows: [drugUseSection.questions.moreThanSixMonthsDetails.displayModes.summaryRow],
})

export const drugsSummaryPartThree = GovUKSummaryList({
  rows: [
    drugUseSection.questions.receivingTreatment.displayModes.summaryRow,
    drugUseSection.questions.reasonsForUse.displayModes.summaryRow,
    drugUseSection.questions.reasonsForUseDetails.displayModes.summaryRow,
    drugUseSection.questions.affectedTheirLife.displayModes.summaryRow,
    drugUseSection.questions.affectedTheirLifeDetails.displayModes.summaryRow,
    drugUseSection.questions.anythingHelpedStopOrReduce.displayModes.summaryRow,
    drugUseSection.questions.whatCouldHelpNotUseInFuture.displayModes.summaryRow,
    drugUseSection.questions.drugUseChanges.displayModes.summaryRow,
  ],
})

export const drugsSummaryTab = GovUKTabs({
  id: 'summaries',
  items: [
    {
      id: 'summary',
      label: commonContentFor('summary'),
      panel: {
        blocks: [
          drugsSummaryPartOne,
          usedInLastSixMonthsSummarySection,
          notUsedInLastSixMonthsSummarySection,
          drugsSummaryPartTwo,
          moreInformationHeading,
          drugsSummaryPartThree,
          goToPractitionerAnalysisButton(Step.drug_use_summary.path),
        ],
      },
    },
    {
      id: 'practitioner-analysis',
      label: commonContentFor('practitioner_analysis'),
      panel: {
        blocks: [
          drugUseSection.practitionerAnalysis.motivatedToStop.displayModes.field,
          drugUseSection.practitionerAnalysis.strengthsOrProtectiveFactors.displayModes.field,
          drugUseSection.practitionerAnalysis.riskOfSeriousHarm.displayModes.field,
          drugUseSection.practitionerAnalysis.riskOfReoffending.displayModes.field,
          markAsCompleteButton,
        ],
      },
    },
  ],
})
