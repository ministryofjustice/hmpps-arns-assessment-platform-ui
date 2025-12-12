import { step, block } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { CodeBlock } from '@form-engine/registry/components/codeBlock'
import { GovUKPagination } from '@form-engine-govuk-components/components'

/**
 * Transitions - Navigation
 *
 * The next() builder and navigation patterns.
 */
export const navigationStep = step({
  path: '/navigation',
  title: 'Navigation',
  blocks: [
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <h1 class="govuk-heading-l">Navigation</h1>

        <p class="govuk-body-l">
          The <code>next()</code> builder defines where users go after transitions.
          Used in <code>onSubmission</code> and <code>redirect</code> arrays.
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
          Condition for this navigation to apply. If omitted, always matches (use as fallback).
          In arrays, the first <code>next()</code> with a matching <code>when</code> is used.
        </p>
        {{slot:code}}
      `,
      values: { name: 'when' },
      slots: {
        code: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `next({
  when: Answer('hasChildren').match(Condition.Equals('yes')),
  goto: '/children-details',
})`,
          }),
        ],
      },
    }),

    // Property: goto
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <h3 class="govuk-heading-s"><code>{{name}}</code> <span class="govuk-tag govuk-tag--red">Required</span></h3>
        <p class="govuk-body">
          Destination path. Can be a string (relative or absolute) or a <code>Format()</code>
          expression for dynamic paths. Does <strong>not</strong> accept <code>Conditional()</code>
          or <code>when().then()</code>.
        </p>
        {{slot:code}}
      `,
      values: { name: 'goto' },
      slots: {
        code: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `// Relative path (within current journey)
goto: 'next-step'

// Absolute path
goto: '/other-journey/step'

// Dynamic path with Format()
goto: Format('/items/%1/edit', Answer('itemId'))`,
          }),
        ],
      },
    }),

    // Static navigation
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Static Navigation</h2>
        <p class="govuk-body">
          The simplest form &mdash; navigate to a fixed path:
        </p>
        {{slot:code}}
      `,
      slots: {
        code: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `// Relative path (within current journey)
next({ goto: 'next-step' })

// Absolute path
next({ goto: '/some-other-journey/step' })`,
          }),
        ],
      },
    }),

    // Dynamic paths with Format
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Dynamic Paths with Format()</h2>
        <p class="govuk-body">
          Use <code>Format()</code> to build paths dynamically from answers or parameters:
        </p>
        {{slot:code}}
      `,
      slots: {
        code: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `// Navigate to edit page for specific item
next({ goto: Format('/items/%1/edit', Answer('selectedItemId')) })

// Use URL parameter
next({ goto: Format('/assessments/%1/summary', Params('assessmentId')) })

// Combine multiple values
next({ goto: Format('/users/%1/orders/%2', Answer('userId'), Answer('orderId')) })`,
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
          Use <code>when</code> to navigate to different destinations based on answers:
        </p>
        {{slot:code}}
      `,
      slots: {
        code: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `onValid: {
  effects: [MyEffects.saveAnswers()],
  next: [
    // Check conditions in order
    next({
      when: Answer('hasChildren').match(Condition.Equals('yes')),
      goto: '/children-details',
    }),
    next({
      when: Answer('hasPartner').match(Condition.Equals('yes')),
      goto: '/partner-details',
    }),
    // Fallback - always include one without 'when'
    next({ goto: '/summary' }),
  ],
}`,
          }),
        ],
      },
    }),

    // First-match semantics
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">First-Match Semantics</h2>

        <p class="govuk-body">
          Navigation arrays use <strong>first-match</strong> semantics:
        </p>

        <ol class="govuk-list govuk-list--number">
          <li>Each <code>next()</code> is evaluated in order</li>
          <li>The first one where <code>when</code> matches (or has no <code>when</code>) is used</li>
          <li>Remaining entries are ignored</li>
        </ol>

        <div class="govuk-inset-text">
          Always put specific conditions first and a fallback (no <code>when</code>) last.
        </div>
      `,
    }),

    // Staying on current step
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Staying on Current Step</h2>
        <p class="govuk-body">
          To stay on the current step, <strong>omit the <code>next</code> array entirely</strong>:
        </p>
        {{slot:code}}
      `,
      slots: {
        code: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `// Stay on step after invalid submission
