import { block, Data, Format, Query } from '@form-engine/form/builders'
import { HtmlBlock, TemplateWrapper } from '@form-engine/registry/components'
import { GovUKButton, GovUKTextInput } from '@form-engine-govuk-components/components'
import { TabPanel } from '../../../components'
import { subjectDetailsTabContent } from './tabs/subjectDetailsTab'
import { criminogenicNeedsTabContent } from './tabs/criminogenicNeedsTab'
import { flagsTabContent } from './tabs/flagsTab'
import { practitionerDetailsTabContent } from './tabs/practitionerDetailsTab'

/**
 * Page heading with caption
 */
export const pageHeading = block<HtmlBlock>({
  variant: 'html',
  content: `
    <span class="govuk-caption-l">Training</span>
    <h1 class="govuk-heading-l">Customise scenario</h1>
  `,
})

/**
 * Customisation TabPanel with 4 tabs
 */
const customiseTabPanel = TabPanel({
  id: 'customise-scenario',
  sidebarTitle: 'Configuration',
  defaultSelected: 'subject-details',
  queryParam: 'tab',
  items: [
    {
      id: 'subject-details',
      label: 'Subject Details',
      sublabel: 'Name, DOB, identifiers',
      panel: subjectDetailsTabContent,
    },
    {
      id: 'criminogenic-needs',
      label: 'Criminogenic Needs',
      sublabel: 'Need scores and flags',
      panel: criminogenicNeedsTabContent,
    },
    {
      id: 'flags',
      label: 'Scenario Flags',
      sublabel: 'Feature toggles',
      panel: flagsTabContent,
    },
    {
      id: 'practitioner',
      label: 'Practitioner Details',
      sublabel: 'Access and identity',
      panel: practitionerDetailsTabContent,
    },
  ],
})

/**
 * Scenario name input field
 */
const scenarioNameInput = GovUKTextInput({
  code: 'scenarioName',
  label: 'Scenario name',
  classes: 'govuk-input--width-20',
  defaultValue: Format('%1 (Customised)', Data('originalScenarioName')),
})

/**
 * Main form wrapper containing header, tab panel, and all form inputs
 * Wraps everything in a single <form> tag so inputs in tabs are submitted
 */
export const customiseFormWrapper = TemplateWrapper({
  template: `
    <form method="post" novalidate class="customise-scenario">
      <input type="hidden" name="_csrf" value="{{csrfToken}}">
      <input type="hidden" name="scenarioId" value="{{scenarioId}}">

      <div class="customise-scenario__header">
        <div class="customise-scenario__header-name">
          {{slot:scenarioNameInput}}
          <p class="govuk-body-s govuk-!-margin-top-1 govuk-!-margin-bottom-0">
            Based on: <strong>{{originalScenarioName}}</strong>
          </p>
        </div>
        <div class="customise-scenario__header-actions">
          <div class="govuk-button-group">
            {{slot:actions}}
          </div>
        </div>
      </div>

      {{slot:tabPanel}}
    </form>
  `,
  values: {
    originalScenarioName: Data('originalScenarioName'),
    csrfToken: Data('csrfToken'),
    scenarioId: Query('scenario'),
  },
  slots: {
    scenarioNameInput: [scenarioNameInput],
    actions: [
      GovUKButton({
        text: 'Create session',
        name: 'action',
        value: 'createSession',
      }),
      GovUKButton({
        text: 'Save as preset',
        name: 'action',
        value: 'savePreset',
        classes: 'govuk-button--secondary',
      }),
      HtmlBlock({
        content: '<a href="../browse" class="govuk-link">Cancel</a>',
      }),
    ],
    tabPanel: [customiseTabPanel],
  },
})
