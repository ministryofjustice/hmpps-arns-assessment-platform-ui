import { step, block, field, validation, Self, Answer, submitTransition } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { CodeBlock } from '@form-engine/registry/components/codeBlock'
import { GovUKTextInput, GovUKDetails, GovUKPagination } from '@form-engine-govuk-components/components'
import { exampleBox } from '../../../helpers/exampleBox'

/**
 * Conditions Playground - Strings
 *
 * Interactive examples of string conditions with validation.
 * Submit the form to see validation errors.
 */
export const stringsStep = step({
  path: '/strings',
  title: 'String Conditions',
  onSubmission: [
    submitTransition({
      validate: true,
    }),
  ],
  blocks: [
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <h1 class="govuk-heading-l">String Conditions Playground</h1>

        <p class="govuk-body-l">
          Try these fields to see string conditions in action. Submit the form to
          trigger validation and see error messages.
        </p>
      `,
    }),

    // Equals
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Condition.Equals()</h2>
        <p class="govuk-body">Type anything other than the correct password to see the validation error.</p>
      `,
    }),

    exampleBox([
      field<GovUKTextInput>({
        variant: 'govukTextInput',
        code: 'cond_equals',
        label: 'Enter the password',
        hint: 'Hint: the combination is 12345',
        validate: [
          validation({
            when: Self().not.match(Condition.Equals('12345')),
            message: 'Enter the correct password',
          }),
        ],
      }),

      block<HtmlBlock>({
        variant: 'html',
        content: `
          <div class="govuk-inset-text govuk-!-margin-top-4 govuk-!-margin-bottom-0">
            <strong>1, 2, 3, 4, 5?</strong> That's amazing! I've got the same combination on my luggage!
          </div>
        `,
        hidden: Answer('cond_equals').not.match(Condition.Equals('12345')),
      }),
    ]),

    block<GovUKDetails>({
      variant: 'govukDetails',
      summaryText: 'View code',
      content: [
        block<CodeBlock>({
          variant: 'codeBlock',
          language: 'typescript',
          code: `field<GovUKTextInput>({
  variant: 'govukTextInput',
  code: 'cond_equals',
  label: 'Enter the password',
  validate: [
    validation({
      when: Self().not.match(Condition.Equals('12345')),
      message: 'Enter the correct password',
    }),
  ],
})`,
        }),
      ],
    }),

    // IsRequired
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Condition.IsRequired()</h2>
        <p class="govuk-body">Leave this empty and submit to see the required validation.</p>
      `,
    }),

    exampleBox([
      field<GovUKTextInput>({
        variant: 'govukTextInput',
        code: 'cond_required',
        label: 'Your name',
        validate: [
          validation({
            when: Self().not.match(Condition.IsRequired()),
            message: 'Enter your name',
          }),
        ],
      }),
    ]),

    block<GovUKDetails>({
      variant: 'govukDetails',
      summaryText: 'View code',
      content: [
        block<CodeBlock>({
          variant: 'codeBlock',
          language: 'typescript',
          code: `field<GovUKTextInput>({
  variant: 'govukTextInput',
  code: 'cond_required',
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

    // HasMinLength
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Condition.String.HasMinLength()</h2>
        <p class="govuk-body">Enter fewer than 5 characters to see the validation error.</p>
      `,
    }),

    exampleBox([
      field<GovUKTextInput>({
        variant: 'govukTextInput',
        code: 'cond_minlength',
        label: 'Username',
        hint: 'Must be at least 5 characters',
        validate: [
          validation({
            when: Self().not.match(Condition.IsRequired()),
            message: 'Enter a username',
          }),
          validation({
            when: Self().not.match(Condition.String.HasMinLength(5)),
            message: 'Username must be at least 5 characters',
          }),
        ],
      }),
    ]),

    block<GovUKDetails>({
      variant: 'govukDetails',
      summaryText: 'View code',
      content: [
        block<CodeBlock>({
          variant: 'codeBlock',
          language: 'typescript',
          code: `field<GovUKTextInput>({
  variant: 'govukTextInput',
  code: 'cond_minlength',
  label: 'Username',
  hint: 'Must be at least 5 characters',
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Enter a username',
    }),
    validation({
      when: Self().not.match(Condition.String.HasMinLength(5)),
      message: 'Username must be at least 5 characters',
    }),
  ],
})`,
        }),
      ],
    }),

    // HasMaxLength
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Condition.String.HasMaxLength()</h2>
        <p class="govuk-body">Enter more than 10 characters to see the validation error.</p>
      `,
    }),

    exampleBox([
      field<GovUKTextInput>({
        variant: 'govukTextInput',
        code: 'cond_maxlength',
        label: 'Short code',
        hint: 'Maximum 10 characters',
        validate: [
          validation({
            when: Self().not.match(Condition.IsRequired()),
            message: 'Enter a short code',
          }),
          validation({
            when: Self().not.match(Condition.String.HasMaxLength(10)),
            message: 'Short code must be 10 characters or fewer',
          }),
        ],
      }),
    ]),

    block<GovUKDetails>({
      variant: 'govukDetails',
      summaryText: 'View code',
      content: [
        block<CodeBlock>({
          variant: 'codeBlock',
          language: 'typescript',
          code: `field<GovUKTextInput>({
  variant: 'govukTextInput',
  code: 'cond_maxlength',
  label: 'Short code',
  hint: 'Maximum 10 characters',
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Enter a short code',
    }),
    validation({
      when: Self().not.match(Condition.String.HasMaxLength(10)),
      message: 'Short code must be 10 characters or fewer',
    }),
  ],
})`,
        }),
      ],
    }),

    // MatchesRegex
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Condition.String.MatchesRegex()</h2>
        <p class="govuk-body">
          Enter an invalid UK postcode format (e.g., "invalid" or "123") to see validation fail.
        </p>
      `,
    }),

    exampleBox([
      field<GovUKTextInput>({
        variant: 'govukTextInput',
        code: 'cond_regex',
        label: 'Postcode',
        hint: 'For example, SW1A 1AA',
        validate: [
          validation({
            when: Self().not.match(Condition.IsRequired()),
            message: 'Enter a postcode',
          }),
          validation({
            when: Self().not.match(
              Condition.String.MatchesRegex('^[A-Za-z]{1,2}[0-9][0-9A-Za-z]?\\s?[0-9][A-Za-z]{2}$'),
            ),
            message: 'Enter a postcode in the correct format',
          }),
        ],
      }),
    ]),

    block<GovUKDetails>({
      variant: 'govukDetails',
      summaryText: 'View code',
      content: [
        block<CodeBlock>({
          variant: 'codeBlock',
          language: 'typescript',
          code: `field<GovUKTextInput>({
  variant: 'govukTextInput',
  code: 'cond_regex',
  label: 'Postcode',
  hint: 'For example, SW1A 1AA',
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Enter a postcode',
    }),
    validation({
      when: Self().not.match(
        Condition.String.MatchesRegex('^[A-Za-z]{1,2}[0-9][0-9A-Za-z]?\\\\s?[0-9][A-Za-z]{2}$')
      ),
      message: 'Enter a postcode in the correct format',
    }),
  ],
})`,
        }),
      ],
    }),

    // LettersOnly
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Condition.String.LettersOnly()</h2>
        <p class="govuk-body">Try "John123" or "Test!" to see validation fail.</p>
      `,
    }),

    exampleBox([
      field<GovUKTextInput>({
        variant: 'govukTextInput',
        code: 'cond_letters',
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
    ]),

    block<GovUKDetails>({
      variant: 'govukDetails',
      summaryText: 'View code',
      content: [
        block<CodeBlock>({
          variant: 'codeBlock',
          language: 'typescript',
          code: `field<GovUKTextInput>({
  variant: 'govukTextInput',
  code: 'cond_letters',
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

    // Email
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Condition.Email.IsValidEmail()</h2>
        <p class="govuk-body">Try entering invalid emails like "test" or "test@" to see format validation.</p>
      `,
    }),

    exampleBox([
      field<GovUKTextInput>({
        variant: 'govukTextInput',
        code: 'cond_email',
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
    ]),

    block<GovUKDetails>({
      variant: 'govukDetails',
      summaryText: 'View code',
      content: [
        block<CodeBlock>({
          variant: 'codeBlock',
          language: 'typescript',
          code: `field<GovUKTextInput>({
  variant: 'govukTextInput',
  code: 'cond_email',
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
              href: '/forms/form-engine-developer-guide/conditions/playground/intro',
              labelText: 'Playground Hub',
            },
            next: {
              href: '/forms/form-engine-developer-guide/conditions/playground/numbers',
              labelText: 'Number Conditions',
            },
          }),
        ],
      },
    }),
  ],
})
