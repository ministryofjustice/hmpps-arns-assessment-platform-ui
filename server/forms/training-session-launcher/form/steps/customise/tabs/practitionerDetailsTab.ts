import { Data } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components'
import { GovUKTextInput, GovUKRadioInput } from '@form-engine-govuk-components/components'
import { RandomizableField } from '../../../../components'

/**
 * Practitioner details tab content
 * Contains fields for practitioner identity and access configuration
 */
export const practitionerDetailsTabContent = [
  HtmlBlock({
    content: '<h2 class="govuk-heading-m">Practitioner Details</h2>',
  }),

  HtmlBlock({
    content: `
      <p class="govuk-body">
        These details identify the practitioner accessing the training session.
        Check "Randomize" to generate a new value each time the scenario is loaded.
      </p>
    `,
  }),

  RandomizableField({
    fieldKey: 'practitionerIdentifier',
    randomize: Data('practitionerIdentifier_isRandomized'),
    field: GovUKTextInput({
      code: 'practitionerIdentifier',
      label: 'Practitioner identifier',
      hint: 'Unique identifier for the practitioner',
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
    fieldKey: 'planAccessMode',
    randomize: Data('planAccessMode_isRandomized'),
    field: GovUKRadioInput({
      code: 'planAccessMode',
      label: 'Access mode',
      hint: 'Controls whether the practitioner can edit or only view',
      defaultValue: Data('scenario.planAccessMode'),
      items: [
        { value: 'READ_WRITE', text: 'Read and Write' },
        { value: 'READ_ONLY', text: 'Read Only' },
      ],
    }),
  }),
]
