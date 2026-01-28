import { validation, Self } from '@form-engine/form/builders'
import { TemplateWrapper } from '@form-engine/registry/components'
import { Condition } from '@form-engine/registry/conditions'
import { GovUKTextInput, GovUKDetails, GovUKPagination } from '@form-engine-govuk-components/components'
import { CodeBlock } from '../../../../../components'
import { parseGovUKMarkdown } from '../../../../../helpers/markdown'
import { exampleBox } from '../../../../../helpers/exampleBox'

/**
 * String Validation Playground
 *
 * Interactive examples of string validation conditions.
 */
export const pageContent = TemplateWrapper({
  template: parseGovUKMarkdown(`
  # String Validation Playground

  Try these fields to see string validation in action. Submit the form to
  trigger validation and see error messages. {.lead}

  ---

  ## Required Field

  Leave this empty and submit to see the required validation.

  {{slot:requiredFieldExample}}

  {{slot:requiredFieldCode}}

  ---

  ## Email Format

  Try entering invalid emails like "test" or "test@" to see format validation.

  {{slot:emailFormatExample}}

  {{slot:emailFormatCode}}

  ---

  ## Length Constraints

  This field requires between 5 and 20 characters. Try "abc" or a very long string.

  {{slot:lengthConstraintsExample}}

  {{slot:lengthConstraintsCode}}

  ---

  ## Pattern Matching (Regex)

  This validates a UK National Insurance number format (e.g., "AB123456C").
  Try "invalid" or "AB12345" to see validation fail.

  {{slot:patternMatchingExample}}

  {{slot:patternMatchingCode}}

  ---

  ## Letters Only

  This field only accepts letters. Try "John123" or "Test!" to see validation fail.

  {{slot:lettersOnlyExample}}

  {{slot:lettersOnlyCode}}

  ---

  {{slot:pagination}}
`),
  slots: {
    requiredFieldExample: [
      exampleBox([
        GovUKTextInput({
          code: 'playground_required',
          label: 'Your name',
          validate: [
            validation({
              when: Self().not.match(Condition.IsRequired()),
              message: 'Enter your name',
            }),
          ],
        }),
      ]),
    ],
    requiredFieldCode: [
      GovUKDetails({
        summaryText: 'View code',
        content: [
          CodeBlock({
            language: 'typescript',
            code: `
              GovUKTextInput({
                code: 'playground_required',
                label: 'Your name',
                validate: [
                  validation({
                    when: Self().not.match(Condition.IsRequired()),
                    message: 'Enter your name',
                  }),
                ],
              })
            `,
          }),
        ],
      }),
    ],
    emailFormatExample: [
      exampleBox([
        GovUKTextInput({
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
      ]),
    ],
    emailFormatCode: [
      GovUKDetails({
        summaryText: 'View code',
        content: [
          CodeBlock({
            language: 'typescript',
            code: `
              GovUKTextInput({
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
              })
            `,
          }),
        ],
      }),
    ],
    lengthConstraintsExample: [
      exampleBox([
        GovUKTextInput({
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
      ]),
    ],
    lengthConstraintsCode: [
      GovUKDetails({
        summaryText: 'View code',
        content: [
          CodeBlock({
            language: 'typescript',
            code: `
              GovUKTextInput({
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
              })
            `,
          }),
        ],
      }),
    ],
    patternMatchingExample: [
      exampleBox([
        GovUKTextInput({
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
      ]),
    ],
    patternMatchingCode: [
      GovUKDetails({
        summaryText: 'View code',
        content: [
          CodeBlock({
            language: 'typescript',
            code: `
              GovUKTextInput({
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
              })
            `,
          }),
        ],
      }),
    ],
    lettersOnlyExample: [
      exampleBox([
        GovUKTextInput({
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
      ]),
    ],
    lettersOnlyCode: [
      GovUKDetails({
        summaryText: 'View code',
        content: [
          CodeBlock({
            language: 'typescript',
            code: `
              GovUKTextInput({
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
              })
            `,
          }),
        ],
      }),
    ],
    pagination: [
      GovUKPagination({
        classes: 'govuk-pagination--inline',
        previous: {
          href: '/form-engine-developer-guide/validation/playground/intro',
          labelText: 'Playground Hub',
        },
        next: {
          href: '/form-engine-developer-guide/validation/playground/numbers',
          labelText: 'Number Validation',
        },
      }),
    ],
  },
})
