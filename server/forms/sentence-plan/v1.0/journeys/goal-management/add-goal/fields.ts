import { block, Data, field, Format, Self, validation } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { GovUKButton } from '@form-engine-govuk-components/components/button/govukButton'
import {
  GovUKRadioInput,
  GovUKTextInput,
  GovUKCheckboxInput,
  GovUKDateInputFull,
} from '@form-engine-govuk-components/components'
import { Condition } from '@form-engine/registry/conditions'
import { MOJDatePicker } from '@form-engine-moj-components/components'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { BlockDefinition } from '@form-engine/form/types/structures.type'
import { squadOptions } from '../../../../../aap-standup-demo/options'

export const pageHeading = block<HtmlBlock>({
  variant: 'html',
  content: '<h1 class="govuk-heading-l">Create Goal</h1>',
})

export const goalNameInput = field<GovUKTextInput>({
  variant: 'govukTextInput',
  code: 'goal_name_input',
  label: 'What goal should NAME try to achieve?',
  hint: 'Search for a suggested goal or add your own. Add one goal at a time',
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Select or enter what goal they should try to achieve',
    }),
  ],
})

export const areaOfNeedCheckboxes = field<GovUKCheckboxInput>({
  variant: 'govukCheckboxInput',
  code: 'area_of_need_checkboxes',
  multiple: true, // Important: captures array of values
  hint: {
    text: 'Select all that apply',
  },
  fieldset: {
    legend: {
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    { value: 'area_alcohol_use', text: 'Alcohol use' },
    { value: 'area_drug_use', text: 'Drug use' },
    { value: 'area_employment_and_education', text: 'Employment and education' },
    { value: 'area_finances', text: 'Finances' },
    { value: 'area_health_and_wellbeing', text: 'Health and wellbeing' },
    { value: 'area_personal_relationships_and_community', text: 'Personal relationships and community' },
    { value: 'area_thinking_behaviours_and_attitudes', text: 'Thinking, behaviours and attitudes' },
  ],
})

export const isGoalRelatedToOtherAreaOfNeed = field<GovUKRadioInput>({
  variant: 'govukRadioInput',
  code: 'is_goal_related_to_other_area_of_need',
  fieldset: {
    legend: {
      text: 'Is this goal related to any other area of need?',
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    { value: 'yes', text: 'Yes', block: areaOfNeedCheckboxes },
    { value: 'no', text: 'No' },
  ],
  validate: [
    validation({
      when: Self().match(Condition.IsRequired()),
      message: 'Select yes if this goal is related to any other area of need',
    }),
  ],
})

export const whenShouldTheGoalBeAchieved = field<GovUKRadioInput>({
  variant: 'govukRadioInput',
  code: 'when_should_the_goal_be_achieved',
  fieldset: {
    legend: {
      text: 'Is this goal related to any other area of need?',
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    { value: 'date', text: 'In 3 months DATE' },
    { value: 'date', text: 'In 6 months DATE' },
    { value: 'date', text: 'In 12 months DATE' },
    { divider: 'or' },
    { value: 'date', text: 'Set another date' },
  ],
  validate: [
    validation({
      when: Self().match(Condition.IsRequired()),
      message: 'Select yes if they can start working on this goal now',
    }),
  ],
})

export const dateOfCurrentGoal = field<MOJDatePicker>({
  variant: 'mojDatePicker',
  code: 'dateOfCurrentGoal',
  label: {
    text: 'Select a date',
    classes: 'govuk-fieldset__legend--s',
  },
  hint: 'For example, 31/3/2023.',
  minDate: new Date().toLocaleDateString('en-GB'),
  validate: [
    validation({
      when: Self().not.match(Condition.Date.IsValid()),
      message: 'Date must be today or in the future',
    }),
    validation({
      when: Self().not.match(Condition.Date.IsFutureDate()),
      message: 'Date must be today or in the future',
    }),
  ],
})

export const canStartWorkingOnGoalNow = field<GovUKRadioInput>({
  variant: 'govukRadioInput',
  code: 'can_start_working_on_goal_now',
  fieldset: {
    legend: {
      text: 'Can Esther start working on this goal now?',
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    { value: 'yes', text: 'Yes', block: dateOfCurrentGoal },
    { value: 'no', text: "No, it's a future goal" },
  ],
  validate: [
    validation({
      when: Self().match(Condition.IsRequired()),
      message: 'Select yes if they can start working on this goal now',
    }),
  ],
})

export const addStepsButton = block<GovUKButton>({
  variant: 'govukButton',
  text: 'Add Steps',
  name: 'addSteps',
  value: 'addSteps',
  preventDoubleClick: true,
})

export const saveWithoutStepsButton = block<GovUKButton>({
  variant: 'govukButton',
  classes: 'govuk-button--secondary',
  text: 'Save without steps',
  name: 'saveWithoutSteps',
  value: 'saveWithoutSteps',
  preventDoubleClick: true,
})

export const buttonGroup = <T extends BlockDefinition>(): TemplateWrapper => {
  return block<TemplateWrapper>({
    variant: 'templateWrapper',
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
}
