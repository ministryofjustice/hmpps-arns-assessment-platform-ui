import { validation, Self, Answer } from '@form-engine/form/builders'
import { GovUKRadioInput, GovUKCharacterCount } from '@form-engine-govuk-components/components'
import { Condition } from '@form-engine/registry/conditions'

// --- Practitioner Analysis: Strengths or Protective Factors ---

const strengthsYesDetails = GovUKCharacterCount({
  code: 'accommodation_practitioner_analysis_strengths_or_protective_factors_yes_details',
  label: 'Give details',
  maxLength: 1425,
  dependent: Answer('accommodation_practitioner_analysis_strengths_or_protective_factors').match(
    Condition.Equals('YES'),
  ),
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Enter details',
    }),
  ],
})

const strengthsNoDetails = GovUKCharacterCount({
  code: 'accommodation_practitioner_analysis_strengths_or_protective_factors_no_details',
  label: 'Give details (optional)',
  maxLength: 1425,
  dependent: Answer('accommodation_practitioner_analysis_strengths_or_protective_factors').match(
    Condition.Equals('NO'),
  ),
})

export const strengthsOrProtectiveFactors = GovUKRadioInput({
  code: 'accommodation_practitioner_analysis_strengths_or_protective_factors',
  fieldset: {
    legend: {
      text: 'Are there any strengths or protective factors related to accommodation?',
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    { value: 'YES', text: 'Yes', block: strengthsYesDetails },
    { value: 'NO', text: 'No', block: strengthsNoDetails },
  ],
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Select if there are any strengths or protective factors related to accommodation',
    }),
  ],
})

// --- Practitioner Analysis: Risk of Serious Harm ---

const riskOfSeriousHarmYesDetails = GovUKCharacterCount({
  code: 'accommodation_practitioner_analysis_risk_of_serious_harm_yes_details',
  label: 'Give details',
  maxLength: 1425,
  dependent: Answer('accommodation_practitioner_analysis_risk_of_serious_harm').match(Condition.Equals('YES')),
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Enter details',
    }),
  ],
})

const riskOfSeriousHarmNoDetails = GovUKCharacterCount({
  code: 'accommodation_practitioner_analysis_risk_of_serious_harm_no_details',
  label: 'Give details (optional)',
  maxLength: 1425,
  dependent: Answer('accommodation_practitioner_analysis_risk_of_serious_harm').match(Condition.Equals('NO')),
})

export const riskOfSeriousHarm = GovUKRadioInput({
  code: 'accommodation_practitioner_analysis_risk_of_serious_harm',
  fieldset: {
    legend: {
      text: 'Is accommodation linked to risk of serious harm?',
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    { value: 'YES', text: 'Yes', block: riskOfSeriousHarmYesDetails },
    { value: 'NO', text: 'No', block: riskOfSeriousHarmNoDetails },
  ],
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Select if accommodation is linked to risk of serious harm',
    }),
  ],
})

// --- Practitioner Analysis: Risk of Reoffending ---

const riskOfReoffendingYesDetails = GovUKCharacterCount({
  code: 'accommodation_practitioner_analysis_risk_of_reoffending_yes_details',
  label: 'Give details',
  maxLength: 1000,
  dependent: Answer('accommodation_practitioner_analysis_risk_of_reoffending').match(Condition.Equals('YES')),
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Enter details',
    }),
  ],
})

const riskOfReoffendingNoDetails = GovUKCharacterCount({
  code: 'accommodation_practitioner_analysis_risk_of_reoffending_no_details',
  label: 'Give details (optional)',
  maxLength: 1000,
  dependent: Answer('accommodation_practitioner_analysis_risk_of_reoffending').match(Condition.Equals('NO')),
})

export const riskOfReoffending = GovUKRadioInput({
  code: 'accommodation_practitioner_analysis_risk_of_reoffending',
  fieldset: {
    legend: {
      text: 'Is accommodation linked to risk of reoffending?',
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    { value: 'YES', text: 'Yes', block: riskOfReoffendingYesDetails },
    { value: 'NO', text: 'No', block: riskOfReoffendingNoDetails },
  ],
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Select if accommodation is linked to risk of reoffending',
    }),
  ],
})
