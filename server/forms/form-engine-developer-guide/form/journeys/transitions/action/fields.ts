import { block } from '@form-engine/form/builders'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { GovUKPagination } from '@form-engine-govuk-components/components'
import { CodeBlock } from '../../../../components/code-block/codeBlock'
import { parseGovUKMarkdown } from '../../../../helpers/markdown'

/**
 * Transitions - Action
 *
 * onAction transitions for handling in-page actions like lookups.
 */
export const pageContent = block<TemplateWrapper>({
  variant: 'templateWrapper',
  template: parseGovUKMarkdown(`
  # Action Transitions

  \`actionTransition()\` handles in-page actions like address lookups
  or data fetches. The key difference: actions run **before** blocks
  render, so their effects can populate fields displayed on the page. {.lead}

  ---

  ## Interface

  <h3 class="govuk-heading-s"><code>when</code> <span class="govuk-tag govuk-tag--red">Required</span></h3>

  Trigger condition. Typically matches a button's \`name\` and \`value\`
  using \`Post()\`. Only the first matching action transition executes.

  {{slot:whenCode}}

  <h3 class="govuk-heading-s"><code>effects</code> <span class="govuk-tag govuk-tag--red">Required</span></h3>

  Array of effect functions to execute. Effects run **before** blocks render,
  so values set by effects appear immediately in the form.

  {{slot:effectsCode}}

  ---

  ## Key Characteristics

  - **Step-level only:** \`onAction\` is not available on journeys
  - **First match executes:** Only the first actionTransition with
    matching \`when\` condition runs
  - **Runs before render:** Effects execute before blocks evaluate,
    so effect-set values appear in the rendered page
  - **No navigation:** Actions always stay on the current page

  ---

  ## The Problem It Solves

  Imagine a "Find address" button that looks up a postcode and populates address fields.
  Without \`onAction\`, effects in \`onSubmission\` run
  **after** blocks evaluate — the looked-up address wouldn't appear.

  \`onAction\` runs **before** blocks render, so the lookup
  effect can set values that immediately appear in the form.

  ---

  ## Execution Flow

  On a POST request, here's when \`onAction\` runs:

  {{slot:flowCode}}

  ---

  ## Example: Address Lookup

  A common pattern — user enters postcode, clicks "Find address", and
  address fields are populated:

  {{slot:addressLookupCode}}

  ---

  ## The Lookup Effect

  The effect calls an API and sets the address fields:

  {{slot:effectCode}}

  ---

  ## Flow By Button

  ### When user clicks "Find address":

  1. \`onAction\` evaluates: \`Post('action') === 'lookup'\` ✓ matches
  2. Lookup effect runs, sets address field values
  3. Blocks render with populated address fields
  4. \`onSubmission\` does NOT run (different \`when\`)

  ### When user clicks "Continue":

  1. \`onAction\` evaluates: \`Post('action') === 'lookup'\` ✗ no match
  2. Blocks render normally
  3. \`onSubmission\` evaluates: \`Post('action') === 'continue'\` ✓ matches
  4. Validation runs, save effect executes, navigation happens

  ---

  ## Best Practices

  - **Use different action values:** Give each button a distinct
    \`value\` attribute to differentiate them
  - **Match action to submission:** Ensure your \`onAction\`
    and \`onSubmission\` \`when\` conditions don't overlap
  - **Handle errors:** Set error state in \`Data()\` if
    the action fails, and display it in the form
  - **Keep actions focused:** Actions are for lookups and fetches,
    not for validation or navigation

  ---

  {{slot:pagination}}
`),
  slots: {
    whenCode: [
      block<CodeBlock>({
        variant: 'codeBlock',
        language: 'typescript',
        code: `
          when: Post('action').match(Condition.Equals('lookup'))
        `,
      }),
    ],
    effectsCode: [
      block<CodeBlock>({
        variant: 'codeBlock',
        language: 'typescript',
        code: `
          effects: [MyEffects.lookupPostcode(Post('postcode'))]
        `,
      }),
    ],
    flowCode: [
      block<CodeBlock>({
        variant: 'codeBlock',
        language: 'bash',
        code: `
          1. onLoad effects run
          2. onAccess guards checked
          3. onAction evaluated           ← Effects set values here
          4. Blocks render                ← Values appear in fields
          5. onSubmission evaluated       ← NOT run if action matched
        `,
      }),
    ],
    addressLookupCode: [
      block<CodeBlock>({
        variant: 'codeBlock',
        language: 'typescript',
        code: `
          step({
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
          })
        `,
      }),
    ],
    effectCode: [
      block<CodeBlock>({
        variant: 'codeBlock',
        language: 'typescript',
        code: `
          lookupPostcode: deps => async (context: EffectFunctionContext, postcode: string) => {
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
          }
        `,
      }),
    ],
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
})
