import { step, block } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { CodeBlock } from '@form-engine/registry/components/codeBlock'
import { GovUKPagination } from '@form-engine-govuk-components/components'

/**
 * Generators - Introduction
 *
 * How to use generators to produce dynamic values without input.
 */
export const introStep = step({
  path: '/intro',
  title: 'Understanding Generators',
  isEntryPoint: true,
  blocks: [
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <h1 class="govuk-heading-l">Generators</h1>

        <p class="govuk-body-l">
          Generators produce values dynamically without requiring input.
          Unlike conditions (which test values) or transformers (which modify values),
          generators create new values from scratch.
        </p>

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <h2 class="govuk-heading-m">When to Use Generators</h2>

        <ul class="govuk-list govuk-list--bullet">
          <li>
            <strong>Dynamic defaults:</strong> Set a field's default to today's date
          </li>
          <li>
            <strong>Computed constraints:</strong> Set a date picker's minimum date to "now"
          </li>
          <li>
            <strong>Value pipelines:</strong> Generate a value then transform it with <code>.pipe()</code>
          </li>
        </ul>
      `,
    }),

    // Basic Usage
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Basic Usage</h2>
        <p class="govuk-body">
          Import generators from the registry and call them where you need a dynamic value.
        </p>
        {{slot:code}}
      `,
      slots: {
        code: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `
import { Generator } from '@form-engine/registry/generators'

field<MOJDatePicker>({
  variant: 'mojDatePicker',
  code: 'appointmentDate',
  label: 'Select appointment date',
  // Minimum date is dynamically set to "now"
  minDate: Generator.Date.Now(),
})`,
          }),
        ],
      },
    }),

    // Available Generators
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Date Generators</h2>
        <p class="govuk-body">
          Generate date values for use in forms.
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `
// Current date and time
Generator.Date.Now()     // Returns: new Date() with full timestamp

// Today at midnight (start of day)
Generator.Date.Today()   // Returns: Date set to 00:00:00.000`,
    }),

    // Pipeline Integration
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Pipeline Integration</h2>
        <p class="govuk-body">
          Generators can be piped to transformers, allowing you to generate a value
          and then transform it in a single expression.
        </p>
        {{slot:code}}
      `,
      slots: {
        code: [
          block<CodeBlock>({
            variant: 'codeBlock',
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
)`,
          }),
        ],
      },
    }),

    // Comparison with Other Function Types
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Generators vs Other Function Types</h2>
        <table class="govuk-table">
          <thead class="govuk-table__head">
            <tr class="govuk-table__row">
              <th scope="col" class="govuk-table__header">Type</th>
              <th scope="col" class="govuk-table__header">Purpose</th>
              <th scope="col" class="govuk-table__header">Signature</th>
            </tr>
          </thead>
          <tbody class="govuk-table__body">
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><strong>Condition</strong></td>
              <td class="govuk-table__cell">Test a value against criteria</td>
              <td class="govuk-table__cell"><code>(value, ...args) => boolean</code></td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><strong>Transformer</strong></td>
              <td class="govuk-table__cell">Transform a value</td>
              <td class="govuk-table__cell"><code>(value, ...args) => any</code></td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><strong>Generator</strong></td>
              <td class="govuk-table__cell">Produce a value</td>
              <td class="govuk-table__cell"><code>(...args) => any</code></td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><strong>Effect</strong></td>
              <td class="govuk-table__cell">Side effects (API calls, etc.)</td>
              <td class="govuk-table__cell"><code>(context, ...args) => void</code></td>
            </tr>
          </tbody>
        </table>
        <p class="govuk-body">
          The key difference is that generators don't receive an input value &mdash; they
          create values from nothing (or from their arguments).
        </p>
      `,
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
    }),
  ],
})
