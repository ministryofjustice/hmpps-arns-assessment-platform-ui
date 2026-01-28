import { Format } from '@form-engine/form/builders'
import { TemplateWrapper } from '@form-engine/registry/components'
import { Generator } from '@form-engine/registry/generators'
import { Transformer } from '@form-engine/registry/transformers'
import { GovUKDetails, GovUKPagination } from '@form-engine-govuk-components/components'
import { CodeBlock } from '../../../../../components'
import { parseGovUKMarkdown } from '../../../../../helpers/markdown'

/**
 * Generators Playground - Dates
 *
 * Interactive examples of date generators.
 */
export const pageContent = TemplateWrapper({
  template: parseGovUKMarkdown(`
  # Date Generators Playground

  Date generators produce date values dynamically. They're particularly useful
  for setting constraints like minimum/maximum dates on date pickers. {.lead}

  ---

  ## Generator.Date.Now()

  Returns the current date and time as a JavaScript \`Date\` object.
  Useful for setting dynamic constraints or capturing timestamps.

  {{slot:nowExample}}

  {{slot:nowCode}}

  ---

  ## Generator.Date.Today()

  Returns today's date at midnight (00:00:00.000). Useful when you need
  a date without the time component for cleaner comparisons.

  {{slot:todayExample}}

  {{slot:todayCode}}

  ---

  ## Using Generators with Pipelines

  Generators can be chained with transformers using \`.pipe()\`.
  This allows you to generate a value and then transform it.

  {{slot:pipelineExample}}

  {{slot:pipelineCode}}

  ---

  ## Real-world Example: Appointment Booking

  Here's how generators might be used in an appointment booking form
  where appointments must be at least 2 days in the future but within 30 days.

  {{slot:realWorldCode}}

  ---

  {{slot:pagination}}
`),
  slots: {
    nowExample: [
      TemplateWrapper({
        template: Format(
          `<div class="govuk-inset-text">
            <p class="govuk-body govuk-!-margin-bottom-2"><strong>Current time when page loaded:</strong></p>
            <p class="govuk-body govuk-!-font-weight-bold">%1</p>
          </div>`,
          Generator.Date.Now().pipe(Transformer.Date.Format('DD/MM/YYYY')),
        ),
        slots: {},
      }),
    ],
    nowCode: [
      GovUKDetails({
        summaryText: 'View code',
        content: [
          CodeBlock({
            language: 'typescript',
            code: `
              import { Generator } from '@form-engine/registry/generators'
              import { MOJDatePicker } from '@form-engine-moj-components/components'

              // Use as a dynamic constraint
              MOJDatePicker({
                code: 'appointmentDate',
                label: 'Select appointment date',
                hint: 'Must be today or later',
                minDate: Generator.Date.Now(),
              })

              // The generator produces: new Date()
              // e.g., 2024-01-15T14:30:45.123Z
            `,
          }),
        ],
      }),
    ],
    todayExample: [
      TemplateWrapper({
        template: Format(
          `<div class="govuk-inset-text">
            <p class="govuk-body govuk-!-margin-bottom-2"><strong>Today at midnight:</strong></p>
            <p class="govuk-body govuk-!-font-weight-bold">%1</p>
          </div>`,
          Generator.Date.Today().pipe(Transformer.Date.Format('DD/MM/YYYY HH:mm:ss')),
        ),
        slots: {},
      }),
    ],
    todayCode: [
      GovUKDetails({
        summaryText: 'View code',
        content: [
          CodeBlock({
            language: 'typescript',
            code: `
              import { Generator } from '@form-engine/registry/generators'
              import { MOJDatePicker } from '@form-engine-moj-components/components'

              // Use for date-only comparisons
              MOJDatePicker({
                code: 'startDate',
                label: 'Start date',
                hint: 'Must be today or later',
                minDate: Generator.Date.Today(),
              })

              // The generator produces: new Date(year, month, date)
              // e.g., 2024-01-15T00:00:00.000Z (midnight)
            `,
          }),
        ],
      }),
    ],
    pipelineExample: [
      TemplateWrapper({
        template: Format(
          `<div class="govuk-inset-text">
            <p class="govuk-body govuk-!-margin-bottom-2"><strong>One week from today:</strong></p>
            <p class="govuk-body govuk-!-font-weight-bold">%1</p>
          </div>`,
          Generator.Date.Today().pipe(Transformer.Date.AddDays(7), Transformer.Date.Format('DD/MM/YYYY')),
        ),
        slots: {},
      }),
    ],
    pipelineCode: [
      GovUKDetails({
        summaryText: 'View code',
        content: [
          CodeBlock({
            language: 'typescript',
            code: `
              import { Generator } from '@form-engine/registry/generators'
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
              // 4. Result: date one week from now
            `,
          }),
        ],
      }),
    ],
    realWorldCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          import { Generator } from '@form-engine/registry/generators'
          import { Transformer } from '@form-engine/registry/transformers'
          import { MOJDatePicker } from '@form-engine-moj-components/components'

          MOJDatePicker({
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
          })
        `,
      }),
    ],
    pagination: [
      GovUKPagination({
        classes: 'govuk-pagination--inline',
        previous: {
          href: '/form-engine-developer-guide/generators/playground/intro',
          labelText: 'Playground Hub',
        },
        next: {
          href: '/form-engine-developer-guide/effects/intro',
          labelText: 'Effects',
        },
      }),
    ],
  },
})
