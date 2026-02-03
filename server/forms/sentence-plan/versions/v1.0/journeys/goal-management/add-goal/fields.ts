import { Data, Format, Item, Iterator, Params, Self, validation } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { GovUKButton } from '@form-engine-govuk-components/components/button/govukButton'
import { GovUKTextInput } from '@form-engine-govuk-components/components'
import { Condition } from '@form-engine/registry/conditions'
import { MOJSideNavigation } from '@form-engine-moj-components/components'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { CaseData } from '../../../constants'
import { isRelatedToOtherAreas, canStartNow } from '../sharedFields'
import { AccessibleAutocomplete, AssessmentInfoDetails } from '../../../../../components'

const sideNavigation = MOJSideNavigation({
  attributes: { 'data-qa': 'area-of-need-nav' },
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
    CaseData.Forename,
  ),
})

const assessmentInfoDetails = AssessmentInfoDetails({
  personName: CaseData.Forename,
  areaName: Data('currentAreaOfNeed').path('text'),
  assessmentData: Data('currentAreaAssessment'),
  status: Data('currentAreaAssessmentStatus'),
})

const goalTitle = AccessibleAutocomplete({
  data: Data('currentAreaOfNeed').path('goals'),
  field: GovUKTextInput({
    code: 'goal_title',
    label: {
      text: Format('What goal should %1 try to achieve?', CaseData.Forename),
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

export const sideNav = sideNavigation

export const contentBlocks = [
  pageHeading,
  assessmentInfoDetails,
  goalTitle,
  isRelatedToOtherAreas,
  canStartNow,
  buttonGroup,
]
