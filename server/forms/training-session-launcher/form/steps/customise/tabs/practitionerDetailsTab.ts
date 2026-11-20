import { Data } from '@ministryofjustice/hmpps-forge/core/authoring'
import { HtmlBlock } from '@ministryofjustice/hmpps-forge/core/components'
import { GovUKTextInput, GovUKRadioInput } from '@ministryofjustice/hmpps-forge/govuk-components'
import { RandomizableField } from '../../../../components'

/**
 * Practitioner details tab content
 * Contains fields for practitioner identity and access configuration
 */
export const practitionerDetailsTabContent = [
  HtmlBlock({
    content: '<h2 class="govuk-heading-m">Practitioner details</h2>',
  }),

  HtmlBlock({
    content: `
      <p class="govuk-body">
        These details identify the practitioner using the training session.
        Select "Random" next to a field to get a new value each time a session is started.
      </p>
    `,
  }),

  RandomizableField({
    fieldKey: 'practitionerIdentifier',
    randomize: Data('practitionerIdentifier_isRandomized'),
    field: GovUKTextInput({
      code: 'practitionerIdentifier',
      label: 'Practitioner identifier',
      hint: 'A unique ID for the practitioner, such as a staff code',
      classes: 'govuk-input--width-20',
      defaultValue: Data('scenario.practitionerIdentifier'),
    }),
  }),

  RandomizableField({
    fieldKey: 'practitionerDisplayName',
    randomize: Data('practitionerDisplayName_isRandomized'),
    field: GovUKTextInput({
      code: 'practitionerDisplayName',
      label: 'Display name',
      hint: 'Name shown in the target application',
      classes: 'govuk-input--width-20',
      defaultValue: Data('scenario.practitionerDisplayName'),
    }),
  }),

  RandomizableField({
    fieldKey: 'accessMode',
    randomize: Data('accessMode_isRandomized'),
    field: GovUKRadioInput({
      code: 'accessMode',
      label: 'Access mode',
      hint: 'Whether the practitioner can change the assessment or only view it',
      defaultValue: Data('scenario.accessMode'),
      items: [
        { value: 'READ_WRITE', text: 'Read and write' },
        { value: 'READ_ONLY', text: 'Read only' },
      ],
    }),
  }),

  RandomizableField({
    fieldKey: 'planAccessMode',
    randomize: Data('planAccessMode_isRandomized'),
    field: GovUKRadioInput({
      code: 'planAccessMode',
      label: 'Plan access mode',
      hint: 'Whether the practitioner can change the plan or only view it',
      defaultValue: Data('scenario.planAccessMode'),
      items: [
        { value: 'READ_WRITE', text: 'Read and write' },
        { value: 'READ_ONLY', text: 'Read only' },
      ],
    }),
  }),
]
