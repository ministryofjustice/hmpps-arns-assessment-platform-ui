import { step, block } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { CodeBlock } from '@form-engine/registry/components/codeBlock'
import { GovUKPagination } from '@form-engine-govuk-components/components'

/**
 * Components - Custom Components
 *
 * How to build your own components for form-engine.
 */
export const customStep = step({
  path: '/custom',
  title: 'Custom Components',
  blocks: [
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <h1 class="govuk-heading-l">Custom Components</h1>

        <p class="govuk-body-l">
          Create your own components when built-in options don't fit your needs.
          Components are TypeScript adapters that transform form definitions into
          rendered HTML via Nunjucks templates.
        </p>

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <h2 class="govuk-heading-m">Component Structure</h2>

        <p class="govuk-body">
          Every component needs three things:
        </p>

        <ol class="govuk-list govuk-list--number">
          <li><strong>Interface</strong> &mdash; TypeScript type defining the component's properties</li>
          <li><strong>Renderer</strong> &mdash; Function that transforms properties into template params</li>
          <li><strong>Registration</strong> &mdash; Export using <code>buildNunjucksComponent()</code></li>
        </ol>
      `,
    }),

    // Simple Block Component
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Example: Simple Block Component</h2>
        <p class="govuk-body">
          Here's a custom alert component that renders a styled message box:
        </p>
        {{slot:code}}
      `,
      slots: {
        code: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `// myAlertBox.ts
import type nunjucks from 'nunjucks'
import { buildNunjucksComponent } from '@form-engine-govuk-components/internal/buildNunjucksComponent'
import { BlockDefinition, ConditionalString, EvaluatedBlock } from '@form-engine/form/types/structures.type'

// 1. Define the interface
export interface MyAlertBox extends BlockDefinition {
  variant: 'myAlertBox'

  /** The alert message */
  message: ConditionalString

  /** Alert type affects styling */
  type?: 'info' | 'warning' | 'error' | 'success'

  /** Optional title above the message */
  title?: ConditionalString
}

// 2. Create the renderer function
async function alertBoxRenderer(
  block: EvaluatedBlock<MyAlertBox>,
  nunjucksEnv: nunjucks.Environment,
): Promise<string> {
  // Transform block properties into template params
  const params = {
    message: block.message,
    type: block.type ?? 'info',
    title: block.title,
    // Map type to CSS class
    typeClass: \`alert-box--\${block.type ?? 'info'}\`,
  }

  return nunjucksEnv.render('components/alert-box/template.njk', { params })
}

// 3. Register the component
export const myAlertBox = buildNunjucksComponent<MyAlertBox>('myAlertBox', alertBoxRenderer)`,
          }),
        ],
      },
    }),

    // Template
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <h3 class="govuk-heading-s">The Nunjucks Template</h3>
        <p class="govuk-body">
          Create the template at <code>views/components/alert-box/template.njk</code>:
        </p>
        {{slot:code}}
      `,
      slots: {
        code: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'html',
            code: `{# components/alert-box/template.njk #}
<div class="alert-box {{ params.typeClass }}">
  {% if params.title %}
    <h3 class="alert-box__title">{{ params.title }}</h3>
  {% endif %}
  <p class="alert-box__message">{{ params.message }}</p>
</div>`,
          }),
        ],
      },
    }),

    // Usage
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <h3 class="govuk-heading-s">Using the Component</h3>
        {{slot:code}}
      `,
      slots: {
        code: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `import { block } from '@form-engine/form/builders'
import { MyAlertBox } from './components/myAlertBox'

// In your step
blocks: [
  block<MyAlertBox>({
    variant: 'myAlertBox',
    type: 'warning',
    title: 'Important',
    message: 'Your session will expire in 5 minutes.',
  }),
]`,
          }),
        ],
      },
    }),

    // Field Component
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Field Components</h2>

        <p class="govuk-body">
          Field components collect user input. They extend <code>FieldBlockDefinition</code>
          instead of <code>BlockDefinition</code> and have access to additional properties
          like <code>value</code>, <code>errors</code>, and <code>code</code>.
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `// myStarRating.ts
import type nunjucks from 'nunjucks'
import { buildNunjucksComponent } from '@form-engine-govuk-components/internal/buildNunjucksComponent'
import { FieldBlockDefinition, ConditionalString, EvaluatedBlock } from '@form-engine/form/types/structures.type'

// Field components extend FieldBlockDefinition
export interface MyStarRating extends FieldBlockDefinition {
  variant: 'myStarRating'

  /** Label for the rating field */
  label: ConditionalString

  /** Maximum number of stars */
  maxStars?: number

  /** Hint text */
  hint?: ConditionalString
}

async function starRatingRenderer(
  block: EvaluatedBlock<MyStarRating>,
  nunjucksEnv: nunjucks.Environment,
): Promise<string> {
  const params = {
    // Field properties
    name: block.code,           // Form field name (from 'code')
    id: block.code,
    value: block.value,         // Current value (from answers)
    errorMessage: block.errors?.length
      ? { text: block.errors[0].message }
      : undefined,

    // Component-specific properties
    label: block.label,
    hint: block.hint,
    maxStars: block.maxStars ?? 5,
  }

  return nunjucksEnv.render('components/star-rating/template.njk', { params })
}

export const myStarRating = buildNunjucksComponent<MyStarRating>('myStarRating', starRatingRenderer)`,
    }),

    // Data Transformation
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Data Transformation in Renderers</h2>

        <p class="govuk-body">
          The renderer function is your opportunity to transform data before it reaches
          the template. This is where the real power lies &mdash; you can:
        </p>

        <ul class="govuk-list govuk-list--bullet">
          <li>Convert data formats (e.g., ISO dates to display format)</li>
          <li>Set default values</li>
          <li>Map properties to CSS classes</li>
          <li>Restructure data to match template expectations</li>
          <li>Handle edge cases and type coercion</li>
        </ul>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `async function myDatePickerRenderer(
  block: EvaluatedBlock<MyDatePicker>,
  nunjucksEnv: nunjucks.Environment,
): Promise<string> {
  // Transform ISO date to display format for the input
  const displayValue = toDisplayFormat(block.value)

  // Set sensible defaults
  const params = {
    name: block.code,
    value: displayValue,  // Transformed value!
    label: typeof block.label === 'string'
      ? { text: block.label }
      : block.label,
    // Default min/max if not provided
    minDate: block.minDate ?? '01/01/1900',
    maxDate: block.maxDate ?? '31/12/2100',
  }

  return nunjucksEnv.render('...', { params })
}

// Helper function to convert ISO to UK format
function toDisplayFormat(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined

  // If ISO format (YYYY-MM-DD), convert to UK format
  const match = value.match(/^(\\d{4})-(\\d{2})-(\\d{2})$/)
  if (match) {
    return \`\${match[3]}/\${match[2]}/\${match[1]}\`
  }

  return value
}`,
    }),

    // Registration
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Registering Components</h2>

        <p class="govuk-body">
          Components must be registered with form-engine before use. Add them to your
          form package's component registry:
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `// In your form's index.ts or components/index.ts
import { myAlertBox } from './components/myAlertBox'
import { myStarRating } from './components/myStarRating'

// Register during form engine setup
formEngine.registerComponents({
  ...myAlertBox,
  ...myStarRating,
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
              href: '/forms/form-engine-developer-guide/components/built-in',
              labelText: 'Built-in Components',
            },
            next: {
              href: '/forms/form-engine-developer-guide/components/extending',
              labelText: 'Extending Components',
            },
          }),
        ],
      },
    }),
  ],
})
