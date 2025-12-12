import { step, block } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { CodeBlock } from '@form-engine/registry/components/codeBlock'
import { GovUKDetails, GovUKPagination } from '@form-engine-govuk-components/components'

/**
 * Journeys & Steps - Step Configuration
 *
 * Deep dive into the step() builder and all its configuration options.
 */
export const stepsStep = step({
  path: '/steps',
  title: 'Step Configuration',
  blocks: [
    // Page header
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <h1 class="govuk-heading-l">Step Configuration</h1>
        <p class="govuk-body-l">
          The <code>step()</code> builder function creates a step definition.
          Steps are the individual pages that make up a journey.
        </p>
      `,
    }),

    // The step() Builder section
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">The step() Builder</h2>
        <p class="govuk-body">Basic usage:</p>
        {{slot:code}}
      `,
      slots: {
        code: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `
import { step } from '@form-engine/form/builders'

export const myStep = step({
  path: '/my-step',
  title: 'My Step',
  blocks: [/* block and field definitions */],
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
        <p class="govuk-body">Every step must have these two properties:</p>
      `,
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
                The URL path segment for this step. Combined with the journey's path
                to form the complete URL.
              </p>
              <ul class="govuk-list govuk-list--bullet">
                <li>Must start with a forward slash</li>
                <li>Should be URL-safe (lowercase, hyphens for spaces)</li>
                <li>Full URL becomes: <code>/forms{journey.path}{step.path}</code></li>
              </ul>
            `,
          }),
        ],
        example: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `path: '/personal-details'`,
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
              <p class="govuk-body">A human-readable title for the step. Used in:</p>
              <ul class="govuk-list govuk-list--bullet">
                <li>Navigation and progress indicators</li>
                <li>Page titles (browser tab)</li>
                <li>Accessibility announcements</li>
              </ul>
            `,
          }),
        ],
        example: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `title: 'Enter your personal details'`,
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

    // isEntryPoint property
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <h3 class="govuk-heading-s"><code>{{name}}</code></h3>
        {{slot:description}}
        {{slot:example}}
        {{slot:footer}}
      `,
      values: { name: 'isEntryPoint' },
      slots: {
        description: [
          block<HtmlBlock>({
            variant: 'html',
            content: `
              <p class="govuk-body">
                Marks this step as an entry point. Entry point steps are exempt from
                reachability validation - they don't need to be reachable via navigation
                from other steps.
              </p>
              <p class="govuk-body">
                Additionally, the <strong>first</strong> step with <code>isEntryPoint: true</code>
                is used as the default redirect when users navigate to the journey's root path
                (unless the journey has <code>entryPath</code> set).
              </p>
            `,
          }),
        ],
        example: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `isEntryPoint: true`,
          }),
        ],
        footer: [
          block<HtmlBlock>({
            variant: 'html',
            content: `
              <div class="govuk-inset-text">
                <p class="govuk-body">
                  <strong>Note:</strong> Multiple steps can have <code>isEntryPoint: true</code>.
                  This is useful for hub-and-spoke patterns where several steps serve as
                  independent starting points.
                </p>
              </div>
            `,
          }),
        ],
      },
    }),

    // blocks property
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <h3 class="govuk-heading-s"><code>{{name}}</code></h3>
        {{slot:description}}
        {{slot:example}}
        {{slot:footer}}
      `,
      values: { name: 'blocks' },
      slots: {
        description: [
          block<HtmlBlock>({
            variant: 'html',
            content: `
              <p class="govuk-body">
                An array of block and field definitions. Blocks display content;
                fields collect user input.
              </p>
            `,
          }),
        ],
        example: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `
blocks: [
  block<HtmlBlock>({
    variant: 'html',
    content: '<h1>Welcome</h1>',
  }),
  field<TextField>({
    variant: 'text',
    code: 'fullName',
    label: 'Full name',
  }),
  field<TextField>({
    variant: 'email',
    code: 'email',
    label: 'Email address',
  }),
]`,
          }),
        ],
        footer: [
          block<HtmlBlock>({
            variant: 'html',
            content: `
              <p class="govuk-body">
                See the <a href="/forms/form-engine-developer-guide/blocks-and-fields/intro" class="govuk-link">Blocks & Fields</a>
                section for details on defining blocks and fields.
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
      `,
      values: { name: 'view' },
      slots: {
        description: [
          block<HtmlBlock>({
            variant: 'html',
            content: `
              <p class="govuk-body">
                Override the journey's view configuration for this specific step.
                Useful when a step needs different rendering.
              </p>
            `,
          }),
        ],
        example: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `
view: {
  // Use a different template
  template: 'partials/confirmation-page',

  // Additional data for the template
  locals: {
    showConfetti: true,
  },

  // Hide from navigation sidebar
  hiddenFromNavigation: true,
}`,
          }),
        ],
      },
    }),

    // backlink property
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <h3 class="govuk-heading-s"><code>{{name}}</code></h3>
        {{slot:description}}
        {{slot:example}}
      `,
      values: { name: 'backlink' },
      slots: {
        description: [
          block<HtmlBlock>({
            variant: 'html',
            content: `
              <p class="govuk-body">
                Override the default back link. By default, steps show a back link
                to the previous step. Use this to customise or hide it.
              </p>
            `,
          }),
        ],
        example: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `
// Custom back link URL
backlink: '/forms/my-journey/previous-section'

// Or disable the back link
backlink: ''`,
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
                Custom data specific to this step. Useful for application-specific
                behaviour or conditional logic.
              </p>
            `,
          }),
        ],
        example: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `
metadata: {
  section: 'personal-info',
  progressWeight: 2,
  analyticsPageName: 'Personal Details Entry',
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
        <p class="govuk-body">Here's a step definition using common options:</p>
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
import { step, block, field } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { TextField } from '@form-engine/registry/components/text-input'

export const personalDetailsStep = step({
  // Required
  path: '/personal-details',
  title: 'Enter your personal details',

  // Mark as entry point
  isEntryPoint: true,

  // Content and inputs
  blocks: [
    block<HtmlBlock>({
      variant: 'html',
      content: \`
        <h1 class="govuk-heading-l">Personal details</h1>
        <p class="govuk-body">
          We need some information about you.
        </p>
      \`,
    }),
    field<TextField>({
      variant: 'text',
      code: 'fullName',
      label: 'Full name',
      hint: 'Enter your first and last name',
    }),
    field<TextField>({
      variant: 'email',
      code: 'email',
      label: 'Email address',
      hint: "We'll use this to send your confirmation",
    }),
  ],

  // Custom back link
  backlink: '/forms/my-journey/welcome',

  // Custom metadata
  metadata: {
    section: 'about-you',
  },
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
              href: '/forms/form-engine-developer-guide/journeys-and-steps/journeys',
              labelText: 'Journey Configuration',
            },
            next: {
              href: '/forms/form-engine-developer-guide/journeys-and-steps/nested-journeys',
              labelText: 'Nested Journeys',
            },
          }),
        ],
      },
    }),
  ],
})
