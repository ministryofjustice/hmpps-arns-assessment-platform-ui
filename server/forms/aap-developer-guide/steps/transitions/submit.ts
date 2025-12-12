import { step, block } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { CodeBlock } from '@form-engine/registry/components/codeBlock'
import { GovUKPagination } from '@form-engine-govuk-components/components'

/**
 * Transitions - Submit
 *
 * onSubmission transitions for handling form submissions, validation, and navigation.
 */
export const submitStep = step({
  path: '/submit',
  title: 'Submit Transitions',
  blocks: [
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <h1 class="govuk-heading-l">Submit Transitions</h1>

        <p class="govuk-body-l">
          <code>submitTransition()</code> handles form submissions &mdash; validation,
          saving data, and navigation. This is the most commonly used transition type.
        </p>

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <h2 class="govuk-heading-m">Interface</h2>
      `,
    }),

    // Property: when
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <h3 class="govuk-heading-s"><code>{{name}}</code> <span class="govuk-tag govuk-tag--grey">Optional</span></h3>
        <p class="govuk-body">
          Condition to match this transition. Typically matches a button's <code>name</code> and
          <code>value</code>. If omitted, the transition always matches (use as fallback).
        </p>
        {{slot:code}}
      `,
      values: { name: 'when' },
      slots: {
        code: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `when: Post('action').match(Condition.Equals('save'))`,
          }),
        ],
      },
    }),

    // Property: guards
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <h3 class="govuk-heading-s"><code>{{name}}</code> <span class="govuk-tag govuk-tag--grey">Optional</span></h3>
        <p class="govuk-body">
          Permission check. When <strong>true</strong>, the transition proceeds.
          <strong>Note:</strong> This is opposite to <code>accessTransition</code> where guards=true means deny.
        </p>
        {{slot:code}}
      `,
      values: { name: 'guards' },
      slots: {
        code: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `guards: Data('user.canSubmit').match(Condition.Equals(true))`,
          }),
        ],
      },
    }),

    // Property: validate
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <h3 class="govuk-heading-s"><code>{{name}}</code> <span class="govuk-tag govuk-tag--grey">Optional</span></h3>
        <p class="govuk-body">
          Whether to show validation errors. Defaults to <code>false</code>. When <code>true</code>,
          <code>onValid</code> and <code>onInvalid</code> paths become available.
        </p>
        {{slot:code}}
      `,
      values: { name: 'validate' },
      slots: {
        code: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `validate: true   // Show errors, enable onValid/onInvalid
validate: false  // Hide errors, use onAlways only`,
          }),
        ],
      },
    }),

    // Property: onAlways
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <h3 class="govuk-heading-s"><code>{{name}}</code> <span class="govuk-tag govuk-tag--grey">Optional</span></h3>
        <p class="govuk-body">
          Runs regardless of validation result. Use with <code>validate: false</code> for
          save-draft functionality. Contains optional <code>effects</code> and <code>next</code> arrays.
        </p>
        {{slot:code}}
      `,
      values: { name: 'onAlways' },
      slots: {
        code: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `onAlways: {
  effects: [MyEffects.saveDraft()],
  next: [next({ goto: '/dashboard' })],
}`,
          }),
        ],
      },
    }),

    // Property: onValid
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <h3 class="govuk-heading-s"><code>{{name}}</code> <span class="govuk-tag govuk-tag--grey">Optional</span></h3>
        <p class="govuk-body">
          Runs only if validation passes. Requires <code>validate: true</code>.
          Contains optional <code>effects</code> and <code>next</code> arrays.
        </p>
        {{slot:code}}
      `,
      values: { name: 'onValid' },
      slots: {
        code: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `onValid: {
  effects: [MyEffects.saveAnswers()],
  next: [next({ goto: '/next-step' })],
}`,
          }),
        ],
      },
    }),

    // Property: onInvalid
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <h3 class="govuk-heading-s"><code>{{name}}</code> <span class="govuk-tag govuk-tag--grey">Optional</span></h3>
        <p class="govuk-body">
          Runs only if validation fails. Requires <code>validate: true</code>.
          Omit this (and its <code>next</code>) to stay on the current step showing errors.
        </p>
        {{slot:code}}
      `,
      values: { name: 'onInvalid' },
      slots: {
        code: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `// Explicit handling
onInvalid: {
  effects: [MyEffects.logValidationFailure()],
  // No 'next' - stays on current step
}

