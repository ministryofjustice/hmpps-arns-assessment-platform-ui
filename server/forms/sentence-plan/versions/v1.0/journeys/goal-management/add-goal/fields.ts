import { Data, Format, Item, Iterator, not, Params, Self, validation } from '@form-engine/form/builders'
import { GovUKButton } from '@form-engine-govuk-components/components/button/govukButton'
import { GovUKTextInput } from '@form-engine-govuk-components/components'
import { Condition } from '@form-engine/registry/conditions'
import { Transformer } from '@form-engine/registry/transformers'
import { MOJSideNavigation } from '@form-engine-moj-components/components'
import { GovUKHeading } from '@form-engine-govuk-components/wrappers/govukHeading'
import { GovUKButtonGroup } from '@form-engine-govuk-components/wrappers/govukButtonGroup'
import { CaseData } from '../../../constants'
import { canAccessSanContent } from '../../../guards'
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

const pageHeading = GovUKHeading({
  text: Format('Create a goal with %1', CaseData.Forename),
  caption: Data('currentAreaOfNeed').path('text').pipe(Transformer.String.EscapeHtml()),
})

const assessmentInfoDetails = AssessmentInfoDetails({
  personName: CaseData.Forename,
  areaName: Data('currentAreaOfNeed').path('text'),
  assessmentData: Data('currentAreaAssessment'),
  status: Data('currentAreaAssessmentStatus'),
  fullWidth: true,
  hidden: not(canAccessSanContent),
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
  attributes: {
    'data-ai-id': 'create-goal-add-steps-button',
  },
})

const saveWithoutStepsButton = GovUKButton({
  classes: 'govuk-button--secondary',
  text: 'Save without steps',
  name: 'action',
  value: 'saveWithoutSteps',
  preventDoubleClick: true,
  attributes: {
    'data-ai-id': 'create-goal-save-without-steps-button',
  },
})

const buttonGroup = GovUKButtonGroup({
  buttons: [addStepsButton, saveWithoutStepsButton],
  classes: 'govuk-!-margin-top-4',
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
