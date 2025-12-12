import { step, block } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { CodeBlock } from '@form-engine/registry/components/codeBlock'
import { GovUKDetails, GovUKPagination } from '@form-engine-govuk-components/components'

/**
 * Journeys & Steps - Journey Configuration
 *
 * Deep dive into the journey() builder and all its configuration options.
 */
export const journeysStep = step({
  path: '/journeys',
  title: 'Journey Configuration',
  blocks: [
    // Page header
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <h1 class="govuk-heading-l">Journey Configuration</h1>
        <p class="govuk-body-l">
          The <code>journey()</code> builder function creates a journey definition.
          This page documents all available configuration options.
        </p>
      `,
    }),

    // The journey() Builder section
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">The journey() Builder</h2>
        <p class="govuk-body">Basic usage:</p>
        {{slot:code}}
      `,
      slots: {
        code: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `
import { journey } from '@form-engine/form/builders'

export default const myJourney = journey({
  code: 'my-journey',
  title: 'My Journey',
  path: '/my-journey',
  steps: [/* step definitions */],
})`,
          }),
        ],
      },
    }),

    // Required Properties section header
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Required Properties</h2>
        <p class="govuk-body">Every journey must have these three properties:</p>
      `,
    }),

    // code property
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <h3 class="govuk-heading-s"><code>{{name}}</code> <span class="govuk-tag govuk-tag--red">Required</span></h3>
        {{slot:description}}
        {{slot:example}}
      `,
      values: { name: 'code' },
      slots: {
        description: [
          block<HtmlBlock>({
            variant: 'html',
            content: `
              <p class="govuk-body">
                A unique identifier for the journey. Used for storing and looking up
                form instances programmatically.
              </p>
              <ul class="govuk-list govuk-list--bullet">
                <li>Must be unique across all journeys in your application</li>
                <li>Convention: use kebab-case matching the folder name</li>
              </ul>
            `,
          }),
        ],
        example: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `code: 'food-business-registration'`,
          }),
        ],
      },
    }),

    // path property
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <h3 class="govuk-heading-s"><code>{{name}}</code> <span class="govuk-tag govuk-tag--red">Required</span></h3>
        {{slot:description}}
        {{slot:example}}
      `,
      values: { name: 'path' },
      slots: {
        description: [
          block<HtmlBlock>({
            variant: 'html',
            content: `
              <p class="govuk-body">
                The URL path segment for this journey. All steps within the journey
                will be prefixed with this path.
              </p>
              <ul class="govuk-list govuk-list--bullet">
                <li>Must start with a forward slash</li>
                <li>Should be URL-safe (lowercase, hyphens for spaces)</li>
              </ul>
            `,
          }),
        ],
        example: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `path: '/food-business-registration'`,
          }),
        ],
      },
    }),

    // title property
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <h3 class="govuk-heading-s"><code>{{name}}</code> <span class="govuk-tag govuk-tag--red">Required</span></h3>
        {{slot:description}}
        {{slot:example}}
      `,
      values: { name: 'title' },
      slots: {
        description: [
          block<HtmlBlock>({
            variant: 'html',
            content: `
              <p class="govuk-body">
                A human-readable title for the journey. Used in navigation, progress indicators,
                and page titles.
              </p>
            `,
          }),
        ],
        example: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `title: 'Register a Food Business'`,
          }),
        ],
      },
    }),

    // Optional Properties section header
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Optional Properties</h2>
      `,
    }),

    // description property
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <h3 class="govuk-heading-s"><code>{{name}}</code></h3>
        {{slot:description}}
        {{slot:example}}
      `,
      values: { name: 'description' },
      slots: {
        description: [
          block<HtmlBlock>({
            variant: 'html',
            content: `
              <p class="govuk-body">
                A description of the journey's purpose. Useful for documentation
                and potentially displayed in UI elements.
              </p>
            `,
          }),
        ],
        example: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `description: 'Complete the registration process for your food business in 10 steps'`,
          }),
        ],
      },
    }),

    // steps property
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <h3 class="govuk-heading-s"><code>{{name}}</code></h3>
        {{slot:description}}
        {{slot:example}}
        {{slot:footer}}
      `,
      values: { name: 'steps' },
      slots: {
        description: [
          block<HtmlBlock>({
            variant: 'html',
            content: `
              <p class="govuk-body">
                An array of step definitions that make up the journey. Steps are
                the individual pages users navigate through.
              </p>
            `,
          }),
        ],
        example: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `
