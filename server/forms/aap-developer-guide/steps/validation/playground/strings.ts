import { step, block, field, validation, Self, submitTransition } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { CodeBlock } from '@form-engine/registry/components/codeBlock'
import { GovUKTextInput, GovUKDetails, GovUKPagination, GovUKButton } from '@form-engine-govuk-components/components'

/**
 * Validation Playground - Strings
 *
 * Interactive examples of string validation conditions.
 */
export const stringsStep = step({
  path: '/strings',
  title: 'String Validation',
  onSubmission: [
    submitTransition({
      validate: true,
      onValid: {},
      onInvalid: {},
    }),
  ],
  blocks: [
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <h1 class="govuk-heading-l">String Validation Playground</h1>

        <p class="govuk-body-l">
          Try these fields to see string validation in action. Submit the form to
          trigger validation and see error messages.
        </p>
      `,
    }),

    // Required Field
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Required Field</h2>
        <p class="govuk-body">Leave this empty and submit to see the required validation.</p>
      `,
    }),

    field<GovUKTextInput>({
      variant: 'govukTextInput',
      code: 'playground_required',
      label: 'Your name',
      validate: [
        validation({
          when: Self().not.match(Condition.IsRequired()),
          message: 'Enter your name',
        }),
      ],
    }),

    block<GovUKDetails>({
      variant: 'govukDetails',
      summaryText: 'View code',
      content: [
        block<CodeBlock>({
          variant: 'codeBlock',
          language: 'typescript',
          code: `field<GovUKTextInput>({
  variant: 'govukTextInput',
  code: 'playground_required',
  label: 'Your name',
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Enter your name',
    }),
  ],
})`,
        }),
      ],
    }),

    // Email Format
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Email Format</h2>
        <p class="govuk-body">Try entering invalid emails like "test" or "test@" to see format validation.</p>
      `,
    }),

    field<GovUKTextInput>({
      variant: 'govukTextInput',
      code: 'playground_email',
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
    }),

    block<GovUKDetails>({
      variant: 'govukDetails',
      summaryText: 'View code',
      content: [
        block<CodeBlock>({
          variant: 'codeBlock',
          language: 'typescript',
          code: `field<GovUKTextInput>({
  variant: 'govukTextInput',
  code: 'playground_email',
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
})`,
        }),
      ],
    }),

    // Length Constraints
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Length Constraints</h2>
        <p class="govuk-body">This field requires between 5 and 20 characters. Try "abc" or a very long string.</p>
      `,
    }),

    field<GovUKTextInput>({
      variant: 'govukTextInput',
      code: 'playground_length',
      label: 'Username',
      hint: 'Must be between 5 and 20 characters',
      validate: [
        validation({
          when: Self().not.match(Condition.IsRequired()),
          message: 'Enter a username',
        }),
        validation({
          when: Self().not.match(Condition.String.HasMinLength(5)),
          message: 'Username must be at least 5 characters',
        }),
        validation({
          when: Self().not.match(Condition.String.HasMaxLength(20)),
          message: 'Username must be 20 characters or fewer',
        }),
      ],
    }),

    block<GovUKDetails>({
      variant: 'govukDetails',
      summaryText: 'View code',
      content: [
        block<CodeBlock>({
          variant: 'codeBlock',
          language: 'typescript',
          code: `field<GovUKTextInput>({
  variant: 'govukTextInput',
  code: 'playground_length',
  label: 'Username',
  hint: 'Must be between 5 and 20 characters',
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Enter a username',
    }),
    validation({
      when: Self().not.match(Condition.String.HasMinLength(5)),
      message: 'Username must be at least 5 characters',
    }),
    validation({
      when: Self().not.match(Condition.String.HasMaxLength(20)),
      message: 'Username must be 20 characters or fewer',
    }),
  ],
})`,
        }),
      ],
    }),

    // Pattern Matching
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Pattern Matching (Regex)</h2>
        <p class="govuk-body">
          This validates a UK National Insurance number format (e.g., "AB123456C").
          Try "invalid" or "AB12345" to see validation fail.
        </p>
      `,
    }),

    field<GovUKTextInput>({
      variant: 'govukTextInput',
      code: 'playground_pattern',
      label: 'National Insurance number',
      hint: 'For example, AB123456C',
      validate: [
        validation({
          when: Self().not.match(Condition.IsRequired()),
          message: 'Enter a National Insurance number',
        }),
        validation({
          when: Self().not.match(Condition.String.MatchesRegex('^[A-Za-z]{2}[0-9]{6}[A-Za-z]$')),
          message: 'Enter a National Insurance number in the correct format',
        }),
      ],
    }),

    block<GovUKDetails>({
      variant: 'govukDetails',
      summaryText: 'View code',
      content: [
        block<CodeBlock>({
          variant: 'codeBlock',
          language: 'typescript',
          code: `field<GovUKTextInput>({
  variant: 'govukTextInput',
  code: 'playground_pattern',
  label: 'National Insurance number',
  hint: 'For example, AB123456C',
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Enter a National Insurance number',
    }),
    validation({
      when: Self().not.match(Condition.String.MatchesRegex('^[A-Za-z]{2}[0-9]{6}[A-Za-z]$')),
      message: 'Enter a National Insurance number in the correct format',
    }),
  ],
})`,
        }),
      ],
    }),

    // Letters Only
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Letters Only</h2>
        <p class="govuk-body">
          This field only accepts letters. Try "John123" or "Test!" to see validation fail.
        </p>
      `,
    }),

    field<GovUKTextInput>({
      variant: 'govukTextInput',
      code: 'playground_letters',
      label: 'First name',
      hint: 'Letters only, no numbers or symbols',
      validate: [
        validation({
          when: Self().not.match(Condition.IsRequired()),
          message: 'Enter your first name',
        }),
        validation({
          when: Self().not.match(Condition.String.LettersOnly()),
          message: 'First name must only contain letters',
        }),
      ],
    }),

    block<GovUKDetails>({
      variant: 'govukDetails',
      summaryText: 'View code',
      content: [
        block<CodeBlock>({
          variant: 'codeBlock',
          language: 'typescript',
          code: `field<GovUKTextInput>({
  variant: 'govukTextInput',
  code: 'playground_letters',
  label: 'First name',
  hint: 'Letters only, no numbers or symbols',
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Enter your first name',
    }),
    validation({
      when: Self().not.match(Condition.String.LettersOnly()),
      message: 'First name must only contain letters',
    }),
  ],
})`,
        }),
      ],
    }),

    // Submit button
    block<GovUKButton>({
      variant: 'govukButton',
      text: 'Test validation',
      name: 'action',
      value: 'continue',
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
              href: '/forms/form-engine-developer-guide/validation/playground/intro',
              labelText: 'Playground Hub',
            },
            next: {
              href: '/forms/form-engine-developer-guide/validation/playground/numbers',
              labelText: 'Number Validation',
            },
          }),
        ],
      },
    }),
  ],
})
