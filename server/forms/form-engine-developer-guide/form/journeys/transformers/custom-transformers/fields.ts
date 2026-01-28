import { TemplateWrapper } from '@form-engine/registry/components'
import { GovUKPagination } from '@form-engine-govuk-components/components'
import { CodeBlock } from '../../../../components'
import { parseGovUKMarkdown } from '../../../../helpers/markdown'

/**
 * Custom Transformers
 *
 * How to build, register, and use your own transformer functions.
 */
export const pageContent = TemplateWrapper({
  template: parseGovUKMarkdown(`
  # Building Custom Transformers

  While form-engine provides many built-in transformers, you may need transformation logic
  specific to your domain. Custom transformers let you define reusable value transformations
  that integrate seamlessly with the form-engine pipeline system. {.lead}

  ---

  ## When to Build Custom Transformers

  Create custom transformers when you need:

  - Domain-specific formatting (e.g., prison number normalisation, CRN formatting)
  - Complex data transformations that combine multiple operations
  - Integration with external formatting services
  - Reusable value pipelines across multiple forms

  ---

  ## Defining Custom Transformers

  Use \`defineTransformers()\` to create a set of transformer functions.
  Each transformer receives the field value as its first parameter and returns the transformed value.

  {{slot:defineCode}}

  ---

  ## Transformer Function Signature

  Every transformer function follows this pattern:

  {{slot:signatureCode}}

  ---

  ## Adding Type Safety with Assertions

  Use assertion utilities to validate input types and provide helpful error messages
  when transformers receive unexpected values. This matches how the built-in transformers work.

  {{slot:assertionsCode}}

  When an assertion fails, it throws an error with helpful context:

  {{slot:errorMessageCode}}

  ---

  ## Supporting Dynamic Arguments

  Transformer arguments can be static values or dynamic expressions like \`Answer()\`
  or \`Data()\`. The form-engine resolves expressions before passing values to
  your transformer function.

  {{slot:dynamicArgsCode}}

  ---

  ## Registering Custom Transformers

  After defining your transformers, register the registry with the form engine.
  This makes the transformer functions available at runtime.

  {{slot:registrationCode}}

  {{slot:appCode}}

  ---

  ## Using Custom Transformers in Forms

  Import and use your custom transformers in field \`formatters\` arrays
  or in \`.pipe()\` chains.

  {{slot:usageCode}}

  ---

  ## Async Transformers

  Transformers can return a \`Promise\` for async operations,
  such as API lookups or external formatting services.

  {{slot:asyncCode}}

  ---

  ## Organising Custom Transformers

  For larger projects, organise transformers by domain into separate files,
  then combine them into a single registry.

  {{slot:organiseCode}}

  ---

  ## Best Practices

  1. **Use assertions** — Always validate input types to catch
     configuration errors early with helpful messages.
  2. **Keep transformers pure** — Transformers should only transform
     values. Side effects belong in effects, not transformers.
  3. **Name descriptively** — Use verb prefixes like \`Normalise*\`,
     \`Format*\`, \`Extract*\`, \`Calculate*\` so the purpose is clear.
  4. **Return immutably** — Never modify the input value directly.
     Always return a new value.
  5. **Validate parameters too** — Use assertions on all parameters,
     not just the value. This catches misconfigured transformer arguments.
  6. **Compose small transformers** — Build small, focused transformers
     that do one thing well. Chain them in pipelines for complex transformations.

  ---

  ## Complete Example

  Here's a complete example of a custom transformer set for prisoner data:

  {{slot:completeExampleCode}}

  {{slot:completeUsageCode}}

  ---

  {{slot:pagination}}
`),
  slots: {
    defineCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          import { defineTransformers } from '@form-engine/registry/utils/createRegisterableFunction'
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
          })
        `,
      }),
    ],
    signatureCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          // Signature
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
          }
        `,
      }),
    ],
    assertionsCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          import { defineTransformers } from '@form-engine/registry/utils/createRegisterableFunction'
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
          // assertObject(value, functionName)  - ensures value is a plain object
        `,
      }),
    ],
    errorMessageCode: [
      CodeBlock({
        language: 'bash',
        code: `
          MyTransformers.FormatCurrency expects a number but received string.
          Add Transformer.String.ToInt() or Transformer.String.ToFloat() to the field configuration.
        `,
      }),
    ],
    dynamicArgsCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          import { ValueExpr } from '@form-engine/form/types/expressions.type'

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
          MyTransformers.MultiplyBy(Data('config.multiplier'))
        `,
      }),
    ],
    registrationCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          import { defineTransformers } from '@form-engine/registry/utils/createRegisterableFunction'

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
          })
        `,
      }),
    ],
    appCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          import FormEngine from '@form-engine/core/FormEngine'
          import { MyTransformersRegistry } from './transformers/myTransformers'
          import myFormJourney from './forms/myForm'

          const formEngine = new FormEngine({
            logger,
            basePath: '/forms',
            frameworkAdapter: /* ... */,
          })
            .registerFunctions(MyTransformersRegistry)  // Register your transformers
            .registerForm(myFormJourney)
        `,
      }),
    ],
    usageCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          import { validation, Self, Answer } from '@form-engine/form/builders'
          import { GovUKTextInput } from '@form-engine-govuk-components/components'
          import { Transformer } from '@form-engine/registry/transformers'
          import { MyTransformers } from './transformers/myTransformers'

          // In field formatters
          GovUKTextInput({
            code: 'prisonNumber',
            label: 'Prison number',
            hint: 'For example, A1234BC',
            formatters: [
              Transformer.String.Trim(),                    // Built-in transformer
              MyTransformers.NormalisePrisonNumber(),       // Custom transformer
            ],
          })

          // In .pipe() chains for computed values
          HtmlBlock({
            content: Format(
              '<p>Normalised: %1</p>',
              Answer('prisonNumber').pipe(MyTransformers.NormalisePrisonNumber())
            ),
          })
        `,
      }),
    ],
    asyncCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          import { defineTransformersWithDeps } from '@form-engine/registry/utils/createRegisterableFunction'
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
          // formEngine.registerFunctions(registry)
        `,
      }),
    ],
    organiseCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          // Import individual transformer sets (all using defineTransformers)
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
    ],
    completeExampleCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          import { defineTransformers } from '@form-engine/registry/utils/createRegisterableFunction'
          import { assertString } from '@form-engine/registry/utils/asserts'
          import { ValueExpr } from '@form-engine/form/types/expressions.type'

          /**
           * Custom transformers for prisoner-related data
           */
          export const { transformers: PrisonerTransformers, registry: PrisonerTransformersRegistry } =
            defineTransformers({
              /**
               * Normalises a prison number to standard format
               * @example "a 1234 bc" → "A1234BC"
               */
              NormalisePrisonNumber: value => {
                assertString(value, 'PrisonerTransformers.NormalisePrisonNumber')
                return value.replace(/\\s/g, '').toUpperCase()
              },

              /**
               * Normalises a PNC ID to standard format
               * @example "01 123456a" → "01/123456A"
               */
              NormalisePncId: value => {
                assertString(value, 'PrisonerTransformers.NormalisePncId')
                const cleaned = value.replace(/\\s/g, '').toUpperCase()
                if (cleaned.length >= 8 && !cleaned.includes('/')) {
                  return cleaned.slice(0, 2) + '/' + cleaned.slice(2)
                }
                return cleaned
              },

              /**
               * Masks a prison number for display
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
            })
        `,
      }),
    ],
    completeUsageCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          import { step, validation, Self, block, Format, Answer } from '@form-engine/form/builders'
          import { GovUKTextInput } from '@form-engine-govuk-components/components'
          import { Transformer } from '@form-engine/registry/transformers'
          import { PrisonerTransformers } from './transformers/prisonerTransformers'

          export const prisonerDetailsStep = step({
            path: '/prisoner-details',
            title: 'Prisoner Details',
            blocks: [
              GovUKTextInput({
                code: 'prisonNumber',
                label: 'Prison number',
                hint: 'For example, A1234BC',
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
            ],
          })`,
      }),
    ],
    pagination: [
      GovUKPagination({
        classes: 'govuk-pagination--inline',
        previous: {
          href: '/form-engine-developer-guide/transformers/intro',
          labelText: 'Transformers Reference',
        },
        next: {
          href: '/form-engine-developer-guide/transformers/playground/intro',
          labelText: 'Transformers Playground',
        },
      }),
    ],
  },
})
