import { Data } from '@ministryofjustice/hmpps-forge/core/authoring'
import { HtmlBlock } from '@ministryofjustice/hmpps-forge/core/components'
import {
  GovUKCheckboxInput,
  GovUKSelectInput,
  GovUKTextareaInput,
  GovUKTextInput,
} from '@ministryofjustice/hmpps-forge/govuk-components'
import { getFormVersions } from '../../../../../strengths-and-needs/constants/formConfigRegistry'

const defaultOasysData: Record<string, any> = {
  'o3-4': null,
  'o4-3': null,
  'o4-9': null,
  'o8-1': null,
  'o8-8': null,
  'o9-2': null,
  'o4-8': null,
  'o10-1': null,
  'o10.4': null,
  'o6-9': null,
  'o6-1': null,
  'o6-3': null,
  'o10-7_V2_CHILDHOOD': null,
  'o6-8': null,
  'o6-4': null,
  'o11-7': null,
  'o11-6': null,
  'o11-9': null,
  'o11-4': null,
  'o11-2': null,
  'o12-9': null,
  'o12-4': null,
  'o12-1': null,
  'o1-30': null,
  'o2-1': null,
  'o2-8': null,
  'o2-7': null,
  'o2-7-1': null,
  'o2-6': null,
  'o2-11': null,
  'o2-12': null,
  'o2-99': null,
}

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
        value: 'SAN_BETA',
        text: 'SAN Private Beta',
        hint: 'Enables Strengths and Needs private beta features and criminogenic needs',
      },
      {
        value: 'MAX_UPLIFT_VERSION',
        text: 'SAN Max uplift version',
        block: GovUKSelectInput({
          code: 'maxUpliftVersion',
          label: 'Set the max uplift version',
          classes: 'govuk-radios--small',
          items: [{ value: '', text: 'None' }, ...getFormVersions.map(version => ({ value: version, text: version }))],
        }),
      },
      {
        value: 'SAN_FORM_VERSION',
        text: 'SAN form version',
        block: GovUKSelectInput({
          code: 'sanFormVersion',
          label: 'Set the san form version',
          classes: 'govuk-radios--small',
          items: [{ value: '', text: 'None' }, ...getFormVersions.map(version => ({ value: version, text: version }))],
        }),
      },
      {
        value: 'OASYS_DATA',
        text: 'OASys data',
        block: GovUKTextareaInput({
          code: 'oasysData',
          label: 'Set the OASys data for prepopulation',
          rows: 14,
          defaultValue: JSON.stringify(defaultOasysData, null, 4),
        }),
        checked: true,
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
      {
        value: 'TIERING_ASSESSMENT',
        text: 'Tiering Assessment Private Beta',
        hint: 'Enables Tiering Assessment Private Beta features',
      },
    ],
  }),
]
