import { block, Data, Format, Item, Iterator, Params, Self, validation } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { GovUKButton } from '@form-engine-govuk-components/components/button/govukButton'
import { GovUKTextInput } from '@form-engine-govuk-components/components'
import { Condition } from '@form-engine/registry/conditions'
import { MOJSideNavigation } from '@form-engine-moj-components/components'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { AccessibleAutocomplete } from '../../../../components'
import { isRelatedToOtherAreas, canStartNow } from '../sharedFields'

// Side navigation for areas of need
const sideNavigation = MOJSideNavigation({
  items: Data('areasOfNeed').each(
    Iterator.Map({
      text: Item().path('text'),
      href: Item().path('slug'),
      active: Item()
        .path('slug')
        .match(Condition.Equals(Params('areaOfNeed'))),
    }),
  ),
})

const pageHeading = HtmlBlock({
  content: Format(
    `<span class="govuk-caption-l">%1</span>
    <h1 class="govuk-heading-l">Create a goal with %2</h1>`,
    Data('currentAreaOfNeed').path('text'),
    Data('caseData.name.forename'),
  ),
})

const goalTitle = block<AccessibleAutocomplete>({
  variant: 'accessibleAutocomplete',
  data: Data('currentAreaOfNeed').path('goals'),
  field: GovUKTextInput({
    code: 'goal_title',
    label: {
      text: Format('What goal should %1 try to achieve?', Data('caseData.name.forename')),
      classes: 'govuk-label--m',
    },
    hint: 'Search for a suggested goal or enter your own. Add one goal at a time.',
    validate: [
      validation({
        when: Self().not.match(Condition.IsRequired()),
        message: 'Select or enter what goal they should try to achieve',
      }),
    ],
  }),
})

const addStepsButton = GovUKButton({
  text: 'Add Steps',
  name: 'action',
  value: 'addSteps',
  preventDoubleClick: true,
})

const saveWithoutStepsButton = GovUKButton({
  classes: 'govuk-button--secondary',
  text: 'Save without steps',
  name: 'action',
  value: 'saveWithoutSteps',
  preventDoubleClick: true,
})

const buttonGroup = TemplateWrapper({
  template: `
        <div class="govuk-button-group govuk-!-margin-top-4">
            {{slot:addStepsButton}}
            {{slot:saveWithoutStepsButton}}
          </div>
      </div>
    `,
  slots: {
    addStepsButton: [addStepsButton],
    saveWithoutStepsButton: [saveWithoutStepsButton],
  },
})

const forename = Data('caseData.name.forename')

// Two-column layout wrapper
export const twoColumnLayout = (): TemplateWrapper => {
  return TemplateWrapper({
    classes: 'govuk-width-container',
    template: `
      <div class="govuk-grid-row">
        <div class="govuk-grid-column-one-third">
          {{slot:sideNav}}
        </div>
        <div class="govuk-grid-column-two-thirds">
          {{slot:content}}
        </div>
      </div>
    `,
    slots: {
      sideNav: [sideNavigation],
      content: [pageHeading, goalTitle, isRelatedToOtherAreas, canStartNow(forename), buttonGroup],
    },
  })
}
