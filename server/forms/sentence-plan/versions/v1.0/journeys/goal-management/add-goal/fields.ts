import {
  or,
  Answer,
  Data,
  Format,
  Item,
  Iterator,
  Params,
  Query,
  Self,
  validation,
  when,
  Condition,
  Transformer,
  Generator,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import {
  GovUKButton,
  GovUKBody,
  GovUKTextInput,
  GovUKHeading,
  GovUKButtonGroup,
  GovUKCheckboxInput,
  GovUKInsetText,
  GovUKRadioInput,
} from '@ministryofjustice/hmpps-forge/govuk-components'
import { MOJDatePicker } from '@ministryofjustice/hmpps-forge/moj-components'
import { CaseData } from '../../../constants'
import { canAccessSanContent } from '../../../guards'
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

const relatedAreasOfNeed = GovUKCheckboxInput({
  code: 'related_areas_of_need',
  multiple: true,
  hint: {
    text: 'Select all that apply',
    classes: 'app-label--body-text',
  },
  fieldset: {
    legend: {
      text: 'Which other areas of need is this goal related to?',
      classes: 'govuk-fieldset__legend--m govuk-visually-hidden',
    },
  },
  items: Data('otherAreasOfNeed').each(
    Iterator.Map({
      value: Item().path('slug'),
      text: Item().path('text'),
    }),
  ),
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: 'Select one or more related areas of need',
    }),
  ],
  dependentWhen: Answer('is_related_to_other_areas').match(Condition.Equals('yes')),
})

const isRelatedToOtherAreas = GovUKRadioInput({
  code: 'is_related_to_other_areas',
  fieldset: {
    legend: {
      text: 'Does this goal relate to any other areas of need?',
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    { value: 'yes', text: 'Yes', block: relatedAreasOfNeed },
    { value: 'no', text: 'No' },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: 'Select yes if this goal relates to any other areas of need',
    }),
  ],
})

// MOJ Date Picker uses DD/MM/YYYY format, so everything needs
// converting into that format.
const customTargetDate = MOJDatePicker({
  code: 'custom_target_date',
  label: {
    text: 'Select a date',
  },
  hint: 'For example, 31/3/2023.',
  // Set a minimum date of today in the DD/MM/YYYY format
  minDate: Generator.Date.Today().pipe(Transformer.Date.Format('DD/MM/YYYY')),
  formatters: [Transformer.String.ToISODate()],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: 'Select a date',
    }),
    validation({
      condition: Self().match(Condition.Date.IsValid()),
      message: 'Please enter a valid date',
    }),
    validation({
      condition: or(Self().match(Condition.Date.IsToday()), Self().match(Condition.Date.IsFutureDate())),
      message: 'Date must be today or in the future',
    }),
  ],
  dependentWhen: Answer('target_date_option').match(Condition.Equals('set_another_date')),
})

const targetDateOption = GovUKRadioInput({
  code: 'target_date_option',
  fieldset: {
    legend: {
      text: Format('When does %1 aim to achieve this goal?', CaseData.Forename),
    },
  },
  items: [
    {
      value: 'date_in_3_months',
      text: Format(
        'In 3 months (%1)',
        Generator.Date.Today().pipe(Transformer.Date.AddMonths(3), Transformer.Date.ToUKLongDate()),
      ),
    },
    {
      value: 'date_in_6_months',
      text: Format(
        'In 6 months (%1)',
        Generator.Date.Today().pipe(Transformer.Date.AddMonths(6), Transformer.Date.ToUKLongDate()),
      ),
    },
    {
      value: 'date_in_12_months',
      text: Format(
        'In 12 months (%1)',
        Generator.Date.Today().pipe(Transformer.Date.AddMonths(12), Transformer.Date.ToUKLongDate()),
      ),
    },
    { divider: 'or' },
    { value: 'set_another_date', text: 'Set another date', block: customTargetDate },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: 'Select when they aim to achieve this goal',
    }),
  ],
  dependentWhen: Answer('can_start_now').match(Condition.Equals('yes')),
})

const canStartNow = GovUKRadioInput({
  code: 'can_start_now',
  fieldset: {
    legend: {
      text: Format('Can %1 start working on this goal now?', CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    { value: 'yes', text: 'Yes', block: targetDateOption },
    { value: 'no', text: 'No, it is a future goal' },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: 'Select yes if they can start working on this goal now',
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
