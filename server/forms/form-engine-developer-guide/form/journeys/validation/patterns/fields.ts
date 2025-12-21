import { block } from '@form-engine/form/builders'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { GovUKDetails, GovUKPagination } from '@form-engine-govuk-components/components'
import { CodeBlock } from '../../../../components/code-block/codeBlock'
import { parseGovUKMarkdown } from '../../../../helpers/markdown'

/**
 * Validation Patterns Page
 *
 * Single markdown template with component slots for code examples and navigation.
 */
export const pageContent = block<TemplateWrapper>({
  variant: 'templateWrapper',
  template: parseGovUKMarkdown(`
  # Common Validation Patterns

  Real-world validation often involves multiple fields and conditional logic.
  Here are patterns you'll use frequently. {.lead}

  ---

  ## Confirm Field Matches

  Ensure a confirmation field matches the original (e.g., email confirmation).

  {{slot:confirmFieldMatchesCode}}

  ---

  ## Conditional Required Field

  Make a field required only when another field has a specific value
  (e.g., "Other - please specify").

  {{slot:conditionalRequiredCode}}

  ---

  ## Date Comparison

  Ensure one date comes before or after another (e.g., end date after start date).

  {{slot:dateComparisonCode}}

  ---

  ## Date in Past or Future

  Validate that a date is in the past (e.g., date of birth) or future (e.g., appointment).

  {{slot:dateInPastFutureCode}}

  ---

  ## At Least One Selected

  Require users to select at least one option from checkboxes.

  {{slot:atLeastOneSelectedCode}}

  ---

  ## Maximum Selections

  Limit how many options users can select.

  {{slot:maximumSelectionsCode}}

  ---

  ## Complex Cross-Field Validation

  Sometimes you need to validate based on multiple other fields.

  {{slot:complexCrossFieldDetails}}

  ---

  {{slot:pagination}}
`),
  slots: {
    confirmFieldMatchesCode: [
      block<CodeBlock>({
        variant: 'codeBlock',
        language: 'typescript',
        code: `
          field<GovUKTextInput>({
            variant: 'govukTextInput',
            code: 'email',
            label: 'Email address',
            inputType: 'email',
            validate: [
              validation({
                when: Self().not.match(Condition.IsRequired()),
                message: 'Enter your email address',
              }),
              validation({
                when: Self().not.match(Condition.Email.IsValidEmail()),
                message: 'Enter a valid email address',
              }),
            ],
          })

          field<GovUKTextInput>({
            variant: 'govukTextInput',
            code: 'confirm_email',
            label: 'Confirm email address',
            inputType: 'email',
            validate: [
              validation({
                when: Self().not.match(Condition.IsRequired()),
                message: 'Confirm your email address',
              }),
              validation({
                when: Self().not.match(Condition.Equals(Answer('email'))),
                message: 'Email addresses do not match',
              }),
            ],
          })
        `,
      }),
    ],
    conditionalRequiredCode: [
      block<CodeBlock>({
        variant: 'codeBlock',
        language: 'typescript',
        code: `
          field<GovUKRadioInput>({
            variant: 'govukRadioInput',
            code: 'contact_method',
            fieldset: { legend: { text: 'How should we contact you?' } },
            items: [
              { value: 'email', text: 'Email' },
              { value: 'phone', text: 'Phone' },
              { value: 'other', text: 'Other' },
            ],
          })

          field<GovUKTextInput>({
            variant: 'govukTextInput',
            code: 'other_contact_method',
            label: 'Please specify',
            // Only show when "other" is selected
            hidden: Answer('contact_method').not.match(Condition.Equals('other')),
            // Only validate when "other" is selected
            dependent: Answer('contact_method').match(Condition.Equals('other')),
            validate: [
              validation({
                when: Self().not.match(Condition.IsRequired()),
                message: 'Enter your preferred contact method',
              }),
            ],
          })
        `,
      }),
    ],
    dateComparisonCode: [
      block<CodeBlock>({
        variant: 'codeBlock',
        language: 'typescript',
        code: `
          field<GovUKDateInputFull>({
            variant: 'govukDateInputFull',
            code: 'start_date',
            fieldset: { legend: { text: 'Start date' } },
            hint: 'For example, 27 3 2024',
            validate: [
              validation({
                when: Self().not.match(Condition.IsRequired()),
                message: 'Enter a start date',
              }),
              validation({
                when: Self().not.match(Condition.Date.IsValid()),
                message: 'Enter a valid start date',
              }),
            ],
          })

          field<GovUKDateInputFull>({
            variant: 'govukDateInputFull',
            code: 'end_date',
            fieldset: { legend: { text: 'End date' } },
            hint: 'For example, 27 3 2025',
            validate: [
              validation({
                when: Self().not.match(Condition.IsRequired()),
                message: 'Enter an end date',
              }),
              validation({
                when: Self().not.match(Condition.Date.IsValid()),
                message: 'Enter a valid end date',
              }),
              validation({
                when: Self().not.match(Condition.Date.IsAfter(Answer('start_date'))),
                message: 'End date must be after the start date',
              }),
            ],
          })
        `,
      }),
    ],
    dateInPastFutureCode: [
      block<CodeBlock>({
        variant: 'codeBlock',
        language: 'typescript',
        code: `
          // Date must be in the past (e.g., date of birth)
          field<GovUKDateInputFull>({
            variant: 'govukDateInputFull',
            code: 'date_of_birth',
            fieldset: { legend: { text: 'Date of birth' } },
            validate: [
              validation({
                when: Self().not.match(Condition.IsRequired()),
                message: 'Enter your date of birth',
              }),
              validation({
                when: Self().not.match(Condition.Date.IsValid()),
                message: 'Date of birth must be a real date',
              }),
              validation({
                // Show error when date IS in the future (i.e., not in the past)
                when: Self().match(Condition.Date.IsFutureDate()),
                message: 'Date of birth must be in the past',
              }),
            ],
          })

          // Date must be in the future (e.g., appointment)
          field<GovUKDateInputFull>({
            variant: 'govukDateInputFull',
            code: 'appointment_date',
            fieldset: { legend: { text: 'Appointment date' } },
            validate: [
              validation({
                when: Self().not.match(Condition.IsRequired()),
                message: 'Enter an appointment date',
              }),
              validation({
                when: Self().not.match(Condition.Date.IsFutureDate()),
                message: 'Appointment must be in the future',
              }),
            ],
          })
        `,
      }),
    ],
    atLeastOneSelectedCode: [
      block<CodeBlock>({
        variant: 'codeBlock',
        language: 'typescript',
        code: `
          field<GovUKCheckboxInput>({
            variant: 'govukCheckboxInput',
            code: 'interests',
            multiple: true,
            fieldset: {
              legend: { text: 'What are you interested in?' },
            },
            items: [
              { value: 'sports', text: 'Sports' },
              { value: 'music', text: 'Music' },
              { value: 'art', text: 'Art' },
              { value: 'technology', text: 'Technology' },
            ],
            validate: [
              validation({
                when: Self().not.match(Condition.IsRequired()),
                message: 'Select at least one interest',
              }),
            ],
          })
        `,
      }),
    ],
    maximumSelectionsCode: [
      block<CodeBlock>({
        variant: 'codeBlock',
        language: 'typescript',
        code: `
          field<GovUKCheckboxInput>({
            variant: 'govukCheckboxInput',
            code: 'top_priorities',
            multiple: true,
            fieldset: {
              legend: { text: 'Select your top 3 priorities' },
            },
            hint: 'Choose up to 3 options',
            items: [
              { value: 'cost', text: 'Cost' },
              { value: 'quality', text: 'Quality' },
              { value: 'speed', text: 'Speed' },
              { value: 'reliability', text: 'Reliability' },
              { value: 'support', text: 'Support' },
            ],
            validate: [
              validation({
                when: Self().not.match(Condition.IsRequired()),
                message: 'Select at least one priority',
              }),
              validation({
                // Use pipe to get array length and check against number condition
                when: Self().pipe(Transformer.Array.Length()).not.match(
                  Condition.Number.LessThanOrEqual(3)
                ),
                message: 'Select no more than 3 priorities',
              }),
            ],
          })
        `,
      }),
    ],
    complexCrossFieldDetails: [
      block<GovUKDetails>({
        variant: 'govukDetails',
        summaryText: 'View complex example',
        content: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `
              import { and, or } from '@form-engine/form/builders'

              // Phone number is required if:
              // - Contact method is "phone" OR
              // - They opted in to SMS notifications
              field<GovUKTextInput>({
                variant: 'govukTextInput',
                code: 'phone_number',
                label: 'Phone number',
                inputType: 'tel',
                validate: [
                  validation({
                    when: and(
                      or(
                        Answer('contact_method').match(Condition.Equals('phone')),
                        Answer('sms_notifications').match(Condition.Equals('yes')),
                      ),
                      Self().not.match(Condition.IsRequired()),
                    ),
                    message: 'Enter a phone number',
                  }),
                  validation({
                    when: and(
                      Self().match(Condition.IsRequired()),
                      Self().not.match(Condition.Phone.IsValidPhoneNumber()),
                    ),
                    message: 'Enter a valid phone number',
                  }),
                ],
              })
            `,
          }),
        ],
      }),
    ],
    pagination: [
      block<GovUKPagination>({
        variant: 'govukPagination',
        classes: 'govuk-pagination--inline',
        previous: {
          href: '/forms/form-engine-developer-guide/validation/intro',
          labelText: 'Understanding Validation',
        },
        next: {
          href: '/forms/form-engine-developer-guide/validation/playground/intro',
          labelText: 'Validation Playground',
        },
      }),
    ],
  },
})
