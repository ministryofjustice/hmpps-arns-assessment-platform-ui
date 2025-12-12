import { step, block, Answer } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { CodeBlock } from '@form-engine/registry/components/codeBlock'
import { GovUKDetails, GovUKPagination } from '@form-engine-govuk-components/components'

/**
 * References - Chaining
 *
 * Documentation for chaining references with .pipe(), .match(), .not,
 * and combining references with Format() and Conditional().
 */
export const chainingStep = step({
  path: '/chaining',
  title: 'Chaining References',
  blocks: [
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <h1 class="govuk-heading-l">Chaining References</h1>

        <p class="govuk-body-l">
          References can be extended with transformations, conditions, and combined
          into complex expressions. This page covers the fluent API for building
          powerful data pipelines.
        </p>

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <h2 class="govuk-heading-m">The Fluent API</h2>

        <p class="govuk-body">
          Every reference returns a <code>ChainableRef</code> that supports these methods:
        </p>

        <ul class="govuk-list govuk-list--bullet">
          <li><code>.match(condition)</code> &mdash; Test the value against a condition</li>
          <li><code>.not.match(condition)</code> &mdash; Negate a condition test</li>
          <li><code>.pipe(...transformers)</code> &mdash; Transform the value through a pipeline</li>
          <li><code>.path('property')</code> &mdash; Navigate to a nested property</li>
        </ul>
      `,
    }),

    // .match()
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">.match() - Condition Testing</h2>

        <p class="govuk-body">
          The <code>.match()</code> method tests a reference value against a condition,
          returning a boolean expression that can be used in <code>when</code>,
          <code>hidden</code>, and <code>dependent</code> properties.
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `
import { Answer, Self, Condition } from '@form-engine/form/builders'

// Basic condition matching
Answer('country').match(Condition.Equals('UK'))
Answer('age').match(Condition.Number.GreaterThan(18))
Self().not.match(Condition.IsRequired())

// Use in validation
validation({
  when: Self().not.match(Condition.IsRequired()),
  message: 'Enter your full name',
})

// Use in hidden condition
field({
  code: 'ukDetails',
  hidden: Answer('country').not.match(Condition.Equals('UK')),
})`,
    }),

    // .not modifier
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <hr class="govuk-section-break govuk-section-break--m govuk-section-break--visible">
        <h3 class="govuk-heading-s">.not - Negating Conditions</h3>
        <p class="govuk-body">
          Use <code>.not</code> before <code>.match()</code> to invert the condition:
        </p>
        {{slot:code}}
      `,
      values: { lol: Answer('test') },
      slots: {
        code: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `
// "Show error when value is NOT a valid email"
Self().not.match(Condition.Email.IsValidEmail())

// "Show error when value is NOT at least 8 characters"
Self().not.match(Condition.String.HasMinLength(8))

// "Hide field when user has NOT selected 'other'"
Answer('selection').not.match(Condition.Equals('other'))

// Common validation pattern (Required → Format → Business)
validate: [
  validation({
    when: Self().not.match(Condition.IsRequired()),
    message: 'Enter your email address',
  }),
  validation({
    when: Self().not.match(Condition.Email.IsValidEmail()),
    message: 'Enter a valid email address',
  }),
]`,
          }),
        ],
      },
    }),

    // .pipe()
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">.pipe() - Transformation Pipelines</h2>

        <p class="govuk-body">
          The <code>.pipe()</code> method passes the reference value through one or more
          transformers, creating a pipeline that processes the data step by step.
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `
import { Answer, Transformer } from '@form-engine/form/builders'

// Single transformer
Answer('email').pipe(Transformer.String.ToLowerCase())

// Multiple transformers (executed left to right)
Answer('email').pipe(
  Transformer.String.Trim(),
  Transformer.String.ToLowerCase()
)

// Chain with conditions
Answer('quantity').pipe(
  Transformer.String.ToInt()
).match(Condition.Number.GreaterThan(0))`,
    }),

    // Common pipe patterns
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <h3 class="govuk-heading-s">Common Pipeline Patterns</h3>
        {{slot:code}}
      `,
      slots: {
        code: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `
// 1. Clean string input
Answer('postcode').pipe(
  Transformer.String.Trim(),
  Transformer.String.ToUpperCase()
)
// "  sw1a 1aa  " → "SW1A 1AA"

// 2. Parse and format numbers
Answer('price').pipe(
  Transformer.String.ToFloat(),
  Transformer.Number.ToFixed(2)
)
// "99.999" → "100.00"

// 3. Array length for validation
Answer('selections').pipe(
  Transformer.Array.Length()
)
// ["a", "b", "c"] → 3

// 4. Calculate values
Answer('quantity').pipe(
  Transformer.String.ToInt(),
  Transformer.Number.Multiply(10)
)`,
          }),
        ],
      },
    }),

    // Standalone Pipe()
    block<GovUKDetails>({
      variant: 'govukDetails',
      summaryText: 'Alternative: Standalone Pipe() function',
      content: [
        block<HtmlBlock>({
          variant: 'html',
          content: `
            <p class="govuk-body">
              You can also use the standalone <code>Pipe()</code> function with any expression:
            </p>
          `,
        }),
        block<CodeBlock>({
          variant: 'codeBlock',
          language: 'typescript',
          code: `
// The .pipe() method is chainable:
Answer('email').pipe(Transformer.String.Trim())

// You can chain multiple transformers:
Answer('email').pipe(
  Transformer.String.Trim(),
  Transformer.String.ToLowerCase()
)

// Works with Item() for collection indices
Item().index().pipe(Transformer.Number.Add(1))`,
        }),
      ],
    }),

    // Format()
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Format() - String Interpolation</h2>

        <p class="govuk-body">
          <code>Format()</code> combines multiple references into a formatted string
          using placeholder syntax:
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `
import { Format, Answer, Data } from '@form-engine/form/builders'

