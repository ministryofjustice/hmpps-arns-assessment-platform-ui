import {
  and,
  Answer,
  ChainableExpr,
  Condition,
  Data,
  Format,
  Item,
  Iterator,
  not,
  PipelineExpr,
  Self,
  Transformer,
  validation,
  when,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import {
  GovUKBody,
  GovUKCharacterCount,
  GovUKHeading,
  GovUKRadioInput,
  GovUKSummaryList,
  GovUKTabs,
} from '@ministryofjustice/hmpps-forge/govuk-components'

import { CollectionBlock, TemplateWrapper } from '@ministryofjustice/hmpps-forge/core/components'
import { CaseData } from '../../../../constants/formVersion'
import { commonContentFor } from '../../../../locales'
import { goToPractitionerAnalysisButton, markAsCompleteButton } from '../../../../constants/buttons'
import { Step } from '../../constants/step'
import { Question } from '../../constants/question'
import { SANGenerators } from '../../../../../../generators'
import { drugUse } from '../drug-use/fields'
import { drugInjectedLast, drugIntakeFrequency, receivingTreatmentField } from '../drug-details/fields'
import { selectMisusedDrugs } from '../add-drugs/fields'
import { Option } from '../../constants/option'
import { drugUseChanges } from '../drug-use-history/fields'
import { CommonOption } from '../../../../constants/commonOption'
import { contentFor } from '../../locales'

export const drugsSummaryPartOne = GovUKSummaryList({
  rows: [
    {
      key: { html: contentFor('question.drug_use.text', CaseData.Forename) },
      value: {
        blocks: [
          GovUKBody({
            text: SANGenerators.getTextFromListDefinition(drugUse.items, Answer(Question.drug_use)),
          }),
        ],
      },
      actions: {
        items: [{ href: Step.drug_use.path, text: commonContentFor('change') }],
      },
    },
  ],
})

export const drugsSummaryCards = (drugValue: ChainableExpr<PipelineExpr>) =>
  GovUKSummaryList({
    card: {
      title: {
        text: when(drugValue.match(Condition.Equals(CommonOption.other)))
          .then(Answer(Question.other_drug_name))
          .else(SANGenerators.getTextFromListDefinition(selectMisusedDrugs.items, drugValue)),
      },
      actions: {
        items: [{ href: Step.add_drugs.path, text: commonContentFor('change') }],
      },
    },
    rows: [
      {
        key: { text: contentFor('text.lastUsed.text') },
        value: {
          text: SANGenerators.getTextFromListDefinition(
            drugInjectedLast(drugValue).items,
            Answer(Format(Question.drug_last_used_value, drugValue.pipe(Transformer.String.ToLowerCase()))),
          ),
        },
        actions: {
          items: [{ href: Step.add_drugs.path, text: commonContentFor('change') }],
        },
      },
      {
        key: { text: contentFor('text.howOften.text') },
        value: {
          text: SANGenerators.getTextFromListDefinition(
            drugIntakeFrequency(drugValue).items,
            Answer(Format(Question.how_often_used_value, drugValue.pipe(Transformer.String.ToLowerCase()))),
          ),
        },
        actions: {
          items: [{ href: Step.drug_details.path, text: commonContentFor('change') }],
        },
        visibleWhen: Answer(Format(Question.how_often_used_value, drugValue.pipe(Transformer.String.ToLowerCase())))
          .match(Condition.IsRequired()),
      },
      {
        key: {
          text: commonContentFor('optional_details'),
        },
        value: {
          text: Answer(Format(Question.how_often_used_details, drugValue.pipe(Transformer.String.ToLowerCase()))),
        },
        visibleWhen: Answer(Format(Question.how_often_used_details, drugValue.pipe(Transformer.String.ToLowerCase())))
          .match(Condition.IsRequired()),
        actions: {
          items: [{ href: Step.drug_details.path, text: commonContentFor('change') }],
        },
      },
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
  rows: [
    {
      key: {
        text: contentFor('question.drug_use_more_than_six_months_details.text', CaseData.ForenamePossessive),
      },
      value: {
        blocks: [
          GovUKBody({
            text: Answer(Question.drug_use_more_than_six_months_details),
          }),
        ],
      },
      actions: {
        items: [{ href: Step.drug_details.path, text: commonContentFor('change') }],
      },
      visibleWhen: Answer(Question.drug_use_more_than_six_months_details).match(Condition.IsRequired()),
    },
  ],
})

export const drugsSummaryPartThree = GovUKSummaryList({
  rows: [
    {
      key: {
        text: contentFor('question.receiving_treatment.text', CaseData.Forename),
      },
      value: {
        blocks: [
          GovUKBody({
            text: SANGenerators.getTextFromListDefinition(
              receivingTreatmentField.items,
              Answer(Question.receiving_treatment),
            ),
          }),
          GovUKBody({
            text: Answer(Question.receiving_treatment_yes_details),
          }),
          GovUKBody({
            text: Answer(Question.receiving_treatment_no_details),
          }),
        ],
      },
      actions: {
        items: [{ href: Step.drug_details.path, text: commonContentFor('change') }],
      },
      visibleWhen: Answer(Question.drugs_reasons_for_use).match(Condition.IsRequired()),
    },
    {
      key: {
        text: when(Data('drugsUsedInLastSix').match(Condition.IsRequired()))
          .then(contentFor('question.drugs_reasons_for_use.text.usedLastSixMonths', CaseData.Forename))
          .else(contentFor('question.drugs_reasons_for_use.text.default', CaseData.Forename)),
      },
      value: {
        blocks: [
          GovUKBody({
            text: contentFor('question.drugs_reasons_for_use.option.CULTURAL_OR_RELIGIOUS'),
            visibleWhen: and(
              Answer(Question.drugs_reasons_for_use).match(Condition.IsRequired()),
              Answer(Question.drugs_reasons_for_use).match(Condition.Array.Contains(Option.cultural_or_religious)),
            ),
          }),
          GovUKBody({
            text: contentFor('question.drugs_reasons_for_use.option.CURIOSITY_OR_EXPERIMENTATION'),
            visibleWhen: and(
              Answer(Question.drugs_reasons_for_use).match(Condition.IsRequired()),
              Answer(Question.drugs_reasons_for_use).match(
                Condition.Array.Contains(Option.curiosity_or_experimentation),
              ),
            ),
          }),
          GovUKBody({
            text: contentFor('question.drugs_reasons_for_use.option.ENHANCE_PERFORMANCE'),
            visibleWhen: and(
              Answer(Question.drugs_reasons_for_use).match(Condition.IsRequired()),
              Answer(Question.drugs_reasons_for_use).match(Condition.Array.Contains(Option.enhance_performance)),
            ),
          }),
          GovUKBody({
            text: contentFor('question.drugs_reasons_for_use.option.ESCAPISM_OR_AVOIDANCE'),
            visibleWhen: and(
              Answer(Question.drugs_reasons_for_use).match(Condition.IsRequired()),
              Answer(Question.drugs_reasons_for_use).match(Condition.Array.Contains(Option.escapism_or_avoidance)),
            ),
          }),
          GovUKBody({
            text: contentFor('question.drugs_reasons_for_use.option.MANAGING_EMOTIONAL_ISSUES'),
            visibleWhen: and(
              Answer(Question.drugs_reasons_for_use).match(Condition.IsRequired()),
              Answer(Question.drugs_reasons_for_use).match(Condition.Array.Contains(Option.managing_emotional_issues)),
            ),
          }),
          GovUKBody({
            text: contentFor('question.drugs_reasons_for_use.option.PEER_PRESSURE'),
            visibleWhen: and(
              Answer(Question.drugs_reasons_for_use).match(Condition.IsRequired()),
              Answer(Question.drugs_reasons_for_use).match(Condition.Array.Contains(Option.peer_pressure)),
            ),
          }),
          GovUKBody({
            text: contentFor('question.drugs_reasons_for_use.option.RECREATION_OR_PLEASURE'),
            visibleWhen: and(
              Answer(Question.drugs_reasons_for_use).match(Condition.IsRequired()),
              Answer(Question.drugs_reasons_for_use).match(Condition.Array.Contains(Option.recreation_or_pleasure)),
            ),
          }),
          GovUKBody({
            text: contentFor('question.drugs_reasons_for_use.option.SELF_MEDICATION'),
            visibleWhen: and(
              Answer(Question.drugs_reasons_for_use).match(Condition.IsRequired()),
              Answer(Question.drugs_reasons_for_use).match(Condition.Array.Contains(Option.self_medication)),
            ),
          }),
          GovUKBody({
            text: commonContentFor('option.OTHER'),
            visibleWhen: and(
              Answer(Question.drugs_reasons_for_use).match(Condition.IsRequired()),
              Answer(Question.drugs_reasons_for_use).match(Condition.Array.Contains(CommonOption.other)),
            ),
          }),
        ],
      },
      actions: {
        items: [{ href: Step.drug_use_history.path, text: commonContentFor('change') }],
      },
      visibleWhen: Answer(Question.drugs_reasons_for_use).match(Condition.IsRequired()),
    },
    {
      key: {
        text: contentFor('question.drugs_reasons_for_use_details.text', CaseData.Forename),
      },
      value: {
        blocks: [
          GovUKBody({
            text: Answer(Question.drugs_reasons_for_use_details),
          }),
        ],
      },
      actions: {
        items: [{ href: Step.drug_use_history.path, text: commonContentFor('change') }],
      },
      visibleWhen: Answer(Question.drugs_reasons_for_use_details).match(Condition.IsRequired()),
    },
    {
      key: {
        text: contentFor('question.drugs_affected_their_life.text', CaseData.ForenamePossessive),
      },
      value: {
        blocks: [
          GovUKBody({
            text: contentFor('question.drugs_affected_their_life.option.BEHAVIOUR.text'),
            visibleWhen: and(
              Answer(Question.drugs_affected_their_life).match(Condition.IsRequired()),
              Answer(Question.drugs_affected_their_life).match(Condition.Array.Contains(Option.behaviour)),
            ),
          }),
          GovUKBody({
            text: contentFor('question.drugs_affected_their_life.option.COMMUNITY.text'),
            visibleWhen: and(
              Answer(Question.drugs_affected_their_life).match(Condition.IsRequired()),
              Answer(Question.drugs_affected_their_life).match(Condition.Array.Contains(Option.community)),
            ),
          }),
          GovUKBody({
            text: contentFor('question.drugs_affected_their_life.option.FINANCES.text'),
            visibleWhen: and(
              Answer(Question.drugs_affected_their_life).match(Condition.IsRequired()),
              Answer(Question.drugs_affected_their_life).match(Condition.Array.Contains(Option.finances)),
            ),
          }),
          GovUKBody({
            text: contentFor('question.drugs_affected_their_life.option.LINKS_TO_OFFENDING.text'),
            visibleWhen: and(
              Answer(Question.drugs_affected_their_life).match(Condition.IsRequired()),
              Answer(Question.drugs_affected_their_life).match(Condition.Array.Contains(Option.links_to_offending)),
            ),
          }),
          GovUKBody({
            text: contentFor('question.drugs_affected_their_life.option.HEALTH.text'),
            visibleWhen: and(
              Answer(Question.drugs_affected_their_life).match(Condition.IsRequired()),
              Answer(Question.drugs_affected_their_life).match(Condition.Array.Contains(Option.health)),
            ),
          }),
          GovUKBody({
            text: contentFor('question.drugs_affected_their_life.option.RELATIONSHIPS.text'),
            visibleWhen: and(
              Answer(Question.drugs_affected_their_life).match(Condition.IsRequired()),
              Answer(Question.drugs_affected_their_life).match(Condition.Array.Contains(Option.relationships)),
            ),
          }),
          GovUKBody({
            text: commonContentFor('option.OTHER'),
            visibleWhen: and(
              Answer(Question.drugs_affected_their_life).match(Condition.IsRequired()),
              Answer(Question.drugs_affected_their_life).match(Condition.Array.Contains(CommonOption.other)),
            ),
          }),
        ],
      },
      actions: {
        items: [{ href: Step.drug_use_history.path, text: commonContentFor('change') }],
      },
      visibleWhen: Answer(Question.drugs_affected_their_life).match(Condition.IsRequired()),
    },
    {
      key: {
        text: contentFor('question.drugs_affected_their_life_details.text', CaseData.ForenamePossessive),
      },
      value: {
        blocks: [
          GovUKBody({
            text: Answer(Question.drugs_affected_their_life_details),
          }),
        ],
      },
      actions: {
        items: [{ href: Step.drug_use_history.path, text: commonContentFor('change') }],
      },
      visibleWhen: Answer(Question.drugs_affected_their_life_details).match(Condition.IsRequired()),
    },
    {
      key: {
        text: contentFor('question.drugs_anything_helped_stop_or_reduce_use.text', CaseData.Forename),
      },
      value: {
        blocks: [
          GovUKBody({
            text: Answer(Question.drugs_anything_helped_stop_or_reduce_use),
          }),
        ],
      },
      actions: {
        items: [{ href: Step.drug_use_history.path, text: commonContentFor('change') }],
      },
      visibleWhen: Answer(Question.drugs_anything_helped_stop_or_reduce_use).match(Condition.IsRequired()),
    },
    {
      key: {
        text: Format('What could help %1 not use drugs in the future? (optional)', CaseData.Forename),
      },
      value: {
        blocks: [
          GovUKBody({
            text: Answer(Question.drugs_what_could_help_not_use_drugs_in_future),
          }),
        ],
      },
      actions: {
        items: [{ href: Step.drug_use_history.path, text: commonContentFor('change') }],
      },
      visibleWhen: Answer(Question.drugs_what_could_help_not_use_drugs_in_future).match(Condition.IsRequired()),
    },
    {
      key: {
        text: contentFor('question.drug_use_changes.text', CaseData.Forename),
      },
      value: {
        blocks: [
          GovUKBody({
            text: SANGenerators.getTextFromListDefinition(drugUseChanges.items, Answer(Question.drug_use_changes)),
          }),
          GovUKBody({
            text: Answer(Question.has_made_positive_changes_drugs_details),
            size: 's',
            visibleWhen: Answer(Question.drug_use_changes).match(Condition.Equals(CommonOption.has_made_changes)),
          }),
          GovUKBody({
            text: Answer(Question.actively_making_changes_drugs_details),
            size: 's',
            visibleWhen: Answer(Question.drug_use_changes).match(Condition.Equals(CommonOption.is_making_changes)),
          }),
          GovUKBody({
            text: Answer(Question.wants_to_make_changes_knows_how_to_drugs_details),
            size: 's',
            visibleWhen: Answer(Question.drug_use_changes).match(
              Condition.Equals(CommonOption.wants_to_make_changes_knows_how_to),
            ),
          }),
          GovUKBody({
            text: Answer(Question.wants_to_make_changes_needs_help_drugs_details),
            size: 's',
            visibleWhen: Answer(Question.drug_use_changes).match(
              Condition.Equals(CommonOption.wants_to_make_changes_needs_help),
            ),
          }),
          GovUKBody({
            text: Answer(Question.thinking_about_making_changes_drugs_details),
            size: 's',
            visibleWhen: Answer(Question.drug_use_changes).match(
              Condition.Equals(CommonOption.thinking_about_making_changes),
            ),
          }),
          GovUKBody({
            text: Answer(Question.does_not_want_to_make_changes_drugs_details),
            size: 's',
            visibleWhen: Answer(Question.drug_use_changes).match(
              Condition.Equals(CommonOption.does_not_want_to_make_changes),
            ),
          }),
          GovUKBody({
            text: Answer(Question.does_not_want_to_answer_drugs_details),
            size: 's',
            visibleWhen: Answer(Question.drug_use_changes).match(
              Condition.Equals(CommonOption.does_not_want_to_answer),
            ),
          }),
        ],
      },
      actions: {
        items: [{ href: Step.drug_use_history.path, text: commonContentFor('change') }],
      },
      visibleWhen: Answer(Question.drug_use_changes).match(Condition.IsRequired()),
    },
  ],
})

// --- Practitioner Analysis: Motivated to stop (drug-use specific) ---

export const drugsPractitionerAnalysisMotivatedToStop = GovUKRadioInput({
  code: Question.drugs_practitioner_analysis_motivated_to_stop,
  fieldset: {
    legend: {
      text: contentFor('question.drugs_practitioner_analysis_motivated_to_stop.text', CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    {
      value: Option.no_motivation,
      text: contentFor('question.drugs_practitioner_analysis_motivated_to_stop.option.NO_MOTIVATION'),
    },
    {
      value: Option.partial_motivation,
      text: contentFor('question.drugs_practitioner_analysis_motivated_to_stop.option.PARTIAL_MOTIVATION'),
    },
    {
      value: Option.full_motivation,
      text: contentFor('question.drugs_practitioner_analysis_motivated_to_stop.option.FULL_MOTIVATION'),
    },
    { value: CommonOption.unknown, text: commonContentFor('option.UNKNOWN') },
  ],
  dependentWhen: Answer('drug_use').match(Condition.Equals(CommonOption.yes)),
  visibleWhen: Answer('drug_use').match(Condition.Equals(CommonOption.yes)),
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.drugs_practitioner_analysis_motivated_to_stop.validation'),
    }),
  ],
})

// --- Practitioner Analysis: Strengths or Protective Factors ---

const strengthsYesDetails = GovUKCharacterCount({
  code: Question.drug_use_practitioner_analysis_strengths_or_protective_factors_yes_details,
  label: commonContentFor('required_details'),
  maxLength: 1425,
  dependentWhen: Answer(Question.drug_use_practitioner_analysis_strengths_or_protective_factors)
    .match(Condition.Equals(CommonOption.yes)),
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: commonContentFor('validation.enter_details'),
    }),
    validation({
      condition: Self().match(Condition.String.HasMaxLength(1425)),
      message: commonContentFor('validation.details_must_be_less_than', 1425),
    }),
  ],
})

