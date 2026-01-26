import { Data } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components'
import { GovUKTextInput, GovUKSelectInput, GovUKRadioInput } from '@form-engine-govuk-components/components'
import { RandomizableField } from '../../../../components'

/**
 * Subject details tab content
 * Contains fields for personal information, identifiers, and location
 * Each field is wrapped with RandomizableField to allow toggling randomization
 */
export const subjectDetailsTabContent = [
  HtmlBlock({
    content: '<h2 class="govuk-heading-m">Subject Details</h2>',
  }),

  HtmlBlock({
    content:
      '<p class="govuk-body">Configure the subject details for this scenario. Check "Randomize" to generate a new value each time the scenario is loaded.</p>',
  }),

  HtmlBlock({
    content: '<h3 class="govuk-heading-s govuk-!-margin-top-6">Personal Information</h3>',
  }),

  RandomizableField({
    fieldKey: 'givenName',
    randomize: Data('givenName_isRandomized'),
    field: GovUKTextInput({
      code: 'givenName',
      label: 'Given name',
      classes: 'govuk-input--width-10',
      defaultValue: Data('scenario.givenName'),
    }),
  }),

  RandomizableField({
    fieldKey: 'familyName',
    randomize: Data('familyName_isRandomized'),
    field: GovUKTextInput({
      code: 'familyName',
      label: 'Family name',
      classes: 'govuk-input--width-10',
      defaultValue: Data('scenario.familyName'),
    }),
  }),

  RandomizableField({
    fieldKey: 'dateOfBirth',
    randomize: Data('dateOfBirth_isRandomized'),
    field: GovUKTextInput({
      code: 'dateOfBirth',
      label: 'Date of birth',
      hint: 'Format: YYYY-MM-DD (e.g., 1985-03-15)',
      classes: 'govuk-input--width-10',
      defaultValue: Data('scenario.dateOfBirth'),
    }),
  }),

  RandomizableField({
    fieldKey: 'gender',
    randomize: Data('gender_isRandomized'),
    field: GovUKSelectInput({
      code: 'gender',
      label: 'Gender',
      classes: 'govuk-input--width-10',
      defaultValue: Data('scenario.gender'),
      items: [
        { value: '0', text: 'Not known' },
        { value: '1', text: 'Male' },
        { value: '2', text: 'Female' },
        { value: '9', text: 'Not specified' },
      ],
    }),
  }),

  RandomizableField({
    fieldKey: 'location',
    randomize: Data('location_isRandomized'),
    field: GovUKRadioInput({
      code: 'location',
      label: 'Location',
      classes: 'govuk-radios--inline',
      defaultValue: Data('scenario.location'),
      items: [
        { value: 'COMMUNITY', text: 'Community' },
        { value: 'PRISON', text: 'Prison' },
      ],
    }),
  }),

  RandomizableField({
    fieldKey: 'sexuallyMotivatedOffenceHistory',
    randomize: Data('sexuallyMotivatedOffenceHistory_isRandomized'),
    field: GovUKRadioInput({
      code: 'sexuallyMotivatedOffenceHistory',
      label: 'Sexually motivated offence history',
      classes: 'govuk-radios--inline',
      defaultValue: Data('scenario.sexuallyMotivatedOffenceHistory'),
      items: [
        { value: 'YES', text: 'Yes' },
        { value: 'NO', text: 'No' },
      ],
    }),
  }),

  HtmlBlock({
    content: '<h3 class="govuk-heading-s govuk-!-margin-top-6">Identifiers</h3>',
  }),

  RandomizableField({
    fieldKey: 'crn',
    randomize: Data('crn_isRandomized'),
    field: GovUKTextInput({
      code: 'crn',
      label: 'CRN',
      hint: 'Case Reference Number',
      classes: 'govuk-input--width-10',
      defaultValue: Data('scenario.crn'),
    }),
  }),

  RandomizableField({
    fieldKey: 'pnc',
    randomize: Data('pnc_isRandomized'),
    field: GovUKTextInput({
      code: 'pnc',
      label: 'PNC',
      hint: 'Police National Computer number',
      classes: 'govuk-input--width-20',
      defaultValue: Data('scenario.pnc'),
    }),
  }),

  RandomizableField({
    fieldKey: 'oasysAssessmentPk',
    randomize: Data('oasysAssessmentPk_isRandomized'),
    field: GovUKTextInput({
      code: 'oasysAssessmentPk',
      label: 'OASys Assessment PK',
      hint: '7-digit identifier',
      classes: 'govuk-input--width-10',
      defaultValue: Data('scenario.oasysAssessmentPk'),
    }),
  }),
]
