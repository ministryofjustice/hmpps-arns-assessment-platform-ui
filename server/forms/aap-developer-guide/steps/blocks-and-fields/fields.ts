import { step, block } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { CodeBlock } from '@form-engine/registry/components/codeBlock'
import { GovUKDetails, GovUKPagination, GovUKWarningText } from '@form-engine-govuk-components/components'

/**
 * Blocks & Fields - Field Types
 *
 * Deep dive into the field() builder, common field properties, and GOV.UK field components.
 */
export const fieldsStep = step({
  path: '/fields',
  title: 'Fields',
  blocks: [
    // Page header
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <h1 class="govuk-heading-l">Field Types</h1>
        <p class="govuk-body-l">
          The <code>field()</code> builder creates input components that collect user data.
          Every field has a <code>code</code> that identifies the answer in form submissions.
        </p>
      `,
    }),

    // The field() Builder section
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">The field() Builder</h2>
        <p class="govuk-body">Basic usage:</p>
        {{slot:code}}
      `,
      slots: {
        code: [
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
})`,
          }),
        ],
      },
    }),

    // Common Properties section
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Common Field Properties</h2>
        <p class="govuk-body">All fields share these base properties in addition to their variant-specific options:</p>
      `,
    }),

    // code property
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <h3 class="govuk-heading-s"><code>{{name}}</code> <span class="govuk-tag govuk-tag--red">Required</span></h3>
        {{slot:description}}
        {{slot:example}}
      `,
      values: { name: 'code' },
      slots: {
        description: [
          block<HtmlBlock>({
            variant: 'html',
            content: `
              <p class="govuk-body">
                A unique identifier for this field within the form. Used to:
              </p>
              <ul class="govuk-list govuk-list--bullet">
                <li>Store the user's answer in form data</li>
                <li>Reference the answer using <code>Answer('code')</code></li>
                <li>Generate the HTML <code>name</code> attribute</li>
              </ul>
              <p class="govuk-body">
                <strong>Convention:</strong> Use snake_case for field codes, <i>sss...🐍</i> .
              </p>
            `,
          }),
        ],
        example: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `
code: 'email_address'
code: 'business_contact_phone'`,
          }),
        ],
      },
    }),

    // defaultValue property
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <h3 class="govuk-heading-s"><code>{{name}}</code></h3>
        {{slot:description}}
        {{slot:example}}
      `,
      values: { name: 'defaultValue' },
      slots: {
        description: [
          block<HtmlBlock>({
            variant: 'html',
            content: `
              <p class="govuk-body">
                Initial value for the field when the page loads with no pre-existing answer set.
                Can be a static value or a dynamic expression.
              </p>
            `,
          }),
        ],
        example: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `// Static default
defaultValue: 'United Kingdom'

// From another field
defaultValue: Answer('contactEmail')

// From step data
defaultValue: Data('user.email')`,
          }),
        ],
      },
    }),

    // validate property
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <h3 class="govuk-heading-s"><code>{{name}}</code></h3>
        {{slot:description}}
        {{slot:example}}
        {{slot:footer}}
      `,
      values: { name: 'validate' },
      slots: {
        description: [
          block<HtmlBlock>({
            variant: 'html',
            content: `
              <p class="govuk-body">
                Array of validation rules. Each rule specifies a condition that triggers
                an error and the message to display.
              </p>
            `,
          }),
        ],
        example: [
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
]`,
          }),
        ],
        footer: [
          block<HtmlBlock>({
            variant: 'html',
            content: `
              <p class="govuk-body">
                See the <a href="/forms/form-engine-developer-guide/blocks-and-fields/validation" class="govuk-link">Validation</a>
                page for full details on validation rules.
              </p>
            `,
          }),
        ],
      },
    }),

    // formatters property
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <h3 class="govuk-heading-s"><code>{{name}}</code></h3>
        {{slot:description}}
        {{slot:example}}
      `,
      values: { name: 'formatters' },
      slots: {
        description: [
          block<HtmlBlock>({
            variant: 'html',
            content: `
              <p class="govuk-body">
                Array of transformers applied to the field value after submission.
                Use to normalise, clean, or transform user input.
              </p>
            `,
          }),
        ],
        example: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `
import { Transformer } from '@form-engine/registry/transformers'

