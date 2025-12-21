import { block } from '@form-engine/form/builders'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { GovUKDetails, GovUKPagination } from '@form-engine-govuk-components/components'
import { CodeBlock } from '../../../../components/code-block/codeBlock'
import { parseGovUKMarkdown } from '../../../../helpers/markdown'

/**
 * Journeys & Steps - Nested Journeys
 *
 * Explains how to use the children property to create hierarchical journey structures.
 */
export const pageContent = block<TemplateWrapper>({
  variant: 'templateWrapper',
  template: parseGovUKMarkdown(`
# Nested Journeys

Journeys can contain other journeys using the \`children\` property.
This creates hierarchical URL structures and helps organize complex forms. {.lead}

---

## What are Nested Journeys?

A **nested journey** (or child journey) is a journey defined inside
another journey's \`children\` array. Child journeys:

- Have their URL paths prefixed with the parent journey's path
- Can have their own steps and even their own children (multiple levels)
- Are fully independent journeys with their own configuration
- Inherit view configuration from the parent (unless overridden)

---

## URL Path Composition

When you nest journeys, their paths are concatenated to form the full URL:

{{slot:formula}}

### Example: This Developer Guide

You're currently viewing a nested journey. Here's how the URL breaks down:

| Level | Code | Path |
|-------|------|------|
| Parent Journey | \`form-engine-developer-guide\` | \`/form-engine-developer-guide\` |
| Child Journey | \`journeys-and-steps\` | \`/journeys-and-steps\` |
| Step | - | \`/nested-journeys\` |

**Result:** \`/forms/form-engine-developer-guide/journeys-and-steps/nested-journeys\`

---

## When to Use Nested Journeys

Consider using nested journeys when:

### 1. Hub-and-Spoke Patterns

A central hub page links to multiple independent sections that users can
explore in any order. This developer guide uses this pattern:

{{slot:tree}}

### 2. Large Forms with Distinct Sections

When a form has multiple logical sections (e.g., "About You", "Business Details",
"Payment"), each section can be a child journey with its own steps.

### 3. Conditional Sub-flows

Some users might need to complete additional steps based on their answers.
These optional flows can be child journeys that are conditionally navigated to.

---

## Code Example

Here's the basic pattern for defining nested journeys:

{{slot:codeExample}}

### URLs Generated

The above code generates these routes:

- \`/forms/registration/hub\` - Main hub page
- \`/forms/registration/about-you/intro\` - About You intro
- \`/forms/registration/about-you/contact\` - Contact details
- \`/forms/registration/business/intro\` - Business intro
- \`/forms/registration/business/address\` - Business address

---

## Configuration Inheritance

Child journeys inherit certain configuration from their parent:

| Property | Inheritance |
|----------|-------------|
| \`view.template\` | Inherits if not specified |
| \`view.locals\` | Merged with parent |
| \`code\` | Must be unique (not inherited) |
| \`path\` | Concatenated with parent |

---

## Best Practices

- **Keep nesting shallow** - Two levels (parent + child) is usually enough. Deeper nesting creates unwieldy URLs and complex navigation.
- **Use clear, consistent paths** - Child journey paths should be descriptive and follow the same naming conventions as parent journeys.
- **Provide navigation back to hub** - Always give users a clear way to return to the parent journey's hub or entry point.
- **Consider user flow** - Nested journeys work best when sections are logically independent. If steps must be completed in a strict order, a flat journey with many steps may be simpler.

---

{{slot:pagination}}

[← Back to Guide Hub](/forms/form-engine-developer-guide/hub)
`),
  slots: {
    formula: [
      block<CodeBlock>({
        variant: 'codeBlock',
        language: 'plaintext',
        code: `
          /basePath + parent.path + child.path + step.path
        `,
      }),
    ],
    tree: [
      block<CodeBlock>({
        variant: 'codeBlock',
        language: 'plaintext',
        code: `
          Developer Guide (parent)
            ├── Hub Step (entry point)
            ├── Journeys & Steps (child)
            │     ├── Intro
            │     ├── Journey Config
            │     ├── Step Config
            │     └── Nested Journeys ← You are here
            ├── Blocks & Fields (child)
            │     └── ...
            └── References (child)
                  └── ...
        `,
      }),
    ],
    codeExample: [
      block<GovUKDetails>({
        variant: 'govukDetails',
        summaryText: 'View code example',
        content: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `
          import { journey, step, block } from '@form-engine/form/builders'

          export default journey({
            code: 'registration-form',
            title: 'Registration Form',
            path: '/registration',

            // Hub step - the main entry point
            steps: [
              step({
                path: '/hub',
                title: 'Registration Hub',
                isEntryPoint: true,
                blocks: [
                  block({
                    variant: 'html',
                    content: \`
                      <h1>Complete your registration</h1>
                      <ul>
                        <li><a href="about-you/intro">About you</a></li>
                        <li><a href="business/intro">Business details</a></li>
                      </ul>
                    \`,
                  }),
                ],
              }),
            ],

            // Child journeys - each section is a separate journey
            children: [
              journey({
                code: 'about-you',
                title: 'About You',
                path: '/about-you',
                steps: [
                  step({
                    path: '/intro',
                    title: 'Personal Information',
                    isEntryPoint: true,
                    blocks: [/* ... */],
                  }),
                  step({
                    path: '/contact',
                    title: 'Contact Details',
                    blocks: [/* ... */],
                  }),
                ],
              }),

              journey({
                code: 'business',
                title: 'Business Details',
                path: '/business',
                steps: [
                  step({
                    path: '/intro',
                    title: 'Business Information',
                    isEntryPoint: true,
                    blocks: [/* ... */],
                  }),
                  step({
                    path: '/address',
                    title: 'Business Address',
                    blocks: [/* ... */],
                  }),
                ],
              }),
            ],
          })
        `,
          }),
        ],
      }),
    ],
    pagination: [
      block<GovUKPagination>({
        variant: 'govukPagination',
        classes: 'govuk-pagination--inline',
        previous: {
          href: '/forms/form-engine-developer-guide/journeys-and-steps/steps',
          labelText: 'Step Configuration',
        },
      }),
    ],
  },
})
