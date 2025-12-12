import { step, block, field, validation, Self, Answer, submitTransition, and } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { CodeBlock } from '@form-engine/registry/components/codeBlock'
import { GovUKDateInputFull, GovUKDetails, GovUKPagination } from '@form-engine-govuk-components/components'
import { exampleBox } from '../../../helpers/exampleBox'

/**
 * Conditions Playground - Dates
 *
 * Interactive examples of date conditions with validation.
 * Submit the form to see validation errors.
 */
export const datesStep = step({
  path: '/dates',
  title: 'Date Conditions',
  onSubmission: [
    submitTransition({
      validate: true,
    }),
  ],
  blocks: [
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <h1 class="govuk-heading-l">Date Conditions Playground</h1>

        <p class="govuk-body-l">
          Try these fields to see date conditions in action. Submit the form to
          trigger validation and see error messages.
        </p>

        <div class="govuk-inset-text">
          <strong>Note:</strong> Date conditions expect ISO-8601 format (YYYY-MM-DD).
          The GOV.UK date input automatically converts to this format.
        </div>
      `,
    }),

    // IsValid
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Condition.Date.IsValid()</h2>
        <p class="govuk-body">Enter an invalid date like 31 February to see the validation error.</p>
      `,
    }),

    exampleBox([
      field<GovUKDateInputFull>({
        variant: 'govukDateInputFull',
        code: 'cond_date_valid',
        fieldset: {
          legend: { text: 'Enter any date' },
        },
        hint: 'For example, 27 3 2024',
        validate: [
          validation({
            when: Self().not.match(Condition.IsRequired()),
            message: 'Enter a date',
          }),
          validation({
            when: Self().not.match(Condition.Date.IsValid()),
            message: 'Enter a real date',
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
          code: `field<GovUKDateInputFull>({
  variant: 'govukDateInputFull',
  code: 'cond_date_valid',
  fieldset: {
    legend: { text: 'Enter any date' },
  },
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Enter a date',
    }),
    validation({
      when: Self().not.match(Condition.Date.IsValid()),
      message: 'Enter a real date',
    }),
  ],
})`,
        }),
      ],
    }),

    // IsFutureDate
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Condition.Date.IsFutureDate()</h2>
        <p class="govuk-body">Enter today's date or earlier to see the validation error.</p>
      `,
    }),

    exampleBox([
      field<GovUKDateInputFull>({
        variant: 'govukDateInputFull',
        code: 'cond_date_future',
        fieldset: {
          legend: { text: 'Appointment date' },
        },
        hint: 'Must be a future date',
        validate: [
          validation({
            when: Self().not.match(Condition.IsRequired()),
            message: 'Enter an appointment date',
          }),
          validation({
            when: Self().not.match(Condition.Date.IsValid()),
            message: 'Enter a real date',
          }),
          validation({
            when: Self().not.match(Condition.Date.IsFutureDate()),
            message: 'Appointment date must be in the future',
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
          code: `field<GovUKDateInputFull>({
  variant: 'govukDateInputFull',
  code: 'cond_date_future',
  fieldset: {
    legend: { text: 'Appointment date' },
  },
  hint: 'Must be a future date',
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Enter an appointment date',
    }),
    validation({
      when: Self().not.match(Condition.Date.IsValid()),
      message: 'Enter a real date',
    }),
    validation({
      when: Self().not.match(Condition.Date.IsFutureDate()),
      message: 'Appointment date must be in the future',
    }),
  ],
})`,
        }),
      ],
    }),

    // IsAfter
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Condition.Date.IsAfter()</h2>
        <p class="govuk-body">Enter a date on or before 1st January 2020 to see the validation error.</p>
      `,
    }),

    exampleBox([
      field<GovUKDateInputFull>({
        variant: 'govukDateInputFull',
        code: 'cond_date_after',
        fieldset: {
          legend: { text: 'Start date' },
        },
        hint: 'Must be after 1 January 2020',
        validate: [
          validation({
            when: Self().not.match(Condition.IsRequired()),
            message: 'Enter a start date',
          }),
          validation({
            when: Self().not.match(Condition.Date.IsValid()),
            message: 'Enter a real date',
          }),
          validation({
            when: Self().not.match(Condition.Date.IsAfter('2020-01-01')),
            message: 'Start date must be after 1 January 2020',
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
          code: `field<GovUKDateInputFull>({
  variant: 'govukDateInputFull',
  code: 'cond_date_after',
  fieldset: {
    legend: { text: 'Start date' },
  },
  hint: 'Must be after 1 January 2020',
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Enter a start date',
    }),
    validation({
      when: Self().not.match(Condition.Date.IsValid()),
      message: 'Enter a real date',
    }),
    validation({
      when: Self().not.match(Condition.Date.IsAfter('2020-01-01')),
      message: 'Start date must be after 1 January 2020',
    }),
  ],
})`,
        }),
      ],
    }),

    // IsBefore
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Condition.Date.IsBefore()</h2>
        <p class="govuk-body">Enter a date on or after 1st January 2000 to see the validation error.</p>
      `,
    }),

    exampleBox([
      field<GovUKDateInputFull>({
        variant: 'govukDateInputFull',
        code: 'cond_date_before',
        fieldset: {
          legend: { text: 'Date of birth' },
        },
        hint: 'Must be before 1 January 2000',
        validate: [
          validation({
            when: Self().not.match(Condition.IsRequired()),
            message: 'Enter your date of birth',
          }),
          validation({
            when: Self().not.match(Condition.Date.IsValid()),
            message: 'Enter a real date',
          }),
          validation({
            when: Self().not.match(Condition.Date.IsBefore('2000-01-01')),
            message: 'Date of birth must be before 1 January 2000',
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
          code: `field<GovUKDateInputFull>({
  variant: 'govukDateInputFull',
  code: 'cond_date_before',
  fieldset: {
    legend: { text: 'Date of birth' },
  },
  hint: 'Must be before 1 January 2000',
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Enter your date of birth',
    }),
    validation({
      when: Self().not.match(Condition.Date.IsValid()),
      message: 'Enter a real date',
    }),
    validation({
      when: Self().not.match(Condition.Date.IsBefore('2000-01-01')),
      message: 'Date of birth must be before 1 January 2000',
    }),
  ],
})`,
        }),
      ],
    }),

    // Dynamic Date Comparison
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Dynamic Date Comparison (Cross-Field)</h2>
        <p class="govuk-body">
          Date condition arguments can be <strong>expressions</strong>. This example validates
          that the end date is after the start date using
          <code>Condition.Date.IsAfter(Answer('startDate'))</code>.
        </p>
      `,
    }),

    exampleBox([
      field<GovUKDateInputFull>({
        variant: 'govukDateInputFull',
        code: 'cond_date_start',
        fieldset: {
          legend: { text: 'Start date' },
        },
        hint: 'When does the event begin?',
        validate: [
          validation({
            when: Self().not.match(Condition.IsRequired()),
            message: 'Enter a start date',
          }),
          validation({
            when: Self().not.match(Condition.Date.IsValid()),
            message: 'Start date must be a real date',
          }),
        ],
      }),

      field<GovUKDateInputFull>({
        variant: 'govukDateInputFull',
        code: 'cond_date_end',
        fieldset: {
          legend: { text: 'End date' },
        },
        hint: 'Must be after the start date',
        validate: [
          validation({
            when: Self().not.match(Condition.IsRequired()),
            message: 'Enter an end date',
          }),
          validation({
            when: Self().not.match(Condition.Date.IsValid()),
            message: 'End date must be a real date',
          }),
          validation({
            when: and(
              Answer('cond_date_start').match(Condition.IsRequired()),
              Self().not.match(Condition.Date.IsAfter(Answer('cond_date_start'))),
            ),
            message: 'End date must be after the start date',
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
          code: `// End date validates against start date's value
field<GovUKDateInputFull>({
  code: 'endDate',
  fieldset: { legend: { text: 'End date' } },
  validate: [
    validation({
      when: and(
        Answer('startDate').match(Condition.IsRequired()),
        // Dynamic argument: compare against another field!
        Self().not.match(Condition.Date.IsAfter(Answer('startDate')))
      ),
      message: 'End date must be after the start date',
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
              href: '/forms/form-engine-developer-guide/conditions/playground/numbers',
              labelText: 'Number Conditions',
            },
            next: {
              href: '/forms/form-engine-developer-guide/conditions/playground/combinators',
              labelText: 'Predicate Combinators',
            },
          }),
        ],
      },
    }),
  ],
})
