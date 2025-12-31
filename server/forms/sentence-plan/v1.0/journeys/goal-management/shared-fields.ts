import { and, Answer, Data, Format, Item, Iterator, Self, validation } from '@form-engine/form/builders'
import { GovUKRadioInput, GovUKCheckboxInput } from '@form-engine-govuk-components/components'
import { Condition } from '@form-engine/registry/conditions'
import { MOJDatePicker } from '@form-engine-moj-components/components'
import { Transformer } from '@form-engine/registry/transformers'
import { Generator } from '@form-engine/registry/generators'

export const relatedAreasOfNeed = GovUKCheckboxInput({
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

export const isRelatedToOtherAreas = GovUKRadioInput({
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
export const customTargetDate = MOJDatePicker({
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

export const targetDateOption = (forename: ReturnType<typeof Data>) =>
  GovUKRadioInput({
    code: 'target_date_option',
    fieldset: {
      legend: {
        text: Format('When should %1 aim to achieve this goal?', forename),
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

export const canStartNow = (forename: ReturnType<typeof Data>) =>
  GovUKRadioInput({
    code: 'can_start_now',
    fieldset: {
      legend: {
        text: Format('Can %1 start working on this goal now?', forename),
        classes: 'govuk-fieldset__legend--m',
      },
    },
    items: [
      { value: 'yes', text: 'Yes', block: targetDateOption(forename) },
      { value: 'no', text: 'No, it is a future goal' },
    ],
    validate: [
      validation({
        when: Self().not.match(Condition.IsRequired()),
        message: 'Select yes if they can start working on this goal now',
      }),
    ],
  })
