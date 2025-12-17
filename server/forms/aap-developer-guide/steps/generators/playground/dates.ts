import { step, block, submitTransition, Format } from '@form-engine/form/builders'
import { Generator } from '@form-engine/registry/generators'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { CodeBlock } from '@form-engine/registry/components/codeBlock'
import { GovUKDetails, GovUKPagination } from '@form-engine-govuk-components/components'
import { Transformer } from '@form-engine/registry/transformers'

/**
 * Generators Playground - Dates
 *
 * Interactive examples of date generators.
 * Shows how generators produce values that can be used in forms.
 */
export const datesStep = step({
  path: '/dates',
  title: 'Date Generators',
  onSubmission: [
    submitTransition({
      validate: true,
    }),
  ],
  blocks: [
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <h1 class="govuk-heading-l">Date Generators Playground</h1>

        <p class="govuk-body-l">
          Date generators produce date values dynamically. They're particularly useful
          for setting constraints like minimum/maximum dates on date pickers.
        </p>
      `,
    }),

    // Generator.Date.Now()
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Generator.Date.Now()</h2>
        <p class="govuk-body">
          Returns the current date and time as a JavaScript <code>Date</code> object.
          Useful for setting dynamic constraints or capturing timestamps.
        </p>
      `,
    }),

    block<HtmlBlock>({
      variant: 'html',
      content: Format(
        `
        <div class="govuk-inset-text">
          <p class="govuk-body govuk-!-margin-bottom-2"><strong>Current time when page loaded:</strong></p>
          <p class="govuk-body govuk-!-font-weight-bold">%1</p>
        </div>
      `,
        Generator.Date.Now().pipe(Transformer.Date.Format('DD/MM/YYYY')),
      ),
    }),

    block<GovUKDetails>({
      variant: 'govukDetails',
      summaryText: 'View code',
      content: [
        block<CodeBlock>({
          variant: 'codeBlock',
          language: 'typescript',
          code: `import { Generator } from '@form-engine/registry/generators'

// Use as a dynamic constraint
field<MOJDatePicker>({
  variant: 'mojDatePicker',
  code: 'appointmentDate',
  label: 'Select appointment date',
  hint: 'Must be today or later',
  minDate: Generator.Date.Now(),
})

// The generator produces: new Date()
// e.g., 2024-01-15T14:30:45.123Z`,
        }),
      ],
    }),

    // Generator.Date.Today()
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Generator.Date.Today()</h2>
        <p class="govuk-body">
          Returns today's date at midnight (00:00:00.000). Useful when you need
          a date without the time component for cleaner comparisons.
        </p>
      `,
    }),

    block<HtmlBlock>({
      variant: 'html',
      content: Format(
        `
        <div class="govuk-inset-text">
          <p class="govuk-body govuk-!-margin-bottom-2"><strong>Today at midnight:</strong></p>
          <p class="govuk-body govuk-!-font-weight-bold">%1</p>
        </div>
      `,
        Generator.Date.Today().pipe(Transformer.Date.Format('DD/MM/YYYY HH:mm:ss')),
      ),
    }),

    block<GovUKDetails>({
      variant: 'govukDetails',
      summaryText: 'View code',
      content: [
        block<CodeBlock>({
          variant: 'codeBlock',
          language: 'typescript',
          code: `import { Generator } from '@form-engine/registry/generators'

// Use for date-only comparisons
field<MOJDatePicker>({
  variant: 'mojDatePicker',
  code: 'startDate',
  label: 'Start date',
  hint: 'Must be today or later',
  minDate: Generator.Date.Today(),
})

// The generator produces: new Date(year, month, date)
// e.g., 2024-01-15T00:00:00.000Z (midnight)`,
        }),
      ],
    }),

    // Pipeline Example
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Using Generators with Pipelines</h2>
        <p class="govuk-body">
          Generators can be chained with transformers using <code>.pipe()</code>.
          This allows you to generate a value and then transform it.
        </p>
      `,
    }),

    block<HtmlBlock>({
      variant: 'html',
      content: Format(
        `
        <div class="govuk-inset-text">
          <p class="govuk-body govuk-!-margin-bottom-2"><strong>One week from today:</strong></p>
          <p class="govuk-body govuk-!-font-weight-bold">%1</p>
        </div>
      `,
        Generator.Date.Today().pipe(Transformer.Date.AddDays(7), Transformer.Date.Format('DD/MM/YYYY')),
      ),
    }),

    block<GovUKDetails>({
      variant: 'govukDetails',
      summaryText: 'View code',
      content: [
        block<CodeBlock>({
          variant: 'codeBlock',
          language: 'typescript',
          code: `import { Generator } from '@form-engine/registry/generators'
import { Transformer } from '@form-engine/registry/transformers'

// Generate today, then add 7 days
const nextWeek = Generator.Date.Now().pipe(
  Transformer.Date.AddDays(7),
  Transformer.Date.Format('DD/MM/YYYY')
)

// This creates a pipeline:
// 1. Generator.Date.Now() produces current date
// 2. Transformer.Date.AddDays(7) adds 7 days
// 3. Make it pretty with Transformer.Date.Format('DD/MM/YYYY')
// 4. Result: date one week from now`,
        }),
      ],
    }),

    // Real-world Example
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Real-world Example: Appointment Booking</h2>
        <p class="govuk-body">
          Here's how generators might be used in an appointment booking form
          where appointments must be at least 2 days in the future but within 30 days.
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `import { Generator } from '@form-engine/registry/generators'
import { Transformer } from '@form-engine/registry/transformers'

field<MOJDatePicker>({
  variant: 'mojDatePicker',
  code: 'appointmentDate',
  label: 'Select appointment date',
  hint: 'Appointments must be booked 2-30 days in advance',

  // Minimum: 2 days from now
  minDate: Generator.Date.Today().pipe(
    Transformer.Date.AddDays(2)
  ),

  // Maximum: 30 days from now
  maxDate: Generator.Date.Today().pipe(
    Transformer.Date.AddDays(30)
  ),

  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Select an appointment date',
    }),
  ],
})`,
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
              href: '/forms/form-engine-developer-guide/generators/playground/intro',
              labelText: 'Playground Hub',
            },
            next: {
              href: '/forms/form-engine-developer-guide/effects/intro',
              labelText: 'Effects',
            },
          }),
        ],
      },
    }),
  ],
})