steps: [
  welcomeStep,
  personalDetailsStep,
  businessDetailsStep,
  reviewStep,
  confirmationStep,
]`,
          }),
        ],
        footer: [
          block<HtmlBlock>({
            variant: 'html',
            content: `
              <p class="govuk-body">
                See the <a href="/forms/form-engine-developer-guide/journeys-and-steps/steps" class="govuk-link">Step Configuration</a>
                page for details on defining steps.
              </p>
            `,
          }),
        ],
      },
    }),

    // children property
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <h3 class="govuk-heading-s"><code>{{name}}</code></h3>
        {{slot:description}}
        {{slot:example}}
        {{slot:footer}}
      `,
      values: { name: 'children' },
      slots: {
        description: [
          block<HtmlBlock>({
            variant: 'html',
            content: `
              <p class="govuk-body">
                An array of child journey definitions for creating nested, hierarchical structures.
                Child journeys have their paths prefixed with the parent journey's path.
              </p>
            `,
          }),
        ],
        example: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `
children: [
  journey({
    code: 'business-details',
    title: 'Business Details',
    path: '/business-details',
    steps: [/* ... */],
  }),
]`,
          }),
        ],
        footer: [
          block<HtmlBlock>({
            variant: 'html',
            content: `
              <p class="govuk-body">
                See the <a href="/forms/form-engine-developer-guide/journeys-and-steps/nested-journeys" class="govuk-link">Nested Journeys</a>
                page for details on using children.
              </p>
            `,
          }),
        ],
      },
    }),

    // view property
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <h3 class="govuk-heading-s"><code>{{name}}</code></h3>
        {{slot:description}}
        {{slot:example}}
        {{slot:footer}}
      `,
      values: { name: 'view' },
      slots: {
        description: [
          block<HtmlBlock>({
            variant: 'html',
            content: `
              <p class="govuk-body">
                Configuration for how the journey renders. Contains template selection
                and data passed to templates.
              </p>
            `,
          }),
        ],
        example: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `view: {
  // Nunjucks template to use for rendering steps
  template: 'partials/form-step',

  // Data passed to the template as locals
  locals: {
    showProgress: true,
    serviceName: 'Food Business Registration',
  },

  // Hide from navigation tree (optional)
  hiddenFromNavigation: false,
}`,
          }),
        ],
        footer: [
          block<HtmlBlock>({
            variant: 'html',
            content: `
              <div class="govuk-inset-text">
                <p class="govuk-body">
                  <strong>Inheritance:</strong> If a step doesn't specify its own <code>view</code>,
                  it inherits from the parent journey's view configuration.
                </p>
              </div>
            `,
          }),
        ],
      },
    }),

    // entryPath property
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <h3 class="govuk-heading-s"><code>{{name}}</code></h3>
        {{slot:description}}
        {{slot:example}}
        {{slot:footer}}
      `,
      values: { name: 'entryPath' },
      slots: {
        description: [
          block<HtmlBlock>({
            variant: 'html',
            content: `
              <p class="govuk-body">
                Override the default entry point for the journey. When a user navigates
                to the journey's root path, they'll be redirected to this path.
              </p>
            `,
          }),
        ],
        example: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `entryPath: '/welcome'`,
          }),
        ],
        footer: [
          block<HtmlBlock>({
            variant: 'html',
            content: `
              <p class="govuk-body"><strong>Resolution priority:</strong></p>
              <ol class="govuk-list govuk-list--number">
                <li><code>entryPath</code> on the journey (if specified)</li>
                <li>First step with <code>isEntryPoint: true</code></li>
              </ol>
              <p class="govuk-body">
                If neither is found, no redirect is registered and accessing the journey root returns a 404.
              </p>
            `,
          }),
        ],
      },
    }),

    // metadata property
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <h3 class="govuk-heading-s"><code>{{name}}</code></h3>
        {{slot:description}}
        {{slot:example}}
      `,
      values: { name: 'metadata' },
      slots: {
        description: [
          block<HtmlBlock>({
            variant: 'html',
            content: `
              <p class="govuk-body">
                An object for storing arbitrary custom data. Useful for application-specific
                configuration that doesn't fit standard properties.
              </p>
            `,
          }),
        ],
        example: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `metadata: {
  version: '2.1',
  category: 'registration',
  requiresAuth: true,
  analyticsId: 'UA-12345',
}`,
          }),
        ],
      },
    }),

    // Complete Example section
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Complete Example</h2>
        <p class="govuk-body">Here's a journey definition using all the options:</p>
      `,
    }),

    block<GovUKDetails>({
      variant: 'govukDetails',
      summaryText: 'View complete example',
      content: [
        block<CodeBlock>({
          variant: 'codeBlock',
          language: 'typescript',
          code: `
import { journey, loadTransition } from '@form-engine/form/builders'
import { MyEffects } from './effects'
import { welcomeStep, detailsStep, reviewStep, confirmationStep } from './steps'

export default journey({
  // Required properties
  code: 'food-business-registration',
  title: 'Register a Food Business',
  path: '/food-business-registration',

  // Optional: description
  description: 'Complete registration in 10 minutes',

  // Optional: view configuration
  view: {
    template: 'partials/form-step',
    locals: {
      serviceName: 'Food Business Registration',
      showProgress: true,
    },
  },

  // Optional: override entry point
  entryPath: '/welcome',

  // Optional: custom metadata
  metadata: {
    version: '1.0',
    category: 'registration',
  },

  // The steps in this journey
  steps: [
    welcomeStep,
    detailsStep,
    reviewStep,
    confirmationStep,
  ],
})`,
        }),
      ],
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
              href: '/forms/form-engine-developer-guide/journeys-and-steps/intro',
              labelText: 'Introduction',
            },
            next: {
              href: '/forms/form-engine-developer-guide/journeys-and-steps/steps',
              labelText: 'Step Configuration',
            },
          }),
        ],
      },
    }),
  ],
})