formatters: [
  Transformer.String.Trim,
  Transformer.String.ToLowerCase,
]`,
          }),
        ],
      },
    }),

    // hidden property
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <h3 class="govuk-heading-s"><code>{{name}}</code></h3>
        {{slot:description}}
        {{slot:example}}
        {{slot:warning}}
      `,
      values: { name: 'hidden' },
      slots: {
        description: [
          block<HtmlBlock>({
            variant: 'html',
            content: `
              <p class="govuk-body">
                Condition that, when true, hides the field from the page.
              </p>
            `,
          }),
        ],
        example: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `// Hide unless "other" is selected
hidden: Answer('contactMethod').not.match(
  Condition.String.Equals('other')
)`,
          }),
        ],
        warning: [
          block<GovUKWarningText>({
            variant: 'govukWarningText',
            html: `<p><strong>
                Hidden fields are not rendered but DO participate in validation.
                If you don't want to include it in validation, set a
                </strong><code>dependent</code> <strong>condition</strong>
                </p>`,
          }),
        ],
      },
    }),

    // dependent property
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <h3 class="govuk-heading-s"><code>{{name}}</code></h3>
        {{slot:description}}
        {{slot:example}}
      `,
      values: { name: 'dependent' },
      slots: {
        description: [
          block<HtmlBlock>({
            variant: 'html',
            content: `
              <p class="govuk-body">
                Marks this field as depending on another field's value. When the dependency
                condition is <strong>not met</strong>, the field is excluded from validation
                and its value is cleared.
              </p>
              <p class="govuk-body">
                Use this for fields that should only be validated when a parent field
                has a specific value (e.g., "Other - please specify" patterns).
              </p>
            `,
          }),
        ],
        example: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `// Only validate when "other" is selected
