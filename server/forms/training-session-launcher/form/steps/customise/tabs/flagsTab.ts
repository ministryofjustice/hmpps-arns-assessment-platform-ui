import { Data } from '@ministryofjustice/hmpps-forge/core/authoring'
import { HtmlBlock } from '@ministryofjustice/hmpps-forge/core/components'
import { GovUKCheckboxInput, GovUKTextInput } from '@ministryofjustice/hmpps-forge/govuk-components'
import { flagsValidation } from '../../../validation/customiseValidation'

/**
 * Scenario flags tab content
 * Contains checkboxes for enabling/disabling feature flags
 */
export const flagsTabContent = [
  HtmlBlock({
    content: '<h2 class="govuk-heading-m">Scenario flags</h2>',
  }),

  HtmlBlock({
    content: `
      <p class="govuk-body">
        Flags switch on features or situations for this scenario.
        They change how Sentence Plan or Strengths and needs behaves in the session.
      </p>
    `,
  }),

  GovUKCheckboxInput({
    code: 'flags',
    label: 'Active flags',
    hint: 'Select all that apply',
    defaultValue: Data('flags'),
    validWhen: flagsValidation(),
    items: [
      {
        value: 'SAN_PRIVATE_BETA',
        text: 'SAN Private Beta',
        hint: 'Enables Strengths and Needs private beta features and criminogenic needs',
      },
      {
        value: 'NEW_PERIOD_OF_SUPERVISION',
        text: 'New period of supervision',
        hint: 'Simulates a new period of supervision. The session will be created with the plan in a reset state.',
      },
      {
        value: 'MERGED',
        text: 'Merged',
        hint: 'Simulates an OASys merge. The plan will be created then merged to a new PK, setting the MERGED flag. Do not combine with New Period of Supervision.',
        block: GovUKTextInput({
          code: 'mergeOldPk',
          label: 'Previous OASys assessment PK',
          hint: 'The OASys Assessment PK of the existing session to merge from.',
          classes: 'govuk-input--width-10',
        }),
      },
      {
        value: 'TIERING_ASSESSMENT',
        text: 'Tiering Assessment Private Beta',
        hint: 'Enables Tiering Assessment Private Beta features',
      },
    ],
  }),
]
