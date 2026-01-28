import { TemplateWrapper } from '@form-engine/registry/components'
import { GovUKPagination } from '@form-engine-govuk-components/components'
import { CodeBlock } from '../../../../components'
import { parseGovUKMarkdown } from '../../../../helpers/markdown'

/**
 * Custom Conditions
 *
 * How to build, register, and use your own condition functions.
 */
export const pageContent = TemplateWrapper({
  template: parseGovUKMarkdown(`
  # Building Custom Conditions

  While form-engine provides many built-in conditions, you may need validation logic
  specific to your domain. Custom conditions let you define reusable validation
  predicates that integrate seamlessly with the form-engine. {.lead}

  ---

  ## When to Build Custom Conditions

  Create custom conditions when you need:

  - Domain-specific validation (e.g., prison number format, CRN validation)
  - Complex logic that combines multiple checks
  - Integration with external validation services
  - Reusable predicates across multiple forms

  ---

  ## Defining Custom Conditions

  Use \`defineConditions()\` to create a set of condition functions.
  Each condition receives the field value as its first parameter and returns a boolean.

  {{slot:defineConditionsCode}}

  ---

  ## Condition Function Signature

  Every condition function follows this pattern:

  {{slot:signatureCode}}

  ---

  ## Adding Type Safety with Assertions

  Use assertion utilities to validate input types and provide helpful error messages
  when conditions receive unexpected values.

  {{slot:assertionsCode}}

  When an assertion fails, it throws an error with helpful context:

  {{slot:assertionErrorCode}}

  ---

  ## Supporting Dynamic Arguments

  Condition arguments can be static values or dynamic expressions like \`Answer()\`
  or \`Data()\`. The form-engine resolves expressions before passing values to
  your condition function.

  {{slot:dynamicArgsCode}}

  ---

  ## Registering Custom Conditions

  After defining your conditions, register the registry with the form engine.
  This makes the evaluator functions available at runtime.

  {{slot:registrationCode}}

  ---

  ## Using Custom Conditions in Forms

  Import and use your custom conditions just like the built-in ones.

  {{slot:usageCode}}

  ---

  ## Async Conditions

  Conditions can return a \`Promise<boolean>\` for async validation,
  such as API calls or database lookups.

  {{slot:asyncCode}}

  ---

  ## Organising Custom Conditions

  For larger projects, organise conditions by domain into separate files,
  then combine them into a single registry.

  {{slot:organisingCode}}

  ---

  ## Best Practices

  1. **Use assertions** — Always validate input types to catch
     configuration errors early with helpful messages.

  2. **Keep conditions pure** — Conditions should only test values
     and return booleans. Side effects belong in effects, not conditions.

  3. **Name descriptively** — Use \`Is*\`, \`Has*\`,
     or \`*Matches\` prefixes so conditions read naturally:
     \`Self().match(Condition.IsValidEmail())\`

  4. **Handle edge cases** — Consider null, undefined, empty strings,
     and wrong types. Return \`false\` rather than throwing for invalid input
     (unless using assertions for development-time feedback).

  5. **Document formats** — Add comments explaining expected formats,
     especially for domain-specific patterns like prison numbers or CRNs.

  6. **Test thoroughly** — Write unit tests covering valid cases,
     invalid cases, edge cases, and type errors.

  ---

  ## Complete Example

  Here's a complete example of a custom condition set for prisoner validation:

  {{slot:completeExampleCode}}

  {{slot:completeExampleUsageCode}}

  ---

  {{slot:pagination}}
`),
  slots: {
    defineConditionsCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          import { defineConditions } from '@form-engine/registry/utils/createRegisterableFunction'

          // Define your conditions
          export const { conditions: MyConditions, registry: MyConditionsRegistry } = defineConditions({
            // Simple condition - no extra parameters
            IsPrisonNumber: value => {
              if (typeof value !== 'string') return false
              // Prison number format: letter followed by 4 digits and 2 letters
              return /^[A-Z][0-9]{4}[A-Z]{2}$/i.test(value)
            },

            // Condition with parameters
            StartsWithPrefix: (value, prefix: string) => {
              if (typeof value !== 'string') return false
              if (typeof prefix !== 'string') return false
              return value.startsWith(prefix)
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
          (value: ValueExpr, ...args: ValueExpr[]) => boolean | Promise<boolean>

          // The first parameter is always the value being tested
          // Additional parameters are arguments passed to the condition
          // Can return a Promise for async validation

          // Examples:
          IsEmpty: value => value === '' || value === null || value === undefined

          HasLength: (value, length: number) => value.length === length

          Between: (value, min: number, max: number) => value >= min && value <= max
        `,
      }),
    ],
    assertionsCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          import { defineConditions } from '@form-engine/registry/utils/createRegisterableFunction'
          import { assertString, assertNumber } from '@form-engine/registry/utils/asserts'

          export const { conditions: MyConditions, registry: MyConditionsRegistry } = defineConditions({
            // With type assertions - throws helpful errors if types are wrong
            IsPrisonNumber: value => {
              assertString(value, 'MyConditions.IsPrisonNumber')
              return /^[A-Z][0-9]{4}[A-Z]{2}$/i.test(value)
            },

            HasMinimumAge: (value, minAge: number) => {
              assertNumber(value, 'MyConditions.HasMinimumAge')
              assertNumber(minAge, 'MyConditions.HasMinimumAge (minAge)')
              return value >= minAge
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
    assertionErrorCode: [
      CodeBlock({
        language: 'bash',
        code: `
          MyConditions.HasMinimumAge (minAge) expects a number but received string.
          Add Transformer.String.ToInt() or Transformer.String.ToFloat() to the field configuration.
        `,
      }),
    ],
    dynamicArgsCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          import { ValueExpr } from '@form-engine/form/types/expressions.type'

          export const { conditions: MyConditions, registry: MyConditionsRegistry } = defineConditions({
            // Type parameters as ValueExpr to support dynamic values
            IsGreaterThan: (value, threshold: number | ValueExpr) => {
              assertNumber(value, 'MyConditions.IsGreaterThan')
              assertNumber(threshold, 'MyConditions.IsGreaterThan (threshold)')
              return value > threshold
            },
          })

          // Usage with static value:
          MyConditions.IsGreaterThan(100)

          // Usage with dynamic value (resolved at runtime):
          MyConditions.IsGreaterThan(Answer('minimumValue'))
          MyConditions.IsGreaterThan(Data('config.threshold'))
        `,
      }),
    ],
    registrationCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          // conditions/myConditions.ts
          import { defineConditions } from '@form-engine/registry/utils/createRegisterableFunction'
          import { assertString } from '@form-engine/registry/utils/asserts'

          export const { conditions: MyConditions, registry: MyConditionsRegistry } = defineConditions({
            IsPrisonNumber: value => {
              assertString(value, 'MyConditions.IsPrisonNumber')
              return /^[A-Z][0-9]{4}[A-Z]{2}$/i.test(value)
            },
          })

          // app.ts
          import FormEngine from '@form-engine/core/FormEngine'
          import { MyConditionsRegistry } from './conditions/myConditions'

          const formEngine = new FormEngine({ /* ... */ })
            .registerFunctions(MyConditionsRegistry)
        `,
      }),
    ],
    usageCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          import { validation, Self } from '@form-engine/form/builders'
          import { GovUKTextInput } from '@form-engine-govuk-components/components'
          import { Condition } from '@form-engine/registry/conditions'
          import { MyConditions } from './conditions/myConditions'

          GovUKTextInput({
            code: 'prisonNumber',
            label: 'Prison number',
            hint: 'For example, A1234BC',
            validate: [
              // Use built-in conditions
              validation({
                when: Self().not.match(Condition.IsRequired()),
                message: 'Enter a prison number',
              }),

              // Use custom conditions
              validation({
                when: Self().not.match(MyConditions.IsPrisonNumber()),
                message: 'Enter a valid prison number',
              }),
            ],
          })
        `,
      }),
    ],
    asyncCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          import { defineConditionsWithDeps } from '@form-engine/registry/utils/createRegisterableFunction'
          import type { ValidationApiClient } from './services/validationApi'

          interface MyConditionsDeps {
            api: ValidationApiClient
          }

          export const { conditions: MyConditions, createRegistry: createMyConditionsRegistry } =
            defineConditionsWithDeps<MyConditionsDeps>()({
              // Async condition with dependency injection
              IsValidPostcode: deps => async (value: string) => {
                if (typeof value !== 'string') return false
                const result = await deps.api.validatePostcode(value)
                return result.isValid
              },

              // Check if prison number exists in system
              PrisonNumberExists: deps => async (value: string) => {
                if (typeof value !== 'string') return false
                const prisoner = await deps.api.lookupPrisoner(value)
                return prisoner !== null
              },
            })

          // In app.ts - create registry with real dependencies
          // const registry = createMyConditionsRegistry({ api: validationApiClient })
          // formEngine.registerFunctions(registry)
        `,
      }),
    ],
    organisingCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          // conditions/index.ts
          import { PrisonerConditions, PrisonerConditionsRegistry } from './prisonerConditions'
          import { AddressConditions, AddressConditionsRegistry } from './addressConditions'

          // Export combined conditions object for use in forms
          export const MyConditions = {
            Prisoner: PrisonerConditions,
            Address: AddressConditions,
          }

          // Export combined registry for registration
          export const MyConditionsRegistry = {
            ...PrisonerConditionsRegistry,
            ...AddressConditionsRegistry,
          }

          // Usage in forms:
          validation({
            when: Self().not.match(MyConditions.Prisoner.IsPrisonNumber()),
            message: 'Enter a valid prison number',
          })
        `,
      }),
    ],
    completeExampleCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          // conditions/prisonerConditions.ts
          import { defineConditions } from '@form-engine/registry/utils/createRegisterableFunction'
          import { assertString, assertNumber } from '@form-engine/registry/utils/asserts'
          import { ValueExpr } from '@form-engine/form/types/expressions.type'

          /**
           * Custom conditions for prisoner-related validation
           *
           * Formats:
           * - Prison Number: Letter + 4 digits + 2 letters (e.g., A1234BC)
           * - PNC ID: Year + area code + serial + check (e.g., 01/123456A)
           */
          export const { conditions: PrisonerConditions, registry: PrisonerConditionsRegistry } =
            defineConditions({
              IsPrisonNumber: value => {
                assertString(value, 'PrisonerConditions.IsPrisonNumber')
                return /^[A-Z][0-9]{4}[A-Z]{2}$/i.test(value.trim())
              },

              IsPncId: value => {
                assertString(value, 'PrisonerConditions.IsPncId')
                return /^[0-9]{2}\\/[0-9]{6}[A-Z]$/i.test(value.trim())
              },

              IsValidPrisonerAge: (value, min: number | ValueExpr = 18, max: number | ValueExpr = 120) => {
                assertNumber(value, 'PrisonerConditions.IsValidPrisonerAge')
                assertNumber(min, 'PrisonerConditions.IsValidPrisonerAge (min)')
                assertNumber(max, 'PrisonerConditions.IsValidPrisonerAge (max)')
                return Number.isInteger(value) && value >= min && value <= max
              },
            })
        `,
      }),
    ],
    completeExampleUsageCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          // Usage in a form step
          import { validation, Self } from '@form-engine/form/builders'
          import { GovUKTextInput } from '@form-engine-govuk-components/components'
          import { Condition } from '@form-engine/registry/conditions'
          import { PrisonerConditions } from './conditions/prisonerConditions'

          GovUKTextInput({
            code: 'prisonNumber',
            label: 'Prison number',
            hint: 'For example, A1234BC',
            classes: 'govuk-input--width-10',
            validate: [
              validation({
                when: Self().not.match(Condition.IsRequired()),
                message: 'Enter a prison number',
              }),
              validation({
                when: Self().not.match(PrisonerConditions.IsPrisonNumber()),
                message: 'Enter a valid prison number in the format A1234BC',
              }),
            ],
          })
        `,
      }),
    ],
    pagination: [
      GovUKPagination({
        classes: 'govuk-pagination--inline',
        previous: {
          href: '/form-engine-developer-guide/conditions/intro',
          labelText: 'Conditions Reference',
        },
        next: {
          href: '/form-engine-developer-guide/conditions/playground/intro',
          labelText: 'Conditions Playground',
        },
      }),
    ],
  },
})