const strengthsNoDetails = GovUKCharacterCount({
  code: Question.drug_use_practitioner_analysis_strengths_or_protective_factors_no_details,
  label: commonContentFor('optional_details'),
  maxLength: 1425,
  dependentWhen: Answer(Question.drug_use_practitioner_analysis_strengths_or_protective_factors)
    .match(Condition.Equals(CommonOption.no)),
  validWhen: [
    validation({
      condition: Self().match(Condition.String.HasMaxLength(1425)),
      message: commonContentFor('validation.details_must_be_less_than', 1425),
    }),
  ],
})

export const strengthsOrProtectiveFactors = GovUKRadioInput({
  code: Question.drug_use_practitioner_analysis_strengths_or_protective_factors,
  fieldset: {
    legend: {
      text: contentFor(
        'question.drug_use_practitioner_analysis_strengths_or_protective_factors.text',
        CaseData.ForenamePossessive,
      ),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    { value: CommonOption.yes, text: commonContentFor('option.YES'), block: strengthsYesDetails },
    { value: CommonOption.no, text: commonContentFor('option.NO'), block: strengthsNoDetails },
  ],
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: contentFor('question.drug_use_practitioner_analysis_strengths_or_protective_factors.validation'),
    }),
  ],
})

// --- Practitioner Analysis: Risk of Serious Harm ---

