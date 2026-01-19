import { TemplateWrapper } from '@form-engine/registry/components'
import { GovUKPagination } from '@form-engine-govuk-components/components'
import { parseGovUKMarkdown } from '../../../../helpers/markdown'
import { CodeBlock } from '../../../../components'

/**
 * Recipe: Load Data on Entry
 */
export const pageContent = TemplateWrapper({
  template: parseGovUKMarkdown(`
# Recipe: Load Data on Entry

Fetch data from an API or session when a step loads. {.lead}

---

## The Pattern

1. Define effects in your form's \`effects.ts\`
2. Attach them to an \`accessTransition\` in \`onAccess\` on your journey or step

### Step 1: Define the effect

{{slot:effectExample}}

### Step 2: Attach to a transition

{{slot:transitionExample}}

---

## How It Works

1. \`defineEffectsWithDeps<DepsType>()\` creates typed effects with dependency injection
2. Effects receive a \`context\` object with methods to read/write form state
3. \`context.setData('key', value)\` stores data accessible via \`Data('key')\`
4. \`context.setAnswer('code', value)\` pre-populates a form field

---

## Context Methods

| Method | Purpose |
|--------|---------|
| \`context.getSession()\` | Get the mutable session object |
| \`context.setData('key', value)\` | Store data for \`Data('key')\` reference |
| \`context.setAnswer('code', value)\` | Pre-populate a field value |
| \`context.getRequestParam('name')\` | Get URL route parameter |
| \`context.getState('key')\` | Get state value (e.g., csrfToken) |

---

## Common Variations

### Load from session

{{slot:sessionExample}}

### Load with API dependency

{{slot:apiExample}}

### Load on a specific step

{{slot:stepExample}}

---

## Related Concepts

- [Effects](/forms/form-engine-developer-guide/effects/intro) - Full effects documentation
- [Transitions](/forms/form-engine-developer-guide/transitions/intro) - Access and submit transitions
- [References](/forms/form-engine-developer-guide/references/data) - Using Data() to access loaded data

---

{{slot:pagination}}
`),
  slots: {
    effectExample: [
      CodeBlock({
        language: 'typescript',
        code: `
          // effects.ts
          import { defineEffectsWithDeps } from '@form-engine/registry/utils/createRegisterableFunction'
          import EffectFunctionContext from '@form-engine/core/nodes/expressions/effect/EffectFunctionContext'

          export const { effects: MyFormEffects, createRegistry: createMyFormEffectsRegistry } =
            defineEffectsWithDeps<object>()({
              loadUserData: _deps => (context: EffectFunctionContext) => {
                const userId = context.getRequestParam('userId')

                // Fetch from API (simplified example)
                const user = { name: 'John', email: 'john@example.com' }

                // Store for Data('user') reference
                context.setData('user', user)

                // Pre-populate form fields
                context.setAnswer('email', user.email)
              },
            })
        `,
      }),
    ],
    transitionExample: [
      CodeBlock({
        language: 'typescript',
        code: `
          // form/index.ts or step.ts
          import { journey, accessTransition } from '@form-engine/form/builders'
          import { MyFormEffects } from '../effects'

          export const myJourney = journey({
            code: 'my-form',
            path: '/my-form',
            onAccess: [
              accessTransition({
                effects: [MyFormEffects.loadUserData()],
              }),
            ],
            steps: [/* ... */],
          })
        `,
      }),
    ],
    sessionExample: [
      CodeBlock({
        language: 'typescript',
        code: `
          loadFromSession: _deps => (context: EffectFunctionContext) => {
            const session = context.getSession()

            if (session.savedProgress) {
              context.setData('progress', session.savedProgress)
            }
          }
        `,
      }),
    ],
    apiExample: [
      CodeBlock({
        language: 'typescript',
        code: `
          // effects.ts - with typed dependencies
          interface MyFormDeps {
            api: ApiClient
          }

          export const { effects: MyFormEffects, createRegistry: createMyFormEffectsRegistry } =
            defineEffectsWithDeps<MyFormDeps>()({
              loadData: deps => async (context: EffectFunctionContext) => {
                const data = await deps.api.fetchData()
                context.setData('apiData', data)
              },
            })

          // index.ts - pass dependencies at registration
          export default createFormPackage({
            journey: myJourney,
            createRegistries: () => ({
              ...createMyFormEffectsRegistry({ api: myApiClient }),
            }),
          })
        `,
      }),
    ],
    stepExample: [
      CodeBlock({
        language: 'typescript',
        code: `
          // step.ts - load data for a specific step
          export const detailsStep = step({
            path: '/details',
            title: 'Details',
            onAccess: [
              accessTransition({
                effects: [MyFormEffects.loadDetails()],
              }),
            ],
            blocks: [/* ... */],
          })
        `,
      }),
    ],
    pagination: [
      GovUKPagination({
        classes: 'govuk-pagination--inline',
        previous: {
          href: '/forms/form-engine-developer-guide/recipes/custom-validation',
          labelText: 'Custom Validation',
        },
        next: {
          href: '/forms/form-engine-developer-guide/recipes/format-value',
          labelText: 'Format a Dynamic Value',
        },
      }),
    ],
  },
})
