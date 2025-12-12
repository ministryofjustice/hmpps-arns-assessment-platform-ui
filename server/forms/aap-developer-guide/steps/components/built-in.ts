import { step, block } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { CodeBlock } from '@form-engine/registry/components/codeBlock'
import { GovUKPagination } from '@form-engine-govuk-components/components'

/**
 * Components - Built-in Components
 *
 * Overview of the component packages available in form-engine.
 */
export const builtInStep = step({
  path: '/built-in',
  title: 'Built-in Components',
  blocks: [
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <h1 class="govuk-heading-l">Built-in Components</h1>

        <p class="govuk-body-l">
          Form-engine includes three component packages: Core components for framework
          functionality, GOV.UK components for government services, and MOJ components
          for Ministry of Justice patterns.
        </p>

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <h2 class="govuk-heading-m">Core Components</h2>

        <p class="govuk-body">
          Framework components for content rendering and layout.
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `import { HtmlBlock } from '@form-engine/registry/components/html'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { CodeBlock } from '@form-engine/registry/components/codeBlock'
import { CollectionBlock } from '@form-engine/registry/components/collectionBlock'`,
    }),

    block<HtmlBlock>({
      variant: 'html',
      content: `
        <table class="govuk-table">
          <thead class="govuk-table__head">
            <tr class="govuk-table__row">
              <th class="govuk-table__header">Component</th>
              <th class="govuk-table__header">Purpose</th>
            </tr>
          </thead>
          <tbody class="govuk-table__body">
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>HtmlBlock</code></td>
              <td class="govuk-table__cell">Render raw HTML content</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>TemplateWrapper</code></td>
              <td class="govuk-table__cell">Wrap blocks in HTML templates with slots</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>CodeBlock</code></td>
              <td class="govuk-table__cell">Display syntax-highlighted code</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>CollectionBlock</code></td>
              <td class="govuk-table__cell">Iterate over arrays to render repeated content</td>
            </tr>
          </tbody>
        </table>
      `,
    }),

    // GOV.UK Components
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">GOV.UK Components</h2>

        <p class="govuk-body">
          Components from the <a href="https://design-system.service.gov.uk/" class="govuk-link">GOV.UK Design System</a>.
          Use these for government services.
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `import {
  // Fields (collect input)
  GovUKTextInput,
  GovUKTextareaInput,
  GovUKRadioInput,
  GovUKCheckboxInput,
  GovUKCharacterCount,
  GovUKDateInputFull,
  GovUKDateInputYearMonth,
  GovUKDateInputMonthDay,

  // Blocks (display only)
  GovUKButton,
  GovUKLinkButton,
  GovUKDetails,
  GovUKPagination,
  GovUKWarningText,
} from '@form-engine-govuk-components/components'`,
    }),

    block<HtmlBlock>({
      variant: 'html',
      content: `
        <h3 class="govuk-heading-s">Field Components</h3>
        <table class="govuk-table">
          <thead class="govuk-table__head">
            <tr class="govuk-table__row">
              <th class="govuk-table__header">Component</th>
              <th class="govuk-table__header">Purpose</th>
            </tr>
          </thead>
          <tbody class="govuk-table__body">
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>GovUKTextInput</code></td>
              <td class="govuk-table__cell">Single-line text input</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>GovUKTextareaInput</code></td>
              <td class="govuk-table__cell">Multi-line text input</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>GovUKCharacterCount</code></td>
              <td class="govuk-table__cell">Textarea with character/word limit</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>GovUKRadioInput</code></td>
              <td class="govuk-table__cell">Radio button group (single selection)</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>GovUKCheckboxInput</code></td>
              <td class="govuk-table__cell">Checkbox group (multiple selection)</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>GovUKDateInputFull</code></td>
              <td class="govuk-table__cell">Day, month, year inputs</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>GovUKDateInputYearMonth</code></td>
              <td class="govuk-table__cell">Month and year only</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>GovUKDateInputMonthDay</code></td>
              <td class="govuk-table__cell">Month and day only</td>
            </tr>
          </tbody>
        </table>

        <h3 class="govuk-heading-s">Block Components</h3>
        <table class="govuk-table">
          <thead class="govuk-table__head">
            <tr class="govuk-table__row">
              <th class="govuk-table__header">Component</th>
              <th class="govuk-table__header">Purpose</th>
            </tr>
          </thead>
          <tbody class="govuk-table__body">
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>GovUKButton</code></td>
              <td class="govuk-table__cell">Submit or action button</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>GovUKLinkButton</code></td>
              <td class="govuk-table__cell">Button styled as a link</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>GovUKDetails</code></td>
              <td class="govuk-table__cell">Expandable details/summary</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>GovUKPagination</code></td>
              <td class="govuk-table__cell">Navigation pagination</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>GovUKWarningText</code></td>
              <td class="govuk-table__cell">Warning callout</td>
            </tr>
          </tbody>
        </table>
      `,
    }),

    // MOJ Components
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">MOJ Components</h2>

        <p class="govuk-body">
          Components from the <a href="https://design-patterns.service.justice.gov.uk/" class="govuk-link">MOJ Design Patterns</a>.
          Extended patterns for Ministry of Justice services.
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `import {
  MOJDatePicker,
  MOJCard,
  MOJCardGroup,
} from '@form-engine-moj-components/components'`,
    }),

    block<HtmlBlock>({
      variant: 'html',
      content: `
        <table class="govuk-table">
          <thead class="govuk-table__head">
            <tr class="govuk-table__row">
              <th class="govuk-table__header">Component</th>
              <th class="govuk-table__header">Type</th>
              <th class="govuk-table__header">Purpose</th>
            </tr>
          </thead>
          <tbody class="govuk-table__body">
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>MOJDatePicker</code></td>
              <td class="govuk-table__cell">Field</td>
              <td class="govuk-table__cell">Calendar date picker widget</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>MOJCard</code></td>
              <td class="govuk-table__cell">Block</td>
              <td class="govuk-table__cell">Card for displaying content</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>MOJCardGroup</code></td>
              <td class="govuk-table__cell">Block</td>
              <td class="govuk-table__cell">Group of cards</td>
            </tr>
          </tbody>
        </table>
      `,
    }),

    // Example Usage
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Example: Complete Form Step</h2>
        <p class="govuk-body">
          Here's a complete step using various built-in components together:
        </p>
        {{slot:code}}
      `,
      slots: {
        code: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `import { step, block, field, validation, Self, submitTransition, next } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { Transformer } from '@form-engine/registry/transformers'
