import { TemplateWrapper } from '@form-engine/registry/components'
import { GovUKPagination } from '@form-engine-govuk-components/components'
import { parseGovUKMarkdown } from '../../../../helpers/markdown'
import { CodeBlock } from '../../../../components'

/**
 * Form Registration - Directory Structure
 *
 * How to organize form files and folders.
 */
export const pageContent = TemplateWrapper({
  template: parseGovUKMarkdown(`
# Directory Structure

A well-organized form follows a consistent directory structure.
This makes forms easy to navigate, maintain, and scale. {.lead}

---

## Recommended Structure

{{slot:structureExample}}

---

## Key Files Explained

### index.ts (Root)

The form package entry point. Uses \`createFormPackage()\` to bundle
the journey, components, and effect registries together.

{{slot:indexExample}}

---

### form/index.ts

Defines the main journey using the \`journey()\` builder. Imports all steps
and child journeys, configures load transitions and view templates.

{{slot:journeyExample}}

---

### effects.ts

Defines lifecycle effects using \`defineEffectsWithDeps()\`. Effects handle
data loading, saving, API calls, and other side effects.

{{slot:effectsExample}}

---

### form/steps/

Contains step directories. Each step has:

- **step.ts** — step configuration (path, title, blocks, transitions)
- **fields.ts** — block and field definitions for the step

{{slot:stepExample}}

---

### form/journeys/ (Optional)

For complex forms, child journeys provide nested navigation. Each child
journey is a self-contained module with its own steps.

---

### components/ (Optional)

Custom components specific to this form. Each component has:

- **componentName.ts** — interface and registration
- **template.njk** — Nunjucks template for rendering

---

### views/ (Optional)

Custom Nunjucks templates for the form's HTML layout.

---

{{slot:pagination}}
`),
  slots: {
    structureExample: [
      CodeBlock({
        language: 'plaintext',
        code: `
          my-form/
          ├── index.ts                 # Form package entry point
          ├── effects.ts               # Lifecycle effects
          ├── form/
          │   ├── index.ts             # Main journey definition
          │   ├── steps/
          │   │   ├── intro/
          │   │   │   ├── step.ts      # Step configuration
          │   │   │   └── fields.ts    # Blocks and fields
          │   │   └── summary/
          │   │       ├── step.ts
          │   │       └── fields.ts
          │   └── journeys/            # Optional child journeys
          │       └── details/
          │           ├── index.ts
          │           └── steps/...
          ├── components/              # Optional custom components
          │   ├── index.ts
          │   └── my-component/
          │       ├── myComponent.ts
          │       └── template.njk
          └── views/                   # Optional custom templates
              └── template.njk
        `,
      }),
    ],
    indexExample: [
      CodeBlock({
        language: 'typescript',
        code: `
          // my-form/index.ts
          import { createFormPackage } from '@form-engine/form/builders'
          import { myFormJourney } from './form'
          import { myFormComponents } from './components'
          import { createMyFormEffectsRegistry } from './effects'

          export default createFormPackage({
            journey: myFormJourney,
            components: myFormComponents,
            createRegistries: () => ({
              ...createMyFormEffectsRegistry({}),
            }),
          })
        `,
      }),
    ],
    journeyExample: [
      CodeBlock({
        language: 'typescript',
        code: `
          // my-form/form/index.ts
          import { journey, loadTransition } from '@form-engine/form/builders'
          import { introStep } from './steps/intro/step'
          import { summaryStep } from './steps/summary/step'
          import { MyFormEffects } from '../effects'

          export const myFormJourney = journey({
            code: 'my-form',
            title: 'My Form',
            path: '/my-form',
            onLoad: [
              loadTransition({
                effects: [MyFormEffects.initializeSession()],
              }),
            ],
            steps: [introStep, summaryStep],
          })
        `,
      }),
    ],
    effectsExample: [
      CodeBlock({
        language: 'typescript',
        code: `
          // my-form/effects.ts
          import { defineEffectsWithDeps, EffectResult } from '@form-engine/form/effects'

          // Define effects with typed dependencies
          const MyFormEffectsDefinition = defineEffectsWithDeps<{}>()({
            initializeSession: () => async (ctx) => {
              // Load initial data, set up session state
              await ctx.session.set('initialized', true)
              return EffectResult.Continue
            },
          })

          export const MyFormEffects = MyFormEffectsDefinition.Effects
          export const createMyFormEffectsRegistry = MyFormEffectsDefinition.createRegistry
        `,
      }),
    ],
    stepExample: [
      CodeBlock({
        language: 'typescript',
        code: `
          // my-form/form/steps/intro/step.ts
          import { step, submitTransition } from '@form-engine/form/builders'
          import { welcomeBlock, nameField } from './fields'

          export const introStep = step({
            path: '/intro',
            title: 'Welcome',
            isEntryPoint: true,
            blocks: [welcomeBlock, nameField],
            onSubmission: [
              submitTransition({ validate: true }),
            ],
          })
        `,
      }),
    ],
    pagination: [
      GovUKPagination({
        classes: 'govuk-pagination--inline',
        previous: {
          href: '/forms/form-engine-developer-guide/form-registration/intro',
          labelText: 'Form Packages Overview',
        },
        next: {
          href: '/forms/form-engine-developer-guide/form-registration/registration',
          labelText: 'Registration',
        },
      }),
    ],
  },
})
