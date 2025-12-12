import { step, block } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { CodeBlock } from '@form-engine/registry/components/codeBlock'
import { GovUKPagination } from '@form-engine-govuk-components/components'

/**
 * Components - Extending Components
 *
 * How to extend and wrap existing components without forking.
 */
export const extendingStep = step({
  path: '/extending',
  title: 'Extending Components',
  blocks: [
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <h1 class="govuk-heading-l">Extending Components</h1>

        <p class="govuk-body-l">
          Sometimes you need a component that's <em>almost</em> like an existing one,
          but with different defaults, additional preprocessing, or modified behaviour.
          Instead of copying and modifying, you can wrap the existing renderer.
        </p>

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <h2 class="govuk-heading-m">The Wrapper Pattern</h2>

        <p class="govuk-body">
          The renderer pattern enables composition &mdash; create a new component that
          delegates to an existing renderer after applying your modifications:
        </p>

        <ol class="govuk-list govuk-list--number">
          <li>Define a new interface extending the original</li>
          <li>Create a renderer that modifies the block</li>
          <li>Delegate to the original renderer</li>
        </ol>
      `,
    }),

    // Basic Wrapper Example
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Example: Adding Default Values</h2>
        <p class="govuk-body">
          Create a text input with sensible defaults for phone numbers:
        </p>
        {{slot:code}}
      `,
      slots: {
        code: [
          block<CodeBlock>({
            variant: 'codeBlock',
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
      },
    }),

    // Usage
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <p class="govuk-body">
          Now you have a cleaner API for phone number fields:
        </p>
        {{slot:code}}
      `,
      slots: {
        code: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `// Before: Repetitive configuration
field<GovUKTextInput>({
  variant: 'govukTextInput',
  code: 'phone',
  label: 'Phone number',
  inputMode: 'tel',
  autocomplete: 'tel',
  hint: 'For example, 07700 900123',
  classes: 'govuk-input--width-20',
})

// After: Clean, semantic API
field<PhoneNumberInput>({
  variant: 'phoneNumberInput',
  code: 'phone',
  label: 'Phone number',
})`,
          }),
        ],
      },
    }),

    // Data Transformation Wrapper
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Example: Data Transformation</h2>
        <p class="govuk-body">
          Wrap a component to transform data before rendering. This is how the
          MOJ Date Picker handles ISO dates &mdash; it converts them to UK format
          for display:
        </p>
        {{slot:code}}
      `,
      slots: {
        code: [
          block<CodeBlock>({
            variant: 'codeBlock',
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
      },
    }),

    // Adding Properties
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Example: Adding New Properties</h2>
        <p class="govuk-body">
          Extend a component with new properties that affect rendering:
        </p>
        {{slot:code}}
      `,
      slots: {
        code: [
          block<CodeBlock>({
            variant: 'codeBlock',
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
      },
    }),

    // Best Practices
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Best Practices</h2>

        <dl class="govuk-summary-list">
          <div class="govuk-summary-list__row">
            <dt class="govuk-summary-list__key">Prefer wrapping over forking</dt>
            <dd class="govuk-summary-list__value">
              Wrapping keeps you on the upgrade path for the original component.
              When it gets bug fixes or improvements, your wrapper benefits automatically.
            </dd>
          </div>
          <div class="govuk-summary-list__row">
            <dt class="govuk-summary-list__key">Keep wrappers thin</dt>
            <dd class="govuk-summary-list__value">
              Wrappers should only modify what's necessary. Complex logic suggests
              you might need a custom component instead.
            </dd>
          </div>
          <div class="govuk-summary-list__row">
            <dt class="govuk-summary-list__key">Document the differences</dt>
            <dd class="govuk-summary-list__value">
              Make it clear what your wrapped component does differently from
              the original. Future maintainers will thank you.
            </dd>
          </div>
          <div class="govuk-summary-list__row">
            <dt class="govuk-summary-list__key">Consider upstream contributions</dt>
            <dd class="govuk-summary-list__value">
              If your modification would benefit everyone, consider contributing
              it back to the original component instead of wrapping.
            </dd>
          </div>
        </dl>
      `,
    }),

    // When to use each approach
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">When to Use Each Approach</h2>

        <table class="govuk-table">
          <thead class="govuk-table__head">
            <tr class="govuk-table__row">
              <th class="govuk-table__header">Scenario</th>
              <th class="govuk-table__header">Approach</th>
            </tr>
          </thead>
          <tbody class="govuk-table__body">
            <tr class="govuk-table__row">
              <td class="govuk-table__cell">Different defaults only</td>
              <td class="govuk-table__cell"><strong>Wrapper</strong> &mdash; minimal code</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell">Data format conversion</td>
              <td class="govuk-table__cell"><strong>Wrapper</strong> &mdash; transform and delegate</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell">Add new properties that map to existing ones</td>
              <td class="govuk-table__cell"><strong>Wrapper</strong> &mdash; extend interface</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell">Completely different HTML structure</td>
              <td class="govuk-table__cell"><strong>Custom component</strong> &mdash; new template needed</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell">Different validation/behaviour logic</td>
              <td class="govuk-table__cell"><strong>Custom component</strong> &mdash; too different to wrap</td>
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
      `,
      slots: {
        pagination: [
          block<GovUKPagination>({
            variant: 'govukPagination',
            classes: 'govuk-pagination--inline',
            previous: {
              href: '/forms/form-engine-developer-guide/components/custom',
              labelText: 'Custom Components',
            },
            next: {
              href: '/forms/form-engine-developer-guide/hub',
              labelText: 'Developer Guide Hub',
            },
          }),
        ],
      },
    }),
  ],
})
