import { Data } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components'
import { GovUKCheckboxInput } from '@form-engine-govuk-components/components'

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
        hint: 'Triggers a plan reset. Paste the OASys PK from an existing session that has active/future goals.',
      },
    ],
  }),
]
