import { block } from '@form-engine/form/builders'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { GovUKDetails, GovUKPagination } from '@form-engine-govuk-components/components'
import { CodeBlock } from '../../../../components/code-block/codeBlock'
import { parseGovUKMarkdown } from '../../../../helpers/markdown'

/**
 * Journeys & Steps - Step Configuration
 *
 * Deep dive into the step() builder and all its configuration options.
 */
export const pageContent = block<TemplateWrapper>({
  variant: 'templateWrapper',
  template: parseGovUKMarkdown(`
# Step Configuration

The \`step()\` builder function creates a step definition.
Steps are the individual pages that make up a journey. {.lead}

---

## The step() Builder

Basic usage:

{{slot:basicCode}}

---

## Required Properties

Every step must have these two properties:

### \`path\` <span class="govuk-tag govuk-tag--red">Required</span>

The URL path segment for this step. Combined with the journey's path
to form the complete URL.

- Must start with a forward slash
- Should be URL-safe (lowercase, hyphens for spaces)
- Full URL becomes: \`/forms{journey.path}{step.path}\`

{{slot:pathExample}}

### \`title\` <span class="govuk-tag govuk-tag--red">Required</span>

A human-readable title for the step. Used in:

- Navigation and progress indicators
- Page titles (browser tab)
- Accessibility announcements

{{slot:titleExample}}

---

## Optional Properties

### \`isEntryPoint\` <span class="govuk-tag govuk-tag--grey">Optional</span>

Marks this step as an entry point. Entry point steps are exempt from
reachability validation - they don't need to be reachable via navigation
from other steps.

Additionally, the **first** step with \`isEntryPoint: true\`
is used as the default redirect when users navigate to the journey's root path
(unless the journey has \`entryPath\` set).

{{slot:isEntryPointExample}}

> **Note:** Multiple steps can have \`isEntryPoint: true\`.
> This is useful for hub-and-spoke patterns where several steps serve as
> independent starting points.

### \`blocks\` <span class="govuk-tag govuk-tag--grey">Optional</span>

An array of block and field definitions. Blocks display content;
fields collect user input.

{{slot:blocksExample}}

See the [Blocks & Fields](/forms/form-engine-developer-guide/blocks-and-fields/intro) section for details on defining blocks and fields.

### \`view\` <span class="govuk-tag govuk-tag--grey">Optional</span>

Override the journey's view configuration for this specific step.
Useful when a step needs different rendering.

{{slot:viewExample}}

### \`backlink\` <span class="govuk-tag govuk-tag--grey">Optional</span>

Override the default back link. By default, steps show a back link
to the previous step. Use this to customise or hide it.

{{slot:backlinkExample}}

### \`metadata\` <span class="govuk-tag govuk-tag--grey">Optional</span>

Custom data specific to this step. Useful for application-specific
behaviour or conditional logic.

{{slot:metadataExample}}

### \`data\` <span class="govuk-tag govuk-tag--grey">Optional</span>

Static data available to this step via \`Data()\` references.
Merged with inherited journey data (step values take precedence).

{{slot:dataExample}}

See the [Journey Configuration](/forms/form-engine-developer-guide/journeys-and-steps/journeys) page for full usage examples.

---

## Lifecycle Transitions

Steps can define lifecycle transitions that control behaviour at different points in the request lifecycle.

### \`onLoad\` <span class="govuk-tag govuk-tag--grey">Optional</span>

An array of load transitions that run when the step is accessed.
Use this to fetch step-specific data.

{{slot:onLoadExample}}

See the [Load Transitions](/forms/form-engine-developer-guide/transitions/load) page for details.

### \`onAccess\` <span class="govuk-tag govuk-tag--grey">Optional</span>

An array of access transitions that control access to this step.
Use this for step-specific guards or redirects.

{{slot:onAccessExample}}

See the [Access Transitions](/forms/form-engine-developer-guide/transitions/access) page for details.

### \`onAction\` <span class="govuk-tag govuk-tag--grey">Optional</span>

An array of action transitions that run on form submission based on conditions.
Use this for handling different button clicks or conditional logic.

{{slot:onActionExample}}

See the [Action Transitions](/forms/form-engine-developer-guide/transitions/action) page for details.

### \`onSubmission\` <span class="govuk-tag govuk-tag--grey">Optional</span>

An array of submission transitions that handle form submission, validation,
and navigation to the next step.

{{slot:onSubmissionExample}}

See the [Submit Transitions](/forms/form-engine-developer-guide/transitions/submit) page for details.

---

## Complete Example

Here's a step definition using common options:

{{slot:completeExample}}

---

{{slot:pagination}}

[← Back to Guide Hub](/forms/form-engine-developer-guide/hub)
`),
  slots: {
    basicCode: [
      block<CodeBlock>({
        variant: 'codeBlock',
        language: 'typescript',
        code: `import { step } from '@form-engine/form/builders'

export const myStep = step({
  path: '/my-step',
  title: 'My Step',
  blocks: [/* block and field definitions */],
})`,
      }),
    ],
    pathExample: [
      block<CodeBlock>({
        variant: 'codeBlock',
        language: 'typescript',
        code: `path: '/personal-details'`,
      }),
    ],
    titleExample: [
      block<CodeBlock>({
        variant: 'codeBlock',
        language: 'typescript',
        code: `title: 'Enter your personal details'`,
      }),
    ],
    isEntryPointExample: [
      block<CodeBlock>({
        variant: 'codeBlock',
        language: 'typescript',
        code: `isEntryPoint: true`,
      }),
    ],
    blocksExample: [
      block<CodeBlock>({
        variant: 'codeBlock',
        language: 'typescript',
        code: `blocks: [
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
    viewExample: [
      block<CodeBlock>({
        variant: 'codeBlock',
        language: 'typescript',
        code: `view: {
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
    backlinkExample: [
      block<CodeBlock>({
        variant: 'codeBlock',
        language: 'typescript',
        code: `// Custom back link URL
backlink: '/forms/my-journey/previous-section'

// Or disable the back link
backlink: ''`,
      }),
    ],
    metadataExample: [
      block<CodeBlock>({
        variant: 'codeBlock',
        language: 'typescript',
        code: `metadata: {
  section: 'personal-info',
  progressWeight: 2,
  analyticsPageName: 'Personal Details Entry',
}`,
      }),
    ],
    dataExample: [
      block<CodeBlock>({
        variant: 'codeBlock',
        language: 'typescript',
        code: `data: {
  pageHeading: 'Enter your personal details',
  maxItems: 5,
}`,
      }),
    ],
    onLoadExample: [
      block<CodeBlock>({
        variant: 'codeBlock',
        language: 'typescript',
        code: `onLoad: [
  loadTransition({
    effects: [MyStepEffects.loadOptions()],
  }),
]`,
      }),
    ],
    onAccessExample: [
      block<CodeBlock>({
        variant: 'codeBlock',
        language: 'typescript',
        code: `onAccess: [
  accessTransition({
    guards: Answer('termsAccepted').not.match(Condition.Equals(true)),
    redirect: [next({ goto: '/terms' })],
  }),
]`,
      }),
    ],
    onActionExample: [
      block<CodeBlock>({
        variant: 'codeBlock',
        language: 'typescript',
        code: `onAction: [
  actionTransition({
    when: Post('action').match(Condition.Equals('lookup')),
    effects: [MyStepEffects.lookupPostcode(Post('postcode'))],
  }),
]`,
      }),
    ],
    onSubmissionExample: [
      block<CodeBlock>({
        variant: 'codeBlock',
        language: 'typescript',
        code: `onSubmission: [
  submitTransition({
    validate: true,
    onValid: {
      effects: [MyStepEffects.saveAnswers()],
      next: [next({ goto: '/review' })],
    },
  }),
]`,
      }),
    ],
    completeExample: [
      block<GovUKDetails>({
        variant: 'govukDetails',
        summaryText: 'View complete example',
        content: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `import { step, block, field, Format, Data } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { TextField } from '@form-engine/registry/components/text-input'

export const personalDetailsStep = step({
  // Required
  path: '/personal-details',
  title: 'Enter your personal details',

  // Mark as entry point
  isEntryPoint: true,

  // Custom back link
  backlink: '/forms/my-journey/welcome',

  // Custom metadata
  metadata: {
    section: 'about-you',
  },

  // Static data (merged with journey data)
  data: {
    pageHeading: 'Personal details',
  },

  // Content and inputs
  blocks: [
    block<HtmlBlock>({
      variant: 'html',
      content: Format('<h1 class="govuk-heading-l">{0}</h1>', Data('pageHeading')),
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
})`,
          }),
        ],
      }),
    ],
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
})
