import {
  Data,
  Format,
  Params,
  Query,
  Self,
  validation,
  when,
  Condition,
  Transformer,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import {
  GovUKButton,
  GovUKBody,
  GovUKTextInput,
  GovUKHeading,
  GovUKButtonGroup,
  GovUKInsetText,
} from '@ministryofjustice/hmpps-forge/govuk-components'
import { CaseData } from '../../../constants'
import { canAccessSanContent } from '../../../guards'
import { isRelatedToOtherAreas, canStartNow } from '../sharedFields'
import { AccessibleAutocomplete, AssessmentInfoDetails } from '../../../../../components'

const pageHeading = GovUKHeading({
  text: Format('What goal does %1 aim to achieve?', CaseData.Forename),
})

const assessmentInfoDetails = AssessmentInfoDetails({
  personName: CaseData.Forename,
  areaName: Data('currentAreaOfNeed.text'),
  assessmentData: Data('currentAreaAssessment'),
  status: Data('currentAreaAssessmentStatus'),
  fullWidth: true,
  visibleWhen: canAccessSanContent,
})

const goalTitle = AccessibleAutocomplete({
  data: Data('currentAreaOfNeed.goals'),
  inputClasses: 'govuk-!-width-one-half',
  field: GovUKTextInput({
    code: 'goal_title',
    label: {
      text: 'Search goals or enter your own',
      classes: 'govuk-label--m',
    },
    hint: 'Start typing keywords to view suggested goals or enter your own.',
    validWhen: [
      validation({
        condition: Self().match(Condition.IsRequired()),
        message: 'Select or enter a goal',
      }),
    ],
  }),
})

/*
 * The page's back link. Goes to area selection with the current area pre-selected
 * and the plan tab kept, so the user doesn't lose their place.
 */
export const backLinkHref = when(Query('goalStatusTab').match(Condition.IsRequired()))
  .then(Format('../select-area-of-need?area=%1&goalStatusTab=%2', Params('areaOfNeed'), Query('goalStatusTab')))
  .else(Format('../select-area-of-need?area=%1', Params('areaOfNeed')))

/*
 * The "Change area of need" link. Same as the back link, but change=true tells the area
 * selection page to send the user back here afterwards instead of to the plan overview.
 */
const changeAreaOfNeedHref = when(Query('goalStatusTab').match(Condition.IsRequired()))
  .then(
    Format('../select-area-of-need?area=%1&goalStatusTab=%2&change=true', Params('areaOfNeed'), Query('goalStatusTab')),
  )
  .else(Format('../select-area-of-need?area=%1&change=true', Params('areaOfNeed')))

const areaOfNeedInset = GovUKInsetText({
  blocks: [
    GovUKBody({
      text: Format(
        'Area of need: <strong>%1</strong>.',
        Data('currentAreaOfNeed.text').pipe(Transformer.String.ToLowerCase(), Transformer.String.EscapeHtml()),
      ),
    }),
    GovUKBody({
      classes: 'govuk-!-margin-bottom-0',
      text: Format(
        '<a class="govuk-link govuk-link--no-visited-state" href="%1" data-ai-id="create-goal-change-area-of-need-link">Change area of need.</a>',
        changeAreaOfNeedHref,
      ),
    }),
  ],
})

const addStepsButton = GovUKButton({
  text: 'Add steps',
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

export const contentBlocks = [
  pageHeading,
  assessmentInfoDetails,
  goalTitle,
  areaOfNeedInset,
  isRelatedToOtherAreas,
  canStartNow,
  buttonGroup,
]
