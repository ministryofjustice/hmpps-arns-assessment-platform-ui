import {
  Answer, ChainableExpr,
  Condition,
  Format,
  Item, Iterator,
  not, PipelineExpr,
  Self,
  Transformer,
  validation, when
} from '@ministryofjustice/hmpps-forge/core/authoring'
import {
  GovUKBody,
  GovUKCharacterCount,
  GovUKHeading,
  GovUKRadioInput,
  GovUKSummaryList,
  GovUKTabs,
} from '@ministryofjustice/hmpps-forge/govuk-components'

import {CaseData} from '../../../../constants/formVersion'
import {commonContentFor} from '../../../../locales'
import {goToPractitionerAnalysisButton, markAsCompleteButton} from '../../../../constants/buttons'
import {Step} from '../../constants/step'
import {contentFor} from '../../locales'
import {Question} from '../../constants/question'
import {SANGenerators} from '../../../../../../generators'
import {drugUse} from '../drug-use/fields'
import {drugInjectedLast, drugIntakeFrequency, drugIntakeFrequencyDetails} from "../drug-details/fields";
import {Option} from "../../constants/option";
import {fieldCode} from "../../constants";
import {selectMisusedDrugs} from "../add-drugs/fields";
import {CollectionBlock, TemplateWrapper} from "@ministryofjustice/hmpps-forge/core/components";
import {CommonOption} from "../../../../constants/commonOption";

const misusedDrugs = Answer(Question.select_misused_drugs).match(Condition.IsRequired())

// --- Motivated to stop (drug-use specific) ---

// export const drugsPractitionerAnalysisMotivatedToStop = GovUKRadioInput({
//   code: 'drugs_practitioner_analysis_motivated_to_stop',
//   fieldset: {
//     legend: {
//       text: Format('Does %1 seem motivated to stop or reduce their drug use?', CaseData.Forename),
//       classes: 'govuk-fieldset__legend--m',
//     },
//   },
//   dependentWhen: Answer('drug_use').match(Condition.Equals('YES')),
//   items: [
//     { value: 'NO_MOTIVATION', text: 'Does not show motivation to stop or reduce' },
//     { value: 'PARTIAL_MOTIVATION', text: 'Shows some motivation to stop or reduce' },
//     { value: 'FULL_MOTIVATION', text: 'Motivated to stop or reduce' },
//     { value: 'UNKNOWN', text: 'Unknown' },
//   ],
//   validWhen: [
//     validation({
//       condition: not(Self().not.match(Condition.IsRequired())),
//       message: 'Select if they seem motivated to stop or reduce their drug use',
//     }),
//   ],
// })


