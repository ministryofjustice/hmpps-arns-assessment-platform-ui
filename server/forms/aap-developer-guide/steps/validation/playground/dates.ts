import { step, block, field, validation, Self, submitTransition, and } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { Transformer } from '@form-engine/registry/transformers'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { CodeBlock } from '@form-engine/registry/components/codeBlock'
import { GovUKDateInputFull, GovUKDetails, GovUKPagination } from '@form-engine-govuk-components/components'
import { MOJDatePicker } from '@form-engine-moj-components/components'
import { exampleBox } from '../../../helpers/exampleBox'

/**
 * Validation Playground - Dates
 *
 * Interactive examples of date validation conditions.
 */
export const datesStep = step({
  path: '/dates',
  title: 'Date Validation',
  onSubmission: [
    submitTransition({
      validate: true,
    }),
  ],
  blocks: [
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <h1 class="govuk-heading-l">Date Validation Playground</h1>

        <p class="govuk-body-l">
          Try these date fields to see date validation in action. Submit the form to
          trigger validation and see error messages.
        </p>

        <div class="govuk-inset-text">
          <strong>Note:</strong> Date conditions work with ISO format strings (YYYY-MM-DD).
          <ul class="govuk-list govuk-list--bullet">
            <li><strong>GOV.UK Date Input</strong>: Use <code>formatters: [Transformer.Object.ToISO()]</code></li>
            <li><strong>MOJ Date Picker</strong>: Use <code>formatters: [Transformer.String.ToISODate()]</code></li>
          </ul>
          Both components handle ISO format on re-display automatically.
        </div>

        <h2 class="govuk-heading-m">GOV.UK Date Input Examples</h2>
        <p class="govuk-body">The GOV.UK date input provides separate day, month, and year fields.</p>
      `,
    }),

    // Valid Date
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Valid Date</h2>
        <p class="govuk-body">Try entering an invalid date like 31/2/2024 or 99/99/9999.</p>
      `,
    }),

    exampleBox([
      field<GovUKDateInputFull>({
        variant: 'govukDateInputFull',
        code: 'playground_valid_date',
        fieldset: {
          legend: { text: 'When did this happen?' },
        },
        hint: 'For example, 27 3 2024',
        formatters: [Transformer.Object.ToISO({ year: 'year', month: 'month', day: 'day' })],
        validate: [
          // Field-specific validations - guarded with IsObject() since PropertyHasValue throws on non-objects
          validation({
            when: and(
              Self().match(Condition.Object.IsObject()),
              Self().not.match(Condition.Object.PropertyHasValue('day')),
            ),
            message: 'Date must include a day',
            details: { field: 'day' },
          }),
          validation({
            when: and(
              Self().match(Condition.Object.IsObject()),
              Self().not.match(Condition.Object.PropertyHasValue('month')),
            ),
            message: 'Date must include a month',
            details: { field: 'month' },
          }),
          validation({
            when: and(
              Self().match(Condition.Object.IsObject()),
              Self().not.match(Condition.Object.PropertyHasValue('year')),
            ),
            message: 'Date must include a year',
            details: { field: 'year' },
          }),
          // Overall date validation - runs when ToISO succeeded (string)
          validation({
            when: Self().not.match(Condition.Date.IsValid()),
            message: 'Enter a real date',
          }),
        ],
      }),
    ]),

    block<GovUKDetails>({
      variant: 'govukDetails',
      summaryText: 'View code',
      content: [
        block<CodeBlock>({
          variant: 'codeBlock',
          language: 'typescript',
          code: `field<GovUKDateInputFull>({
  variant: 'govukDateInputFull',
  code: 'playground_valid_date',
  fieldset: {
    legend: { text: 'When did this happen?' },
  },
  hint: 'For example, 27 3 2024',
  formatters: [Transformer.Object.ToISO({ year: 'year', month: 'month', day: 'day' })],
  validate: [
    // Field-specific validations - guarded with IsObject() since PropertyHasValue throws on non-objects
    validation({
      when: and(
        Self().match(Condition.Object.IsObject()),
        Self().not.match(Condition.Object.PropertyHasValue('day'))
      ),
      message: 'Date must include a day',
      details: { field: 'day' },
    }),
    validation({
      when: and(
        Self().match(Condition.Object.IsObject()),
        Self().not.match(Condition.Object.PropertyHasValue('month'))
      ),
      message: 'Date must include a month',
      details: { field: 'month' },
    }),
    validation({
      when: and(
        Self().match(Condition.Object.IsObject()),
        Self().not.match(Condition.Object.PropertyHasValue('year'))
      ),
      message: 'Date must include a year',
      details: { field: 'year' },
    }),
    // Overall date validation - runs when ToISO succeeded (string)
    validation({
      when: Self().not.match(Condition.Date.IsValid()),
      message: 'Enter a real date',
    }),
  ],
})`,
        }),
      ],
    }),

    // Date in Future
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Date in Future</h2>
        <p class="govuk-body">Appointment date must be in the future. Try entering yesterday's date or today.</p>
      `,
    }),

    exampleBox([
      field<GovUKDateInputFull>({
        variant: 'govukDateInputFull',
        code: 'playground_future_date',
        fieldset: {
          legend: { text: 'Appointment date' },
        },
        hint: 'The appointment must be scheduled for a future date',
        formatters: [Transformer.Object.ToISO({ year: 'year', month: 'month', day: 'day' })],
        validate: [
          validation({
            when: Self().not.match(Condition.IsRequired()),
            message: 'Enter an appointment date',
          }),
          validation({
            when: Self().not.match(Condition.Date.IsValid()),
            message: 'Appointment date must be a real date',
          }),
          validation({
            when: Self().not.match(Condition.Date.IsFutureDate()),
            message: 'Appointment must be in the future',
          }),
        ],
      }),
    ]),

    block<GovUKDetails>({
      variant: 'govukDetails',
      summaryText: 'View code',
      content: [
        block<CodeBlock>({
          variant: 'codeBlock',
          language: 'typescript',
          code: `field<GovUKDateInputFull>({
  variant: 'govukDateInputFull',
  code: 'playground_future_date',
  fieldset: {
    legend: { text: 'Appointment date' },
  },
  hint: 'The appointment must be scheduled for a future date',
  formatters: [Transformer.Object.ToISO({ year: 'year', month: 'month', day: 'day' })],
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Enter an appointment date',
    }),
    validation({
      when: Self().not.match(Condition.Date.IsValid()),
      message: 'Appointment date must be a real date',
    }),
    validation({
      when: Self().not.match(Condition.Date.IsFutureDate()),
      message: 'Appointment must be in the future',
    }),
  ],
})`,
        }),
      ],
    }),

    // Date Before Specific Date
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Date Before Specific Date</h2>
        <p class="govuk-body">
          Registration closed on 31 December 2024. Try entering a date after that.
        </p>
      `,
    }),

    exampleBox([
      field<GovUKDateInputFull>({
        variant: 'govukDateInputFull',
        code: 'playground_before_date',
        fieldset: {
          legend: { text: 'Registration date' },
        },
        hint: 'Must be before 31 December 2024',
        formatters: [Transformer.Object.ToISO({ year: 'year', month: 'month', day: 'day' })],
        validate: [
          validation({
            when: Self().not.match(Condition.IsRequired()),
            message: 'Enter a registration date',
          }),
          validation({
            when: Self().not.match(Condition.Date.IsValid()),
            message: 'Registration date must be a real date',
          }),
          validation({
            when: Self().not.match(Condition.Date.IsBefore('2025-01-01')),
            message: 'Registration date must be before 31 December 2024',
          }),
        ],
      }),
    ]),

    block<GovUKDetails>({
      variant: 'govukDetails',
      summaryText: 'View code',
      content: [
        block<CodeBlock>({
          variant: 'codeBlock',
          language: 'typescript',
          code: `field<GovUKDateInputFull>({
  variant: 'govukDateInputFull',
  code: 'playground_before_date',
  fieldset: {
    legend: { text: 'Registration date' },
  },
  hint: 'Must be before 31 December 2024',
  formatters: [Transformer.Object.ToISO({ year: 'year', month: 'month', day: 'day' })],
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Enter a registration date',
    }),
    validation({
      when: Self().not.match(Condition.Date.IsValid()),
      message: 'Registration date must be a real date',
    }),
    validation({
      when: Self().not.match(Condition.Date.IsBefore('2025-01-01')),
      message: 'Registration date must be before 31 December 2024',
    }),
  ],
})`,
        }),
      ],
    }),

    // Date After Specific Date
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Date After Specific Date</h2>
        <p class="govuk-body">
          Employment must have started after 1 January 2020. Try an earlier date.
        </p>
      `,
    }),

    exampleBox([
      field<GovUKDateInputFull>({
        variant: 'govukDateInputFull',
        code: 'playground_after_date',
        fieldset: {
          legend: { text: 'Employment start date' },
        },
        hint: 'Must be after 1 January 2020',
        formatters: [Transformer.Object.ToISO({ year: 'year', month: 'month', day: 'day' })],
        validate: [
          validation({
            when: Self().not.match(Condition.IsRequired()),
            message: 'Enter an employment start date',
          }),
          validation({
            when: Self().not.match(Condition.Date.IsValid()),
            message: 'Employment start date must be a real date',
          }),
          validation({
            when: Self().not.match(Condition.Date.IsAfter('2019-12-31')),
            message: 'Employment must have started after 1 January 2020',
          }),
        ],
      }),
    ]),

    block<GovUKDetails>({
      variant: 'govukDetails',
      summaryText: 'View code',
      content: [
        block<CodeBlock>({
          variant: 'codeBlock',
          language: 'typescript',
          code: `field<GovUKDateInputFull>({
  variant: 'govukDateInputFull',
  code: 'playground_after_date',
  fieldset: {
    legend: { text: 'Employment start date' },
  },
  hint: 'Must be after 1 January 2020',
  formatters: [Transformer.Object.ToISO({ year: 'year', month: 'month', day: 'day' })],
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Enter an employment start date',
    }),
    validation({
      when: Self().not.match(Condition.Date.IsValid()),
      message: 'Employment start date must be a real date',
    }),
    validation({
      when: Self().not.match(Condition.Date.IsAfter('2019-12-31')),
      message: 'Employment must have started after 1 January 2020',
    }),
  ],
})`,
        }),
      ],
    }),

    // MOJ Date Picker Section
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--xl govuk-section-break--visible">
        <h2 class="govuk-heading-m">MOJ Date Picker Examples</h2>
        <p class="govuk-body">
          The MOJ Date Picker provides a calendar widget for date selection.
          It outputs dates in UK format (DD/MM/YYYY), but the component automatically handles
          ISO format (YYYY-MM-DD) on re-display, so you can use <code>formatters</code> to store dates
          in ISO format.
        </p>
      `,
    }),

    // MOJ Date Picker - Valid Date
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h3 class="govuk-heading-s">Valid Date (Date Picker)</h3>
        <p class="govuk-body">Try entering an invalid date manually, or use the calendar to select.</p>
      `,
    }),

    exampleBox([
      field<MOJDatePicker>({
        variant: 'mojDatePicker',
        code: 'playground_moj_valid_date',
        label: { text: 'Event date' },
        hint: 'For example, 17/5/2024',
        formatters: [Transformer.String.ToISODate()],
        validate: [
          validation({
            when: Self().not.match(Condition.IsRequired()),
            message: 'Enter an event date',
          }),
          validation({
            when: Self().not.match(Condition.Date.IsValid()),
            message: 'Event date must be a real date',
          }),
        ],
      }),
    ]),

    block<GovUKDetails>({
      variant: 'govukDetails',
      summaryText: 'View code',
      content: [
        block<CodeBlock>({
          variant: 'codeBlock',
          language: 'typescript',
          code: `field<MOJDatePicker>({
  variant: 'mojDatePicker',
  code: 'playground_moj_valid_date',
  label: { text: 'Event date' },
  hint: 'For example, 17/5/2024',
  formatters: [Transformer.String.ToISODate()],
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Enter an event date',
    }),
    validation({
      when: Self().not.match(Condition.Date.IsValid()),
      message: 'Event date must be a real date',
    }),
  ],
})`,
        }),
      ],
    }),

    // MOJ Date Picker - Future Date
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h3 class="govuk-heading-s">Future Date (Date Picker)</h3>
        <p class="govuk-body">The booking must be for a future date.</p>
      `,
    }),

    exampleBox([
      field<MOJDatePicker>({
        variant: 'mojDatePicker',
        code: 'playground_moj_future_date',
        label: { text: 'Booking date' },
        hint: 'Select a date for your appointment',
        formatters: [Transformer.String.ToISODate()],
        validate: [
          validation({
            when: Self().not.match(Condition.IsRequired()),
            message: 'Enter a booking date',
          }),
          validation({
            when: Self().not.match(Condition.Date.IsValid()),
            message: 'Booking date must be a real date',
          }),
          validation({
            when: Self().not.match(Condition.Date.IsFutureDate()),
            message: 'Booking date must be in the future',
          }),
        ],
      }),
    ]),

    block<GovUKDetails>({
      variant: 'govukDetails',
      summaryText: 'View code',
      content: [
        block<CodeBlock>({
          variant: 'codeBlock',
          language: 'typescript',
          code: `field<MOJDatePicker>({
  variant: 'mojDatePicker',
  code: 'playground_moj_future_date',
  label: { text: 'Booking date' },
  hint: 'Select a date for your appointment',
  formatters: [Transformer.String.ToISODate()],
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Enter a booking date',
    }),
    validation({
      when: Self().not.match(Condition.Date.IsValid()),
      message: 'Booking date must be a real date',
    }),
    validation({
      when: Self().not.match(Condition.Date.IsFutureDate()),
      message: 'Booking date must be in the future',
    }),
  ],
})`,
        }),
      ],
    }),

    // MOJ Date Picker - With Min/Max Dates
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h3 class="govuk-heading-s">Date Range with Calendar Restrictions</h3>
        <p class="govuk-body">
          The MOJ Date Picker supports <code>minDate</code> and <code>maxDate</code> to restrict
          selectable dates in the calendar. Note: users can still type dates outside the range,
          so server-side validation is still required.
        </p>
      `,
    }),

    exampleBox([
      field<MOJDatePicker>({
        variant: 'mojDatePicker',
        code: 'playground_moj_range_date',
        label: { text: 'Conference date' },
        hint: 'Select a date in January 2025',
        minDate: '01/01/2025',
        maxDate: '31/01/2025',
        formatters: [Transformer.String.ToISODate()],
        validate: [
          validation({
            when: Self().not.match(Condition.IsRequired()),
            message: 'Enter a conference date',
          }),
          validation({
            when: Self().not.match(Condition.Date.IsValid()),
            message: 'Conference date must be a real date',
          }),
          validation({
            when: Self().not.match(Condition.Date.IsAfter('2024-12-31')),
            message: 'Conference date must be in January 2025 or later',
          }),
          validation({
            when: Self().not.match(Condition.Date.IsBefore('2025-02-01')),
            message: 'Conference date must be before February 2025',
          }),
        ],
      }),
    ]),

    block<GovUKDetails>({
      variant: 'govukDetails',
      summaryText: 'View code',
      content: [
        block<CodeBlock>({
          variant: 'codeBlock',
          language: 'typescript',
          code: `field<MOJDatePicker>({
  variant: 'mojDatePicker',
  code: 'playground_moj_range_date',
  label: { text: 'Conference date' },
  hint: 'Select a date in January 2025',
  minDate: '01/01/2025',
  maxDate: '31/01/2025',
  formatters: [Transformer.String.ToISODate()],
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Enter a conference date',
    }),
    validation({
      when: Self().not.match(Condition.Date.IsValid()),
      message: 'Conference date must be a real date',
    }),
    validation({
      when: Self().not.match(Condition.Date.IsAfter('2024-12-31')),
      message: 'Conference date must be in January 2025 or later',
    }),
    validation({
      when: Self().not.match(Condition.Date.IsBefore('2025-02-01')),
      message: 'Conference date must be before February 2025',
    }),
  ],
})`,
        }),
      ],
    }),

    // MOJ Date Picker - Excluded Days
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h3 class="govuk-heading-s">Excluding Weekends</h3>
        <p class="govuk-body">
          Use <code>excludedDays</code> to disable specific days of the week in the calendar.
          Weekends are disabled in this example.
        </p>
      `,
    }),

    exampleBox([
      field<MOJDatePicker>({
        variant: 'mojDatePicker',
        code: 'playground_moj_weekday_date',
        label: { text: 'Office appointment date' },
        hint: 'Appointments are only available on weekdays',
        excludedDays: ['saturday', 'sunday'],
        formatters: [Transformer.String.ToISODate()],
        validate: [
          validation({
            when: Self().not.match(Condition.IsRequired()),
            message: 'Enter an appointment date',
          }),
          validation({
            when: Self().not.match(Condition.Date.IsValid()),
            message: 'Appointment date must be a real date',
          }),
        ],
      }),
    ]),

    block<GovUKDetails>({
      variant: 'govukDetails',
      summaryText: 'View code',
      content: [
        block<CodeBlock>({
          variant: 'codeBlock',
          language: 'typescript',
          code: `field<MOJDatePicker>({
  variant: 'mojDatePicker',
  code: 'playground_moj_weekday_date',
  label: { text: 'Office appointment date' },
  hint: 'Appointments are only available on weekdays',
  excludedDays: ['saturday', 'sunday'],
  formatters: [Transformer.String.ToISODate()],
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Enter an appointment date',
    }),
    validation({
      when: Self().not.match(Condition.Date.IsValid()),
      message: 'Appointment date must be a real date',
    }),
  ],
})`,
        }),
      ],
    }),

    // Navigation
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        {{slot:pagination}}
      `,
      slots: {
        pagination: [
          block<GovUKPagination>({
            variant: 'govukPagination',
            classes: 'govuk-pagination--inline',
            previous: {
              href: '/forms/form-engine-developer-guide/validation/playground/numbers',
              labelText: 'Number Validation',
            },
            next: {
              href: '/forms/form-engine-developer-guide/validation/playground/arrays',
              labelText: 'Array Validation',
            },
          }),
        ],
      },
    }),
  ],
})