// Or simply omit onInvalid to stay on page with errors`,
          }),
        ],
      },
    }),

    // Validation behaviour - CRITICAL
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Validation Behaviour</h2>

        <div class="govuk-warning-text">
          <span class="govuk-warning-text__icon" aria-hidden="true">!</span>
          <strong class="govuk-warning-text__text">
            <span class="govuk-visually-hidden">Warning</span>
            Validation always runs internally. The <code>validate</code> property controls
            whether errors are <strong>shown</strong> and which paths are available.
          </strong>
        </div>

        <table class="govuk-table">
          <thead class="govuk-table__head">
            <tr class="govuk-table__row">
              <th scope="col" class="govuk-table__header"><code>validate</code></th>
              <th scope="col" class="govuk-table__header">Error messages</th>
              <th scope="col" class="govuk-table__header">Available paths</th>
            </tr>
          </thead>
          <tbody class="govuk-table__body">
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>true</code></td>
              <td class="govuk-table__cell">Visible to user</td>
              <td class="govuk-table__cell"><code>onValid</code>, <code>onInvalid</code>, <code>onAlways</code></td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>false</code></td>
              <td class="govuk-table__cell">Hidden</td>
              <td class="govuk-table__cell"><code>onAlways</code> only</td>
            </tr>
          </tbody>
        </table>

        <h3 class="govuk-heading-s">Guards vs accessTransition</h3>
        <p class="govuk-body">
          Note: <code>guards</code> in submitTransition works <strong>opposite</strong> to accessTransition:
        </p>
        <ul class="govuk-list govuk-list--bullet">
          <li><strong>submitTransition:</strong> guards = true &rarr; proceed with transition</li>
          <li><strong>accessTransition:</strong> guards = true &rarr; deny access, redirect</li>
        </ul>
      `,
    }),

    // Basic example
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Basic Example</h2>
        <p class="govuk-body">
          A simple form that validates, saves, and navigates:
        </p>
        {{slot:code}}
      `,
      slots: {
        code: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `step({
  path: '/personal-details',
  title: 'Personal Details',

  blocks: [
    field<GovUKTextInput>({
      variant: 'govukTextInput',
      code: 'fullName',
      label: 'Full name',
      validate: [
        validation({
          when: Self().not.match(Condition.IsRequired()),
          message: 'Enter your full name',
        }),
      ],
    }),
    block<GovUKButton>({
      variant: 'govukButton',
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
      },
    }),

    // Multiple buttons
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Multiple Submit Buttons</h2>
        <p class="govuk-body">
          Use <code>when</code> to handle different buttons differently:
        </p>
        {{slot:code}}
      `,
      slots: {
        code: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `blocks: [
  // Form fields...

  // Save and add another
  block<GovUKButton>({
    variant: 'govukButton',
    text: 'Save and add another',
    name: 'action',
    value: 'saveAndAdd',
    classes: 'govuk-button--secondary',
  }),

  // Save and finish
  block<GovUKButton>({
    variant: 'govukButton',
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
      },
    }),

    // Save draft without validation
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Save Draft (Skip Validation)</h2>
        <p class="govuk-body">
          Use <code>validate: false</code> and <code>onAlways</code> to save without validation:
        </p>
        {{slot:code}}
      `,
      slots: {
        code: [
          block<CodeBlock>({
            variant: 'codeBlock',
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
      },
    }),

    // Conditional navigation
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Conditional Navigation</h2>
        <p class="govuk-body">
          Navigate to different steps based on answers:
        </p>
        {{slot:code}}
      `,
      slots: {
        code: [
          block<CodeBlock>({
            variant: 'codeBlock',
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
      },
    }),

    // Staying on current step
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Staying on Current Step</h2>

        <p class="govuk-body">
          To stay on the current step (e.g., after failed validation), simply
          <strong>omit the <code>next</code> array</strong>:
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
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

    // First-match semantics
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">First-Match Semantics</h2>

        <p class="govuk-body">
          Only the <strong>first</strong> submitTransition with a matching <code>when</code>
          condition executes. Order matters:
        </p>

        <ul class="govuk-list govuk-list--bullet">
          <li>Put specific conditions first</li>
          <li>Put fallback (no <code>when</code>) last</li>
          <li>Always include a fallback to avoid unhandled submissions</li>
        </ul>
      `,
    }),

    // Best practices
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Best Practices</h2>

        <ul class="govuk-list govuk-list--bullet">
          <li>
            <strong>Use descriptive action values:</strong> <code>saveDraft</code>,
            <code>saveAndAdd</code>, <code>delete</code> instead of <code>1</code>, <code>2</code>
          </li>
          <li>
            <strong>Always include a fallback:</strong> A submitTransition without
            <code>when</code> catches anything not explicitly handled
          </li>
          <li>
            <strong>Validate on continue:</strong> Use <code>validate: true</code> for
            primary continue/save buttons
          </li>
          <li>
            <strong>Skip validation for drafts:</strong> Use <code>validate: false</code>
            with <code>onAlways</code> for save-draft functionality
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
      `,
      slots: {
        pagination: [
          block<GovUKPagination>({
            variant: 'govukPagination',
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
    }),
  ],
})
