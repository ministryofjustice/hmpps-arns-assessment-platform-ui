import { step, block } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { CodeBlock } from '@form-engine/registry/components/codeBlock'
import { GovUKDetails, GovUKPagination } from '@form-engine-govuk-components/components'

/**
 * Validation - Common Patterns
 *
 * Real-world validation patterns: cross-field validation, conditional required,
 * date comparisons, and more.
 */
export const patternsStep = step({
  path: '/patterns',
  title: 'Common Patterns',
  blocks: [
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <h1 class="govuk-heading-l">Common Validation Patterns</h1>

        <p class="govuk-body-l">
          Real-world validation often involves multiple fields and conditional logic.
          Here are patterns you'll use frequently.
        </p>
      `,
    }),

    // Confirm Field Matches
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Confirm Field Matches</h2>
        <p class="govuk-body">
          Ensure a confirmation field matches the original (e.g., email confirmation).
        </p>
        {{slot:code}}
      `,
      slots: {
        code: [
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
      when: Self().match(Condition.String.IsEmpty()),
      message: 'Enter your email address',
    }),
    validation({
      when: Self().not.match(Condition.String.IsEmail()),
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
      when: Self().match(Condition.String.IsEmpty()),
      message: 'Confirm your email address',
    }),
    validation({
      when: Self().not.match(Condition.String.Equals(Answer('email'))),
      message: 'Email addresses do not match',
    }),
  ],
})`,
          }),
        ],
      },
    }),

    // Conditional Required Field
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Conditional Required Field</h2>
        <p class="govuk-body">
          Make a field required only when another field has a specific value
          (e.g., "Other - please specify").
        </p>
        {{slot:code}}
      `,
      slots: {
        code: [
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
  hidden: Answer('contact_method').not.match(Condition.String.Equals('other')),
  // Only validate when "other" is selected
  dependent: Answer('contact_method').match(Condition.String.Equals('other')),
  validate: [
    validation({
      when: Self().match(Condition.String.IsEmpty()),
      message: 'Enter your preferred contact method',
    }),
  ],
})`,
          }),
        ],
      },
    }),

    // Date Comparison
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Date Comparison</h2>
        <p class="govuk-body">
          Ensure one date comes before or after another (e.g., end date after start date).
        </p>
        {{slot:code}}
      `,
      slots: {
        code: [
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
      when: Self().match(Condition.String.IsEmpty()),
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
      when: Self().match(Condition.String.IsEmpty()),
      message: 'Enter an end date',
    }),
    validation({
      when: Self().not.match(Condition.Date.IsValid()),
      message: 'Enter a valid end date',
    }),
    validation({
      when: Self().match(Condition.Date.IsBefore(Answer('start_date'))),
      message: 'End date must be after the start date',
    }),
  ],
})`,
          }),
        ],
      },
    }),

    // Date in Past/Future
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Date in Past or Future</h2>
        <p class="govuk-body">
          Validate that a date is in the past (e.g., date of birth) or future (e.g., appointment).
        </p>
        {{slot:code}}
      `,
      slots: {
        code: [
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
      when: Self().match(Condition.String.IsEmpty()),
      message: 'Enter your date of birth',
    }),
    validation({
      when: Self().not.match(Condition.Date.IsValid()),
      message: 'Date of birth must be a real date',
    }),
    validation({
      when: Self().not.match(Condition.Date.IsInPast()),
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
      when: Self().match(Condition.String.IsEmpty()),
      message: 'Enter an appointment date',
    }),
    validation({
      when: Self().not.match(Condition.Date.IsInFuture()),
      message: 'Appointment must be in the future',
    }),
  ],
})`,
          }),
        ],
      },
    }),

    // At Least One Selected
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">At Least One Selected</h2>
        <p class="govuk-body">
          Require users to select at least one option from checkboxes.
        </p>
        {{slot:code}}
      `,
      slots: {
        code: [
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
      when: Self().match(Condition.Array.IsEmpty()),
      message: 'Select at least one interest',
    }),
  ],
})`,
          }),
        ],
      },
    }),

    // Maximum Selections
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Maximum Selections</h2>
        <p class="govuk-body">
          Limit how many options users can select.
        </p>
        {{slot:code}}
      `,
      slots: {
        code: [
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
      when: Self().match(Condition.Array.IsEmpty()),
      message: 'Select at least one priority',
    }),
    validation({
      when: Self().not.match(Condition.Array.MaxLength(3)),
      message: 'Select no more than 3 priorities',
    }),
  ],
})`,
          }),
        ],
      },
    }),

    // Complex cross-field example
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Complex Cross-Field Validation</h2>
        <p class="govuk-body">
          Sometimes you need to validate based on multiple other fields.
        </p>
      `,
    }),

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
          Answer('contact_method').match(Condition.String.Equals('phone')),
          Answer('sms_notifications').match(Condition.String.Equals('yes')),
        ),
        Self().match(Condition.String.IsEmpty()),
      ),
      message: 'Enter a phone number',
    }),
    validation({
      when: and(
        Self().not.match(Condition.String.IsEmpty()),
        Self().not.match(Condition.String.Matches(/^\\+?[0-9\\s]{10,14}$/)),
      ),
      message: 'Enter a valid phone number',
    }),
  ],
})`,
        }),
      ],
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
    }),
  ],
})
