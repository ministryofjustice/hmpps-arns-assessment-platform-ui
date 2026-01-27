import { TemplateWrapper } from '@form-engine/registry/components'
import { GovUKPagination } from '@form-engine-govuk-components/components'
import { CodeBlock } from '../../../../components'
import { parseGovUKMarkdown } from '../../../../helpers/markdown'

/**
 * Components - Extending Components
 *
 * How to extend and wrap existing components without forking.
 */
export const pageContent = TemplateWrapper({
  template: parseGovUKMarkdown(`
# Extending Components

Sometimes you need a component that's *almost* like an existing one,
but with different defaults, additional preprocessing, or modified behaviour.
Instead of copying and modifying, you can wrap the existing renderer. {.lead}

---

## The Wrapper Pattern

The renderer pattern enables composition — create a new component that
delegates to an existing renderer after applying your modifications:

1. Define a new interface extending the original
2. Create a renderer that modifies the block
3. Delegate to the original renderer

---

## Example: Adding Default Values

Create a text input with sensible defaults for phone numbers:

{{slot:wrapperExample}}

Now you have a cleaner API for phone number fields:

{{slot:usageExample}}

---

## Example: Data Transformation

Wrap a component to transform data before rendering. This is how the
MOJ Date Picker handles ISO dates — it converts them to UK format
for display:

{{slot:transformExample}}

---

## Example: Adding New Properties

Extend a component with new properties that affect rendering:

{{slot:extendExample}}

---

## Best Practices

| Practice | Description |
|----------|-------------|
| **Prefer wrapping over forking** | Wrapping keeps you on the upgrade path for the original component. When it gets bug fixes or improvements, your wrapper benefits automatically. |
| **Keep wrappers thin** | Wrappers should only modify what's necessary. Complex logic suggests you might need a custom component instead. |
| **Document the differences** | Make it clear what your wrapped component does differently from the original. Future maintainers will thank you. |
| **Consider upstream contributions** | If your modification would benefit everyone, consider contributing it back to the original component instead of wrapping. |

---

## When to Use Each Approach

| Scenario | Approach |
|----------|----------|
| Different defaults only | **Wrapper** — minimal code |
| Data format conversion | **Wrapper** — transform and delegate |
| Add new properties that map to existing ones | **Wrapper** — extend interface |
| Completely different HTML structure | **Custom component** — new template needed |
| Different validation/behaviour logic | **Custom component** — too different to wrap |

---

{{slot:pagination}}
`),
  slots: {
    wrapperExample: [
      CodeBlock({
        language: 'typescript',
        code: `// phoneNumberInput.ts
import type nunjucks from 'nunjucks'
import { buildNunjucksComponent } from '@form-engine-govuk-components/internal/buildNunjucksComponent'
import { EvaluatedBlock } from '@form-engine/form/types/structures.type'

// Import the original component's renderer
import { GovUKTextInput, textInputRenderer } from '@form-engine-govuk-components/components/text-input'

// Extend the original interface (or just re-use it)
export interface PhoneNumberInput extends GovUKTextInput {
  variant: 'phoneNumberInput'
}

// Wrapper renderer
async function phoneNumberInputRenderer(
  block: EvaluatedBlock<PhoneNumberInput>,
  nunjucksEnv: nunjucks.Environment,
): Promise<string> {
  // Apply defaults and modifications
  const modifiedBlock = {
    ...block,
    inputMode: block.inputMode ?? 'tel',
    autocomplete: block.autocomplete ?? 'tel',
    hint: block.hint ?? 'For example, 07700 900123',
    classes: \`\${block.classes ?? ''} govuk-input--width-20\`.trim(),
  }

  // Delegate to original renderer
  return textInputRenderer(modifiedBlock as EvaluatedBlock<GovUKTextInput>, nunjucksEnv)
}

export const phoneNumberInput = buildNunjucksComponent<PhoneNumberInput>(
  'phoneNumberInput',
  phoneNumberInputRenderer
)`,
      }),
    ],
    usageExample: [
      CodeBlock({
        language: 'typescript',
        code: `// Before: Repetitive configuration
GovUKTextInput({
  code: 'phone',
  label: 'Phone number',
  inputMode: 'tel',
  autocomplete: 'tel',
  hint: 'For example, 07700 900123',
  classes: 'govuk-input--width-20',
})

// After: Clean, semantic API
PhoneNumberInput({
  code: 'phone',
  label: 'Phone number',
})`,
      }),
    ],
    transformExample: [
      CodeBlock({
        language: 'typescript',
        code: `// smartDatePicker.ts
import type nunjucks from 'nunjucks'
import { buildNunjucksComponent } from '@form-engine-moj-components/internal/buildNunjucksComponent'
import { EvaluatedBlock } from '@form-engine/form/types/structures.type'
import { MOJDatePicker, datePickerRenderer } from '@form-engine-moj-components/components/date-picker'

export interface SmartDatePicker extends MOJDatePicker {
  variant: 'smartDatePicker'
}

// Convert ISO format (YYYY-MM-DD) to UK format (DD/MM/YYYY)
function isoToUkFormat(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined

  const match = value.match(/^(\\d{4})-(\\d{2})-(\\d{2})$/)
  if (match) {
    return \`\${match[3]}/\${match[2]}/\${match[1]}\`
  }

  return value
}

async function smartDatePickerRenderer(
  block: EvaluatedBlock<SmartDatePicker>,
  nunjucksEnv: nunjucks.Environment,
): Promise<string> {
  // Transform the value before passing to original renderer
  const modifiedBlock = {
    ...block,
    value: isoToUkFormat(block.value),
  }

  return datePickerRenderer(modifiedBlock as EvaluatedBlock<MOJDatePicker>, nunjucksEnv)
}

export const smartDatePicker = buildNunjucksComponent<SmartDatePicker>(
  'smartDatePicker',
  smartDatePickerRenderer
)`,
      }),
    ],
    extendExample: [
      CodeBlock({
        language: 'typescript',
        code: `// enhancedTextInput.ts
import type nunjucks from 'nunjucks'
import { buildNunjucksComponent } from '@form-engine-govuk-components/internal/buildNunjucksComponent'
import { EvaluatedBlock, ConditionalString } from '@form-engine/form/types/structures.type'
import { GovUKTextInput, textInputRenderer } from '@form-engine-govuk-components/components/text-input'

// Extend with new properties
export interface EnhancedTextInput extends GovUKTextInput {
  variant: 'enhancedTextInput'

  /** Show a character counter */
  showCharacterCount?: boolean

  /** Maximum characters (enables counter automatically) */
  maxChars?: number

  /** Icon to show before the input */
  prefixIcon?: 'search' | 'email' | 'phone'
}

async function enhancedTextInputRenderer(
  block: EvaluatedBlock<EnhancedTextInput>,
  nunjucksEnv: nunjucks.Environment,
): Promise<string> {
  // Map new properties to existing ones
  const prefixMap = {
    search: { html: '<span class="icon-search"></span>' },
    email: { html: '<span class="icon-email"></span>' },
    phone: { html: '<span class="icon-phone"></span>' },
  }

  const modifiedBlock = {
    ...block,
    prefix: block.prefixIcon ? prefixMap[block.prefixIcon] : block.prefix,
    // Add character count class if needed
    classes: block.maxChars
      ? \`\${block.classes ?? ''} js-character-count\`.trim()
      : block.classes,
    attributes: block.maxChars
      ? { ...block.attributes, 'data-maxlength': String(block.maxChars) }
      : block.attributes,
  }

  return textInputRenderer(modifiedBlock as EvaluatedBlock<GovUKTextInput>, nunjucksEnv)
}

export const enhancedTextInput = buildNunjucksComponent<EnhancedTextInput>(
  'enhancedTextInput',
  enhancedTextInputRenderer
)`,
      }),
    ],
    pagination: [
      GovUKPagination({
        classes: 'govuk-pagination--inline',
        previous: {
          href: '/form-engine-developer-guide/components/custom',
          labelText: 'Custom Components',
        },
        next: {
          href: '/form-engine-developer-guide/hub',
          labelText: 'Developer Guide Hub',
        },
      }),
    ],
  },
})
