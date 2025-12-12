import { step, block } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { CodeBlock } from '@form-engine/registry/components/codeBlock'
import { GovUKPagination } from '@form-engine-govuk-components/components'

/**
 * Transitions - Action
 *
 * onAction transitions for handling in-page actions like lookups.
 */
export const actionStep = step({
  path: '/action',
  title: 'Action Transitions',
  blocks: [
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <h1 class="govuk-heading-l">Action Transitions</h1>

        <p class="govuk-body-l">
          <code>actionTransition()</code> handles in-page actions like address lookups
          or data fetches. The key difference: actions run <strong>before</strong> blocks
          render, so their effects can populate fields displayed on the page.
        </p>

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <h2 class="govuk-heading-m">Interface</h2>
      `,
    }),

    // Property: when
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <h3 class="govuk-heading-s"><code>{{name}}</code> <span class="govuk-tag govuk-tag--red">Required</span></h3>
        <p class="govuk-body">
          Trigger condition. Typically matches a button's <code>name</code> and <code>value</code>
          using <code>Post()</code>. Only the first matching action transition executes.
        </p>
        {{slot:code}}
      `,
      values: { name: 'when' },
      slots: {
        code: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `when: Post('action').match(Condition.Equals('lookup'))`,
          }),
        ],
      },
    }),

    // Property: effects
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <h3 class="govuk-heading-s"><code>{{name}}</code> <span class="govuk-tag govuk-tag--red">Required</span></h3>
        <p class="govuk-body">
          Array of effect functions to execute. Effects run <strong>before</strong> blocks render,
          so values set by effects appear immediately in the form.
        </p>
        {{slot:code}}
      `,
      values: { name: 'effects' },
      slots: {
        code: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `effects: [MyEffects.lookupPostcode(Post('postcode'))]`,
          }),
        ],
      },
    }),

    // Key characteristics
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Key Characteristics</h2>

        <ul class="govuk-list govuk-list--bullet">
          <li>
            <strong>Step-level only:</strong> <code>onAction</code> is not available on journeys
          </li>
          <li>
            <strong>First match executes:</strong> Only the first actionTransition with
            matching <code>when</code> condition runs
          </li>
          <li>
            <strong>Runs before render:</strong> Effects execute before blocks evaluate,
            so effect-set values appear in the rendered page
          </li>
          <li>
            <strong>No navigation:</strong> Actions always stay on the current page
          </li>
        </ul>
      `,
    }),

    // The problem it solves
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">The Problem It Solves</h2>

        <p class="govuk-body">
          Imagine a "Find address" button that looks up a postcode and populates address fields.
          Without <code>onAction</code>, effects in <code>onSubmission</code> run
          <strong>after</strong> blocks evaluate &mdash; the looked-up address wouldn't appear.
        </p>

        <p class="govuk-body">
          <code>onAction</code> runs <strong>before</strong> blocks render, so the lookup
          effect can set values that immediately appear in the form.
        </p>
      `,
    }),

    // Execution flow
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Execution Flow</h2>
        <p class="govuk-body">
          On a POST request, here's when <code>onAction</code> runs:
        </p>
        {{slot:code}}
      `,
      slots: {
        code: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'bash',
            code: `1. onLoad effects run
2. onAccess guards checked
3. onAction evaluated           ← Effects set values here
4. Blocks render                ← Values appear in fields
5. onSubmission evaluated       ← NOT run if action matched`,
          }),
        ],
      },
    }),

    // Address lookup example
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Example: Address Lookup</h2>
        <p class="govuk-body">
          A common pattern &mdash; user enters postcode, clicks "Find address", and
          address fields are populated:
        </p>
        {{slot:code}}
      `,
      slots: {
        code: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `step({
  path: '/address',
  title: 'Your Address',

  blocks: [
    // Postcode input
    field<GovUKTextInput>({
      variant: 'govukTextInput',
      code: 'postcode',
      label: 'Postcode',
      classes: 'govuk-input--width-10',
    }),

    // Lookup button - note the name and value
    block<GovUKButton>({
      variant: 'govukButton',
      text: 'Find address',
      name: 'action',
      value: 'lookup',
      classes: 'govuk-button--secondary',
    }),

    // Address fields - populated by the lookup
    field<GovUKTextInput>({
      variant: 'govukTextInput',
      code: 'addressLine1',
      label: 'Address line 1',
    }),
    field<GovUKTextInput>({
      variant: 'govukTextInput',
      code: 'town',
      label: 'Town or city',
    }),

    // Continue button
    block<GovUKButton>({
      variant: 'govukButton',
      text: 'Continue',
      name: 'action',
      value: 'continue',
    }),
  ],

  // Handle the lookup button
  onAction: [
    actionTransition({
      when: Post('action').match(Condition.Equals('lookup')),
      effects: [MyEffects.lookupPostcode(Post('postcode'))],
    }),
  ],

  // Handle the continue button
  onSubmission: [
    submitTransition({
      when: Post('action').match(Condition.Equals('continue')),
      validate: true,
      onValid: {
        effects: [MyEffects.saveAddress()],
        next: [next({ goto: '/contact' })],
      },
    }),
  ],
})`,
          }),
        ],
      },
    }),

    // How the effect works
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">The Lookup Effect</h2>
        <p class="govuk-body">
          The effect calls an API and sets the address fields:
        </p>
        {{slot:code}}
      `,
      slots: {
        code: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `lookupPostcode: deps => async (context: EffectFunctionContext, postcode: string) => {
  // Call postcode lookup API
  const result = await deps.postcodeApi.lookup(postcode)

  if (result.found) {
    // Set answer values - these will appear in the form fields
    context.setAnswer('addressLine1', result.addressLine1)
    context.setAnswer('addressLine2', result.addressLine2)
    context.setAnswer('town', result.town)
    context.setAnswer('county', result.county)
  } else {
    // Could set an error message
    context.setData('lookupError', 'Address not found')
  }
}`,
          }),
        ],
      },
    }),

    // What happens on each button
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Flow By Button</h2>

        <h3 class="govuk-heading-s">When user clicks "Find address":</h3>
        <ol class="govuk-list govuk-list--number">
          <li><code>onAction</code> evaluates: <code>Post('action') === 'lookup'</code> ✓ matches</li>
          <li>Lookup effect runs, sets address field values</li>
          <li>Blocks render with populated address fields</li>
          <li><code>onSubmission</code> does NOT run (different <code>when</code>)</li>
        </ol>

        <h3 class="govuk-heading-s">When user clicks "Continue":</h3>
        <ol class="govuk-list govuk-list--number">
          <li><code>onAction</code> evaluates: <code>Post('action') === 'lookup'</code> ✗ no match</li>
          <li>Blocks render normally</li>
          <li><code>onSubmission</code> evaluates: <code>Post('action') === 'continue'</code> ✓ matches</li>
          <li>Validation runs, save effect executes, navigation happens</li>
        </ol>
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
            <strong>Use different action values:</strong> Give each button a distinct
            <code>value</code> attribute to differentiate them
          </li>
          <li>
            <strong>Match action to submission:</strong> Ensure your <code>onAction</code>
            and <code>onSubmission</code> <code>when</code> conditions don't overlap
          </li>
          <li>
            <strong>Handle errors:</strong> Set error state in <code>Data()</code> if
            the action fails, and display it in the form
          </li>
          <li>
            <strong>Keep actions focused:</strong> Actions are for lookups and fetches,
            not for validation or navigation
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
              href: '/forms/form-engine-developer-guide/transitions/access',
              labelText: 'Access Transitions',
            },
            next: {
              href: '/forms/form-engine-developer-guide/transitions/submit',
              labelText: 'Submit Transitions',
            },
          }),
        ],
      },
    }),
  ],
})
