import { step, block } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { CodeBlock } from '@form-engine/registry/components/codeBlock'
import { GovUKPagination } from '@form-engine-govuk-components/components'

/**
 * Custom Conditions
 *
 * How to build, register, and use your own condition functions.
 */
export const customStep = step({
  path: '/custom',
  title: 'Custom Conditions',
  blocks: [
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <h1 class="govuk-heading-l">Building Custom Conditions</h1>

        <p class="govuk-body-l">
          While form-engine provides many built-in conditions, you may need validation logic
          specific to your domain. Custom conditions let you define reusable validation
          predicates that integrate seamlessly with the form-engine.
        </p>

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <h2 class="govuk-heading-m">When to Build Custom Conditions</h2>

        <p class="govuk-body">
          Create custom conditions when you need:
        </p>

        <ul class="govuk-list govuk-list--bullet">
          <li>Domain-specific validation (e.g., prison number format, CRN validation)</li>
          <li>Complex logic that combines multiple checks</li>
          <li>Integration with external validation services</li>
          <li>Reusable predicates across multiple forms</li>
        </ul>
      `,
    }),

    // Defining Conditions Section
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Defining Custom Conditions</h2>
        <p class="govuk-body">
          Use <code>defineConditions()</code> to create a set of condition functions.
          Each condition receives the field value as its first parameter and returns a boolean.
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `import { defineConditions } from '@form-engine/registry/utils/createRegisterableFunction'

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
})`,
    }),

    // Function Signature Section
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Condition Function Signature</h2>
        <p class="govuk-body">
          Every condition function follows this pattern:
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `// Signature
(value: ValueExpr, ...args: ValueExpr[]) => boolean | Promise<boolean>

// The first parameter is always the value being tested
// Additional parameters are arguments passed to the condition
// Can return a Promise for async validation

// Examples:
IsEmpty: value => value === '' || value === null || value === undefined

HasLength: (value, length: number) => value.length === length

Between: (value, min: number, max: number) => value >= min && value <= max`,
    }),

    // Type Safety Section
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Adding Type Safety with Assertions</h2>
        <p class="govuk-body">
          Use assertion utilities to validate input types and provide helpful error messages
          when conditions receive unexpected values.
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `import { defineConditions } from '@form-engine/registry/utils/createRegisterableFunction'
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
      code: `MyConditions.HasMinimumAge (minAge) expects a number but received string.
Add Transformer.String.ToInt() or Transformer.String.ToFloat() to the field configuration.`,
    }),

    // Dynamic Arguments Section
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Supporting Dynamic Arguments</h2>
        <p class="govuk-body">
          Condition arguments can be static values or dynamic expressions like <code>Answer()</code>
          or <code>Data()</code>. The form-engine resolves expressions before passing values to
          your condition function.
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `import { ValueExpr } from '@form-engine/form/types/expressions.type'

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
MyConditions.IsGreaterThan(Data('config.threshold'))`,
    }),

    // Registration Section
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Registering Custom Conditions</h2>
        <p class="govuk-body">
          After defining your conditions, register the registry with the form engine.
          This makes the evaluator functions available at runtime.
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      title: 'conditions/myConditions.ts',
      code: `import { defineConditions } from '@form-engine/registry/utils/createRegisterableFunction'
import { assertString } from '@form-engine/registry/utils/asserts'

export const { conditions: MyConditions, registry: MyConditionsRegistry } = defineConditions({
  IsPrisonNumber: value => {
    assertString(value, 'MyConditions.IsPrisonNumber')
    return /^[A-Z][0-9]{4}[A-Z]{2}$/i.test(value)
  },

  IsCRN: value => {
    assertString(value, 'MyConditions.IsCRN')
    // CRN format: letter followed by 6 digits and optional check letter
    return /^[A-Z][0-9]{6}[A-Z]?$/i.test(value)
  },
})`,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      title: 'app.ts',
      code: `import FormEngine from '@form-engine/core/FormEngine'
import { MyConditionsRegistry } from './conditions/myConditions'
import myFormJourney from './forms/myForm'

const formEngine = new FormEngine({
  logger,
  basePath: '/forms',
  frameworkAdapter: /* ... */,
})
  .registerFunctions(MyConditionsRegistry)  // Register your conditions
  .registerForm(myFormJourney)`,
    }),

    // Using Custom Conditions Section
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Using Custom Conditions in Forms</h2>
        <p class="govuk-body">
          Import and use your custom conditions just like the built-in ones.
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `import { field, validation, Self } from '@form-engine/form/builders'
import { GovUKTextInput } from '@form-engine-govuk-components/components'
import { Condition } from '@form-engine/registry/conditions'
import { MyConditions } from './conditions/myConditions'

field<GovUKTextInput>({
  variant: 'govukTextInput',
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
})`,
    }),

    // Async Conditions Section
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Async Conditions</h2>
        <p class="govuk-body">
          Conditions can return a <code>Promise&lt;boolean&gt;</code> for async validation,
          such as API calls or database lookups.
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `import { defineConditionsWithDeps } from '@form-engine/registry/utils/createRegisterableFunction'
import type { ValidationApiClient } from './services/validationApi'

interface MyConditionsDeps {
  api: ValidationApiClient
}

// Define conditions - no deps needed yet
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
// formEngine.registerFunctions(registry)`,
    }),

    // Organising Conditions Section
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Organising Custom Conditions</h2>
        <p class="govuk-body">
          For larger projects, organise conditions by domain into separate files,
          then combine them into a single registry.
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      title: 'conditions/index.ts (without dependencies)',
      code: `// Import individual condition sets (all using defineConditions)
import { PrisonerConditions, PrisonerConditionsRegistry } from './prisonerConditions'
import { AddressConditions, AddressConditionsRegistry } from './addressConditions'
import { AssessmentConditions, AssessmentConditionsRegistry } from './assessmentConditions'

// Export combined conditions object for use in forms
export const MyConditions = {
  Prisoner: PrisonerConditions,
  Address: AddressConditions,
  Assessment: AssessmentConditions,
}

// Export combined registry for registration
export const MyConditionsRegistry = {
  ...PrisonerConditionsRegistry,
  ...AddressConditionsRegistry,
  ...AssessmentConditionsRegistry,
}`,
    }),

    block<HtmlBlock>({
      variant: 'html',
      content: `
        <p class="govuk-body govuk-!-margin-top-4">
          When mixing conditions that need dependencies with those that don't, export a
          <code>createRegistry</code> function that accepts the required dependencies:
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      title: 'conditions/index.ts (with dependencies)',
      code: `// Some conditions use defineConditions (no deps)
import { PrisonerConditions, PrisonerConditionsRegistry } from './prisonerConditions'
import { AddressConditions, AddressConditionsRegistry } from './addressConditions'

// Some conditions use defineConditionsWithDeps (need deps)
import {
  ApiConditions,
  createApiConditionsRegistry,
  type ApiConditionsDeps,
} from './apiConditions'

// Export combined conditions object for use in forms
// (conditions builders don't need deps, so this is straightforward)
export const MyConditions = {
  Prisoner: PrisonerConditions,
  Address: AddressConditions,
  Api: ApiConditions,
}

// Export a factory that creates the combined registry
// Call this at app startup with the required dependencies
export const createMyConditionsRegistry = (deps: ApiConditionsDeps) => ({
  ...PrisonerConditionsRegistry,      // No deps needed
  ...AddressConditionsRegistry,       // No deps needed
  ...createApiConditionsRegistry(deps), // Deps required
})

// Re-export the deps type for consumers
export type { ApiConditionsDeps as MyConditionsDeps }`,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      title: 'app.ts',
      code: `import FormEngine from '@form-engine/core/FormEngine'
import { createMyConditionsRegistry } from './conditions'

const formEngine = new FormEngine({ /* ... */ })
  .registerFunctions(createMyConditionsRegistry({
    api: validationApiClient,
  }))`,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      title: 'Usage in forms',
      code: `import { MyConditions } from './conditions'

// Use namespaced conditions (same as before - no deps needed here)
validation({
  when: Self().not.match(MyConditions.Prisoner.IsPrisonNumber()),
  message: 'Enter a valid prison number',
})

validation({
  when: Self().not.match(MyConditions.Api.IsValidPostcode()),
  message: 'Enter a valid postcode',
})`,
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
            <strong>Keep conditions pure</strong> &mdash; Conditions should only test values
            and return booleans. Side effects belong in effects, not conditions.
          </li>
          <li>
            <strong>Name descriptively</strong> &mdash; Use <code>Is*</code>, <code>Has*</code>,
            or <code>*Matches</code> prefixes so conditions read naturally:
            <code>Self().match(Condition.IsValidEmail())</code>
          </li>
          <li>
            <strong>Handle edge cases</strong> &mdash; Consider null, undefined, empty strings,
            and wrong types. Return <code>false</code> rather than throwing for invalid input
            (unless using assertions for development-time feedback).
          </li>
          <li>
            <strong>Document formats</strong> &mdash; Add comments explaining expected formats,
            especially for domain-specific patterns like prison numbers or CRNs.
          </li>
          <li>
            <strong>Test thoroughly</strong> &mdash; Write unit tests covering valid cases,
            invalid cases, edge cases, and type errors.
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
          Here's a complete example of a custom condition set for prisoner validation:
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      title: 'conditions/prisonerConditions.ts',
      code: `import { defineConditions } from '@form-engine/registry/utils/createRegisterableFunction'
import { assertString, assertNumber } from '@form-engine/registry/utils/asserts'
import { ValueExpr } from '@form-engine/form/types/expressions.type'

/**
 * Custom conditions for prisoner-related validation
 *
 * Formats:
 * - Prison Number: Letter + 4 digits + 2 letters (e.g., A1234BC)
 * - NOMS Number: Letter + 4 digits + 2 letters (same as prison number)
 * - PNC ID: Year + area code + serial + check (e.g., 01/123456A)
 */
export const { conditions: PrisonerConditions, registry: PrisonerConditionsRegistry } =
  defineConditions({
    /**
     * Validates a prison number format
     * Format: Letter followed by 4 digits and 2 letters
     * @example A1234BC, B5678DE
     */
    IsPrisonNumber: value => {
      assertString(value, 'PrisonerConditions.IsPrisonNumber')
      return /^[A-Z][0-9]{4}[A-Z]{2}$/i.test(value.trim())
    },

    /**
     * Validates a PNC ID format
     * Format: YY/NNNNNNC where YY=year, N=digits, C=check letter
     * @example 01/123456A, 23/987654Z
     */
    IsPncId: value => {
      assertString(value, 'PrisonerConditions.IsPncId')
      return /^[0-9]{2}\\/[0-9]{6}[A-Z]$/i.test(value.trim())
    },

    /**
     * Checks if prisoner age is within valid range
     * @param min - Minimum age (default: 18)
     * @param max - Maximum age (default: 120)
     */
    IsValidPrisonerAge: (value, min: number | ValueExpr = 18, max: number | ValueExpr = 120) => {
      assertNumber(value, 'PrisonerConditions.IsValidPrisonerAge')
      assertNumber(min, 'PrisonerConditions.IsValidPrisonerAge (min)')
      assertNumber(max, 'PrisonerConditions.IsValidPrisonerAge (max)')

      return Number.isInteger(value) && value >= min && value <= max
    },
  })`,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      title: 'Usage in a form step',
      code: `import { step, field, validation, Self, block } from '@form-engine/form/builders'
import { GovUKTextInput } from '@form-engine-govuk-components/components'
import { Condition } from '@form-engine/registry/conditions'
import { PrisonerConditions } from './conditions/prisonerConditions'

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
    }),

    field<GovUKTextInput>({
      variant: 'govukTextInput',
      code: 'pncId',
      label: 'PNC ID (optional)',
      hint: 'For example, 01/123456A',
      classes: 'govuk-input--width-10',
      validate: [
        // Only validate format if a value is provided
        validation({
          when: Self().match(Condition.IsRequired())
            .and(Self().not.match(PrisonerConditions.IsPncId())),
          message: 'Enter a valid PNC ID in the format 01/123456A',
        }),
      ],
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
              href: '/forms/form-engine-developer-guide/conditions/intro',
              labelText: 'Conditions Reference',
            },
            next: {
              href: '/forms/form-engine-developer-guide/conditions/playground/intro',
              labelText: 'Conditions Playground',
            },
          }),
        ],
      },
    }),
  ],
})
