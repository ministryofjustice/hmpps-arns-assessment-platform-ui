import { GovUKCheckboxInput, GovUKRadioInput } from '@ministryofjustice/hmpps-forge/govuk-components'
import { Answer, Condition, Format, Self, validation } from '@ministryofjustice/hmpps-forge/core/authoring'
import { CaseData } from '../../../../../sentence-plan/versions/v1.0/constants'

const domesticAbuseAgainstField = GovUKRadioInput({
  code: 'domestic-abuse-against',
  fieldset: {
    legend: {
      text: 'Who was this commited against?',
      classes: 'govuk-fieldset__legend--s',
    },
  },
  dependentWhen: Answer('evidence-of-domestic-abuse').match(Condition.Equals('true')),
  items: [
    {
      value: 'family-member',
      text: 'Family member',
    },
    {
      value: 'intimate-partner',
      text: 'Intimate partner',
    },
    {
      value: 'family-member-and-intimate-partner',
      text: 'Family member and intimate partner',
    },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: 'This is a required field',
    }),
  ],
})

export const offenceElementsField = GovUKCheckboxInput({
  code: 'offence-elements',
  hint: {
    text: 'Select all that apply.',
  },
  fieldset: {
    legend: {
      text: Format('Does %1 current offence have any of the following elements?', CaseData.ForenamePossessive),
      classes: 'govuk-fieldset__legend--s',
    },
  },
  items: [
    {
      value: 'arson',
      text: 'Arson',
    },
    {
      value: 'domestic-abuse',
      text: 'Domestic abuse',
    },
    {
      value: 'excessive-violence-or-sadistic-violence',
      text: 'Excessive violence or sadistic violence',
    },
    {
      value: 'hatred-of-identifiable-group',
      text: 'Hatred of identifiable groups',
    },
    {
      value: 'physical-violence-against-a-child',
      text: 'Physical violence against a child',
    },
    {
      value: 'sexual-element',
      text: 'Sexual element',
    },
    {
      value: 'stalking-element',
      text: 'Stalking element',
    },
    {
      value: 'violent-or-threat-of-violence-with-a-weapon',
      text: 'Violent or threat of violence with a weapon',
    },
    {
      value: 'weapon',
      text: 'Weapon',
    },
    {
      divider: 'or',
    },
    {
      value: 'NA',
      text: 'None of these elements',
      behaviour: 'exclusive',
    },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: 'This is a required field',
    }),
  ],
})

export const evidenceOfDomesticAbuseField = GovUKRadioInput({
  code: 'evidence-of-domestic-abuse',
  fieldset: {
    legend: {
      text: Format('Is there evidence that %1 has ever been a perpetrator of domestic abuse?', CaseData.Forename),
      classes: 'govuk-fieldset__legend--s',
    },
  },
  items: [
    {
      value: 'true',
      text: 'Yes',
      block: domesticAbuseAgainstField,
    },

    { value: 'false', text: 'No' },
    {
      divider: 'or',
    },
    {
      value: 'unknown',
      text: 'Unknown',
    },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: 'This is a required field',
    }),
  ],
})
