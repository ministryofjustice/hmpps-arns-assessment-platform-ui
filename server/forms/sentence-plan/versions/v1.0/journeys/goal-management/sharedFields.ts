import {
  Answer,
  Condition,
  Data,
  Format,
  Generator,
  Item,
  Iterator,
  or,
  Self,
  Transformer,
  validation,
  when,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import {
  GovUKCheckboxInput,
  GovUKInsetText,
  GovUKRadioInput,
  GovUKTag,
} from '@ministryofjustice/hmpps-forge/govuk-components'
import { MOJDatePicker } from '@ministryofjustice/hmpps-forge/moj-components'
import { HtmlBlock } from '@ministryofjustice/hmpps-forge/core/components'
import { CaseData } from '../../constants'

export const relatedAreasOfNeed = GovUKCheckboxInput({
  code: 'related_areas_of_need',
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
      attributes: {
        'data-ai-id': Format('related-area-of-need-%1-checkbox', Item().path('slug')),
      },
    }),
  ),
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: 'Select all related areas',
    }),
  ],
  dependentWhen: Answer('is_related_to_other_areas').match(Condition.Equals('yes')),
})

export const isRelatedToOtherAreas = GovUKRadioInput({
  code: 'is_related_to_other_areas',
  fieldset: {
    legend: {
      text: 'Does this goal relate to any other areas of need?',
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    {
      value: 'yes',
      text: 'Yes',
      block: relatedAreasOfNeed,
    },
    {
      value: 'no',
      text: 'No',
    },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
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
  },
  hint: 'For example, 31/3/2028.',
  // Set a minimum date of today in the DD/MM/YYYY format
  minDate: Generator.Date.Today().pipe(Transformer.Date.Format('DD/MM/YYYY')),
  maxDate: Generator.Date.Today().pipe(Transformer.Date.AddYears(5), Transformer.Date.Format('DD/MM/YYYY')),
  formatters: [Transformer.String.ToISODate()],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: 'Select a date',
    }),
    validation({
      // Skip when empty so the IsRequired rule above is the only error shown for a blank field.
      condition: or(Self().not.match(Condition.IsRequired()), Self().match(Condition.Date.IsValid())),
      message: 'Enter a date in the correct format, for example 31/3/2028',
    }),
    validation({
      // Only range-check once we have a valid date — IsToday/IsFutureDate throw on an empty or
      // invalid value, so defer those cases to the IsRequired/IsValid rules above.
      condition: or(
        Self().not.match(Condition.Date.IsValid()),
        Self().match(Condition.Date.IsToday()),
        Self().match(Condition.Date.IsFutureDate()),
      ),
      message: 'The date must be today or in the future',
    }),
    validation({
      condition: or(
        Self().not.match(Condition.Date.IsValid()),
        Self().match(
          Condition.Date.IsBefore(
            Generator.Date.Today().pipe(
              Transformer.Date.AddYears(5),
              Transformer.Date.AddDays(1),
              Transformer.Date.Format('YYYY-MM-DD'),
            ),
          ),
        ),
      ),
      message: 'The date must be within the next 5 years',
    }),
  ],
  dependentWhen: Answer('target_date_option').match(Condition.Equals('set_another_date')),
})

export const targetDateOption = GovUKRadioInput({
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
      attributes: {
        'data-ai-id': 'target-date-option-3-months-radio',
      },
    },
    {
      value: 'date_in_6_months',
      text: Format(
        'In 6 months (%1)',
        Generator.Date.Today().pipe(Transformer.Date.AddMonths(6), Transformer.Date.ToUKLongDate()),
      ),
      attributes: {
        'data-ai-id': 'target-date-option-6-months-radio',
      },
    },
    {
      value: 'date_in_12_months',
      text: Format(
        'In 12 months (%1)',
        Generator.Date.Today().pipe(Transformer.Date.AddMonths(12), Transformer.Date.ToUKLongDate()),
      ),
      attributes: {
        'data-ai-id': 'target-date-option-12-months-radio',
      },
    },
    { divider: 'or' },
    {
      value: 'set_another_date',
      text: 'Set another date',
      attributes: {
        'data-ai-id': 'target-date-option-set-another-date-radio',
      },
      block: customTargetDate,
    },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: 'Select when they should aim to achieve this goal',
    }),
  ],
  dependentWhen: Answer('can_start_now').match(Condition.Equals('yes')),
})

export const canStartNow = GovUKRadioInput({
  code: 'can_start_now',
  fieldset: {
    legend: {
      text: Format('Can %1 start working on this goal now?', CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    {
      value: 'yes',
      text: 'Yes',
      block: targetDateOption,
      attributes: {
        'data-ai-id': 'can-start-now-yes-radio',
      },
    },
    {
      value: 'no',
      text: 'No, it is a future goal',
      attributes: {
        'data-ai-id': 'can-start-now-no-radio',
      },
    },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: 'Select yes if they can start working on this goal now',
    }),
  ],
})

// Step status tags
export const statusTag = [
  GovUKTag({
    text: 'Not started',
    classes: 'govuk-tag--grey',
    visibleWhen: Item().path('status').match(Condition.Equals('NOT_STARTED')),
  }),
  GovUKTag({
    text: 'In progress',
    visibleWhen: Item().path('status').match(Condition.Equals('IN_PROGRESS')),
  }),
  GovUKTag({
    text: 'Completed',
    classes: 'govuk-tag--green',
    visibleWhen: Item().path('status').match(Condition.Equals('COMPLETED')),
  }),
  GovUKTag({
    text: 'Cannot be done yet',
    classes: 'govuk-tag--pink',
    visibleWhen: Item().path('status').match(Condition.Equals('CANNOT_BE_DONE_YET')),
  }),
  GovUKTag({
    text: 'No longer needed',
    classes: 'govuk-tag--yellow',
    visibleWhen: Item().path('status').match(Condition.Equals('NO_LONGER_NEEDED')),
  }),
]

/**
 * Inset text block summarising the goal context
 *
 * Shows:
 * - Area of need (in bold)
 * - Also relates to (only when the goal is related to other areas)
 * - Goal text
 *
 * Area of need and "Also relates to" share a single paragraph (with a <br>)
 * so the lines are adjacent — only "Goal" sits in its own paragraph below.
 */
export const areaOfNeedText = Data('activeGoal.areaOfNeedLabel').pipe(
  Transformer.String.ToLowerCase(),
  Transformer.String.EscapeHtml(),
)

export const relatedAreasOfNeedText = Data('activeGoal.relatedAreasOfNeedLabels').pipe(
  Transformer.Array.Sort(),
  Transformer.Array.Join(', '),
  Transformer.String.ToLowerCase(),
  Transformer.String.EscapeHtml(),
)

export const areaBlockContent = when(Data('activeGoal.relatedAreasOfNeedLabels').match(Condition.IsRequired()))
  .then(
    Format('<p>Area of need: <strong>%1</strong><br>Also relates to: %2</p>', areaOfNeedText, relatedAreasOfNeedText),
  )
  .else(Format('<p>Area of need: <strong>%1</strong></p>', areaOfNeedText))

export const goalBlockContent = Format(
  '<p>Goal: %1</p>',
  Data('activeGoal.title').pipe(Transformer.String.EscapeHtml()),
)

export const goalContextInsetText = GovUKInsetText({
  classes: 'govuk-!-margin-top-2',
  blocks: [HtmlBlock({ content: areaBlockContent }), HtmlBlock({ content: goalBlockContent })],
})
