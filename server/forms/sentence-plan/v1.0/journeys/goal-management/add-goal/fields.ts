import { and, Answer, block, Data, field, Format, Self, validation } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { GovUKButton } from '@form-engine-govuk-components/components/button/govukButton'
import {
  GovUKRadioInput,
  GovUKTextInput,
  GovUKCheckboxInput,
} from '@form-engine-govuk-components/components'
import { Condition } from '@form-engine/registry/conditions'
import { MOJDatePicker } from '@form-engine-moj-components/components'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { BlockDefinition } from '@form-engine/form/types/structures.type'
import { Transformer } from '@form-engine/registry/transformers'

export const pageHeading = block<HtmlBlock>({
  variant: 'html',
  content: Format('<h1 class="govuk-heading-l">Create a goal with %1</h1>', Data('caseData.name.forename')),
})

export const goalNameInput = field<GovUKTextInput>({
  variant: 'govukTextInput',
  code: 'goalNameInput',
  label: {
    text: Format('What goal should %1 try to achieve?', Data('caseData.name.forename')),
    classes: 'govuk-label--m'
  },
  hint: 'Search for a suggested goal or enter your own. Add one goal at a time.',
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Select or enter what goal they should try to achieve',
    }),
  ],
})

export const areaOfNeedCheckboxes = field<GovUKCheckboxInput>({
  variant: 'govukCheckboxInput',
  code: 'areaOfNeedCheckboxes',
  multiple: true,
  hint: {
    text: 'Select all that apply.',
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
  validate: [
    validation({
      when: and(
        Answer('isGoalRelatedToOtherAreaOfNeed').match(Condition.Equals('related_yes')),
        Self().not.match(Condition.IsRequired())),
      message: 'Select all related areas',
    }),
  ],
})

export const isGoalRelatedToOtherAreaOfNeed = field<GovUKRadioInput>({
  code: 'isGoalRelatedToOtherAreaOfNeed',
  variant: 'govukRadioInput',
  fieldset: {
    legend: {
      text: 'Is this goal related to any other area of need?',
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    { value: 'related_yes', text: 'Yes', block: areaOfNeedCheckboxes},
    { value: 'related_no', text: 'No' },
  ],
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Select yes if this goal is related to any other area of need',
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
  formatters: [Transformer.String.ToISODate()],
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

export const whenShouldTheGoalBeAchieved = field<GovUKRadioInput>({
  variant: 'govukRadioInput',
  code: 'whenShouldTheGoalBeAchieved',
  fieldset: {
    legend: {
      text: Format('When should %1 aim to achieve this goal?', Data('caseData.name.forename')),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    { value: 'date1', text: 'In 3 months DATE' },
    { value: 'date2', text: 'In 6 months DATE' },
    { value: 'date3', text: 'In 12 months DATE' },
    { divider: 'or' },
    { value: 'date4', text: 'Set another date', block: dateOfCurrentGoal },
  ],
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Select when they should aim to achieve this goal'
    }),
  ],
})

export const canStartWorkingOnGoalNow = field<GovUKRadioInput>({
  variant: 'govukRadioInput',
  code: 'canStartWorkingOnGoalNow',
  fieldset: {
    legend: {
      text: Format('Can %1 start working on this goal now?', Data('caseData.name.forename')),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    { value: 'yes', text: 'Yes', block: whenShouldTheGoalBeAchieved },
    { value: 'no', text: "No, it is a future goal" },
  ],
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Select yes if they can start working on this goal now',
    }),
  ],
})

export const addStepsButton = block<GovUKButton>({
  variant: 'govukButton',
  text: 'Add Steps',
  name: 'action',
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
