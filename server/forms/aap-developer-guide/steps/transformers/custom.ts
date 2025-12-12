import { step, block } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { CodeBlock } from '@form-engine/registry/components/codeBlock'
import { GovUKPagination } from '@form-engine-govuk-components/components'

/**
 * Custom Transformers
 *
 * How to build, register, and use your own transformer functions.
 */
export const customStep = step({
  path: '/custom',
  title: 'Custom Transformers',
  blocks: [
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <h1 class="govuk-heading-l">Building Custom Transformers</h1>

        <p class="govuk-body-l">
          While form-engine provides many built-in transformers, you may need transformation logic
          specific to your domain. Custom transformers let you define reusable value transformations
          that integrate seamlessly with the form-engine pipeline system.
        </p>

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <h2 class="govuk-heading-m">When to Build Custom Transformers</h2>

        <p class="govuk-body">
          Create custom transformers when you need:
        </p>

        <ul class="govuk-list govuk-list--bullet">
          <li>Domain-specific formatting (e.g., prison number normalisation, CRN formatting)</li>
          <li>Complex data transformations that combine multiple operations</li>
          <li>Integration with external formatting services</li>
          <li>Reusable value pipelines across multiple forms</li>
        </ul>
      `,
    }),

    // Defining Transformers Section
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Defining Custom Transformers</h2>
        <p class="govuk-body">
          Use <code>defineTransformers()</code> to create a set of transformer functions.
          Each transformer receives the field value as its first parameter and returns the transformed value.
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `import { defineTransformers } from '@form-engine/registry/utils/createRegisterableFunction'
import { assertString, assertNumber } from '@form-engine/registry/utils/asserts'

// Define your transformers
export const { transformers: MyTransformers, registry: MyTransformersRegistry } = defineTransformers({
  // Simple transformer - no extra parameters
  NormalisePrisonNumber: value => {
    assertString(value, 'MyTransformers.NormalisePrisonNumber')
    // Remove spaces and convert to uppercase
    return value.replace(/\\s/g, '').toUpperCase()
  },

  // Transformer with parameters
  TruncateWithSuffix: (value, maxLength: number, suffix: string = '...') => {
    assertString(value, 'MyTransformers.TruncateWithSuffix')
    assertNumber(maxLength, 'MyTransformers.TruncateWithSuffix (maxLength)')
    assertString(suffix, 'MyTransformers.TruncateWithSuffix (suffix)')
    if (value.length <= maxLength) return value
    return value.substring(0, maxLength - suffix.length) + suffix
  },
})`,
    }),

    // Function Signature Section
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Transformer Function Signature</h2>
        <p class="govuk-body">
          Every transformer function follows this pattern:
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `// Signature
(value: ValueExpr, ...args: ValueExpr[]) => ValueExpr | Promise<ValueExpr>

// The first parameter is always the value to transform
// Additional parameters are arguments passed to the transformer
// Can return a Promise for async transformations

// Examples:
ToUpperCase: value => {
  assertString(value, 'ToUpperCase')
  return value.toUpperCase()
}

Multiply: (value, factor: number) => {
  assertNumber(value, 'Multiply')
  assertNumber(factor, 'Multiply (factor)')
  return value * factor
}

Clamp: (value, min: number, max: number) => {
  assertNumber(value, 'Clamp')
  assertNumber(min, 'Clamp (min)')
  assertNumber(max, 'Clamp (max)')
  return Math.min(Math.max(value, min), max)
}`,
    }),

    // Type Safety Section
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Adding Type Safety with Assertions</h2>
        <p class="govuk-body">
          Use assertion utilities to validate input types and provide helpful error messages
          when transformers receive unexpected values. This matches how the built-in transformers work.
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `import { defineTransformers } from '@form-engine/registry/utils/createRegisterableFunction'
import { assertString, assertNumber } from '@form-engine/registry/utils/asserts'

export const { transformers: MyTransformers, registry: MyTransformersRegistry } = defineTransformers({
  // With type assertions - throws helpful errors if types are wrong
  NormalisePrisonNumber: value => {
    assertString(value, 'MyTransformers.NormalisePrisonNumber')
    return value.replace(/\\s/g, '').toUpperCase()
  },

  FormatCurrency: (value, currency: string = 'GBP') => {
    assertNumber(value, 'MyTransformers.FormatCurrency')
    assertString(currency, 'MyTransformers.FormatCurrency (currency)')

    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency,
    }).format(value)
  },
})

// Available assertion functions:
// assertString(value, functionName)  - ensures value is a string
// assertNumber(value, functionName)  - ensures value is a number (not NaN)
// assertArray(value, functionName)   - ensures value is an array
// assertDate(value, functionName)    - ensures value is a valid Date
// assertObject(value, functionName)  - ensures value is a plain object`,
    }),

    block<HtmlBlock>({
      variant: 'html',
      content: `
        <p class="govuk-body govuk-!-margin-top-4">
          When an assertion fails, it throws an error with helpful context:
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'bash',
      code: `MyTransformers.FormatCurrency expects a number but received string.
Add Transformer.String.ToInt() or Transformer.String.ToFloat() to the field configuration.`,
    }),

    // Dynamic Arguments Section
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Supporting Dynamic Arguments</h2>
        <p class="govuk-body">
          Transformer arguments can be static values or dynamic expressions like <code>Answer()</code>
          or <code>Data()</code>. The form-engine resolves expressions before passing values to
          your transformer function.
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `import { ValueExpr } from '@form-engine/form/types/expressions.type'

export const { transformers: MyTransformers, registry: MyTransformersRegistry } = defineTransformers({
  // Type parameters as ValueExpr to support dynamic values
  MultiplyBy: (value, factor: number | ValueExpr) => {
    if (typeof value !== 'number') return value
    if (typeof factor !== 'number') return value
    return value * factor
  },
})

// Usage with static value:
MyTransformers.MultiplyBy(1.2)

// Usage with dynamic value (resolved at runtime):
MyTransformers.MultiplyBy(Answer('taxRate'))
MyTransformers.MultiplyBy(Data('config.multiplier'))`,
    }),

    // Registration Section
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Registering Custom Transformers</h2>
        <p class="govuk-body">
          After defining your transformers, register the registry with the form engine.
          This makes the transformer functions available at runtime.
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      title: 'transformers/myTransformers.ts',
      code: `import { defineTransformers } from '@form-engine/registry/utils/createRegisterableFunction'

export const { transformers: MyTransformers, registry: MyTransformersRegistry } = defineTransformers({
  NormalisePrisonNumber: value => {
    if (typeof value !== 'string') return value
    return value.replace(/\\s/g, '').toUpperCase()
  },

  NormaliseCRN: value => {
    if (typeof value !== 'string') return value
    // CRN format: letter followed by 6 digits and optional check letter
    return value.replace(/\\s/g, '').toUpperCase()
  },
})`,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      title: 'app.ts',
      code: `import FormEngine from '@form-engine/core/FormEngine'
import { MyTransformersRegistry } from './transformers/myTransformers'
import myFormJourney from './forms/myForm'

const formEngine = new FormEngine({
  logger,
  basePath: '/forms',
  frameworkAdapter: /* ... */,
})
  .registerFunctions(MyTransformersRegistry)  // Register your transformers
  .registerForm(myFormJourney)`,
    }),

    // Using Custom Transformers Section
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Using Custom Transformers in Forms</h2>
        <p class="govuk-body">
          Import and use your custom transformers in field <code>formatters</code> arrays
          or in <code>.pipe()</code> chains.
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `import { field, validation, Self, Answer } from '@form-engine/form/builders'
import { GovUKTextInput } from '@form-engine-govuk-components/components'
import { Transformer } from '@form-engine/registry/transformers'
import { MyTransformers } from './transformers/myTransformers'

// In field formatters
field<GovUKTextInput>({
  variant: 'govukTextInput',
  code: 'prisonNumber',
  label: 'Prison number',
  hint: 'For example, A1234BC',
  formatters: [
    Transformer.String.Trim(),                    // Built-in transformer
    MyTransformers.NormalisePrisonNumber(),       // Custom transformer
  ],
})

// In .pipe() chains for computed values
block<HtmlBlock>({
  variant: 'html',
  content: Format(
    '<p>Normalised: %1</p>',
    Answer('prisonNumber').pipe(MyTransformers.NormalisePrisonNumber())
  ),
})`,
    }),

    // Async Transformers Section
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Async Transformers</h2>
        <p class="govuk-body">
          Transformers can return a <code>Promise</code> for async operations,
          such as API lookups or external formatting services.
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `import { defineTransformersWithDeps } from '@form-engine/registry/utils/createRegisterableFunction'
import type { AddressLookupClient } from './services/addressLookup'

interface MyTransformersDeps {
  addressLookup: AddressLookupClient
}

// Define transformers - no deps needed yet
export const { transformers: MyTransformers, createRegistry: createMyTransformersRegistry } =
  defineTransformersWithDeps<MyTransformersDeps>()({
    // Async transformer with dependency injection
    FormatPostcode: deps => async (value: string) => {
      if (typeof value !== 'string') return value
      const result = await deps.addressLookup.formatPostcode(value)
      return result.formatted
    },

    // Enrich with API data
    EnrichWithAddress: deps => async (postcode: string) => {
      if (typeof postcode !== 'string') return postcode
      const address = await deps.addressLookup.lookup(postcode)
      return address
    },
  })

// In app.ts - create registry with real dependencies
// const registry = createMyTransformersRegistry({ addressLookup: addressLookupClient })
// formEngine.registerFunctions(registry)`,
    }),

    // Organising Transformers Section
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Organising Custom Transformers</h2>
        <p class="govuk-body">
          For larger projects, organise transformers by domain into separate files,
          then combine them into a single registry.
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      title: 'transformers/index.ts (without dependencies)',
      code: `// Import individual transformer sets (all using defineTransformers)
import { PrisonerTransformers, PrisonerTransformersRegistry } from './prisonerTransformers'
import { AddressTransformers, AddressTransformersRegistry } from './addressTransformers'
import { CurrencyTransformers, CurrencyTransformersRegistry } from './currencyTransformers'

// Export combined transformers object for use in forms
export const MyTransformers = {
  Prisoner: PrisonerTransformers,
  Address: AddressTransformers,
  Currency: CurrencyTransformers,
}

// Export combined registry for registration
export const MyTransformersRegistry = {
  ...PrisonerTransformersRegistry,
  ...AddressTransformersRegistry,
  ...CurrencyTransformersRegistry,
}`,
    }),

    block<HtmlBlock>({
      variant: 'html',
      content: `
        <p class="govuk-body govuk-!-margin-top-4">
          When mixing transformers that need dependencies with those that don't, export a
          <code>createRegistry</code> function that accepts the required dependencies:
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      title: 'transformers/index.ts (with dependencies)',
      code: `// Some transformers use defineTransformers (no deps)
import { PrisonerTransformers, PrisonerTransformersRegistry } from './prisonerTransformers'
import { CurrencyTransformers, CurrencyTransformersRegistry } from './currencyTransformers'

// Some transformers use defineTransformersWithDeps (need deps)
import {
  ApiTransformers,
  createApiTransformersRegistry,
  type ApiTransformersDeps,
} from './apiTransformers'

// Export combined transformers object for use in forms
// (transformer builders don't need deps, so this is straightforward)
export const MyTransformers = {
  Prisoner: PrisonerTransformers,
  Currency: CurrencyTransformers,
  Api: ApiTransformers,
}

// Export a factory that creates the combined registry
// Call this at app startup with the required dependencies
export const createMyTransformersRegistry = (deps: ApiTransformersDeps) => ({
  ...PrisonerTransformersRegistry,        // No deps needed
  ...CurrencyTransformersRegistry,        // No deps needed
  ...createApiTransformersRegistry(deps), // Deps required
})

// Re-export the deps type for consumers
export type { ApiTransformersDeps as MyTransformersDeps }`,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      title: 'Usage in forms',
      code: `import { MyTransformers } from './transformers'

// Use namespaced transformers (same as before - no deps needed here)
formatters: [
  MyTransformers.Prisoner.NormalisePrisonNumber(),
  MyTransformers.Currency.FormatGBP(),
]`,
    }),

    // Best Practices Section
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Best Practices</h2>

        <ol class="govuk-list govuk-list--number">
          <li>
            <strong>Use assertions</strong> &mdash; Always validate input types to catch
            configuration errors early with helpful messages.
          </li>
          <li>
            <strong>Keep transformers pure</strong> &mdash; Transformers should only transform
            values. Side effects belong in effects, not transformers.
          </li>
          <li>
            <strong>Name descriptively</strong> &mdash; Use verb prefixes like <code>Normalise*</code>,
            <code>Format*</code>, <code>Extract*</code>, <code>Calculate*</code> so the purpose is clear.
          </li>
          <li>
            <strong>Return immutably</strong> &mdash; Never modify the input value directly.
            Always return a new value.
          </li>
          <li>
            <strong>Validate parameters too</strong> &mdash; Use assertions on all parameters,
            not just the value. This catches misconfigured transformer arguments.
          </li>
          <li>
            <strong>Compose small transformers</strong> &mdash; Build small, focused transformers
            that do one thing well. Chain them in pipelines for complex transformations.
          </li>
        </ol>
      `,
    }),

    // Complete Example Section
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Complete Example</h2>
        <p class="govuk-body">
          Here's a complete example of a custom transformer set for prisoner data:
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      title: 'transformers/prisonerTransformers.ts',
      code: `import { defineTransformers } from '@form-engine/registry/utils/createRegisterableFunction'
import { assertString } from '@form-engine/registry/utils/asserts'
import { ValueExpr } from '@form-engine/form/types/expressions.type'

/**
 * Custom transformers for prisoner-related data
 *
 * Formats:
 * - Prison Number: Letter + 4 digits + 2 letters (e.g., A1234BC)
 * - NOMS Number: Same as prison number
 * - PNC ID: Year + area code + serial + check (e.g., 01/123456A)
 */
export const { transformers: PrisonerTransformers, registry: PrisonerTransformersRegistry } =
  defineTransformers({
    /**
     * Normalises a prison number to standard format
     * - Removes whitespace
     * - Converts to uppercase
     * @example "a 1234 bc" → "A1234BC"
     */
    NormalisePrisonNumber: value => {
      assertString(value, 'PrisonerTransformers.NormalisePrisonNumber')
      return value.replace(/\\s/g, '').toUpperCase()
    },

    /**
     * Normalises a PNC ID to standard format
     * - Removes extra whitespace
     * - Converts to uppercase
     * - Ensures slash separator
     * @example "01 123456a" → "01/123456A"
     */
    NormalisePncId: value => {
      assertString(value, 'PrisonerTransformers.NormalisePncId')
      const cleaned = value.replace(/\\s/g, '').toUpperCase()
      // Ensure proper slash format
      if (cleaned.length >= 8 && !cleaned.includes('/')) {
        return cleaned.slice(0, 2) + '/' + cleaned.slice(2)
      }
      return cleaned
    },

    /**
     * Masks a prison number for display
     * Shows only the first letter and last two letters
     * @example "A1234BC" → "A****BC"
     */
    MaskPrisonNumber: (value, maskChar: string | ValueExpr = '*') => {
      assertString(value, 'PrisonerTransformers.MaskPrisonNumber')
      assertString(maskChar, 'PrisonerTransformers.MaskPrisonNumber (maskChar)')
      if (value.length < 3) return value
      const first = value.charAt(0)
      const last = value.slice(-2)
      const middle = maskChar.repeat(value.length - 3)
      return first + middle + last
    },
  })`,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      title: 'Usage in a form step',
      code: `import { step, field, validation, Self, block, Format, Answer } from '@form-engine/form/builders'
import { GovUKTextInput } from '@form-engine-govuk-components/components'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { Condition } from '@form-engine/registry/conditions'
import { Transformer } from '@form-engine/registry/transformers'
import { PrisonerTransformers } from './transformers/prisonerTransformers'

export const prisonerDetailsStep = step({
  path: '/prisoner-details',
  title: 'Prisoner Details',
  blocks: [
    field<GovUKTextInput>({
      variant: 'govukTextInput',
      code: 'prisonNumber',
      label: 'Prison number',
      hint: 'For example, A1234BC',
      classes: 'govuk-input--width-10',
      formatters: [
        Transformer.String.Trim(),
        PrisonerTransformers.NormalisePrisonNumber(),
      ],
      validate: [
        validation({
          when: Self().not.match(Condition.IsRequired()),
          message: 'Enter a prison number',
        }),
      ],
    }),

    field<GovUKTextInput>({
      variant: 'govukTextInput',
      code: 'pncId',
      label: 'PNC ID (optional)',
      hint: 'For example, 01/123456A',
      classes: 'govuk-input--width-10',
      formatters: [
        Transformer.String.Trim(),
        PrisonerTransformers.NormalisePncId(),
      ],
    }),

    // Display masked version
    block<HtmlBlock>({
      variant: 'html',
      content: Format(
        '<p class="govuk-body">Masked: %1</p>',
        Answer('prisonNumber').pipe(PrisonerTransformers.MaskPrisonNumber())
      ),
    }),
  ],
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
              href: '/forms/form-engine-developer-guide/transformers/intro',
              labelText: 'Transformers Reference',
            },
            next: {
              href: '/forms/form-engine-developer-guide/transformers/playground/intro',
              labelText: 'Transformers Playground',
            },
          }),
        ],
      },
    }),
  ],
})
