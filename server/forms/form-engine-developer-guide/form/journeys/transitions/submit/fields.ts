import { TemplateWrapper } from '@form-engine/registry/components'
import { GovUKPagination } from '@form-engine-govuk-components/components'
import { CodeBlock } from '../../../../components'
import { parseGovUKMarkdown } from '../../../../helpers/markdown'

/**
 * Transitions - Submit
 *
 * onSubmission transitions for handling form submissions, validation, and navigation.
 */
export const pageContent = TemplateWrapper({
  template: parseGovUKMarkdown(`
  # Submit Transitions

  \`submitTransition()\` handles form submissions — validation,
  saving data, and navigation. This is the most commonly used transition type. {.lead}

  ---

  ## Interface

  <h3 class="govuk-heading-s"><code>when</code> <span class="govuk-tag govuk-tag--grey">Optional</span></h3>

  Condition to match this transition. Typically matches a button's \`name\` and
  \`value\`. If omitted, the transition always matches (use as fallback).

  {{slot:whenCode}}

  <h3 class="govuk-heading-s"><code>guards</code> <span class="govuk-tag govuk-tag--grey">Optional</span></h3>

  Permission check. When **true**, the transition proceeds.
  **Note:** This is opposite to \`accessTransition\` where guards=true means deny.

  {{slot:guardsCode}}

  <h3 class="govuk-heading-s"><code>validate</code> <span class="govuk-tag govuk-tag--grey">Optional</span></h3>

  Whether to show validation errors. Defaults to \`false\`. When \`true\`,
  \`onValid\` and \`onInvalid\` paths become available.

  {{slot:validateCode}}

  <h3 class="govuk-heading-s"><code>onAlways</code> <span class="govuk-tag govuk-tag--grey">Optional</span></h3>

  Runs regardless of validation result. Use with \`validate: false\` for
  save-draft functionality. Contains optional \`effects\` and \`next\` arrays.

  {{slot:onAlwaysCode}}

  <h3 class="govuk-heading-s"><code>onValid</code> <span class="govuk-tag govuk-tag--grey">Optional</span></h3>

  Runs only if validation passes. Requires \`validate: true\`.
  Contains optional \`effects\` and \`next\` arrays.

  {{slot:onValidCode}}

  <h3 class="govuk-heading-s"><code>onInvalid</code> <span class="govuk-tag govuk-tag--grey">Optional</span></h3>

  Runs only if validation fails. Requires \`validate: true\`.
  Omit this (and its \`next\`) to stay on the current step showing errors.

  {{slot:onInvalidCode}}

  ---

  ## Validation Behaviour

  <div class="govuk-warning-text">
    <span class="govuk-warning-text__icon" aria-hidden="true">!</span>
    <strong class="govuk-warning-text__text">
      <span class="govuk-visually-hidden">Warning</span>
      Validation always runs internally. The <code>validate</code> property controls
      whether errors are <strong>shown</strong> and which paths are available.
    </strong>
  </div>

  | \`validate\` | Error messages | Available paths |
  |-------------|----------------|-----------------|
  | \`true\` | Visible to user | \`onValid\`, \`onInvalid\`, \`onAlways\` |
  | \`false\` | Hidden | \`onAlways\` only |

  ### Guards vs accessTransition

  Note: \`guards\` in submitTransition works **opposite** to accessTransition:

  - **submitTransition:** guards = true → proceed with transition
  - **accessTransition:** guards = true → deny access, redirect

  ---

  ## Basic Example

  A simple form that validates, saves, and navigates:

  {{slot:basicExampleCode}}

  ---

  ## Multiple Submit Buttons

  Use \`when\` to handle different buttons differently:

  {{slot:multiButtonCode}}

  ---

  ## Save Draft (Skip Validation)

  Use \`validate: false\` and \`onAlways\` to save without validation:

  {{slot:saveDraftCode}}

  ---

  ## Conditional Navigation

  Navigate to different steps based on answers:

  {{slot:conditionalNavCode}}

  ---

  ## Staying on Current Step

  To stay on the current step (e.g., after failed validation), simply
  **omit the \`next\` array**:

  {{slot:stayOnStepCode}}

  ---

  ## First-Match Semantics

  Only the **first** submitTransition with a matching \`when\`
  condition executes. Order matters:

  - Put specific conditions first
  - Put fallback (no \`when\`) last
  - Always include a fallback to avoid unhandled submissions

  ---

  ## Best Practices

  - **Use descriptive action values:** \`saveDraft\`,
    \`saveAndAdd\`, \`delete\` instead of \`1\`, \`2\`
  - **Always include a fallback:** A submitTransition without
    \`when\` catches anything not explicitly handled
  - **Validate on continue:** Use \`validate: true\` for
    primary continue/save buttons
  - **Skip validation for drafts:** Use \`validate: false\`
    with \`onAlways\` for save-draft functionality

  ---

  {{slot:pagination}}
`),
  slots: {
    whenCode: [
      CodeBlock({
        language: 'typescript',
        code: `when: Post('action').match(Condition.Equals('save'))`,
      }),
    ],
    guardsCode: [
      CodeBlock({
        language: 'typescript',
        code: `guards: Data('user.canSubmit').match(Condition.Equals(true))`,
      }),
    ],
    validateCode: [
      CodeBlock({
        language: 'typescript',
        code: `validate: true   // Show errors, enable onValid/onInvalid
validate: false  // Hide errors, use onAlways only`,
      }),
    ],
    onAlwaysCode: [
      CodeBlock({
        language: 'typescript',
        code: `onAlways: {
  effects: [MyEffects.saveDraft()],
  next: [next({ goto: '/dashboard' })],
}`,
      }),
    ],
    onValidCode: [
      CodeBlock({
        language: 'typescript',
        code: `onValid: {
  effects: [MyEffects.saveAnswers()],
  next: [next({ goto: '/next-step' })],
}`,
      }),
    ],
    onInvalidCode: [
      CodeBlock({
        language: 'typescript',
        code: `// Explicit handling
onInvalid: {
  effects: [MyEffects.logValidationFailure()],
  // No 'next' - stays on current step
}

// Or simply omit onInvalid to stay on page with errors`,
      }),
    ],
    basicExampleCode: [
      CodeBlock({
        language: 'typescript',
        code: `step({
  path: '/personal-details',
  title: 'Personal Details',

  blocks: [
    GovUKTextInput({
      code: 'fullName',
      label: 'Full name',
      validate: [
        validation({
          when: Self().not.match(Condition.IsRequired()),
          message: 'Enter your full name',
        }),
      ],
    }),
    GovUKButton({
      text: 'Continue',
    }),
  ],

  onSubmission: [
    submitTransition({
      validate: true,
      onValid: {
        effects: [MyEffects.saveAnswers()],
        next: [next({ goto: '/contact-details' })],
      },
      // onInvalid not needed - omitting 'next' stays on current step
    }),
  ],
})`,
      }),
    ],
    multiButtonCode: [
      CodeBlock({
        language: 'typescript',
        code: `blocks: [
  // Form fields...

  // Save and add another
  GovUKButton({
    text: 'Save and add another',
    name: 'action',
    value: 'saveAndAdd',
    classes: 'govuk-button--secondary',
  }),

  // Save and finish
  GovUKButton({
    text: 'Save and finish',
    name: 'action',
    value: 'save',
  }),
],

onSubmission: [
  // Handle "Save and add another"
  submitTransition({
    when: Post('action').match(Condition.Equals('saveAndAdd')),
    validate: true,
    onValid: {
      effects: [MyEffects.saveItem()],
      next: [next({ goto: '/items/new' })],
    },
  }),

  // Handle "Save and finish"
  submitTransition({
    when: Post('action').match(Condition.Equals('save')),
    validate: true,
    onValid: {
      effects: [MyEffects.saveItem()],
      next: [next({ goto: '/items' })],
    },
  }),
],`,
      }),
    ],
    saveDraftCode: [
      CodeBlock({
        language: 'typescript',
        code: `onSubmission: [
  // Save draft - no validation
  submitTransition({
    when: Post('action').match(Condition.Equals('saveDraft')),
    validate: false,
    onAlways: {
      effects: [MyEffects.saveDraft()],
      next: [next({ goto: '/dashboard' })],
    },
  }),

  // Continue - with validation
  submitTransition({
    when: Post('action').match(Condition.Equals('continue')),
    validate: true,
    onValid: {
      effects: [MyEffects.saveAnswers()],
      next: [next({ goto: '/next-step' })],
    },
  }),
],`,
      }),
    ],
    conditionalNavCode: [
      CodeBlock({
        language: 'typescript',
        code: `onSubmission: [
  submitTransition({
    validate: true,
    onValid: {
      effects: [MyEffects.saveAnswers()],
      next: [
        // Specific conditions first
        next({
          when: Answer('userType').match(Condition.Equals('business')),
          goto: '/business-details',
        }),
        next({
          when: Answer('userType').match(Condition.Equals('individual')),
          goto: '/individual-details',
        }),
        // Fallback last (no 'when')
        next({ goto: '/generic-details' }),
      ],
    },
  }),
],`,
      }),
    ],
    stayOnStepCode: [
      CodeBlock({
        language: 'typescript',
        code: `onSubmission: [
  submitTransition({
    validate: true,
    onValid: {
      effects: [MyEffects.saveAnswers()],
      next: [next({ goto: '/next-step' })],
    },
    // onInvalid omitted - stays on current step with errors shown
  }),
],`,
      }),
    ],
    pagination: [
      GovUKPagination({
        classes: 'govuk-pagination--inline',
        previous: {
          href: '/forms/form-engine-developer-guide/transitions/action',
          labelText: 'Action Transitions',
        },
        next: {
          href: '/forms/form-engine-developer-guide/transitions/navigation',
          labelText: 'Navigation',
        },
      }),
    ],
  },
})
