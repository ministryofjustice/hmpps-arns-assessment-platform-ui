import { block } from '@form-engine/form/builders'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { GovUKDetails, GovUKPagination, GovUKWarningText } from '@form-engine-govuk-components/components'
import { CodeBlock } from '../../../../components/code-block/codeBlock'
import { parseGovUKMarkdown } from '../../../../helpers/markdown'

/**
 * Blocks & Fields - Field Types
 *
 * Deep dive into the field() builder, common field properties, and GOV.UK field components.
 */
export const pageContent = block<TemplateWrapper>({
  variant: 'templateWrapper',
  template: parseGovUKMarkdown(`
  # Field Types

  The \`field()\` builder creates input components that collect user data.
  Every field has a \`code\` that identifies the answer in form submissions. {.lead}

  ---

  ## The field() Builder

  Basic usage:

  {{slot:basicUsageCode}}

  ---

  ## Common Field Properties

  All fields share these base properties in addition to their variant-specific options:

  ### \`code\` <span class="govuk-tag govuk-tag--red">Required</span>

  A unique identifier for this field within the form. Used to:

  - Store the user's answer in form data
  - Reference the answer using \`Answer('code')\`
  - Generate the HTML \`name\` attribute

  **Convention:** Use snake_case for field codes, *sss...🐍* .

  {{slot:codeExampleCode}}

  ### \`defaultValue\` <span class="govuk-tag govuk-tag--grey">Optional</span>

  Initial value for the field when the page loads with no pre-existing answer set.
  Can be a static value or a dynamic expression.

  {{slot:defaultValueExampleCode}}

  ### \`validate\` <span class="govuk-tag govuk-tag--grey">Optional</span>

  Array of validation rules. Each rule specifies a condition that triggers
  an error and the message to display.

  {{slot:validateExampleCode}}

  See the [Validation](/forms/form-engine-developer-guide/validation/intro) page for full details on validation rules.

  ### \`formatters\` <span class="govuk-tag govuk-tag--grey">Optional</span>

  Array of transformers applied to the field value after submission.
  Use to normalise, clean, or transform user input.

  {{slot:formattersExampleCode}}

  ### \`hidden\` <span class="govuk-tag govuk-tag--grey">Optional</span>

  Condition that, when true, hides the field from the page.

  {{slot:hiddenExampleCode}}

  {{slot:hiddenWarning}}

  ### \`dependent\` <span class="govuk-tag govuk-tag--grey">Optional</span>

  Marks this field as depending on another field's value. When the dependency
  condition is **not met**, the field is excluded from validation
  and its value is cleared.

  Use this for fields that should only be validated when a parent field
  has a specific value (e.g., "Other - please specify" patterns).

  {{slot:dependentExampleCode}}

  ### \`multiple\` <span class="govuk-tag govuk-tag--grey">Optional</span>

  For checkbox fields, set to \`true\` to capture all selected values
  as an array. By default, only the first value is captured.

  {{slot:multipleExampleCode}}

  ### \`sanitize\` <span class="govuk-tag govuk-tag--grey">Optional</span>

  Controls whether HTML entities are escaped in the field value. Defaults to \`true\`
  for XSS protection.

  When \`true\` (default), dangerous characters are converted:

  - \`<\` becomes \`&lt;\`
  - \`>\` becomes \`&gt;\`
  - \`&\` becomes \`&amp;\`
  - \`"\` becomes \`&quot;\`
  - \`'\` becomes \`&#39;\`

  Set to \`false\` only for fields that intentionally accept HTML
  (e.g., rich text editors).

  {{slot:sanitizeExampleCode}}

  ---

  ## GOV.UK Field Types

  The following field types are available from the GOV.UK Frontend component library.

  ### Text Input

  \`variant: 'govukTextInput'\`

  Single-line text input for names, emails, numbers, etc.

  **Key Properties:**
  - \`label\` — Field label (string or object with styling)
  - \`hint\` — Help text below the label
  - \`inputType\` — 'text', 'email', 'tel', 'password', 'number'
  - \`inputMode\` — Keyboard type: 'text', 'numeric', 'decimal', 'email', 'tel'
  - \`autocomplete\` — Browser autocomplete hint
  - \`prefix\` / \`suffix\` — Text before/after input
  - \`classes\` — Width classes like \`'govuk-input--width-10'\`

  {{slot:textInputCode}}

  ---

  ### Radio Input

  \`variant: 'govukRadioInput'\`

  Single-choice selection with mutually exclusive options.

  **Key Properties:**
  - \`fieldset\` — Container with \`legend\` for the question
  - \`hint\` — Help text for the group
  - \`items\` — Array of options with \`value\` and \`text\`
  - \`items[].hint\` — Help text for individual option
  - \`items[].block\` — Conditional reveal (shown when selected)

  Use \`{ divider: 'or' }\` in items to add a visual separator.

  {{slot:radioInputCode}}

  ---

  ### Checkbox Input

  \`variant: 'govukCheckboxInput'\`

  Multiple-choice selection where users can select several options.

  {{slot:checkboxWarning}}

  **Key Properties:**
  - \`fieldset\` — Container with \`legend\` for the question
  - \`items\` — Array of options
  - \`items[].behaviour: 'exclusive'\` — Unchecks all others (for "None")
  - \`multiple: true\` — Required to get array of answers

  {{slot:checkboxInputCode}}

  ---

  ### Textarea

  \`variant: 'govukTextarea'\`

  Multi-line text input for longer responses.

  **Key Properties:**
  - \`label\` — Field label
  - \`hint\` — Help text
  - \`rows\` — Number of visible lines (default: 5)
  - \`spellcheck\` — Enable/disable spellcheck

  {{slot:textareaCode}}

  ---

  ### Character Count

  \`variant: 'govukCharacterCount'\`

  Textarea with live character or word counting.

  **Key Properties:**
  - \`maxLength\` — Maximum characters allowed
  - \`maxWords\` — Maximum words allowed (takes precedence)
  - \`threshold\` — Percentage at which to show count (e.g., 75)

  {{slot:characterCountCode}}

  ---

  ### Date Input

  \`variant: 'govukDateInputFull'\`

  Date entry with separate day, month, and year fields.

  **Variants:**
  - \`govukDateInputFull\` — Day, Month, Year (ISO: YYYY-MM-DD)
  - \`govukDateInputYearMonth\` — Month, Year only
  - \`govukDateInputMonthDay\` — Day, Month only

  **Key Properties:**
  - \`fieldset\` — Container with legend for the date question
  - \`hint\` — Format example (e.g., "For example, 31 3 1980")

  {{slot:dateInputCode}}

  ---

  ## Conditional Reveal

  Radio and checkbox items can reveal additional content when selected using the
  \`block\` property. This is useful for follow-up questions.

  {{slot:conditionalRevealDetails}}

  ---

  {{slot:pagination}}

  **Next:** Learn how to validate field input in the [Validation](/forms/form-engine-developer-guide/validation/intro) section.

  [← Back to Guide Hub](/forms/form-engine-developer-guide/hub)
`),
  slots: {
    basicUsageCode: [
      block<CodeBlock>({
        variant: 'codeBlock',
        language: 'typescript',
        code: `
          import { field } from '@form-engine/form/builders'
          import { GovUKTextInput } from '@form-engine-govuk-components/components'

          field<GovUKTextInput>({
            variant: 'govukTextInput',
            code: 'fullName',
            label: 'Full name',
          })
        `,
      }),
    ],
    codeExampleCode: [
      block<CodeBlock>({
        variant: 'codeBlock',
        language: 'typescript',
        code: `
          code: 'email_address'
          code: 'business_contact_phone'
        `,
      }),
    ],
    defaultValueExampleCode: [
      block<CodeBlock>({
        variant: 'codeBlock',
        language: 'typescript',
        code: `
          // Static default
          defaultValue: 'United Kingdom'

          // From another field
          defaultValue: Answer('contactEmail')

          // From step data
          defaultValue: Data('user.email')
        `,
      }),
    ],
    validateExampleCode: [
      block<CodeBlock>({
        variant: 'codeBlock',
        language: 'typescript',
        code: `
          validate: [
            validation({
              when: Self().match(Condition.String.IsEmpty()),
              message: 'Enter your full name',
            }),
            validation({
              when: Self().not.match(Condition.String.MinLength(2)),
              message: 'Full name must be at least 2 characters',
            }),
          ]
        `,
      }),
    ],
    formattersExampleCode: [
      block<CodeBlock>({
        variant: 'codeBlock',
        language: 'typescript',
        code: `
          import { Transformer } from '@form-engine/registry/transformers'

          formatters: [
            Transformer.String.Trim(),
            Transformer.String.ToLowerCase(),
          ]
        `,
      }),
    ],
    hiddenExampleCode: [
      block<CodeBlock>({
        variant: 'codeBlock',
        language: 'typescript',
        code: `
          // Hide unless "other" is selected
          hidden: Answer('contactMethod').not.match(
            Condition.String.Equals('other')
          )
        `,
      }),
    ],
    hiddenWarning: [
      block<GovUKWarningText>({
        variant: 'govukWarningText',
        html: `<p><strong>
                Hidden fields are not rendered but DO participate in validation.
                If you don't want to include it in validation, set a
                </strong><code>dependent</code> <strong>condition</strong>
                </p>`,
      }),
    ],
    dependentExampleCode: [
      block<CodeBlock>({
        variant: 'codeBlock',
        language: 'typescript',
        code: `
          // Only validate when "other" is selected
          dependent: Answer('contactMethod').match(Condition.String.Equals('other'))
        `,
      }),
    ],
    multipleExampleCode: [
      block<CodeBlock>({
        variant: 'codeBlock',
        language: 'typescript',
        code: `
          // Capture all selected checkbox values
          multiple: true
        `,
      }),
    ],
    sanitizeExampleCode: [
      block<CodeBlock>({
        variant: 'codeBlock',
        language: 'typescript',
        code: `
          // Default behaviour - XSS protected
          // Input: <script>alert('xss')</script>
          // Stored: &lt;script&gt;alert(&#39;xss&#39;)&lt;/script&gt;

          // Allow raw HTML (use with caution!)
          sanitize: false
        `,
      }),
    ],
    textInputCode: [
      block<CodeBlock>({
        variant: 'codeBlock',
        language: 'typescript',
        code: `
          field<GovUKTextInput>({
            variant: 'govukTextInput',
            code: 'email',
            label: 'Email address',
            hint: 'We will use this to send your confirmation',
            inputType: 'email',
            autocomplete: 'email',
            classes: 'govuk-input--width-20',
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
        `,
      }),
    ],
    radioInputCode: [
      block<CodeBlock>({
        variant: 'codeBlock',
        language: 'typescript',
        code: `
          field<GovUKRadioInput>({
            variant: 'govukRadioInput',
            code: 'contactMethod',
            fieldset: {
              legend: {
                text: 'How would you like to be contacted?',
                classes: 'govuk-fieldset__legend--m',
              },
            },
            hint: 'Select one option',
            items: [
              { value: 'email', text: 'Email' },
              { value: 'phone', text: 'Phone' },
              { divider: 'or' },
              {
                value: 'post',
                text: 'Post',
                hint: { text: 'We will send a letter to your address' },
              },
            ],
            validate: [
              validation({
                when: Self().match(Condition.String.IsEmpty()),
                message: 'Select how you would like to be contacted',
              }),
            ],
          })
        `,
      }),
    ],
    checkboxWarning: [
      block<GovUKWarningText>({
        variant: 'govukWarningText',
        html: 'Set <code>multiple: true</code> to capture all selected values as an array.',
      }),
    ],
    checkboxInputCode: [
      block<CodeBlock>({
        variant: 'codeBlock',
        language: 'typescript',
        code: `
          field<GovUKCheckboxInput>({
            variant: 'govukCheckboxInput',
            code: 'notifications',
            multiple: true, // Important: captures array of values
            fieldset: {
              legend: {
                text: 'Which notifications do you want to receive?',
                classes: 'govuk-fieldset__legend--m',
              },
            },
            items: [
              { value: 'email_updates', text: 'Email updates' },
              { value: 'sms_alerts', text: 'SMS alerts' },
              { value: 'newsletter', text: 'Monthly newsletter' },
              { divider: 'or' },
              {
                value: 'none',
                text: 'None of the above',
                behaviour: 'exclusive', // Unchecks others when selected
              },
            ],
          })
        `,
      }),
    ],
    textareaCode: [
      block<CodeBlock>({
        variant: 'codeBlock',
        language: 'typescript',
        code: `
          field<GovUKTextarea>({
            variant: 'govukTextarea',
            code: 'description',
            label: 'Describe the issue',
            hint: 'Include as much detail as possible',
            rows: 8,
            validate: [
              validation({
                when: Self().match(Condition.String.IsEmpty()),
                message: 'Enter a description',
              }),
            ],
          })
        `,
      }),
    ],
    characterCountCode: [
      block<CodeBlock>({
        variant: 'codeBlock',
        language: 'typescript',
        code: `
          field<GovUKCharacterCount>({
            variant: 'govukCharacterCount',
            code: 'feedback',
            label: 'Your feedback',
            maxLength: 500,
            threshold: 75, // Show count when 75% full
            validate: [
              validation({
                when: Self().match(Condition.String.IsEmpty()),
                message: 'Enter your feedback',
              }),
            ],
          })
        `,
      }),
    ],
    dateInputCode: [
      block<CodeBlock>({
        variant: 'codeBlock',
        language: 'typescript',
        code: `
          field<GovUKDateInputFull>({
            variant: 'govukDateInputFull',
            code: 'dateOfBirth',
            fieldset: {
              legend: {
                text: 'What is your date of birth?',
                classes: 'govuk-fieldset__legend--m',
              },
            },
            hint: 'For example, 31 3 1980',
            validate: [
              validation({
                when: Self().match(Condition.String.IsEmpty()),
                message: 'Enter your date of birth',
              }),
              validation({
                when: Self().not.match(Condition.Date.IsValid()),
                message: 'Date of birth must be a real date',
                details: { field: 'day' }, // Highlights the day field
              }),
            ],
          })
        `,
      }),
    ],
    conditionalRevealDetails: [
      block<GovUKDetails>({
        variant: 'govukDetails',
        summaryText: 'View conditional reveal example',
        content: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `
              field<GovUKRadioInput>({
                variant: 'govukRadioInput',
                code: 'hasPhone',
                fieldset: {
                  legend: { text: 'Can we contact you by phone?' },
                },
                items: [
                  {
                    value: 'yes',
                    text: 'Yes',
                    block: field<GovUKTextInput>({
                      variant: 'govukTextInput',
                      code: 'phoneNumber',
                      label: 'Phone number',
                      inputType: 'tel',
                      autocomplete: 'tel',
                    }),
                  },
                  { value: 'no', text: 'No' },
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
          href: '/forms/form-engine-developer-guide/blocks-and-fields/blocks',
          labelText: 'Block Types',
        },
      }),
    ],
  },
})
