import { step, block } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { CodeBlock } from '@form-engine/registry/components/codeBlock'
import { GovUKDetails, GovUKPagination } from '@form-engine-govuk-components/components'

/**
 * Journeys & Steps - Nested Journeys
 *
 * Explains how to use the children property to create hierarchical journey structures.
 */
export const nestedJourneysStep = step({
  path: '/nested-journeys',
  title: 'Nested Journeys',
  blocks: [
    // Page header
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <h1 class="govuk-heading-l">Nested Journeys</h1>
        <p class="govuk-body-l">
          Journeys can contain other journeys using the <code>children</code> property.
          This creates hierarchical URL structures and helps organize complex forms.
        </p>
      `,
    }),

    // What are Nested Journeys section
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <h2 class="govuk-heading-m">What are Nested Journeys?</h2>

        <p class="govuk-body">
          A <strong>nested journey</strong> (or child journey) is a journey defined inside
          another journey's <code>children</code> array. Child journeys:
        </p>

        <ul class="govuk-list govuk-list--bullet">
          <li>Have their URL paths prefixed with the parent journey's path</li>
          <li>Can have their own steps and even their own children (multiple levels)</li>
          <li>Are fully independent journeys with their own configuration</li>
          <li>Inherit view configuration from the parent (unless overridden)</li>
        </ul>
      `,
    }),

    // URL Path Composition section
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <hr class="govuk-section-break govuk-section-break--m govuk-section-break--visible">
        <h2 class="govuk-heading-m">URL Path Composition</h2>
        <p class="govuk-body">When you nest journeys, their paths are concatenated to form the full URL:</p>
        {{slot:formula}}
        {{slot:example}}
      `,
      slots: {
        formula: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'plaintext',
            code: `/basePath + parent.path + child.path + step.path`,
          }),
        ],
        example: [
          block<HtmlBlock>({
            variant: 'html',
            content: `
              <h3 class="govuk-heading-s">Example: This Developer Guide</h3>

              <p class="govuk-body">
                You're currently viewing a nested journey. Here's how the URL breaks down:
              </p>

              <table class="govuk-table">
                <thead class="govuk-table__head">
                  <tr class="govuk-table__row">
                    <th scope="col" class="govuk-table__header">Level</th>
                    <th scope="col" class="govuk-table__header">Code</th>
                    <th scope="col" class="govuk-table__header">Path</th>
                  </tr>
                </thead>
                <tbody class="govuk-table__body">
                  <tr class="govuk-table__row">
                    <td class="govuk-table__cell">Parent Journey</td>
                    <td class="govuk-table__cell"><code>form-engine-developer-guide</code></td>
                    <td class="govuk-table__cell"><code>/form-engine-developer-guide</code></td>
                  </tr>
                  <tr class="govuk-table__row">
                    <td class="govuk-table__cell">Child Journey</td>
                    <td class="govuk-table__cell"><code>journeys-and-steps</code></td>
                    <td class="govuk-table__cell"><code>/journeys-and-steps</code></td>
                  </tr>
                  <tr class="govuk-table__row">
                    <td class="govuk-table__cell">Step</td>
                    <td class="govuk-table__cell">-</td>
                    <td class="govuk-table__cell"><code>/nested-journeys</code></td>
                  </tr>
                </tbody>
              </table>

              <p class="govuk-body">
                <strong>Result:</strong> <code>/forms/form-engine-developer-guide/journeys-and-steps/nested-journeys</code>
              </p>
            `,
          }),
        ],
      },
    }),

    // When to Use Nested Journeys section
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <h2 class="govuk-heading-m">When to Use Nested Journeys</h2>

        <p class="govuk-body">Consider using nested journeys when:</p>

        <h3 class="govuk-heading-s">1. Hub-and-Spoke Patterns</h3>

        <p class="govuk-body">
          A central hub page links to multiple independent sections that users can
          explore in any order. This developer guide uses this pattern:
        </p>

        {{slot:tree}}

        <h3 class="govuk-heading-s">2. Large Forms with Distinct Sections</h3>

        <p class="govuk-body">
          When a form has multiple logical sections (e.g., "About You", "Business Details",
          "Payment"), each section can be a child journey with its own steps.
        </p>

        <h3 class="govuk-heading-s">3. Conditional Sub-flows</h3>

        <p class="govuk-body">
          Some users might need to complete additional steps based on their answers.
          These optional flows can be child journeys that are conditionally navigated to.
        </p>
      `,
      slots: {
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
  │     └── Nested Journeys ← You are here ⭐
  ├── Blocks & Fields (child)
  │     └── ...
  └── References (child)
        └── ...`,
          }),
        ],
      },
    }),

    // Code Example section
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Code Example</h2>
        <p class="govuk-body">Here's the basic pattern for defining nested journeys:</p>
      `,
    }),

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
})`,
        }),
      ],
    }),

    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--m govuk-section-break--visible">

        <h3 class="govuk-heading-s">URLs Generated</h3>

        <p class="govuk-body">The above code generates these routes:</p>

        <ul class="govuk-list govuk-list--bullet">
          <li><code>/forms/registration/hub</code> - Main hub page</li>
          <li><code>/forms/registration/about-you/intro</code> - About You intro</li>
          <li><code>/forms/registration/about-you/contact</code> - Contact details</li>
          <li><code>/forms/registration/business/intro</code> - Business intro</li>
          <li><code>/forms/registration/business/address</code> - Business address</li>
        </ul>
      `,
    }),

    // Configuration Inheritance section
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <h2 class="govuk-heading-m">Configuration Inheritance</h2>

        <p class="govuk-body">Child journeys inherit certain configuration from their parent:</p>

        <table class="govuk-table">
          <thead class="govuk-table__head">
            <tr class="govuk-table__row">
              <th scope="col" class="govuk-table__header">Property</th>
              <th scope="col" class="govuk-table__header">Inheritance</th>
            </tr>
          </thead>
          <tbody class="govuk-table__body">
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>view.template</code></td>
              <td class="govuk-table__cell">Inherits if not specified</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>view.locals</code></td>
              <td class="govuk-table__cell">Merged with parent</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>code</code></td>
              <td class="govuk-table__cell">Must be unique (not inherited)</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>path</code></td>
              <td class="govuk-table__cell">Concatenated with parent</td>
            </tr>
          </tbody>
        </table>
      `,
    }),

    // Best Practices section
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <h2 class="govuk-heading-m">Best Practices</h2>

        <ul class="govuk-list govuk-list--bullet">
          <li>
            <strong>Keep nesting shallow</strong> - Two levels (parent + child) is usually enough.
            Deeper nesting creates unwieldy URLs and complex navigation.
          </li>
          <li>
            <strong>Use clear, consistent paths</strong> - Child journey paths should be
            descriptive and follow the same naming conventions as parent journeys.
          </li>
          <li>
            <strong>Provide navigation back to hub</strong> - Always give users a clear way
            to return to the parent journey's hub or entry point.
          </li>
          <li>
            <strong>Consider user flow</strong> - Nested journeys work best when sections
            are logically independent. If steps must be completed in a strict order,
            a flat journey with many steps may be simpler.
          </li>
        </ul>
      `,
    }),

    // Navigation
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        {{slot:pagination}}
        <p class="govuk-body govuk-!-margin-top-6">
          <a href="/forms/form-engine-developer-guide/hub" class="govuk-link">&larr; Back to Guide Hub</a>
        </p>
      `,
      slots: {
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
    }),
  ],
})