export const drugsSummary = GovUKSummaryList({
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

// --- Practitioner Analysis: Strengths or Protective Factors ---

      const strengthsYesDetails = GovUKCharacterCount({
        code: 'drug_use_practitioner_analysis_strengths_or_protective_factors_yes_details',
        label: 'Give details',
        maxLength: 1425,
        dependentWhen: Answer('drug_use_practitioner_analysis_strengths_or_protective_factors').match(
          Condition.Equals('YES'),
        ),
        validWhen: [
          validation({
            condition: not(Self().not.match(Condition.IsRequired())),
            message: 'Enter details',
          }),
        ],
      })

      const strengthsNoDetails = GovUKCharacterCount({
        code: 'drug_use_practitioner_analysis_strengths_or_protective_factors_no_details',
        label: 'Give details (optional)',
        maxLength: 1425,
        dependentWhen: Answer('drug_use_practitioner_analysis_strengths_or_protective_factors').match(Condition.Equals('NO')),
      })

      export const strengthsOrProtectiveFactors = GovUKRadioInput({
        code: 'drug_use_practitioner_analysis_strengths_or_protective_factors',
        fieldset: {
          legend: {
            text: Format(
              "Are there any strengths or protective factors related to %1's drug use?",
              CaseData.ForenamePossessive,
            ),
            classes: 'govuk-fieldset__legend--m',
          },
        },
        items: [
          { value: 'YES', text: 'Yes', block: strengthsYesDetails },
          { value: 'NO', text: 'No', block: strengthsNoDetails },
        ],
        validWhen: [
          validation({
            condition: not(Self().not.match(Condition.IsRequired())),
            message: 'Select if there are any strengths or protective factors related to drug use',
          }),
        ],
      })

// --- Practitioner Analysis: Risk of Serious Harm ---

      const riskOfSeriousHarmYesDetails = GovUKCharacterCount({
        code: 'drug_use_practitioner_analysis_risk_of_serious_harm_yes_details',
        label: 'Give details',
        maxLength: 1425,
        dependentWhen: Answer('drug_use_practitioner_analysis_risk_of_serious_harm').match(Condition.Equals('YES')),
        validWhen: [
          validation({
            condition: not(Self().not.match(Condition.IsRequired())),
            message: 'Enter details',
          }),
        ],
      })

      const riskOfSeriousHarmNoDetails = GovUKCharacterCount({
        code: 'drug_use_practitioner_analysis_risk_of_serious_harm_no_details',
        label: 'Give details (optional)',
        maxLength: 1425,
        dependentWhen: Answer('drug_use_practitioner_analysis_risk_of_serious_harm').match(Condition.Equals('NO')),
      })

      export const riskOfSeriousHarm = GovUKRadioInput({
        code: 'drug_use_practitioner_analysis_risk_of_serious_harm',
        fieldset: {
          legend: {
            text: Format("Is %1's drug use linked to risk of serious harm?", CaseData.ForenamePossessive),
            classes: 'govuk-fieldset__legend--m',
          },
        },
        items: [
          { value: 'YES', text: 'Yes', block: riskOfSeriousHarmYesDetails },
          { value: 'NO', text: 'No', block: riskOfSeriousHarmNoDetails },
        ],
        validWhen: [
          validation({
            condition: not(Self().not.match(Condition.IsRequired())),
            message: 'Select if drug use is linked to risk of serious harm',
          }),
        ],
      })

// --- Practitioner Analysis: Risk of Reoffending ---

const riskOfReoffendingYesDetails = GovUKCharacterCount({
  code: 'drug_use_practitioner_analysis_risk_of_reoffending_yes_details',
  label: 'Give details',
  maxLength: 1000,
  dependentWhen: Answer('drug_use_practitioner_analysis_risk_of_reoffending').match(Condition.Equals('YES')),
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: 'Enter details',
    }),
  ],
})

const riskOfReoffendingNoDetails = GovUKCharacterCount({
  code: 'drug_use_practitioner_analysis_risk_of_reoffending_no_details',
  label: 'Give details (optional)',
  maxLength: 1000,
  dependentWhen: Answer('drug_use_practitioner_analysis_risk_of_reoffending').match(Condition.Equals('NO')),
})

export const riskOfReoffending = GovUKRadioInput({
  code: 'drug_use_practitioner_analysis_risk_of_reoffending',
  fieldset: {
    legend: {
      text: Format("Is %1's drug use linked to risk of reoffending?", CaseData.ForenamePossessive),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    { value: 'YES', text: 'Yes', block: riskOfReoffendingYesDetails },
    { value: 'NO', text: 'No', block: riskOfReoffendingNoDetails },
  ],
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: 'Select if drug use is linked to risk of reoffending',
    }),
  ],
})

export const testHeading = GovUKHeading({
  text: contentFor('question.drug_last_used.option.LAST_SIX'),
})


