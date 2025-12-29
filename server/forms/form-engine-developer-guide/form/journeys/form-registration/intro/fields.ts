import { TemplateWrapper } from '@form-engine/registry/components'
import { GovUKPagination } from '@form-engine-govuk-components/components'
import { parseGovUKMarkdown } from '../../../../helpers/markdown'
import { CodeBlock } from '../../../../components'

/**
 * Form Registration - Introduction
 *
 * Overview of what form packages are and why they matter.
 */
export const pageContent = TemplateWrapper({
  template: parseGovUKMarkdown(`
# Form Registration & Structure

Forms in form-engine are organized into **form packages** — self-contained
bundles that include everything needed to run a form. {.lead}

---

## What is a Form Package?

A form package bundles together:

- **Journey definition** — the form's structure, steps, and navigation
- **Custom components** — any UI components specific to this form
- **Effect registries** — lifecycle hooks for data loading, saving, and side effects

This bundling keeps forms modular and portable. You can develop a form
independently and register it with any FormEngine instance.

---

## Why Package Forms?

| Benefit | Description |
|---------|-------------|
| **Encapsulation** | All form logic lives together — no scattered files |
| **Reusability** | Forms can be shared across applications |
| **Dependency injection** | Forms can declare dependencies and receive them at registration |
| **Testability** | Forms are isolated units that can be tested independently |

---

## The createFormPackage Builder

Forms are packaged using the \`createFormPackage()\` builder:

{{slot:codeExample}}

The package exports a default object that the FormEngine can consume.

---

## What's Next?

In the following pages you'll learn:

1. **Directory Structure** — how to organize form files and folders
2. **Registration** — how to register your form package with the FormEngine

---

{{slot:pagination}}
`),
  slots: {
    codeExample: [
      CodeBlock({
        language: 'typescript',
        code: `
          import { createFormPackage } from '@form-engine/form/builders'
          import { myJourney } from './form'
          import { myComponents } from './components'
          import { createMyEffectsRegistry } from './effects'

          export default createFormPackage({
            journey: myJourney,
            components: myComponents,
            createRegistries: () => ({
              ...createMyEffectsRegistry({}),
            }),
          })
        `,
      }),
    ],
    pagination: [
      GovUKPagination({
        classes: 'govuk-pagination--inline',
        previous: {
          href: '/forms/form-engine-developer-guide/hub',
          labelText: 'Guide Hub',
        },
        next: {
          href: '/forms/form-engine-developer-guide/form-registration/structure',
          labelText: 'Directory Structure',
        },
      }),
    ],
  },
})
