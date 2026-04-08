import { Data } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components'
import { GovUKCheckboxInput, GovUKTextInput } from '@form-engine-govuk-components/components'

/**
 * Scenario flags tab content
 * Contains checkboxes for enabling/disabling feature flags
 */
export const flagsTabContent = [
  HtmlBlock({
    content: '<h2 class="govuk-heading-m">Scenario Flags</h2>',
  }),

  HtmlBlock({
    content: `
      <p class="govuk-body">
        Flags control special behaviors and feature toggles for the training scenario.
        These affect how the target application behaves during the training session.
      </p>
    `,
  }),

  GovUKCheckboxInput({
    code: 'flags',
    label: 'Active flags',
    hint: 'Select the flags to enable for this scenario',
    defaultValue: Data('flags'),
    items: [
      {
        value: 'SAN_PRIVATE_BETA',
        text: 'SAN Private Beta',
        hint: 'Enables Strengths and Needs private beta features and criminogenic needs',
      },
      {
        value: 'NEW_PERIOD_OF_SUPERVISION',
        text: 'New Period of Supervision',
        hint: 'Simulates a new period of supervision. The session will be created with the plan in a reset state.',
      },
      {
        value: 'MERGED',
        text: 'Merged',
        hint: 'Simulates an OASys merge. The plan will be created then merged to a new PK, setting the MERGED flag. Do not combine with New Period of Supervision.',
        block: GovUKTextInput({
          code: 'mergeOldPk',
          label: 'Previous OASys Assessment PK',
          hint: 'The OASys Assessment PK of the existing session to merge from.',
          classes: 'govuk-input--width-10',
        }),
      },
    ],
  }),
]
