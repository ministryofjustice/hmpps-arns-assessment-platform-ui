import { TemplateWrapper } from '@form-engine/registry/components'
import { GovUKPagination } from '@form-engine-govuk-components/components'
import { parseGovUKMarkdown } from '../../../../helpers/markdown'
import { CodeBlock } from '../../../../components'

/**
 * Recipe: In-Page Lookup with Action Transition
 */
export const pageContent = TemplateWrapper({
  template: parseGovUKMarkdown(`
# Recipe: In-Page Lookup

Perform a lookup (like postcode → address) without leaving the page.
The results populate form fields immediately. {.lead}

---

## The Pattern

Use \`actionTransition\` in \`onAction\` to handle a lookup button.
Unlike \`onSubmission\`, action effects run **before** blocks render,
so the looked-up values appear in the form.

---

## Complete Example

### Step 1: Define the effect

{{slot:effectExample}}

### Step 2: Create the step with fields and transitions

{{slot:stepExample}}

---

## How It Works

1. User enters postcode and clicks "Find address"
2. \`onAction\` matches \`Post('action') === 'lookup'\`
3. Effect runs **before** blocks render
4. \`context.setAnswer()\` populates the address fields
5. Page re-renders with address fields filled in
6. User clicks "Continue" → \`onSubmission\` handles validation and save

---

## Key Points

| Aspect | Detail |
|--------|--------|
| **Use \`onAction\`** | Not \`onSubmission\` — actions run before render |
| **Different button values** | "lookup" vs "continue" to distinguish actions |
| **\`setAnswer()\` for fields** | Populates form fields the user can edit |
| **\`setData()\` for errors** | Store lookup errors to display in the form |
| **Secondary button style** | Lookup button should be \`govuk-button--secondary\` |

---

## Handling Errors

Show an error message when the lookup fails:

{{slot:errorExample}}

---

## Related Concepts

- [Action Transitions](/forms/form-engine-developer-guide/transitions/action) - Full action transition documentation
- [Effects](/forms/form-engine-developer-guide/effects/intro) - Creating effects with dependencies
- [Save Answers](/forms/form-engine-developer-guide/recipes/save-answers) - Handling the submit button

---

{{slot:pagination}}
`),
  slots: {
    effectExample: [
      CodeBlock({
        language: 'typescript',
        code: `
          // effects.ts
          import { defineEffectsWithDeps } from '@form-engine/registry/utils/createRegisterableFunction'
          import EffectFunctionContext from '@form-engine/core/nodes/expressions/effect/EffectFunctionContext'

          interface AddressFormDeps {
            postcodeApi: PostcodeLookupClient
          }

          export const { effects: AddressEffects, createRegistry: createAddressEffectsRegistry } =
            defineEffectsWithDeps<AddressFormDeps>()({
              lookupPostcode: deps => async (context: EffectFunctionContext, postcode: string) => {
                // Clear any previous error
                context.setData('lookupError', undefined)

                try {
                  const result = await deps.postcodeApi.lookup(postcode)

                  if (result.addresses.length > 0) {
                    const address = result.addresses[0]
                    // Populate the form fields
                    context.setAnswer('addressLine1', address.line1)
                    context.setAnswer('addressLine2', address.line2 ?? '')
                    context.setAnswer('town', address.town)
                    context.setAnswer('postcode', address.postcode)
                  } else {
                    context.setData('lookupError', 'No addresses found for this postcode')
                  }
                } catch (error) {
                  context.setData('lookupError', 'Unable to look up address. Enter manually.')
                }
              },

              saveAddress: _deps => (context: EffectFunctionContext) => {
                // Save address to session or API
                const session = context.getSession()
                session.address = {
                  line1: context.getAnswer('addressLine1'),
                  line2: context.getAnswer('addressLine2'),
                  town: context.getAnswer('town'),
                  postcode: context.getAnswer('postcode'),
                }
              },
            })
        `,
      }),
    ],
    stepExample: [
      CodeBlock({
        language: 'typescript',
        code: `
          // step.ts
          import {
            step, validation, Self, Post,
            actionTransition, submitTransition, redirect,
          } from '@form-engine/form/builders'
          import { Condition } from '@form-engine/registry/conditions'
          import { GovUKTextInput, GovUKButton } from '@form-engine-govuk-components/components'
          import { AddressEffects } from '../effects'

          export const addressStep = step({
            path: '/address',
            title: 'Your address',

            blocks: [
              // Postcode input
              GovUKTextInput({
                code: 'postcode',
                label: 'Postcode',
                classes: 'govuk-input--width-10',
                validate: [
                  validation({
                    when: Self().not.match(Condition.IsRequired()),
                    message: 'Enter a postcode',
                  }),
                ],
              }),

              // Lookup button
              GovUKButton({
                text: 'Find address',
                name: 'action',
                value: 'lookup',
                classes: 'govuk-button--secondary',
              }),

              // Address fields - populated by lookup or entered manually
              GovUKTextInput({
                code: 'addressLine1',
                label: 'Address line 1',
                validate: [
                  validation({
                    when: Self().not.match(Condition.IsRequired()),
                    message: 'Enter address line 1',
                  }),
                ],
              }),
              GovUKTextInput({
                code: 'addressLine2',
                label: 'Address line 2 (optional)',
              }),
              GovUKTextInput({
                code: 'town',
                label: 'Town or city',
                validate: [
                  validation({
                    when: Self().not.match(Condition.IsRequired()),
                    message: 'Enter town or city',
                  }),
                ],
              }),

              // Continue button
              GovUKButton({
                text: 'Continue',
                name: 'action',
                value: 'continue',
              }),
            ],

            // Handle lookup button - runs BEFORE blocks render
            onAction: [
              actionTransition({
                when: Post('action').match(Condition.Equals('lookup')),
                effects: [AddressEffects.lookupPostcode(Post('postcode'))],
              }),
            ],

            // Handle continue button - runs AFTER blocks render
            onSubmission: [
              submitTransition({
                when: Post('action').match(Condition.Equals('continue')),
                validate: true,
                onValid: {
                  effects: [AddressEffects.saveAddress()],
                  next: [redirect({ goto: '/contact-details' })],
                },
              }),
            ],
          })
        `,
      }),
    ],
    errorExample: [
      CodeBlock({
        language: 'typescript',
        code: `
          // In your blocks array, add an error panel that shows when lookupError is set
          import { Data } from '@form-engine/form/builders'
          import { GovUKErrorSummary } from '@form-engine-govuk-components/components'

          GovUKErrorSummary({
            titleText: 'There is a problem',
            errorList: [
              { text: Data('lookupError') },
            ],
            // Only show when there's an error
            hidden: Data('lookupError').not.match(Condition.IsRequired()),
          })
        `,
      }),
    ],
    pagination: [
      GovUKPagination({
        classes: 'govuk-pagination--inline',
        previous: {
          href: '/forms/form-engine-developer-guide/recipes/branching-navigation',
          labelText: 'Branching Navigation',
        },
        next: {
          href: '/forms/form-engine-developer-guide/hub',
          labelText: 'Guide Hub',
        },
      }),
    ],
  },
})
