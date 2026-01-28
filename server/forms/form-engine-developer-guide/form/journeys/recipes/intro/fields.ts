import { TemplateWrapper } from '@form-engine/registry/components'
import { GovUKPagination } from '@form-engine-govuk-components/components'
import { parseGovUKMarkdown } from '../../../../helpers/markdown'

/**
 * Recipes - Introduction
 *
 * Overview of available recipes with quick links.
 */
export const pageContent = TemplateWrapper({
  template: parseGovUKMarkdown(`
# Recipes

Quick reference patterns for common form tasks.
Each recipe is self-contained with copy-paste ready code. {.lead}

---

## Available Recipes

| Recipe | Description |
|--------|-------------|
| [Conditional Visibility](/form-engine-developer-guide/recipes/conditional-visibility) | Show or hide a field based on another field's value |
| [Custom Validation](/form-engine-developer-guide/recipes/custom-validation) | Add validation with a custom error message |
| [Load Data on Entry](/form-engine-developer-guide/recipes/load-data) | Fetch data when a step loads |
| [Format a Dynamic Value](/form-engine-developer-guide/recipes/format-value) | Display computed or formatted text |
| [Save Answers on Submit](/form-engine-developer-guide/recipes/save-answers) | Save form data when submitted |
| [Dynamic Dropdown Options](/form-engine-developer-guide/recipes/dynamic-options) | Load or filter dropdown options dynamically |
| [Branching Navigation](/form-engine-developer-guide/recipes/branching-navigation) | Navigate to different steps based on answers |
| [In-Page Lookup](/form-engine-developer-guide/recipes/action-lookup) | Postcode lookup or similar in-page actions |

---

## How to Use Recipes

1. Find the recipe that matches your task
2. Copy the code example
3. Adapt the field names and values for your form

Each recipe shows the minimal code needed. For deeper understanding,
see the related concept sections linked in each recipe.

---

{{slot:pagination}}
`),
  slots: {
    pagination: [
      GovUKPagination({
        classes: 'govuk-pagination--inline',
        previous: {
          href: '/form-engine-developer-guide/hub',
          labelText: 'Guide Hub',
        },
        next: {
          href: '/form-engine-developer-guide/recipes/conditional-visibility',
          labelText: 'Conditional Visibility',
        },
      }),
    ],
  },
})
