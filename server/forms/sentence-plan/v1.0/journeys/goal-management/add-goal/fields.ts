import { and, Answer, block, Data, Format, Item, Iterator, Params, Self, validation } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { GovUKButton } from '@form-engine-govuk-components/components/button/govukButton'
import { GovUKRadioInput, GovUKTextInput, GovUKCheckboxInput } from '@form-engine-govuk-components/components'
import { Condition } from '@form-engine/registry/conditions'
import { MOJDatePicker, MOJSideNavigation } from '@form-engine-moj-components/components'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { Transformer } from '@form-engine/registry/transformers'
import { Generator } from '@form-engine/registry/generators'
import { AccessibleAutocomplete } from '../../../../components'

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

const relatedAreasOfNeed = GovUKCheckboxInput({
  code: 'related_areas_of_need',
  multiple: true,
  hint: {
    text: 'Select all that apply.',
  },
  fieldset: {
    legend: {
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: Data('otherAreasOfNeed').each(
    Iterator.Map({
      value: Item().path('slug'),
      text: Item().path('text'),
    }),
  ),
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Select all related areas',
    }),
  ],
  dependent: Answer('is_related_to_other_areas').match(Condition.Equals('yes')),
})

const isRelatedToOtherAreas = GovUKRadioInput({
  code: 'is_related_to_other_areas',
  fieldset: {
    legend: {
      text: 'Is this goal related to any other area of need?',
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    { value: 'yes', text: 'Yes', block: relatedAreasOfNeed },
    { value: 'no', text: 'No' },
  ],
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Select yes if this goal is related to any other area of need',
    }),
  ],
})

// MOJ Date Picker uses DD/MM/YYYY format, so everything needs
// converting into that format.
const customTargetDate = MOJDatePicker({
  code: 'custom_target_date',
  label: {
    text: 'Select a date',
    classes: 'govuk-fieldset__legend--s',
  },
  hint: 'For example, 31/3/2023.',
  // Set a minimum date of today in the DD/MM/YYYY format
  minDate: Generator.Date.Today().pipe(Transformer.Date.Format('DD/MM/YYYY')),
  formatters: [Transformer.String.ToISODate()],
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Please enter a date',
    }),
    validation({
      when: Self().not.match(Condition.Date.IsValid()),
      message: 'Please enter a valid date',
    }),
    validation({
      when: and(Self().not.match(Condition.Date.IsToday()), Self().not.match(Condition.Date.IsFutureDate())),
      message: 'Date must be today or in the future',
    }),
  ],
  dependent: Answer('target_date_option').match(Condition.Equals('set_another_date')),
})

const targetDateOption = GovUKRadioInput({
  code: 'target_date_option',
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
    { value: 'set_another_date', text: 'Set another date', block: customTargetDate },
  ],
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Select when they should aim to achieve this goal',
    }),
  ],
  dependent: Answer('can_start_now').match(Condition.Equals('yes')),
})

const canStartNow = GovUKRadioInput({
  code: 'can_start_now',
  fieldset: {
    legend: {
      text: Format('Can %1 start working on this goal now?', Data('caseData.name.forename')),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    { value: 'yes', text: 'Yes', block: targetDateOption },
    { value: 'no', text: 'No, it is a future goal' },
  ],
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Select yes if they can start working on this goal now',
    }),
  ],
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

// Two-column layout wrapper
export const twoColumnLayout = (): TemplateWrapper => {
  return TemplateWrapper({
    classes: 'govuk-width-container',
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
      content: [pageHeading, goalTitle, isRelatedToOtherAreas, canStartNow, buttonGroup],
    },
  })
}