const riskOfSeriousHarmYesDetails = GovUKCharacterCount({
  code: Question.drug_use_practitioner_analysis_risk_of_serious_harm_yes_details,
  label: commonContentFor('required_details'),
  maxLength: 1425,
  dependentWhen: Answer(Question.drug_use_practitioner_analysis_risk_of_serious_harm).match(
    Condition.Equals(CommonOption.yes),
  ),
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: commonContentFor('validation.enter_details'),
    }),
    validation({
      condition: Self().match(Condition.String.HasMaxLength(1425)),
      message: commonContentFor('validation.details_must_be_less_than', 1425),
    }),
  ],
})

const riskOfSeriousHarmNoDetails = GovUKCharacterCount({
  code: Question.drug_use_practitioner_analysis_risk_of_serious_harm_no_details,
  label: commonContentFor('optional_details'),
  maxLength: 1425,
  dependentWhen: Answer(Question.drug_use_practitioner_analysis_risk_of_serious_harm).match(
    Condition.Equals(CommonOption.no),
  ),
  validWhen: [
    validation({
      condition: Self().match(Condition.String.HasMaxLength(1425)),
      message: commonContentFor('validation.details_must_be_less_than', 1425),
    }),
  ],
})

export const riskOfSeriousHarm = GovUKRadioInput({
  code: Question.drug_use_practitioner_analysis_risk_of_serious_harm,
  fieldset: {
    legend: {
      text: contentFor(
        'question.drug_use_practitioner_analysis_risk_of_serious_harm.text',
        CaseData.ForenamePossessive,
      ),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    { value: CommonOption.yes, text: commonContentFor('option.YES'), block: riskOfSeriousHarmYesDetails },
    { value: CommonOption.no, text: commonContentFor('option.NO'), block: riskOfSeriousHarmNoDetails },
  ],
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: contentFor('question.drug_use_practitioner_analysis_risk_of_serious_harm.validation'),
    }),
  ],
})

