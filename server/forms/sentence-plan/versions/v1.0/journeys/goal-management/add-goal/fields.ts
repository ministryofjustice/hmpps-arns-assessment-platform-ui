import {
  Data,
  Format,
  Item,
  Iterator,
  Params,
  Self,
  validation,
  Condition,
  Transformer,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import {
  GovUKButton,
  GovUKTextInput,
  GovUKHeading,
  GovUKButtonGroup,
} from '@ministryofjustice/hmpps-forge/govuk-components'
import { MOJSideNavigation } from '@ministryofjustice/hmpps-forge/moj-components'
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
  visibleWhen: canAccessSanContent,
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
    validWhen: [
      validation({
        condition: Self().match(Condition.IsRequired()),
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
