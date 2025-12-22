import {
  and,
  Answer,
  block,
  Data,
  field,
  Format,
  Item,
  Iterator,
  Literal,
  Params,
  Self,
  validation,
} from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { GovUKButton } from '@form-engine-govuk-components/components/button/govukButton'
import { GovUKRadioInput, GovUKTextInput, GovUKCheckboxInput } from '@form-engine-govuk-components/components'
import { Condition } from '@form-engine/registry/conditions'
import { MOJDatePicker, MOJSideNavigation } from '@form-engine-moj-components/components'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { Transformer } from '@form-engine/registry/transformers'
import { Generator } from '@form-engine/registry/generators'
import { areasOfNeed } from './constants'
import { AccessibleAutocomplete } from '../../../../components'

// Side navigation for areas of need
export const sideNavigation = block<MOJSideNavigation>({
  variant: 'mojSideNavigation',
  label: 'Areas of need',
  sections: [
    {
      items: Literal(areasOfNeed).each(
        Iterator.Map({
          text: Item().path('text'),
          href: Item().path('slug'),
          active: Item()
            .path('slug')
            .match(Condition.Equals(Params('areaOfNeed'))),
        }),
      ),
    },
  ],
})

export const areaOfNeedSubheading = block<HtmlBlock>({
  variant: 'html',
  content: Format(
    '<span class="govuk-caption-l">%1</span>',
    Literal(areasOfNeed)
      .each(
        Iterator.Find(
          Item().path('slug').match(Condition.Equals(Params('areaOfNeed'))),
        ),
      )
      .each(Iterator.Map(Item().path('text'))),
  ),
})

export const pageHeading = block<HtmlBlock>({
  variant: 'html',
  content: Format('<h1 class="govuk-heading-l">Create a goal with %1</h1>', Data('caseData.name.forename')),
})

export const goalNameAutoComplete = block<AccessibleAutocomplete>({
  variant: 'accessibleAutocomplete',
  data: Literal(areasOfNeed)
    .each(
      Iterator.Find(
        Item().path('slug').match(Condition.Equals(Params('areaOfNeed'))),
      ),
    )
    .path('goals'),
  field: field<GovUKTextInput>({
    variant: 'govukTextInput',
    code: 'goalNameInput',
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
  items: Literal(areasOfNeed)
    .each(
      Iterator.Filter(
        Item().path('slug').not.match(Condition.Equals(Params('areaOfNeed'))),
      ),
    )
    .each(
      Iterator.Map({
        value: Item().path('value'),
        text: Item().path('text'),
      }),
    ),
  validate: [
    validation({
      when: and(
        Answer('isGoalRelatedToOtherAreaOfNeed').match(Condition.Equals('related_yes')),
        Self().not.match(Condition.IsRequired()),
      ),
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
    { value: 'related_yes', text: 'Yes', block: areaOfNeedCheckboxes },
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
      when: and(
        Answer('canStartWorkingOnGoalNow').match(Condition.Equals('yes')),
        Answer('whenShouldTheGoalBeAchieved').match(Condition.Equals('set_another_date')),
        Self().match(Condition.Date.IsValid()),
        Self().not.match(Condition.Date.IsFutureDate()),
      ),
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
    { value: 'set_another_date', text: 'Set another date', block: dateOfCurrentGoal },
  ],
  validate: [
    validation({
      when: and(
        Answer('canStartWorkingOnGoalNow').match(Condition.Equals('yes')),
        Self().not.match(Condition.IsRequired()),
      ),
      message: 'Select when they should aim to achieve this goal',
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
    { value: 'no', text: 'No, it is a future goal' },
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

export const buttonGroup = (): TemplateWrapper => {
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

// Two-column layout wrapper
export const twoColumnLayout = (): TemplateWrapper => {
  return block<TemplateWrapper>({
    classes: 'govuk-width-container',
    variant: 'templateWrapper',
    template: `
      <div class="govuk-grid-row">
        <div class="govuk-grid-column-one-quarter">
          {{slot:sideNav}}
        </div>
        <div class="govuk-grid-column-three-quarters">
          {{slot:content}}
        </div>
      </div>
    `,
    slots: {
      sideNav: [sideNavigation],
      content: [
        areaOfNeedSubheading,
        pageHeading,
        goalNameAutoComplete,
        isGoalRelatedToOtherAreaOfNeed,
        canStartWorkingOnGoalNow,
        buttonGroup(),
      ],
    },
  })
}
