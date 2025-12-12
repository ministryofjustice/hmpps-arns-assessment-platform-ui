import { step, block } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { CodeBlock } from '@form-engine/registry/components/codeBlock'
import { GovUKPagination } from '@form-engine-govuk-components/components'

/**
 * References - Introduction
 *
 * High-level overview of what references are, their purpose, and
 * the different types available in the form-engine.
 */
export const introStep = step({
  path: '/intro',
  title: 'Understanding References',
  isEntryPoint: true,
  blocks: [
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <h1 class="govuk-heading-l">References</h1>

        <p class="govuk-body-l">
          <strong>References</strong> are pointers to data within the form engine.
          They get resolved at runtime to retrieve actual values from various sources.
        </p>

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <h2 class="govuk-heading-m">What is a Reference?</h2>

        <p class="govuk-body">
          A reference is a declarative way to say "get this value from somewhere".
          Instead of hardcoding values, you describe <em>where</em> the value comes from,
          and the form engine resolves it at runtime.
        </p>

        <p class="govuk-body">
          This enables:
        </p>

        <ul class="govuk-list govuk-list--bullet">
          <li>Dynamic content based on user input</li>
          <li>Conditional visibility of fields and blocks</li>
          <li>Validation rules that depend on other fields</li>
          <li>Pre-populating fields from external data</li>
          <li>Building complex expressions from multiple values</li>
        </ul>

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <h2 class="govuk-heading-m">Reference Types</h2>

        <p class="govuk-body">
          The form-engine provides six reference types, each pointing to a different data source:
        </p>
      `,
    }),

    // Reference types table
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <table class="govuk-table">
          <thead class="govuk-table__head">
            <tr class="govuk-table__row">
              <th scope="col" class="govuk-table__header">Reference</th>
              <th scope="col" class="govuk-table__header">Data Source</th>
              <th scope="col" class="govuk-table__header">Common Use</th>
            </tr>
          </thead>
          <tbody class="govuk-table__body">
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>Answer('field')</code></td>
              <td class="govuk-table__cell">Field responses</td>
              <td class="govuk-table__cell">Referencing user input from any field</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>Data('key')</code></td>
              <td class="govuk-table__cell">External data</td>
              <td class="govuk-table__cell">API responses, database lookups</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>Self()</code></td>
              <td class="govuk-table__cell">Current field</td>
              <td class="govuk-table__cell">Validation rules, field-scoped logic</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>Item()</code></td>
              <td class="govuk-table__cell">Collection item</td>
              <td class="govuk-table__cell">Iterating over arrays, dynamic fields</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>Params('id')</code></td>
              <td class="govuk-table__cell">URL path params</td>
              <td class="govuk-table__cell">Route parameters like <code>/users/:id</code></td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>Query('search')</code></td>
              <td class="govuk-table__cell">URL query string</td>
              <td class="govuk-table__cell">Query params like <code>?search=term</code></td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>Post('field')</code></td>
              <td class="govuk-table__cell">Raw POST body</td>
              <td class="govuk-table__cell">Accessing raw submission data</td>
            </tr>
          </tbody>
        </table>
      `,
    }),

    // Basic example
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Basic Example</h2>
        <p class="govuk-body">
          Here's a simple example showing different reference types in action:
        </p>
        {{slot:code}}
      `,
      slots: {
        code: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `
import { field, block, Answer, Data, Self, Condition, validation } from '@form-engine/form/builders'

// Using Answer() to show a greeting based on user input
block<HtmlBlock>({
  variant: 'html',
  content: Format('Hello, %1!', Answer('firstName')),
})

// Using Data() to pre-populate from external source
field<GovUKTextInput>({
  variant: 'govukTextInput',
  code: 'email',
  label: 'Email address',
  defaultValue: Data('user.email'),
})

// Using Self() in validation
field<GovUKTextInput>({
  variant: 'govukTextInput',
  code: 'age',
  label: 'Your age',
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Enter your age',
    }),
  ],
})`,
          }),
        ],
      },
    }),

    // How references resolve
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">How References Resolve</h2>

        <p class="govuk-body">
          References are evaluated at runtime through these steps:
        </p>

        <ol class="govuk-list govuk-list--number">
          <li>The reference is encountered during form rendering or submission</li>
          <li>The form-engine identifies the reference type from its path</li>
          <li>A handler fetches the value from the appropriate source</li>
          <li>Any nested path segments are navigated (e.g., <code>.property.subProperty</code>)</li>
          <li>The final value is returned and used in the expression</li>
        </ol>

        <div class="govuk-inset-text">
          <strong>Key insight:</strong> References are lazy &mdash; they only resolve when needed.
          This means you can reference values that don't exist yet (like answers from fields
          the user hasn't filled in), and the form-engine handles missing values gracefully.
        </div>
      `,
    }),

    // Nested property access
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Accessing Nested Properties</h2>
        <p class="govuk-body">
          All references support dot notation to access nested properties:
        </p>
        {{slot:code}}
      `,
      slots: {
        code: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `
// Accessing nested data properties
Data('user.profile.address.street')

// Accessing nested answer values
Answer('primaryContact.email')

// Deep nesting works to any level
Data('api.response.data.results.0.id')`,
          }),
        ],
      },
    }),

    // What's next
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">What's Next</h2>

        <p class="govuk-body">
          The following pages cover each reference type in detail:
        </p>

        <ul class="govuk-list govuk-list--bullet">
          <li><strong>Answer()</strong> &mdash; Referencing field values</li>
          <li><strong>Data()</strong> &mdash; Referencing external data</li>
          <li><strong>Self()</strong> &mdash; Referencing the current field</li>
          <li><strong>Item()</strong> &mdash; Referencing collection items</li>
          <li><strong>Params, Query & Post</strong> &mdash; HTTP request references</li>
          <li><strong>Chaining</strong> &mdash; Combining references with pipes and conditions</li>
        </ul>
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
              href: '/forms/form-engine-developer-guide/hub',
              labelText: 'Guide Hub',
            },
            next: {
              href: '/forms/form-engine-developer-guide/references/answer',
              labelText: 'Answer Reference',
            },
          }),
        ],
      },
    }),
  ],
})
