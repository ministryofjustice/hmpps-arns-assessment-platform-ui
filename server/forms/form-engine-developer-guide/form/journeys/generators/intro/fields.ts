import { TemplateWrapper } from '@form-engine/registry/components'
import { GovUKPagination } from '@form-engine-govuk-components/components'
import { CodeBlock } from '../../../../components'
import { parseGovUKMarkdown } from '../../../../helpers/markdown'

/**
 * Generators - Introduction
 *
 * How to use generators to produce dynamic values without input.
 */
export const pageContent = TemplateWrapper({
  template: parseGovUKMarkdown(`
  # Generators

  Generators produce values dynamically without requiring input.
  Unlike conditions (which test values) or transformers (which modify values),
  generators create new values from scratch. {.lead}

  ---

  ## When to Use Generators

  - **Dynamic defaults:** Set a field's default to today's date
  - **Computed constraints:** Set a date picker's minimum date to "now"
  - **Value pipelines:** Generate a value then transform it with \`.pipe()\`

  ---

  ## Basic Usage

  Import generators from the registry and call them where you need a dynamic value.

  {{slot:basicUsageCode}}

  ---

  ## Date Generators

  Generate date values for use in forms.

  {{slot:dateGeneratorsCode}}

  ---

  ## Pipeline Integration

  Generators can be piped to transformers, allowing you to generate a value
  and then transform it in a single expression.

  {{slot:pipelineCode}}

  ---

  ## Generators vs Other Function Types

  | Type | Purpose | Signature |
  |------|---------|-----------|
  | **Condition** | Test a value against criteria | \`(value, ...args) => boolean\` |
  | **Transformer** | Transform a value | \`(value, ...args) => any\` |
  | **Generator** | Produce a value | \`(...args) => any\` |
  | **Effect** | Side effects (API calls, etc.) | \`(context, ...args) => void\` |

  The key difference is that generators don't receive an input value — they
  create values from nothing (or from their arguments).

  ---

  {{slot:pagination}}
`),
  slots: {
    basicUsageCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          import { Generator } from '@form-engine/registry/generators'
          import { MOJDatePicker } from '@form-engine-moj-components/components'

          MOJDatePicker({
            code: 'appointmentDate',
            label: 'Select appointment date',
            // Minimum date is dynamically set to "now"
            minDate: Generator.Date.Now(),
          })
        `,
      }),
    ],
    dateGeneratorsCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          // Current date and time
          Generator.Date.Now()     // Returns: new Date() with full timestamp

          // Today at midnight (start of day)
          Generator.Date.Today()   // Returns: Date set to 00:00:00.000
        `,
      }),
    ],
    pipelineCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          import { Generator } from '@form-engine/registry/generators'
          import { Transformer } from '@form-engine/registry/transformers'

          // Generate today's date, then add 7 days
          const nextWeek = Generator.Date.Now().pipe(
            Transformer.Date.AddDays(7)
          )

          // Generate today, then format as ISO string
          const todayISO = Generator.Date.Today().pipe(
            Transformer.Date.ToISOString()
          )
        `,
      }),
    ],
    pagination: [
      GovUKPagination({
        classes: 'govuk-pagination--inline',
        previous: {
          href: '/forms/form-engine-developer-guide/transformers/playground/arrays',
          labelText: 'Array Transformers',
        },
        next: {
          href: '/forms/form-engine-developer-guide/generators/playground/intro',
          labelText: 'Generators Playground',
        },
      }),
    ],
  },
})
