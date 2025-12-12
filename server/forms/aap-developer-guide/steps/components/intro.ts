import { step, block } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { CodeBlock } from '@form-engine/registry/components/codeBlock'
import { GovUKPagination } from '@form-engine-govuk-components/components'

/**
 * Components - Introduction
 *
 * Understanding the component system in form-engine.
 */
export const introStep = step({
  path: '/intro',
  title: 'Understanding Components',
  isEntryPoint: true,
  blocks: [
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <h1 class="govuk-heading-l">Components</h1>

        <p class="govuk-body-l">
          Components are the visual building blocks of forms. They render HTML from
          your form definitions, handling everything from simple text to complex
          interactive widgets.
        </p>

        <div class="govuk-inset-text">
          This section focuses on how components work under the hood and how to build your own.
          For a quick overview of using <code>block()</code> and <code>field()</code> in forms,
          see <a href="/forms/form-engine-developer-guide/blocks-and-fields/intro" class="govuk-link">Blocks & Fields</a>.
        </div>

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <h2 class="govuk-heading-m">Two Types of Components</h2>

        <p class="govuk-body">
          Form-engine distinguishes between two types of components:
        </p>

        <dl class="govuk-summary-list">
          <div class="govuk-summary-list__row">
            <dt class="govuk-summary-list__key">Blocks</dt>
            <dd class="govuk-summary-list__value">
              Display-only components that show content but don't collect data.
              Created with <code>block()</code>.
            </dd>
          </div>
          <div class="govuk-summary-list__row">
            <dt class="govuk-summary-list__key">Fields</dt>
            <dd class="govuk-summary-list__value">
              Input components that collect user data. Created with <code>field()</code>
              and require a <code>code</code> property to identify the answer.
            </dd>
          </div>
        </dl>
      `,
    }),

    // Block Example
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Using block()</h2>
        <p class="govuk-body">
          Blocks display content without collecting data. Common uses include headings,
          instructions, warnings, and navigation.
        </p>
        {{slot:code}}
      `,
      slots: {
        code: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `import { block } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { GovUKWarningText } from '@form-engine-govuk-components/components'

// Simple HTML content
block<HtmlBlock>({
  variant: 'html',
  content: '<h1 class="govuk-heading-l">Welcome</h1>',
})

// GOV.UK warning component
block<GovUKWarningText>({
  variant: 'govukWarningText',
  text: 'You could be fined if you do not register.',
})`,
          }),
        ],
      },
    }),

    // Field Example
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Using field()</h2>
        <p class="govuk-body">
          Fields collect user input. Every field needs a <code>code</code> which becomes
          the key for the answer in your form data.
        </p>
        {{slot:code}}
      `,
      slots: {
        code: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `import { field, validation, Self } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { GovUKTextInput, GovUKRadioInput } from '@form-engine-govuk-components/components'

// Text input
field<GovUKTextInput>({
  variant: 'govukTextInput',
  code: 'email',              // Answer stored as answers.email
  label: 'Email address',
  hint: 'We will use this to contact you',
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Enter your email address',
    }),
  ],
})

// Radio buttons
field<GovUKRadioInput>({
  variant: 'govukRadioInput',
  code: 'contactPreference',  // Answer stored as answers.contactPreference
  fieldset: {
    legend: { text: 'How should we contact you?' },
  },
  items: [
    { value: 'email', text: 'Email' },
    { value: 'phone', text: 'Phone' },
    { value: 'post', text: 'Post' },
  ],
})`,
          }),
        ],
      },
    }),

    // Component Architecture
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Component Architecture</h2>

        <p class="govuk-body">
          Each component consists of three parts:
        </p>

        <ol class="govuk-list govuk-list--number">
          <li>
            <strong>TypeScript interface</strong> &mdash; defines the component's properties
            and ensures type safety
          </li>
          <li>
            <strong>Renderer function</strong> &mdash; transforms the evaluated block data
            into template parameters
          </li>
          <li>
            <strong>Nunjucks template</strong> &mdash; generates the final HTML output
          </li>
        </ol>

        <p class="govuk-body">
          This separation allows the TypeScript layer to handle complex logic (data
          transformation, format conversion, conditional properties) while keeping
          templates simple and focused on presentation.
        </p>
      `,
    }),

    // Variant Property
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Common Properties</h2>
        <p class="govuk-body">All components share these properties:</p>
      `,
    }),

    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <h3 class="govuk-heading-s"><code>{{name}}</code> <span class="govuk-tag govuk-tag--red">Required</span></h3>
        <p class="govuk-body">
          Identifies which component to render. Must match the component's registered name.
        </p>
        {{slot:code}}
        <p class="govuk-body">
          The generic type parameter (e.g., <code>&lt;GovUKTextInput&gt;</code>) provides
          TypeScript autocomplete for that component's specific properties.
        </p>
      `,
      values: { name: 'variant' },
      slots: {
        code: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `// The variant tells form-engine which renderer to use
field<GovUKTextInput>({
  variant: 'govukTextInput',  // Must match registered component name
  code: 'name',
  label: 'Full name',
})

// Different variant = different component
field<GovUKTextareaInput>({
  variant: 'govukTextareaInput',
  code: 'description',
  label: 'Description',
  rows: 5,
})`,
          }),
        ],
      },
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
              labelText: 'Developer Guide Hub',
            },
            next: {
              href: '/forms/form-engine-developer-guide/components/built-in',
              labelText: 'Built-in Components',
            },
          }),
        ],
      },
    }),
  ],
})