dependent: Answer('contactMethod').match(Condition.String.Equals('other'))`,
          }),
        ],
      },
    }),

    // multiple property
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <h3 class="govuk-heading-s"><code>{{name}}</code></h3>
        {{slot:description}}
        {{slot:example}}
      `,
      values: { name: 'multiple' },
      slots: {
        description: [
          block<HtmlBlock>({
            variant: 'html',
            content: `
              <p class="govuk-body">
                For checkbox fields, set to <code>true</code> to capture all selected values
                as an array. By default, only the first value is captured.
              </p>
            `,
          }),
        ],
        example: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `// Capture all selected checkbox values
multiple: true`,
          }),
        ],
      },
    }),

    // Field Types header
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">GOV.UK Field Types</h2>
        <p class="govuk-body">
          The following field types are available from the GOV.UK Frontend component library.
        </p>
      `,
    }),

    // Text Input
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <h3 class="govuk-heading-s">Text Input</h3>
        <p class="govuk-body"><code>variant: 'govukTextInput'</code></p>
        {{slot:description}}
        {{slot:example}}
      `,
      slots: {
        description: [
          block<HtmlBlock>({
            variant: 'html',
            content: `
              <p class="govuk-body">
                Single-line text input for names, emails, numbers, etc.
              </p>
              <p class="govuk-body"><strong>Key Properties:</strong></p>
              <ul class="govuk-list govuk-list--bullet">
                <li><code>label</code> &mdash; Field label (string or object with styling)</li>
                <li><code>hint</code> &mdash; Help text below the label</li>
                <li><code>inputType</code> &mdash; 'text', 'email', 'tel', 'password', 'number'</li>
                <li><code>inputMode</code> &mdash; Keyboard type: 'text', 'numeric', 'decimal', 'email', 'tel'</li>
                <li><code>autocomplete</code> &mdash; Browser autocomplete hint</li>
                <li><code>prefix</code> / <code>suffix</code> &mdash; Text before/after input</li>
                <li><code>classes</code> &mdash; Width classes like <code>'govuk-input--width-10'</code></li>
              </ul>
            `,
          }),
        ],
        example: [
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
})`,
          }),
        ],
      },
    }),

    // Radio Input
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <hr class="govuk-section-break govuk-section-break--m govuk-section-break--visible">
        <h3 class="govuk-heading-s">Radio Input</h3>
        <p class="govuk-body"><code>variant: 'govukRadioInput'</code></p>
        {{slot:description}}
        {{slot:example}}
      `,
      slots: {
        description: [
          block<HtmlBlock>({
            variant: 'html',
            content: `
              <p class="govuk-body">
                Single-choice selection with mutually exclusive options.
              </p>
              <p class="govuk-body"><strong>Key Properties:</strong></p>
              <ul class="govuk-list govuk-list--bullet">
                <li><code>fieldset</code> &mdash; Container with <code>legend</code> for the question</li>
                <li><code>hint</code> &mdash; Help text for the group</li>
                <li><code>items</code> &mdash; Array of options with <code>value</code> and <code>text</code></li>
                <li><code>items[].hint</code> &mdash; Help text for individual option</li>
                <li><code>items[].block</code> &mdash; Conditional reveal (shown when selected)</li>
              </ul>
              <p class="govuk-body">
                Use <code>{ divider: 'or' }</code> in items to add a visual separator.
              </p>
            `,
          }),
        ],
        example: [
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
})`,
          }),
        ],
      },
    }),

    // Checkbox Input
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <hr class="govuk-section-break govuk-section-break--m govuk-section-break--visible">
        <h3 class="govuk-heading-s">Checkbox Input</h3>
        <p class="govuk-body"><code>variant: 'govukCheckboxInput'</code></p>
        {{slot:description}}
        {{slot:example}}
      `,
      slots: {
        description: [
          block<HtmlBlock>({
            variant: 'html',
            content: `
              <p class="govuk-body">
                Multiple-choice selection where users can select several options.
              </p>
            `,
          }),
          block<GovUKWarningText>({
            variant: 'govukWarningText',
            html: 'Set <code>multiple: true</code> to capture all selected values as an array.',
          }),
          block<HtmlBlock>({
            variant: 'html',
            content: `
              <p class="govuk-body"><strong>Key Properties:</strong></p>
              <ul class="govuk-list govuk-list--bullet">
                <li><code>fieldset</code> &mdash; Container with <code>legend</code> for the question</li>
                <li><code>items</code> &mdash; Array of options</li>
                <li><code>items[].behaviour: 'exclusive'</code> &mdash; Unchecks all others (for "None")</li>
                <li><code>multiple: true</code> &mdash; Required to get array of answers</li>
              </ul>
            `,
          }),
        ],
        example: [
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
})`,
          }),
        ],
      },
    }),

    // Textarea
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <hr class="govuk-section-break govuk-section-break--m govuk-section-break--visible">
        <h3 class="govuk-heading-s">Textarea</h3>
        <p class="govuk-body"><code>variant: 'govukTextarea'</code></p>
        {{slot:description}}
        {{slot:example}}
      `,
      slots: {
        description: [
          block<HtmlBlock>({
            variant: 'html',
            content: `
              <p class="govuk-body">
                Multi-line text input for longer responses.
              </p>
              <p class="govuk-body"><strong>Key Properties:</strong></p>
              <ul class="govuk-list govuk-list--bullet">
                <li><code>label</code> &mdash; Field label</li>
                <li><code>hint</code> &mdash; Help text</li>
                <li><code>rows</code> &mdash; Number of visible lines (default: 5)</li>
                <li><code>spellcheck</code> &mdash; Enable/disable spellcheck</li>
              </ul>
            `,
          }),
        ],
        example: [
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
})`,
          }),
        ],
      },
    }),

    // Character Count
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <hr class="govuk-section-break govuk-section-break--m govuk-section-break--visible">
        <h3 class="govuk-heading-s">Character Count</h3>
        <p class="govuk-body"><code>variant: 'govukCharacterCount'</code></p>
        {{slot:description}}
        {{slot:example}}
      `,
      slots: {
        description: [
          block<HtmlBlock>({
            variant: 'html',
            content: `
              <p class="govuk-body">
                Textarea with live character or word counting.
              </p>
              <p class="govuk-body"><strong>Key Properties:</strong></p>
              <ul class="govuk-list govuk-list--bullet">
                <li><code>maxLength</code> &mdash; Maximum characters allowed</li>
                <li><code>maxWords</code> &mdash; Maximum words allowed (takes precedence)</li>
                <li><code>threshold</code> &mdash; Percentage at which to show count (e.g., 75)</li>
              </ul>
            `,
          }),
        ],
        example: [
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
})`,
          }),
        ],
      },
    }),

    // Date Input
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <hr class="govuk-section-break govuk-section-break--m govuk-section-break--visible">
        <h3 class="govuk-heading-s">Date Input</h3>
        <p class="govuk-body"><code>variant: 'govukDateInputFull'</code></p>
        {{slot:description}}
        {{slot:example}}
      `,
      slots: {
        description: [
          block<HtmlBlock>({
            variant: 'html',
            content: `
              <p class="govuk-body">
                Date entry with separate day, month, and year fields.
              </p>
              <p class="govuk-body"><strong>Variants:</strong></p>
              <ul class="govuk-list govuk-list--bullet">
                <li><code>govukDateInputFull</code> &mdash; Day, Month, Year (ISO: YYYY-MM-DD)</li>
                <li><code>govukDateInputYearMonth</code> &mdash; Month, Year only</li>
                <li><code>govukDateInputMonthDay</code> &mdash; Day, Month only</li>
              </ul>
              <p class="govuk-body"><strong>Key Properties:</strong></p>
              <ul class="govuk-list govuk-list--bullet">
                <li><code>fieldset</code> &mdash; Container with legend for the date question</li>
                <li><code>hint</code> &mdash; Format example (e.g., "For example, 31 3 1980")</li>
              </ul>
            `,
          }),
        ],
        example: [
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
})`,
          }),
        ],
      },
    }),

    // Conditional Reveal section
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Conditional Reveal</h2>
        <p class="govuk-body">
          Radio and checkbox items can reveal additional content when selected using the
          <code>block</code> property. This is useful for follow-up questions.
        </p>
      `,
    }),

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
        <p class="govuk-body govuk-!-margin-top-6">
          <strong>Next:</strong> Learn how to validate field input in the
          <a href="/forms/form-engine-developer-guide/validation/intro" class="govuk-link">Validation</a> section.
        </p>
        <p class="govuk-body">
          <a href="/forms/form-engine-developer-guide/hub" class="govuk-link">&larr; Back to Guide Hub</a>
        </p>
      `,
      slots: {
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
    }),
  ],
})
