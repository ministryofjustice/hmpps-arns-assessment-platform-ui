import { block } from '@form-engine/form/builders'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { GovUKDetails, GovUKPagination } from '@form-engine-govuk-components/components'
import { CodeBlock } from '../../../../components/code-block/codeBlock'
import { parseGovUKMarkdown } from '../../../../helpers/markdown'

/**
 * Components - Built-in Components
 *
 * Overview of the component packages available in form-engine.
 */
export const pageContent = block<TemplateWrapper>({
  variant: 'templateWrapper',
  template: parseGovUKMarkdown(`
# Built-in Components

Form-engine includes three component packages: Core components for framework
functionality, GOV.UK components for government services, and MOJ components
for Ministry of Justice patterns. {.lead}

---

## Core Components

Framework components for content rendering and layout.

{{slot:coreImport}}

| Component | Purpose |
|-----------|---------|
| \`HtmlBlock\` | Render raw HTML content |
| \`TemplateWrapper\` | Wrap blocks in HTML templates with slots |
| \`CodeBlock\` | Display syntax-highlighted code |
| \`CollectionBlock\` | Iterate over arrays to render repeated content |

---

## GOV.UK Components

Components from the [GOV.UK Design System](https://design-system.service.gov.uk/).
Use these for government services.

{{slot:govukImport}}

### Field Components

| Component | Purpose |
|-----------|---------|
| \`GovUKTextInput\` | Single-line text input |
| \`GovUKTextareaInput\` | Multi-line text input |
| \`GovUKCharacterCount\` | Textarea with character/word limit |
| \`GovUKRadioInput\` | Radio button group (single selection) |
| \`GovUKCheckboxInput\` | Checkbox group (multiple selection) |
| \`GovUKDateInputFull\` | Day, month, year inputs |
| \`GovUKDateInputYearMonth\` | Month and year only |
| \`GovUKDateInputMonthDay\` | Month and day only |

### Block Components

| Component | Purpose |
|-----------|---------|
| \`GovUKButton\` | Submit or action button |
| \`GovUKLinkButton\` | Button styled as a link |
| \`GovUKDetails\` | Expandable details/summary |
| \`GovUKPagination\` | Navigation pagination |
| \`GovUKWarningText\` | Warning callout |

---

## MOJ Components

Components from the [MOJ Design Patterns](https://design-patterns.service.justice.gov.uk/).
Extended patterns for Ministry of Justice services.

{{slot:mojImport}}

| Component | Type | Purpose |
|-----------|------|---------|
| \`MOJDatePicker\` | Field | Calendar date picker widget |
| \`MOJCard\` | Block | Card for displaying content |
| \`MOJCardGroup\` | Block | Group of cards |

---

## Example: Complete Form Step

Here's a complete step using various built-in components together:

{{slot:completeExample}}

---

{{slot:pagination}}
`),
  slots: {
    coreImport: [
      block<CodeBlock>({
        variant: 'codeBlock',
        language: 'typescript',
        code: `import { HtmlBlock } from '@form-engine/registry/components/html'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { CodeBlock } from '../../../components/codeBlock'
import { CollectionBlock } from '@form-engine/registry/components/collectionBlock'`,
      }),
    ],
    govukImport: [
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
    ],
    mojImport: [
      block<CodeBlock>({
        variant: 'codeBlock',
        language: 'typescript',
        code: `import {
  MOJDatePicker,
  MOJCard,
  MOJCardGroup,
} from '@form-engine-moj-components/components'`,
      }),
    ],
    completeExample: [
      block<GovUKDetails>({
        variant: 'govukDetails',
        summaryText: 'View complete example',
        content: [
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
      }),
    ],
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
})
