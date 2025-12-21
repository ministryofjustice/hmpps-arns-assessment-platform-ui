import { block, field, validation, Self, Answer, and, or, not } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import {
  GovUKTextInput,
  GovUKRadioInput,
  GovUKCheckboxInput,
  GovUKDetails,
  GovUKPagination,
} from '@form-engine-govuk-components/components'
import { CodeBlock } from '../../../../../components/code-block/codeBlock'
import { exampleBox } from '../../../../../helpers/exampleBox'
import { parseGovUKMarkdown } from '../../../../../helpers/markdown'

/**
 * Conditions Playground - Predicate Combinators
 *
 * Interactive examples of combining conditions with and(), or().
 */
export const pageContent = block<TemplateWrapper>({
  variant: 'templateWrapper',
  template: parseGovUKMarkdown(`
  # Predicate Combinators Playground

  Combine multiple conditions using \`and()\` and \`or()\`.
  Submit the form to trigger validation and see error messages. {.lead}

  ---

  ## and() - Conditional Required Field

  The phone number field is only required when "Phone" is selected.
  Use \`and()\` to combine the trigger condition with the required check.

  {{slot:andConditionalExample}}

  {{slot:andConditionalCode}}

  ---

  ## and() - Multiple Conditions

  This field must be both required AND a valid UK postcode.
  Use \`and()\` to combine the country check with the postcode validation.

  {{slot:andMultipleExample}}

  {{slot:andMultipleCode}}

  ---

  ## or() - At Least One Required

  Either email OR phone must be provided. Leave both empty and submit to see the error.

  {{slot:orAtLeastOneExample}}

  {{slot:orAtLeastOneCode}}

  ---

  ## or() - Accept Multiple Formats

  This field accepts either a 5-digit ZIP code OR a ZIP+4 format.
  Enter something like "1234" or "12345-123" to see the error.

  {{slot:orMultipleFormatsExample}}

  {{slot:orMultipleFormatsCode}}

  ---

  ## Array Conditions with Checkboxes

  Select at least one interest. Uses \`Condition.IsRequired()\` which
  returns false for empty arrays.

  {{slot:arrayExample}}

  {{slot:arrayCode}}

  ---

  {{slot:pagination}}
`),
  slots: {
    andConditionalExample: [
      exampleBox([
        field<GovUKRadioInput>({
          variant: 'govukRadioInput',
          code: 'comb_and_contact_method',
          fieldset: {
            legend: { text: 'How should we contact you?' },
          },
          items: [
            { value: 'email', text: 'Email' },
            { value: 'phone', text: 'Phone' },
            { value: 'post', text: 'Post' },
          ],
          validate: [
            validation({
              when: Self().not.match(Condition.IsRequired()),
              message: 'Select how we should contact you',
            }),
          ],
        }),
        field<GovUKTextInput>({
          variant: 'govukTextInput',
          code: 'comb_and_phone',
          label: 'Phone number',
          hint: 'Only required if you selected "Phone" above',
          hidden: Answer('comb_and_contact_method').not.match(Condition.Equals('phone')),
          dependent: Answer('comb_and_contact_method').match(Condition.Equals('phone')),
          validate: [
            validation({
              when: and(
                Answer('comb_and_contact_method').match(Condition.Equals('phone')),
                Self().not.match(Condition.IsRequired()),
              ),
              message: 'Enter your phone number',
            }),
          ],
        }),
      ]),
    ],
    andConditionalCode: [
      block<GovUKDetails>({
        variant: 'govukDetails',
        summaryText: 'View code',
        content: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `field<GovUKTextInput>({
              variant: 'govukTextInput',
              code: 'comb_and_phone',
              label: 'Phone number',
              hidden: Answer('comb_and_contact_method').not.match(Condition.Equals('phone')),
              dependent: Answer('comb_and_contact_method').match(Condition.Equals('phone')),
              validate: [
                validation({
                  when: and(
                    Answer('comb_and_contact_method').match(Condition.Equals('phone')),
                    Self().not.match(Condition.IsRequired())
                  ),
                  message: 'Enter your phone number',
                }),
              ],
            })`,
          }),
        ],
      }),
    ],
    andMultipleExample: [
      exampleBox([
        field<GovUKRadioInput>({
          variant: 'govukRadioInput',
          code: 'comb_and_country',
          fieldset: {
            legend: { text: 'Which country do you live in?' },
          },
          items: [
            { value: 'UK', text: 'United Kingdom' },
            { value: 'US', text: 'United States' },
            { value: 'other', text: 'Other' },
          ],
          validate: [
            validation({
              when: Self().not.match(Condition.IsRequired()),
              message: 'Select which country you live in',
            }),
          ],
        }),
        field<GovUKTextInput>({
          variant: 'govukTextInput',
          code: 'comb_and_postcode',
          label: 'Postcode or ZIP code',
          validate: [
            validation({
              when: Self().not.match(Condition.IsRequired()),
              message: 'Enter your postcode or ZIP code',
            }),
            validation({
              when: and(
                Answer('comb_and_country').match(Condition.Equals('UK')),
                Self().not.match(Condition.Address.IsValidPostcode()),
              ),
              message: 'Enter a valid UK postcode',
            }),
          ],
        }),
      ]),
    ],
    andMultipleCode: [
      block<GovUKDetails>({
        variant: 'govukDetails',
        summaryText: 'View code',
        content: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `field<GovUKTextInput>({
              variant: 'govukTextInput',
              code: 'comb_and_postcode',
              label: 'Postcode or ZIP code',
              validate: [
                validation({
                  when: Self().not.match(Condition.IsRequired()),
                  message: 'Enter your postcode or ZIP code',
                }),
                validation({
                  when: and(
                    Answer('comb_and_country').match(Condition.Equals('UK')),
                    Self().not.match(Condition.Address.IsValidPostcode())
                  ),
                  message: 'Enter a valid UK postcode',
                }),
              ],
            })`,
          }),
        ],
      }),
    ],
    orAtLeastOneExample: [
      exampleBox([
        field<GovUKTextInput>({
          variant: 'govukTextInput',
          code: 'comb_or_email',
          label: 'Email address',
          hint: 'Provide email or phone (or both)',
          inputType: 'email',
          validate: [
            validation({
              when: not(
                or(Self().match(Condition.IsRequired()), Answer('comb_or_phone').match(Condition.IsRequired())),
              ),
              message: 'Enter either an email address or phone number',
            }),
          ],
        }),
        field<GovUKTextInput>({
          variant: 'govukTextInput',
          code: 'comb_or_phone',
          label: 'Phone number',
          hint: 'Provide email or phone (or both)',
        }),
      ]),
    ],
    orAtLeastOneCode: [
      block<GovUKDetails>({
        variant: 'govukDetails',
        summaryText: 'View code',
        content: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `
            field<GovUKTextInput>({
              variant: 'govukTextInput',
              code: 'comb_or_email',
              label: 'Email address',
              hint: 'Provide email or phone (or both)',
              validate: [
                validation({
                  // Error shows when NEITHER has a value
                  when: not(
                    or(
                      Self().match(Condition.IsRequired()),
                      Answer('comb_or_phone').match(Condition.IsRequired())
                    )
                  ),
                  message: 'Enter either an email address or phone number',
                }),
              ],
            })`,
          }),
        ],
      }),
    ],
    orMultipleFormatsExample: [
      exampleBox([
        field<GovUKTextInput>({
          variant: 'govukTextInput',
          code: 'comb_or_zip',
          label: 'ZIP code',
          hint: 'For example, 12345 or 12345-6789',
          validate: [
            validation({
              when: Self().not.match(Condition.IsRequired()),
              message: 'Enter your ZIP code',
            }),
            validation({
              when: not(
                or(
                  Self().match(Condition.String.MatchesRegex('^[0-9]{5}$')),
                  Self().match(Condition.String.MatchesRegex('^[0-9]{5}-[0-9]{4}$')),
                ),
              ),
              message: 'Enter a valid ZIP code (12345 or 12345-6789)',
            }),
          ],
        }),
      ]),
    ],
    orMultipleFormatsCode: [
      block<GovUKDetails>({
        variant: 'govukDetails',
        summaryText: 'View code',
        content: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `
            field<GovUKTextInput>({
              variant: 'govukTextInput',
              code: 'comb_or_zip',
              label: 'ZIP code',
              hint: 'For example, 12345 or 12345-6789',
              validate: [
                validation({
                  when: Self().not.match(Condition.IsRequired()),
                  message: 'Enter your ZIP code',
                }),
                validation({
                  // Valid if EITHER format matches
                  when: not(
                    or(
                      Self().match(Condition.String.MatchesRegex('^[0-9]{5}$')),
                      Self().match(Condition.String.MatchesRegex('^[0-9]{5}-[0-9]{4}$'))
                    )
                  ),
                  message: 'Enter a valid ZIP code (12345 or 12345-6789)',
                }),
              ],
            })`,
          }),
        ],
      }),
    ],
    arrayExample: [
      exampleBox([
        field<GovUKCheckboxInput>({
          variant: 'govukCheckboxInput',
          code: 'comb_checkbox_interests',
          multiple: true,
          fieldset: {
            legend: { text: 'What are your interests?' },
          },
          hint: 'Select all that apply',
          items: [
            { value: 'sports', text: 'Sports' },
            { value: 'music', text: 'Music' },
            { value: 'reading', text: 'Reading' },
            { value: 'travel', text: 'Travel' },
          ],
          validate: [
            validation({
              when: Self().not.match(Condition.IsRequired()),
              message: 'Select at least one interest',
            }),
          ],
        }),
      ]),
    ],
    arrayCode: [
      block<GovUKDetails>({
        variant: 'govukDetails',
        summaryText: 'View code',
        content: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `
            field<GovUKCheckboxInput>({
              variant: 'govukCheckboxInput',
              code: 'comb_checkbox_interests',
              multiple: true,
              fieldset: {
                legend: { text: 'What are your interests?' },
              },
              items: [
                { value: 'sports', text: 'Sports' },
                { value: 'music', text: 'Music' },
                { value: 'reading', text: 'Reading' },
                { value: 'travel', text: 'Travel' },
              ],
              validate: [
                validation({
                  when: Self().not.match(Condition.IsRequired()),
                  message: 'Select at least one interest',
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
          href: '/forms/form-engine-developer-guide/conditions/playground/dates',
          labelText: 'Date Conditions',
        },
        next: {
          href: '/forms/form-engine-developer-guide/validation/intro',
          labelText: 'Validation',
        },
      }),
    ],
  },
})
