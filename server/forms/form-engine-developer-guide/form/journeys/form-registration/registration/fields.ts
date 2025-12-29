import { TemplateWrapper } from '@form-engine/registry/components'
import { GovUKPagination } from '@form-engine-govuk-components/components'
import { parseGovUKMarkdown } from '../../../../helpers/markdown'
import { CodeBlock } from '../../../../components'

/**
 * Form Registration - Registration
 *
 * How to register form packages with the FormEngine.
 */
export const pageContent = TemplateWrapper({
  template: parseGovUKMarkdown(`
# Registering Forms

Once you've created a form package, you need to register it with the
FormEngine instance. Registration makes your form available at its configured path. {.lead}

---

## Basic Registration

Import your form package and call \`registerFormPackage()\`:

{{slot:basicExample}}

That's it! Your form is now accessible at \`/forms/my-form\`.

---

## Registration Order

The order of registration matters:

1. **Components first** — Register component libraries before forms that use them
2. **Forms last** — Forms may depend on globally registered components

{{slot:orderExample}}

---

## Dependency Injection

Forms can declare dependencies that are passed at registration time.
This is useful for API clients, services, or configuration.

{{slot:depsDefinition}}

Then pass the dependencies when registering:

{{slot:depsRegistration}}

---

## Multiple Forms

You can register multiple form packages with the same FormEngine:

{{slot:multipleExample}}

Each form will be available at its own path.

---

## What Happens at Registration?

When you call \`registerFormPackage()\`, the FormEngine:

1. **Registers components** — Any custom components in the package are added
2. **Creates registries** — Effect registries are instantiated with dependencies
3. **Compiles the journey** — The journey definition is compiled into an AST
4. **Mounts routes** — Express routes are created for the form's paths

---

## Summary

| Step | Description |
|------|-------------|
| Create package | Use \`createFormPackage()\` to bundle journey, components, registries |
| Import package | Import the default export from your form's index.ts |
| Register | Call \`formEngine.registerFormPackage(myForm)\` |
| Pass dependencies | Optionally pass \`{ deps }\` for dependency injection |

---

{{slot:pagination}}
`),
  slots: {
    basicExample: [
      CodeBlock({
        language: 'typescript',
        code: `
          // app.ts
          import { FormEngine } from '@form-engine/core'
          import myForm from './forms/my-form'

          const formEngine = new FormEngine({ ... })
            .registerFormPackage(myForm)
        `,
      }),
    ],
    orderExample: [
      CodeBlock({
        language: 'typescript',
        code: `
          // app.ts
          import { FormEngine } from '@form-engine/core'
          import { govukComponents } from '@form-engine-govuk-components'
          import { mojComponents } from '@form-engine-moj-components'
          import myForm from './forms/my-form'

          const formEngine = new FormEngine({ ... })
            // 1. Register component libraries first
            .registerComponents(govukComponents)
            .registerComponents(mojComponents)
            // 2. Register forms that use those components
            .registerFormPackage(myForm)
        `,
      }),
    ],
    depsDefinition: [
      CodeBlock({
        language: 'typescript',
        code: `
          // my-form/effects.ts
          interface MyFormDeps {
            api: ApiClient
            config: { someConfigurationOption: string }
          }

          const MyFormEffectsDefinition = defineEffectsWithDeps<MyFormDeps>()({
            loadData: () => async (ctx, deps) => {
              // deps.api and deps.config are available here
              const data = await deps.api.fetchData()
              await ctx.session.set('data', data)
              return EffectResult.Continue
            },
          })
        `,
      }),
    ],
    depsRegistration: [
      CodeBlock({
        language: 'typescript',
        code: `
        // app.ts
        formEngine.registerFormPackage(myForm, {
          api: services.apiClient,
          config: { someConfigurationOption: 'i-love-forms!' },
        })
        `,
      }),
    ],
    multipleExample: [
      CodeBlock({
        language: 'typescript',
        code: `
          // app.ts
          import applicationForm from './forms/application'
          import feedbackForm from './forms/feedback'
          import settingsForm from './forms/settings'

          const formEngine = new FormEngine({ ... })
            .registerComponents(govukComponents)
            .registerFormPackage(applicationForm)
            .registerFormPackage(feedbackForm)
            .registerFormPackage(settingsForm, { api: services.settingsApi })
        `,
      }),
    ],
    pagination: [
      GovUKPagination({
        classes: 'govuk-pagination--inline',
        previous: {
          href: '/forms/form-engine-developer-guide/form-registration/structure',
          labelText: 'Directory Structure',
        },
        next: {
          href: '/forms/form-engine-developer-guide/hub',
          labelText: 'Guide Hub',
        },
      }),
    ],
  },
})