// Basic placeholders: %1, %2, %3, etc.
Format('Hello, %1!', Answer('firstName'))
// "Hello, John!"

Format('%1 %2', Answer('firstName'), Answer('lastName'))
// "John Smith"

// Use in HTML content
block<HtmlBlock>({
  variant: 'html',
  content: Format(
    '<h1>Welcome, %1</h1><p>Your email: %2</p>',
    Answer('name'),
    Answer('email')
  ),
})

// Combine with pipes
Format('Total: £%1',
  Answer('price').pipe(Transformer.Number.ToFixed(2))
)`,
    }),

    // Conditional()
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Conditional() - If/Then/Else Logic</h2>

        <p class="govuk-body">
          <code>Conditional()</code> returns different values based on a condition:
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `
import { Conditional, Answer, Condition } from '@form-engine/form/builders'

// Basic if/then/else
Conditional({
  when: Answer('country').match(Condition.Equals('UK')),
  then: 'Postcode',
  else: 'ZIP Code',
})

// With references as then/else values
Conditional({
  when: Answer('useBusinessAddress').match(Condition.Equals(true)),
  then: Data('business.address'),
  else: Answer('homeAddress'),
})

// Nested conditionals
Conditional({
  when: Answer('tier').match(Condition.Equals('premium')),
  then: 'Premium Support',
  else: Conditional({
    when: Answer('tier').match(Condition.Equals('standard')),
    then: 'Standard Support',
    else: 'Basic Support',
  }),
})`,
    }),

    // Using in field labels
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <h3 class="govuk-heading-s">Dynamic Field Labels</h3>
        <p class="govuk-body">
          Combine <code>Conditional()</code> and <code>Format()</code> for dynamic labels:
        </p>
        {{slot:code}}
      `,
      slots: {
        code: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `
field<GovUKTextInput>({
  variant: 'govukTextInput',
  code: 'postalCode',
  label: Conditional({
    when: Answer('country').match(Condition.Equals('US')),
    then: 'ZIP Code',
    else: 'Postcode',
  }),
  hint: Conditional({
    when: Answer('country').match(Condition.Equals('US')),
    then: 'For example, 90210',
    else: 'For example, SW1A 1AA',
  }),
})`,
          }),
        ],
      },
    }),

    // Combining everything
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Putting It All Together</h2>

        <p class="govuk-body">
          Here's a complete example showing multiple chaining techniques:
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `
// A sophisticated address validation field
field<GovUKTextInput>({
  variant: 'govukTextInput',
  code: 'postcode',

  // Dynamic label based on country
  label: Conditional({
    when: Answer('country').match(Condition.Equals('US')),
    then: 'ZIP Code',
    else: 'Postcode',
  }),

  // Dynamic hint
  hint: Conditional({
    when: Answer('country').match(Condition.Equals('US')),
    then: 'For example, 90210 or 90210-1234',
    else: 'For example, SW1A 1AA',
  }),

  // Only show for certain countries
  hidden: Answer('country').not.match(
    Condition.Array.IsIn(['UK', 'US', 'CA', 'AU'])
  ),

  // Validation depends on country
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: Conditional({
        when: Answer('country').match(Condition.Equals('US')),
        then: 'Enter your ZIP Code',
        else: 'Enter your postcode',
      }),
    }),
    validation({
      when: and(
        Answer('country').match(Condition.Equals('UK')),
        Self().not.match(Condition.Address.IsValidPostcode()),
      ),
      message: 'Enter a valid UK postcode',
    }),
  ],

  // Clean up the input
  formatters: [
    Transformer.String.Trim(),
    Transformer.String.ToUpperCase(),
  ],
})`,
    }),

    // Summary table
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Quick Reference</h2>

        <table class="govuk-table">
          <thead class="govuk-table__head">
            <tr class="govuk-table__row">
              <th scope="col" class="govuk-table__header">Method</th>
              <th scope="col" class="govuk-table__header">Returns</th>
              <th scope="col" class="govuk-table__header">Use For</th>
            </tr>
          </thead>
          <tbody class="govuk-table__body">
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>.match()</code></td>
              <td class="govuk-table__cell">Boolean expression</td>
              <td class="govuk-table__cell">Validation, hidden, dependent</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>.not.match()</code></td>
              <td class="govuk-table__cell">Boolean expression (negated)</td>
              <td class="govuk-table__cell">"must be" validations</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>.pipe()</code></td>
              <td class="govuk-table__cell">Transformed value</td>
              <td class="govuk-table__cell">Data transformation</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>.path()</code></td>
              <td class="govuk-table__cell">Nested property</td>
              <td class="govuk-table__cell">Object navigation</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>Format()</code></td>
              <td class="govuk-table__cell">Formatted string</td>
              <td class="govuk-table__cell">String interpolation</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>Conditional()</code></td>
              <td class="govuk-table__cell">Conditional value</td>
              <td class="govuk-table__cell">If/then/else logic</td>
            </tr>
          </tbody>
        </table>
      `,
    }),

    // Navigation
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        {{slot:pagination}}
        <p class="govuk-body govuk-!-margin-top-6">
          <a href="/forms/form-engine-developer-guide/hub" class="govuk-link">&larr; Back to Guide Hub</a>
        </p>
      `,
      slots: {
        pagination: [
          block<GovUKPagination>({
            variant: 'govukPagination',
            classes: 'govuk-pagination--inline',
            previous: {
              href: '/forms/form-engine-developer-guide/references/http',
              labelText: 'HTTP References',
            },
          }),
        ],
      },
    }),
  ],
})