import { HtmlBlock } from '@form-engine/registry/components/html'
import {
  GovUKTextInput,
  GovUKRadioInput,
  GovUKDateInputFull,
  GovUKButton,
} from '@form-engine-govuk-components/components'

export const contactStep = step({
  path: '/contact',
  title: 'Contact Details',
  blocks: [
    // Heading
    block<HtmlBlock>({
      variant: 'html',
      content: '<h1 class="govuk-heading-l">Contact Details</h1>',
    }),

    // Email field
    field<GovUKTextInput>({
      variant: 'govukTextInput',
      code: 'email',
      label: 'Email address',
      inputMode: 'email',
      formatters: [
        Transformer.String.Trim(),
        Transformer.String.ToLowerCase(),
      ],
      validate: [
        validation({
          when: Self().not.match(Condition.IsRequired()),
          message: 'Enter your email address',
        }),
        validation({
          when: Self().not.match(Condition.Email.IsValidEmail()),
          message: 'Enter a valid email address',
        }),
      ],
    }),

    // Contact preference
    field<GovUKRadioInput>({
      variant: 'govukRadioInput',
      code: 'contactPreference',
      fieldset: {
        legend: { text: 'How should we contact you?' },
      },
      items: [
        { value: 'email', text: 'Email' },
        { value: 'phone', text: 'Phone' },
      ],
      validate: [
        validation({
          when: Self().not.match(Condition.IsRequired()),
          message: 'Select how you want to be contacted',
        }),
      ],
    }),

    // Date of birth
    field<GovUKDateInputFull>({
      variant: 'govukDateInputFull',
      code: 'dateOfBirth',
      fieldset: {
        legend: { text: 'Date of birth' },
      },
      hint: 'For example, 31 3 1980',
      formatters: [
        Transformer.Object.ToISO({ year: 'year', month: 'month', day: 'day' }),
      ],
      validate: [
        validation({
          when: Self().not.match(Condition.IsRequired()),
          message: 'Enter your date of birth',
        }),
        validation({
          when: Self().not.match(Condition.Date.IsValid()),
          message: 'Date of birth must be a real date',
        }),
      ],
    }),

    // Submit button
    block<GovUKButton>({
      variant: 'govukButton',
      text: 'Continue',
    }),
  ],
  onSubmission: [
    submitTransition({
      validate: true,
      onValid: {
        next: [next({ goto: 'review' })],
      },
    }),
  ],
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
              href: '/forms/form-engine-developer-guide/components/intro',
              labelText: 'Understanding Components',
            },
            next: {
              href: '/forms/form-engine-developer-guide/components/custom',
              labelText: 'Custom Components',
            },
          }),
        ],
      },
    }),
  ],
})
