import { and, Answer, Format, not, or, Self, validation } from '@form-engine/form/builders'
import { HtmlBlock, TemplateWrapper } from '@form-engine/registry/components'
import { Condition } from '@form-engine/registry/conditions'
import {
  GovUKCheckboxInput,
  GovUKDetails,
  GovUKPagination,
  GovUKRadioInput,
  GovUKTextInput,
} from '@form-engine-govuk-components/components'
import { CodeBlock } from '../../../../../components'
import { parseGovUKMarkdown } from '../../../../../helpers/markdown'
import { exampleBox } from '../../../../../helpers/exampleBox'

/**
 * Expressions Playground - Predicates
 *
 * Interactive examples of and(), or(), not() predicate combinators.
 */
export const pageContent = TemplateWrapper({
  template: parseGovUKMarkdown(`
  # Predicates Playground

  Try these interactive examples to see \`and()\`, \`or()\`,
  and \`not()\` in action. These combinators let you build complex
  visibility and validation rules. {.lead}

  ---

  ## and() - Both Conditions Must Be True

  The confirmation message only appears when **both** questions
  are answered "Yes". Try different combinations.

  {{slot:example1}}

  {{slot:example1Code}}

  ---

  ## or() - At Least One Condition Must Be True

  The admin panel only appears for users with "Admin" or "Manager" role.
  Select different roles to see the panel show/hide.

  {{slot:example2}}

  {{slot:example2Code}}

  ---

  ## Combining and() + or()

  Complex logic: The discount code field appears for Premium members
  **OR** for Standard members who have opted in to marketing.

  {{slot:example3}}

  {{slot:example3Code}}

  ---

  ## Conditional Validation

  Use \`and()\` in validation rules to make fields conditionally required.
  The company name is only required when "Business" is selected.

  {{slot:example4}}

  {{slot:example4Code}}

  ---

  ## Multiple Checkbox Trigger

  Show additional fields when **any** of certain checkboxes are selected.
  Select "Allergy" or "Dietary requirements" to see the details field.

  {{slot:example5}}

  {{slot:example5Code}}

  ---

  {{slot:pagination}}
`),
  slots: {
    example1: [
      exampleBox([
        GovUKRadioInput({
          code: 'playground_pred_terms',
          fieldset: {
            legend: { text: 'Do you agree to the terms and conditions?' },
          },
          items: [
            { value: 'yes', text: 'Yes, I agree' },
            { value: 'no', text: 'No, I do not agree' },
          ],
        }),

        GovUKRadioInput({
          code: 'playground_pred_privacy',
          fieldset: {
            legend: { text: 'Do you agree to the privacy policy?' },
          },
          items: [
            { value: 'yes', text: 'Yes, I agree' },
            { value: 'no', text: 'No, I do not agree' },
          ],
        }),

        HtmlBlock({
          hidden: not(
            and(
              Answer('playground_pred_terms').match(Condition.Equals('yes')),
              Answer('playground_pred_privacy').match(Condition.Equals('yes')),
            ),
          ),
          content: `
            <div class="govuk-panel govuk-panel--confirmation govuk-!-margin-top-4 govuk-!-margin-bottom-0">
              <h2 class="govuk-panel__title">Ready to proceed</h2>
              <div class="govuk-panel__body">
                Both agreements accepted. You can now continue.
              </div>
            </div>
          `,
        }),

        HtmlBlock({
          hidden: and(
            Answer('playground_pred_terms').match(Condition.Equals('yes')),
            Answer('playground_pred_privacy').match(Condition.Equals('yes')),
          ),
          content: `
            <div class="govuk-inset-text govuk-!-margin-top-4 govuk-!-margin-bottom-0">
              <strong>Status:</strong> You must agree to both the terms and privacy policy to continue.
            </div>
          `,
        }),
      ]),
    ],
    example1Code: [
      GovUKDetails({
        summaryText: 'View code',
        content: [
          CodeBlock({
            language: 'typescript',
            code: `// Show when BOTH are "yes" - use not() to invert
hidden: not(
  and(
    Answer('terms').match(Condition.Equals('yes')),
    Answer('privacy').match(Condition.Equals('yes'))
  )
)

// Hide when BOTH are "yes" - and() directly
hidden: and(
  Answer('terms').match(Condition.Equals('yes')),
  Answer('privacy').match(Condition.Equals('yes'))
)`,
          }),
        ],
      }),
    ],
    example2: [
      exampleBox([
        GovUKRadioInput({
          code: 'playground_pred_role',
          fieldset: {
            legend: { text: 'What is your role?' },
          },
          items: [
            { value: 'admin', text: 'Admin' },
            { value: 'manager', text: 'Manager' },
            { value: 'staff', text: 'Staff' },
            { value: 'guest', text: 'Guest' },
          ],
        }),

        HtmlBlock({
          hidden: not(
            or(
              Answer('playground_pred_role').match(Condition.Equals('admin')),
              Answer('playground_pred_role').match(Condition.Equals('manager')),
            ),
          ),
          content: `
            <div class="govuk-warning-text govuk-!-margin-top-4 govuk-!-margin-bottom-0">
              <span class="govuk-warning-text__icon" aria-hidden="true">!</span>
              <strong class="govuk-warning-text__text">
                <span class="govuk-visually-hidden">Warning</span>
                Admin Panel Access - You have elevated permissions.
              </strong>
            </div>
          `,
        }),

        HtmlBlock({
          hidden: or(
            Answer('playground_pred_role').match(Condition.Equals('admin')),
            Answer('playground_pred_role').match(Condition.Equals('manager')),
          ),
          content: `
            <div class="govuk-inset-text govuk-!-margin-top-4 govuk-!-margin-bottom-0">
              <strong>Note:</strong> Admin features are not available for your role.
              Contact an administrator if you need elevated access.
            </div>
          `,
        }),
      ]),
    ],
    example2Code: [
      GovUKDetails({
        summaryText: 'View code',
        content: [
          CodeBlock({
            language: 'typescript',
            code: `// Show admin panel when admin OR manager - use not() to invert
hidden: not(
  or(
    Answer('role').match(Condition.Equals('admin')),
    Answer('role').match(Condition.Equals('manager'))
  )
)

// Hide when admin OR manager - or() directly
hidden: or(
  Answer('role').match(Condition.Equals('admin')),
  Answer('role').match(Condition.Equals('manager'))
)`,
          }),
        ],
      }),
    ],
    example3: [
      exampleBox([
        GovUKRadioInput({
          code: 'playground_pred_membership',
          fieldset: {
            legend: { text: 'Membership level' },
          },
          items: [
            { value: 'premium', text: 'Premium' },
            { value: 'standard', text: 'Standard' },
            { value: 'basic', text: 'Basic' },
          ],
        }),

        GovUKRadioInput({
          code: 'playground_pred_marketing',
          fieldset: {
            legend: { text: 'Would you like to receive marketing emails?' },
          },
          items: [
            { value: 'yes', text: 'Yes' },
            { value: 'no', text: 'No' },
          ],
          hidden: Answer('playground_pred_membership').not.match(Condition.IsRequired()),
        }),

        GovUKTextInput({
          code: 'playground_pred_discount',
          label: 'Discount code',
          hint: 'Enter your promotional code for 20% off',
          classes: 'govuk-input--width-10',
          hidden: not(
            or(
              Answer('playground_pred_membership').match(Condition.Equals('premium')),
              and(
                Answer('playground_pred_membership').match(Condition.Equals('standard')),
                Answer('playground_pred_marketing').match(Condition.Equals('yes')),
              ),
            ),
          ),
        }),

        HtmlBlock({
          hidden: Answer('playground_pred_membership').not.match(Condition.IsRequired()),
          content: `
            <div class="govuk-inset-text govuk-!-margin-top-4 govuk-!-margin-bottom-0">
              <strong>Tip:</strong> Select "Premium" or "Standard" with marketing to see the discount field.
            </div>
          `,
        }),
      ]),
    ],
    example3Code: [
      GovUKDetails({
        summaryText: 'View code',
        content: [
          CodeBlock({
            language: 'typescript',
            code: `// Show for: Premium OR (Standard AND marketing)
hidden: not(
  or(
    Answer('membership').match(Condition.Equals('premium')),
    and(
      Answer('membership').match(Condition.Equals('standard')),
      Answer('marketing').match(Condition.Equals('yes'))
    )
  )
)`,
          }),
        ],
      }),
    ],
    example4: [
      exampleBox([
        GovUKRadioInput({
          code: 'playground_pred_accounttype',
          fieldset: {
            legend: { text: 'Account type' },
          },
          items: [
            { value: 'personal', text: 'Personal' },
            { value: 'business', text: 'Business' },
          ],
        }),

        GovUKTextInput({
          code: 'playground_pred_company',
          label: 'Company name',
          hidden: Answer('playground_pred_accounttype').not.match(Condition.Equals('business')),
          dependent: Answer('playground_pred_accounttype').match(Condition.Equals('business')),
          validate: [
            validation({
              when: and(
                Answer('playground_pred_accounttype').match(Condition.Equals('business')),
                Self().not.match(Condition.IsRequired()),
              ),
              message: 'Enter your company name',
            }),
          ],
        }),

        GovUKTextInput({
          code: 'playground_pred_vat',
          label: 'VAT number (optional)',
          hint: 'For example, GB123456789',
          classes: 'govuk-input--width-10',
          hidden: Answer('playground_pred_accounttype').not.match(Condition.Equals('business')),
        }),
      ]),
    ],
    example4Code: [
      GovUKDetails({
        summaryText: 'View code',
        content: [
          CodeBlock({
            language: 'typescript',
            code: `GovUKTextInput({
  code: 'company',
  label: 'Company name',
  hidden: Answer('accountType').not.match(Condition.Equals('business')),
  dependent: Answer('accountType').match(Condition.Equals('business')),
  validate: [
    validation({
      // Only validate when business account AND field is empty
      when: and(
        Answer('accountType').match(Condition.Equals('business')),
        Self().not.match(Condition.IsRequired())
      ),
      message: 'Enter your company name',
    }),
  ],
})`,
          }),
        ],
      }),
    ],
    example5: [
      exampleBox([
        GovUKCheckboxInput({
          code: 'playground_pred_needs',
          multiple: true,
          fieldset: {
            legend: { text: 'Do you have any special requirements?' },
          },
          items: [
            { value: 'wheelchair', text: 'Wheelchair access' },
            { value: 'allergy', text: 'Food allergy' },
            { value: 'dietary', text: 'Dietary requirements' },
            { value: 'hearing', text: 'Hearing loop' },
          ],
        }),

        GovUKTextInput({
          code: 'playground_pred_fooddetails',
          label: 'Please describe your food allergy or dietary requirements',
          hidden: not(
            or(
              Answer('playground_pred_needs').match(Condition.Array.Contains('allergy')),
              Answer('playground_pred_needs').match(Condition.Array.Contains('dietary')),
            ),
          ),
          dependent: or(
            Answer('playground_pred_needs').match(Condition.Array.Contains('allergy')),
            Answer('playground_pred_needs').match(Condition.Array.Contains('dietary')),
          ),
          validate: [
            validation({
              when: Self().not.match(Condition.IsRequired()),
              message: 'Describe your allergy or dietary requirements',
            }),
          ],
        }),

        HtmlBlock({
          hidden: Answer('playground_pred_needs').not.match(Condition.IsRequired()),
          content: Format(
            `<div class="govuk-inset-text govuk-!-margin-top-4 govuk-!-margin-bottom-0">
              <strong>Requirements noted.</strong> We will accommodate your needs.
            </div>`,
          ),
        }),
      ]),
    ],
    example5Code: [
      GovUKDetails({
        summaryText: 'View code',
        content: [
          CodeBlock({
            language: 'typescript',
            code: `// Show details field when allergy OR dietary is checked
hidden: not(
  or(
    Answer('needs').match(Condition.Array.Contains('allergy')),
    Answer('needs').match(Condition.Array.Contains('dietary'))
  )
)

// Make field dependent (only validate when shown)
dependent: or(
  Answer('needs').match(Condition.Array.Contains('allergy')),
  Answer('needs').match(Condition.Array.Contains('dietary'))
)`,
          }),
        ],
      }),
    ],
    pagination: [
      GovUKPagination({
        classes: 'govuk-pagination--inline',
        previous: {
          href: '/form-engine-developer-guide/expressions/playground/conditional',
          labelText: 'Conditional Playground',
        },
      }),
    ],
  },
})
