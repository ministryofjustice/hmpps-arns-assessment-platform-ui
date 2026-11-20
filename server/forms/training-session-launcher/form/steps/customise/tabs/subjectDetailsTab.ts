import { Data } from '@ministryofjustice/hmpps-forge/core/authoring'
import { HtmlBlock } from '@ministryofjustice/hmpps-forge/core/components'
import { GovUKTextInput, GovUKSelectInput, GovUKRadioInput } from '@ministryofjustice/hmpps-forge/govuk-components'
import { RandomizableField } from '../../../../components'
import { stubbedCrns } from '../../../../scenarios/stubbedCrns'

/**
 * Subject details tab content
 * Contains fields for personal information, identifiers, and location
 * Each field is wrapped with RandomizableField to allow toggling randomization
 */
export const subjectDetailsTabContent = [
  HtmlBlock({
    content: '<h2 class="govuk-heading-m">Subject details</h2>',
  }),

  HtmlBlock({
    content:
      '<p class="govuk-body">Set the details of the person on probation or in prison for this scenario. Select "Random" next to a field to get a new value each time a session is started.</p>',
  }),

  HtmlBlock({
    content: '<h3 class="govuk-heading-s govuk-!-margin-top-6">Personal information</h3>',
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
      hint: 'Use year-month-day, for example 1985-03-15',
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
      hint: 'Case reference number (nDelius)',
      classes: 'govuk-input--width-10',
      defaultValue: Data('scenario.crn'),
    }),
  }),

  GovUKRadioInput({
    code: 'stubbedCrn',
    label: 'Stubbed CRN',
    hint: 'Replaces the CRN above with a shared test CRN that has fixed data in local, dev and test, so the About and supervision package pages show that data instead of calling the real services. If you pick one, Sentence Plan shows its canned criminogenic needs, not the ones you set on the Criminogenic Needs tab. The launcher never changes their data.',
    classes: 'govuk-radios--small',
    defaultValue: Data('stubbedCrn'),
    items: [
      { value: '', text: 'None' },
      ...stubbedCrns.map(({ crn, description }) => ({ value: crn, text: crn, hint: description })),
    ],
  }),

  RandomizableField({
    fieldKey: 'pnc',
    randomize: Data('pnc_isRandomized'),
    field: GovUKTextInput({
      code: 'pnc',
      label: 'PNC',
      hint: 'Police National Computer (PNC) number',
      classes: 'govuk-input--width-20',
      defaultValue: Data('scenario.pnc'),
    }),
  }),

  RandomizableField({
    fieldKey: 'oasysAssessmentPk',
    randomize: Data('oasysAssessmentPk_isRandomized'),
    field: GovUKTextInput({
      code: 'oasysAssessmentPk',
      label: 'OASys assessment PK',
      hint: 'The 7-digit OASys assessment ID',
      classes: 'govuk-input--width-10',
      defaultValue: Data('scenario.oasysAssessmentPk'),
    }),
  }),

  RandomizableField({
    fieldKey: 'sentencePlanVersion',
    randomize: Data('sentencePlanVersion_isRandomized'),
    field: GovUKTextInput({
      code: 'sentencePlanVersion',
      label: 'Sentence plan version',
      hint: 'Leave blank to use the current version',
      classes: 'govuk-input--width-10',
      defaultValue: Data('scenario.sentencePlanVersion'),
    }),
  }),
]