// export const drugLastSixMonths = (drugValue: ChainableExpr<PipelineExpr>) => GovUKSummaryList({
//   card: {
//     title: {
//       text: SANGenerators.getTextFromListDefinition(
//         selectMisusedDrugs.items,
//         drugValue
//       ),
//     },
//     actions: {
//       items: [{href: Step.drug_details.path, text: commonContentFor('change') }],
//     },
//   },
//   rows: [
//     {
//       key: { text: contentFor('text.lastUsed.text') },
//       value: {
//         text: SANGenerators.getTextFromListDefinition(
//           drugInjectedLast(drugValue).items,
//           Answer(Format(Question.drug_last_used_value, drugValue.pipe(Transformer.String.ToLowerCase()))),
//         ),
//       },
//       actions: {
//         items: [{href: Step.add_drugs.path, text: commonContentFor('change') }],
//       },
//     },
//     {
//       key: { text: contentFor('text.howOften.text') },
//       value: {
//         text: SANGenerators.getTextFromListDefinition(
//           drugIntakeFrequency(drugValue.pipe(Transformer.String.ToLowerCase())).items,
//           Answer(Format(Question.how_often_used, drugValue)),
//         ),
//       },
//       actions: {
//         items: [{href: Step.drug_details.path, text: commonContentFor('change') }],
//       },
//     },
//     {
//       key: {
//         text: commonContentFor('optional_details')
//       },
//       value: {
//         text: Answer(Format(Question.how_often_used_details, drugValue.pipe(Transformer.String.ToLowerCase()))),
//       },
//       visibleWhen: Answer(
//         Format(Question.how_often_used_details, drugValue.pipe(Transformer.String.ToLowerCase())))
//         .match(Condition.IsRequired()),
//       actions: {
//         items: [{href: Step.drug_details.path, text: commonContentFor('change') }],
//       },
//     },
//     // {
//     //   key: {text: contentFor('text.injected.text')}, value: {text: 'sarah@example.com'}, actions: {
//     //     items: [{href: Step.drug_details.path, text: commonContentFor('change') }],
//     //   },
//     // },
//   ]
// })

export const drugLastSixMonthsString = (drugValue: string) => GovUKSummaryList({
  card: {
    title: {
      text: SANGenerators.getTextFromListDefinition(
        selectMisusedDrugs.items,
        drugValue
      ),
    },
    actions: {
      items: [{href: Step.drug_details.path, text: commonContentFor('change') }],
    },
  },
  rows: [
    {
      key: { text: contentFor('text.lastUsed.text') },
      value: {
        text: SANGenerators.getTextFromListDefinition(
          drugInjectedLast(drugValue).items,
          Answer(Format(Question.drug_last_used_value, drugValue.toLowerCase())),
        ),
      },
      actions: {
        items: [{href: Step.add_drugs.path, text: commonContentFor('change') }],
      },
    },
    {
      key: { text: contentFor('text.howOften.text') },
      value: {
        text: SANGenerators.getTextFromListDefinition(
          drugIntakeFrequency(drugValue.toLowerCase()).items,
          Answer(Format(Question.how_often_used, drugValue)),
        ),
      },
      actions: {
        items: [{href: Step.drug_details.path, text: commonContentFor('change') }],
      },
    },
    {
      key: {
        text: commonContentFor('optional_details')
      },
      value: {
        text: Answer(Format(Question.how_often_used_details, drugValue.toLowerCase())),
      },
      visibleWhen: Answer(
        Format(Question.how_often_used_details, drugValue.toLowerCase()))
        .match(Condition.IsRequired()),
      actions: {
        items: [{href: Step.drug_details.path, text: commonContentFor('change') }],
      },
    },
    // {
    //   key: {text: contentFor('text.injected.text')}, value: {text: 'sarah@example.com'}, actions: {
    //     items: [{href: Step.drug_details.path, text: commonContentFor('change') }],
    //   },
    // },
  ]
})

// const drugsCollection = CollectionBlock({
//   collection: Answer(Question.select_misused_drugs).each(
//     Iterator.Map(
//       TemplateWrapper({
//         template: '',
//         slots: {
//           fields: [
//             drugLastSixMonths(Item().path('value').pipe(Transformer.String.EscapeHtml())),
//           ],
//         },
//       }),
//     ),
//   ),
// })

export const drugsSummaryTab = GovUKTabs({
  id: 'summaries',
  items: [
    {
      id: 'summary',
      label: commonContentFor('summary'),
      panel: {
        blocks: [drugsSummary,testHeading, drugLastSixMonthsString(Option.amphetamines), goToPractitionerAnalysisButton(Step.drug_use_summary.path)],
      },
    },
    {
      id: 'practitioner-analysis',
      label: commonContentFor('practitioner_analysis'),
      panel: {
        blocks: [markAsCompleteButton],
      },
    },
  ],
})
