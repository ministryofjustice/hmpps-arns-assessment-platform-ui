import { TemplateWrapper } from '@form-engine/registry/components'
import { GovUKPagination } from '@form-engine-govuk-components/components'
import { parseGovUKMarkdown } from '../../../../helpers/markdown'

/**
 * Journeys & Steps - Introduction
 *
 * High-level overview of what journeys and steps are, their relationship,
 * and a live demonstration of URL path composition.
 */
export const pageContent = TemplateWrapper({
  template: parseGovUKMarkdown(`
# Journeys & Steps

In the form-engine, forms are built from two fundamental structures:
**journeys** and **steps**. {.lead}

---

## What is a Journey?

A **journey** is the top-level container for a form. It defines:

- A unique identifier (\`code\`) for the form
- The base URL path where the form lives
- Configuration for how the form renders and behaves
- The steps that make up the form flow
- Optional child journeys for complex, nested structures

Think of a journey as the "wrapper" that holds everything together.

---

## What is a Step?

A **step** is a single page within a journey. Each step:

- Has its own URL path (relative to the journey)
- Contains blocks for displaying content
- Contains fields for collecting user input
- Can handle form submissions and navigation

Users progress through steps to complete the journey. A journey can have
one step (single-page form) or many steps (multi-page wizard).

---

## The Hierarchy

Forms follow a strict containment hierarchy:

\`\`\`
Journey
├── Step
│     ├── Block (display content)
│     ├── Field (collect input)
│     └── Field
├── Step
│     └── Block
└── Child Journey (optional)
      └── Step
            └── Block
\`\`\`

---

## Live Demo: Path Breakdown

Look at the URL for this page. It demonstrates how paths compose:

> **Current URL:**
>
> \`/form-engine-developer-guide/journeys-and-steps/intro\`

| Segment | Source | Description |
|---------|--------|-------------|
| \`/forms\` | Server routing | Base path where form-engine is mounted |
| \`/form-engine-developer-guide\` | Parent journey \`path\` | The main Developer Guide journey |
| \`/journeys-and-steps\` | Child journey \`path\` | This concept module (a nested journey) |
| \`/intro\` | Step \`path\` | This specific page within the module |

**Key insight:** Paths are composed by concatenating the journey path(s)
with the step path. This creates clean, hierarchical URLs automatically.

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
          href: '/form-engine-developer-guide/journeys-and-steps/journeys',
          labelText: 'Journey Configuration',
        },
      }),
    ],
  },
})
