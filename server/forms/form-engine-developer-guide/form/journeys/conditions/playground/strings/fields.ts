import { validation, Self, Answer } from '@form-engine/form/builders'
import { HtmlBlock, TemplateWrapper } from '@form-engine/registry/components'
import { Condition } from '@form-engine/registry/conditions'
import { GovUKTextInput, GovUKDetails, GovUKPagination } from '@form-engine-govuk-components/components'
import { CodeBlock } from '../../../../../components'
import { exampleBox } from '../../../../../helpers/exampleBox'
import { parseGovUKMarkdown } from '../../../../../helpers/markdown'

/**
 * Conditions Playground - Strings
 *
 * Interactive examples of string conditions with validation.
 */
export const pageContent = TemplateWrapper({
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
        GovUKTextInput({
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
        HtmlBlock({
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
      GovUKDetails({
        summaryText: 'View code',
        content: [
          CodeBlock({
            language: 'typescript',
            code: `
            GovUKTextInput({
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
        GovUKTextInput({
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
      GovUKDetails({
        summaryText: 'View code',
        content: [
          CodeBlock({
            language: 'typescript',
            code: `
            GovUKTextInput({
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
        GovUKTextInput({
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
      GovUKDetails({
        summaryText: 'View code',
        content: [
          CodeBlock({
            language: 'typescript',
            code: `GovUKTextInput({
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
        GovUKTextInput({
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
      GovUKDetails({
        summaryText: 'View code',
        content: [
          CodeBlock({
            language: 'typescript',
            code: `
            GovUKTextInput({
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
        GovUKTextInput({
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
      GovUKDetails({
        summaryText: 'View code',
        content: [
          CodeBlock({
            language: 'typescript',
            code: `
            GovUKTextInput({
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
        GovUKTextInput({
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
      GovUKDetails({
        summaryText: 'View code',
        content: [
          CodeBlock({
            language: 'typescript',
            code: `
            GovUKTextInput({
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
        GovUKTextInput({
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
      GovUKDetails({
        summaryText: 'View code',
        content: [
          CodeBlock({
            language: 'typescript',
            code: `
            GovUKTextInput({
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
      GovUKPagination({
        classes: 'govuk-pagination--inline',
        previous: {
          href: '/form-engine-developer-guide/conditions/playground/intro',
          labelText: 'Playground Hub',
        },
        next: {
          href: '/form-engine-developer-guide/conditions/playground/numbers',
          labelText: 'Number Conditions',
        },
      }),
    ],
  },
})
