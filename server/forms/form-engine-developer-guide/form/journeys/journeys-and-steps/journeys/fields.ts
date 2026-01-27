import { TemplateWrapper } from '@form-engine/registry/components'
import { GovUKDetails, GovUKPagination } from '@form-engine-govuk-components/components'
import { CodeBlock } from '../../../../components'
import { parseGovUKMarkdown } from '../../../../helpers/markdown'

/**
 * Journeys & Steps - Journey Configuration
 *
 * Deep dive into the journey() builder and all its configuration options.
 */
export const pageContent = TemplateWrapper({
  template: parseGovUKMarkdown(`
# Journey Configuration

The \`journey()\` builder function creates a journey definition.
This page documents all available configuration options. {.lead}

---

## The journey() Builder

Basic usage:

{{slot:basicCode}}

---

## Required Properties

Every journey must have these three properties:

### \`code\` <span class="govuk-tag govuk-tag--red">Required</span>

A unique identifier for the journey. Used for storing and looking up
form instances programmatically.

- Must be unique across all journeys in your application
- Convention: use kebab-case matching the folder name

{{slot:codeExample}}

### \`path\` <span class="govuk-tag govuk-tag--red">Required</span>

The URL path segment for this journey. All steps within the journey
will be prefixed with this path.

- Must start with a forward slash
- Should be URL-safe (lowercase, hyphens for spaces)

{{slot:pathExample}}

### \`title\` <span class="govuk-tag govuk-tag--red">Required</span>

A human-readable title for the journey. Used in navigation, progress indicators,
and page titles.

{{slot:titleExample}}

---

## Optional Properties

### \`description\` <span class="govuk-tag govuk-tag--grey">Optional</span>

A description of the journey's purpose. Useful for documentation
and potentially displayed in UI elements.

{{slot:descriptionExample}}

### \`steps\` <span class="govuk-tag govuk-tag--grey">Optional</span>

An array of step definitions that make up the journey. Steps are
the individual pages users navigate through.

{{slot:stepsExample}}

See the [Step Configuration](/form-engine-developer-guide/journeys-and-steps/steps) page for details on defining steps.

### \`children\` <span class="govuk-tag govuk-tag--grey">Optional</span>

An array of child journey definitions for creating nested, hierarchical structures.
Child journeys have their paths prefixed with the parent journey's path.

{{slot:childrenExample}}

See the [Nested Journeys](/form-engine-developer-guide/journeys-and-steps/nested-journeys) page for details on using children.

### \`view\` <span class="govuk-tag govuk-tag--grey">Optional</span>

Configuration for how the journey renders. Contains template selection
and data passed to templates.

{{slot:viewExample}}

> **Inheritance:** If a step doesn't specify its own \`view\`,
> it inherits from the parent journey's view configuration.

### \`entryPath\` <span class="govuk-tag govuk-tag--grey">Optional</span>

Override the default entry point for the journey. When a user navigates
to the journey's root path, they'll be redirected to this path.

{{slot:entryPathExample}}

**Resolution priority:**

1. \`entryPath\` on the journey (if specified)
2. First step with \`isEntryPoint: true\`

If neither is found, no redirect is registered and accessing the journey root returns a 404.

### \`metadata\` <span class="govuk-tag govuk-tag--grey">Optional</span>

An object for storing arbitrary custom data. Useful for application-specific
configuration that doesn't fit standard properties.

{{slot:metadataExample}}

### \`data\` <span class="govuk-tag govuk-tag--grey">Optional</span>

Static data available to this journey and all its steps via \`Data()\` references.
This data is merged into the evaluation context before any lifecycle transitions run.

{{slot:dataExample}}

Accessing in expressions using \`Data()\`:

{{slot:dataAccessExample}}

Accessing in effects using \`context.getData()\`:

{{slot:dataEffectExample}}

> **Inheritance:** Step \`data\` is shallow-merged with journey \`data\`,
> with step values taking precedence.

---

## Lifecycle Transitions

Journeys can define lifecycle transitions that run for every step within the journey.

### \`onAccess\` <span class="govuk-tag govuk-tag--grey">Optional</span>

An array of access transitions that run for every step in the journey.
Use this to load shared data, check permissions, and redirect or return errors.

{{slot:onAccessExample}}

See the [Access Transitions](/form-engine-developer-guide/transitions/access) page for details.

---

## Complete Example

Here's a journey definition using all the options:

{{slot:completeExample}}

---

{{slot:pagination}}

[← Back to Guide Hub](/form-engine-developer-guide/hub)
`),
  slots: {
    basicCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          import { journey } from '@form-engine/form/builders'

          export default const myJourney = journey({
            code: 'my-journey',
            title: 'My Journey',
            path: '/my-journey',
            steps: [/* step definitions */],
          })
        `,
      }),
    ],
    codeExample: [
      CodeBlock({
        language: 'typescript',
        code: `
          code: 'food-business-registration'
        `,
      }),
    ],
    pathExample: [
      CodeBlock({
        language: 'typescript',
        code: `
          path: '/food-business-registration'
        `,
      }),
    ],
    titleExample: [
      CodeBlock({
        language: 'typescript',
        code: `
          title: 'Register a Food Business'
        `,
      }),
    ],
    descriptionExample: [
      CodeBlock({
        language: 'typescript',
        code: `
          description: 'Complete the registration process for your food business in 10 steps'
        `,
      }),
    ],
    stepsExample: [
      CodeBlock({
        language: 'typescript',
        code: `
          steps: [
            welcomeStep,
            personalDetailsStep,
            businessDetailsStep,
            reviewStep,
            confirmationStep,
          ]
        `,
      }),
    ],
    childrenExample: [
      CodeBlock({
        language: 'typescript',
        code: `
          children: [
            journey({
              code: 'business-details',
              title: 'Business Details',
              path: '/business-details',
              steps: [/* ... */],
            }),
          ]
        `,
      }),
    ],
    viewExample: [
      CodeBlock({
        language: 'typescript',
        code: `
          view: {
            // Nunjucks template to use for rendering steps
            template: 'partials/form-step',

            // Data passed to the template as locals
            locals: {
              showProgress: true,
              serviceName: 'Food Business Registration',
            },

            // Hide from navigation tree (optional)
            hiddenFromNavigation: false,
          }
        `,
      }),
    ],
    entryPathExample: [
      CodeBlock({
        language: 'typescript',
        code: `
          entryPath: '/welcome'
        `,
      }),
    ],
    metadataExample: [
      CodeBlock({
        language: 'typescript',
        code: `
          metadata: {
            version: '2.1',
            category: 'registration',
            requiresAuth: true,
            analyticsId: 'UA-12345',
          }
        `,
      }),
    ],
    dataExample: [
      CodeBlock({
        language: 'typescript',
        code: `
          data: {
            serviceName: 'Food Business Registration',
            supportEmail: 'support@example.com',
            maxFileSize: 10485760,
          }
        `,
      }),
    ],
    dataAccessExample: [
      CodeBlock({
        language: 'typescript',
        code: `
          Format('Contact us at {0}', Data('supportEmail'))
        `,
      }),
    ],
    dataEffectExample: [
      CodeBlock({
        language: 'typescript',
        code: `
          effects: [
            Effect(async (context) => {
              const email = context.getData('supportEmail')
              // ...
            }),
          ]
        `,
      }),
    ],
    onAccessExample: [
      CodeBlock({
        language: 'typescript',
        code: `
          onAccess: [
            accessTransition({
              effects: [MyJourneyEffects.loadUserData()],
              next: [
                redirect({
                  when: Data('user.isAuthenticated').not.match(Condition.Equals(true)),
                  goto: '/login',
                }),
              ],
            }),
          ]
        `,
      }),
    ],
    completeExample: [
      GovUKDetails({
        summaryText: 'View complete example',
        content: [
          CodeBlock({
            language: 'typescript',
            code: `
              import { journey } from '@form-engine/form/builders'
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

                // Optional: static data for Data() references
                data: {
                  supportEmail: 'support@example.com',
                  maxFileSize: 10485760,
                },

                // The steps in this journey
                steps: [
                  welcomeStep,
                  detailsStep,
                  reviewStep,
                  confirmationStep,
                ],
              })
            `,
          }),
        ],
      }),
    ],
    pagination: [
      GovUKPagination({
        classes: 'govuk-pagination--inline',
        previous: {
          href: '/form-engine-developer-guide/journeys-and-steps/intro',
          labelText: 'Introduction',
        },
        next: {
          href: '/form-engine-developer-guide/journeys-and-steps/steps',
          labelText: 'Step Configuration',
        },
      }),
    ],
  },
})