onSubmission: [
  submitTransition({
    validate: true,
    onValid: {
      effects: [MyEffects.saveAnswers()],
      next: [next({ goto: '/next-step' })],
    },
    // No onInvalid - stays on current step with errors
  }),
],

// Stay on step after adding to collection
onSubmission: [
  submitTransition({
    when: Post('action').match(Condition.Equals('addItem')),
    validate: false,
    onAlways: {
      effects: [MyEffects.addItem()],
      // No next - stays on step to show updated list
    },
  }),
],`,
          }),
        ],
      },
    }),

    // Redirect arrays
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Redirect Arrays</h2>
        <p class="govuk-body">
          In <code>accessTransition</code>, use <code>redirect</code> instead of <code>next</code>.
          It works the same way:
        </p>
        {{slot:code}}
      `,
      slots: {
        code: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `onAccess: [
  accessTransition({
    guards: Data('user.isAuthenticated').match(Condition.Equals(true)),
    // redirect is always an array, even for single destination
    redirect: [next({ goto: '/login' })],
  }),
],

// Conditional redirect based on reason
onAccess: [
  accessTransition({
    guards: Data('assessment.status').match(Condition.Equals('active')),
    redirect: [
      next({
        when: Data('assessment.status').match(Condition.Equals('completed')),
        goto: '/assessment-complete',
      }),
      next({
        when: Data('assessment.status').match(Condition.Equals('cancelled')),
        goto: '/assessment-cancelled',
      }),
      next({ goto: '/assessments' }),
    ],
  }),
],`,
          }),
        ],
      },
    }),

    // What goto accepts
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">What <code>goto</code> Accepts</h2>

        <table class="govuk-table">
          <thead class="govuk-table__head">
            <tr class="govuk-table__row">
              <th scope="col" class="govuk-table__header">Type</th>
              <th scope="col" class="govuk-table__header">Example</th>
              <th scope="col" class="govuk-table__header">Use Case</th>
            </tr>
          </thead>
          <tbody class="govuk-table__body">
            <tr class="govuk-table__row">
              <td class="govuk-table__cell">String (relative)</td>
              <td class="govuk-table__cell"><code>'next-step'</code></td>
              <td class="govuk-table__cell">Navigate within current journey</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell">String (absolute)</td>
              <td class="govuk-table__cell"><code>'/other/path'</code></td>
              <td class="govuk-table__cell">Navigate to different journey</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell">Format()</td>
              <td class="govuk-table__cell"><code>Format('/items/%1', id)</code></td>
              <td class="govuk-table__cell">Dynamic path with values</td>
            </tr>
          </tbody>
        </table>

        <div class="govuk-warning-text">
          <span class="govuk-warning-text__icon" aria-hidden="true">!</span>
          <strong class="govuk-warning-text__text">
            <span class="govuk-visually-hidden">Warning</span>
            <code>goto</code> only accepts strings or <code>Format()</code> expressions.
            It does not accept <code>Conditional()</code> or <code>when().then().else()</code>.
          </strong>
        </div>
      `,
    }),

    // Common patterns
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Common Pattern: Branch and Merge</h2>
        <p class="govuk-body">
          A typical flow where users take different paths then converge:
        </p>
        {{slot:code}}
      `,
      slots: {
        code: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `// Step 1: Choose path
// /choose-type
onSubmission: [
  submitTransition({
    validate: true,
    onValid: {
      next: [
        next({
          when: Answer('type').match(Condition.Equals('business')),
          goto: '/business-details',  // Branch A
        }),
        next({ goto: '/individual-details' }),  // Branch B
      ],
    },
  }),
],

// Branch A: /business-details
onSubmission: [
  submitTransition({
    validate: true,
    onValid: {
      next: [next({ goto: '/summary' })],  // Merge
    },
  }),
],

// Branch B: /individual-details
onSubmission: [
  submitTransition({
    validate: true,
    onValid: {
      next: [next({ goto: '/summary' })],  // Merge
    },
  }),
],`,
          }),
        ],
      },
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
              href: '/forms/form-engine-developer-guide/transitions/submit',
              labelText: 'Submit Transitions',
            },
            next: {
              href: '/forms/form-engine-developer-guide/hub',
              labelText: 'Guide Hub',
            },
          }),
        ],
      },
    }),
  ],
})
