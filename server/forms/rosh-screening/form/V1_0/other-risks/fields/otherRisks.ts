import { GovUKRadioInput } from '@form-engine/registry/components/govuk-frontend/radio-input/govukRadioInput'
import { GovUKUtilityClasses } from '@form-engine/utils/govukUtilityClasses'
import { Answer, field, Self, validation } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'

export const riskEscapeOrAbsconding = field<GovUKRadioInput>({
  code: 'risk_escape_absconding',
  variant: 'govukRadioInput',
  fieldset: {
    legend: {
      text: "Are there any concerns about [subject]'s risk of escape or absconding?",
      classes: GovUKUtilityClasses.Fieldset.mediumLabel,
    },
  },
  items: [
    { text: 'Yes', value: 'YES' },
    { text: 'No', value: 'NO' },
    { text: 'Unknown', value: 'UNKNOWN' },
  ],
  validate: [
    validation({
      when: Answer(Self()).not.match(Condition.IsRequired()),
      message: 'Select yes, no, unknown', // TODO: Update message
    }),
  ],
})

export const riskControlIssuesDisruptiveBehaviourBreachTrust = field<GovUKRadioInput>({
  code: 'risk_control_issues_disruptive_behaviour_breach_trust',
  variant: 'govukRadioInput',
  fieldset: {
    legend: {
      text: "Are there any concerns about [subject]'s risk of control issues, disruptive behaviour or breach of trust?",
      classes: GovUKUtilityClasses.Fieldset.mediumLabel,
    },
  },
  items: [
    { text: 'Yes', value: 'YES' },
    { text: 'No', value: 'NO' },
    { text: 'Unknown', value: 'UNKNOWN' },
  ],
  validate: [
    validation({
      when: Answer(Self()).not.match(Condition.IsRequired()),
      message: 'Select yes, no, unknown', // TODO: Update message
    }),
  ],
})

export const riskOtherPrisoners = field<GovUKRadioInput>({
  code: 'risk_other_prisoners',
  variant: 'govukRadioInput',
  fieldset: {
    legend: {
      text: "Are there any concerns about [subject]'s risk to other prisoners?",
      classes: GovUKUtilityClasses.Fieldset.mediumLabel,
    },
  },
  items: [
    { text: 'Yes', value: 'YES' },
    { text: 'No', value: 'NO' },
    { text: 'Unknown', value: 'UNKNOWN' },
  ],
  validate: [
    validation({
      when: Answer(Self()).not.match(Condition.IsRequired()),
      message: 'Select yes, no, unknown', // TODO: Update message
    }),
  ],
})
