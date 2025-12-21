import { block, field, validation, Self, Answer } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { GovUKTextInput, GovUKDetails, GovUKPagination } from '@form-engine-govuk-components/components'
import { CodeBlock } from '../../../../../components/code-block/codeBlock'
import { exampleBox } from '../../../../../helpers/exampleBox'
import { parseGovUKMarkdown } from '../../../../../helpers/markdown'

/**
 * Conditions Playground - Strings
 *
 * Interactive examples of string conditions with validation.
 */
export const pageContent = block<TemplateWrapper>({
  variant: 'templateWrapper',
  template: parseGovUKMarkdown(`
  # String Conditions Playground

  Try these fields to see string conditions in action. Submit the form to
  trigger validation and see error messages. {.lead}

  ---

  ## Condition.Equals()

  Type anything other than the correct password to see the validation error.

  {{slot:equalsExample}}

  {{slot:equalsCode}}

  ---

  ## Condition.IsRequired()

  Leave this empty and submit to see the required validation.

  {{slot:requiredExample}}

  {{slot:requiredCode}}

  ---

  ## Condition.String.HasMinLength()

  Enter fewer than 5 characters to see the validation error.

  {{slot:minLengthExample}}

  {{slot:minLengthCode}}

  ---

  ## Condition.String.HasMaxLength()

  Enter more than 10 characters to see the validation error.

  {{slot:maxLengthExample}}

  {{slot:maxLengthCode}}

  ---

  ## Condition.String.MatchesRegex()

  Enter an invalid UK postcode format (e.g., "invalid" or "123") to see validation fail.

  {{slot:regexExample}}

  {{slot:regexCode}}

  ---

  ## Condition.String.LettersOnly()

  Try "John123" or "Test!" to see validation fail.

  {{slot:lettersExample}}

  {{slot:lettersCode}}

  ---

  ## Condition.Email.IsValidEmail()

  Try entering invalid emails like "test" or "test@" to see format validation.

  {{slot:emailExample}}

  {{slot:emailCode}}

  ---

  {{slot:pagination}}
`),
  slots: {
    equalsExample: [
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
    ],
    equalsCode: [
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
    ],
    requiredExample: [
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
    ],
    requiredCode: [
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
    ],
    minLengthExample: [
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
    ],
    minLengthCode: [
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
    ],
    maxLengthExample: [
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
    ],
    maxLengthCode: [
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
    ],
    regexExample: [
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
    ],
    regexCode: [
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
    ],
    lettersExample: [
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
    ],
    lettersCode: [
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
    ],
    emailExample: [
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
    ],
    emailCode: [
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
    ],
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
})