// --- Practitioner Analysis: Risk of Reoffending ---

const riskOfReoffendingYesDetails = GovUKCharacterCount({
  code: Question.drug_use_practitioner_analysis_risk_of_reoffending_yes_details,
  label: commonContentFor('required_details'),
  maxLength: 1000,
  dependentWhen: Answer(Question.drug_use_practitioner_analysis_risk_of_reoffending).match(Condition.Equals('YES')),
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: commonContentFor('validation.enter_details'),
    }),
    validation({
      condition: Self().match(Condition.String.HasMaxLength(1000)),
      message: commonContentFor('validation.details_must_be_less_than', 1000),
    }),
  ],
})

const riskOfReoffendingNoDetails = GovUKCharacterCount({
  code: Question.drug_use_practitioner_analysis_risk_of_reoffending_no_details,
  label: commonContentFor('optional_details'),
  maxLength: 1000,
  dependentWhen: Answer(Question.drug_use_practitioner_analysis_risk_of_reoffending).match(Condition.Equals('NO')),
  validWhen: [
    validation({
      condition: Self().match(Condition.String.HasMaxLength(1000)),
      message: commonContentFor('validation.details_must_be_less_than', 1000),
    }),
  ],
})

export const riskOfReoffending = GovUKRadioInput({
  code: Question.drug_use_practitioner_analysis_risk_of_reoffending,
  fieldset: {
    legend: {
      text: contentFor('question.drug_use_practitioner_analysis_risk_of_reoffending.text', CaseData.ForenamePossessive),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    { value: CommonOption.yes, text: commonContentFor('option.YES'), block: riskOfReoffendingYesDetails },
    { value: CommonOption.no, text: commonContentFor('option.NO'), block: riskOfReoffendingNoDetails },
  ],
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: contentFor('question.drug_use_practitioner_analysis_risk_of_reoffending.validation'),
    }),
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
          drugsPractitionerAnalysisMotivatedToStop,
          strengthsOrProtectiveFactors,
          riskOfSeriousHarm,
          riskOfReoffending,
          markAsCompleteButton,
        ],
      },
    },
  ],
})
