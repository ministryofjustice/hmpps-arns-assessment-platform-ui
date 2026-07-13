import { Answer, Condition, Format, not, Self, validation } from '@ministryofjustice/hmpps-forge/core/authoring'
import {
  GovUKBody,
  GovUKCharacterCount,
  GovUKRadioInput,
  GovUKSummaryList,
  GovUKTabs,
} from '@ministryofjustice/hmpps-forge/govuk-components'

import { CaseData } from '../../../../constants/formVersion'
import { commonContentFor } from '../../../../locales'
import { goToPractitionerAnalysisButton, markAsCompleteButton } from '../../../../constants/buttons'
import { Step } from '../../constants/step'
import { contentFor } from '../../locales'
import { Question } from '../../constants/question'
import { SANGenerators } from '../../../../../../generators'
import { drugUse } from '../drug-use/fields'

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

export const drugsSummary = GovUKSummaryList({
  rows: [
    {
      key: { text: contentFor('question.drug_use.text', CaseData.Forename) },
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

export const drugsSummaryTab = GovUKTabs({
  id: 'summaries',
  items: [
    {
      id: 'summary',
      label: commonContentFor('summary'),
      panel: {
        blocks: [drugsSummary, goToPractitionerAnalysisButton(Step.drug_use_summary.path)],
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
