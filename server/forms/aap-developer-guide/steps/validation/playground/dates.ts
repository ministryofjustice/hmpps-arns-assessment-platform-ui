import { step, block, field, validation, Self, submitTransition } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { CodeBlock } from '@form-engine/registry/components/codeBlock'
import {
  GovUKDateInputFull,
  GovUKDetails,
  GovUKPagination,
  GovUKButton,
} from '@form-engine-govuk-components/components'

/**
 * Validation Playground - Dates
 *
 * Interactive examples of date validation conditions.
 */
export const datesStep = step({
  path: '/dates',
  title: 'Date Validation',
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
        <h1 class="govuk-heading-l">Date Validation Playground</h1>

        <p class="govuk-body-l">
          Try these date fields to see date validation in action. Submit the form to
          trigger validation and see error messages.
        </p>

        <div class="govuk-inset-text">
          <strong>Note:</strong> Date conditions work with ISO format strings (YYYY-MM-DD).
          The GovUKDateInputFull component automatically converts user input to this format.
        </div>
      `,
    }),

    // Valid Date
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Valid Date</h2>
        <p class="govuk-body">Try entering an invalid date like 31/2/2024 or 99/99/9999.</p>
      `,
    }),

    field<GovUKDateInputFull>({
      variant: 'govukDateInputFull',
      code: 'playground_valid_date',
      fieldset: {
        legend: { text: 'When did this happen?' },
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

    block<GovUKDetails>({
      variant: 'govukDetails',
      summaryText: 'View code',
      content: [
        block<CodeBlock>({
          variant: 'codeBlock',
          language: 'typescript',
          code: `field<GovUKDateInputFull>({
  variant: 'govukDateInputFull',
  code: 'playground_valid_date',
  fieldset: {
    legend: { text: 'When did this happen?' },
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
})`,
        }),
      ],
    }),

    // Date in Future
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Date in Future</h2>
        <p class="govuk-body">Appointment date must be in the future. Try entering yesterday's date or today.</p>
      `,
    }),

    field<GovUKDateInputFull>({
      variant: 'govukDateInputFull',
      code: 'playground_future_date',
      fieldset: {
        legend: { text: 'Appointment date' },
      },
      hint: 'The appointment must be scheduled for a future date',
      validate: [
        validation({
          when: Self().not.match(Condition.IsRequired()),
          message: 'Enter an appointment date',
        }),
        validation({
          when: Self().not.match(Condition.Date.IsValid()),
          message: 'Appointment date must be a real date',
        }),
        validation({
          when: Self().not.match(Condition.Date.IsFutureDate()),
          message: 'Appointment must be in the future',
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
          code: `field<GovUKDateInputFull>({
  variant: 'govukDateInputFull',
  code: 'playground_future_date',
  fieldset: {
    legend: { text: 'Appointment date' },
  },
  hint: 'The appointment must be scheduled for a future date',
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Enter an appointment date',
    }),
    validation({
      when: Self().not.match(Condition.Date.IsValid()),
      message: 'Appointment date must be a real date',
    }),
    validation({
      when: Self().not.match(Condition.Date.IsFutureDate()),
      message: 'Appointment must be in the future',
    }),
  ],
})`,
        }),
      ],
    }),

    // Date Before Specific Date
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Date Before Specific Date</h2>
        <p class="govuk-body">
          Registration closed on 31 December 2024. Try entering a date after that.
        </p>
      `,
    }),

    field<GovUKDateInputFull>({
      variant: 'govukDateInputFull',
      code: 'playground_before_date',
      fieldset: {
        legend: { text: 'Registration date' },
      },
      hint: 'Must be before 31 December 2024',
      validate: [
        validation({
          when: Self().not.match(Condition.IsRequired()),
          message: 'Enter a registration date',
        }),
        validation({
          when: Self().not.match(Condition.Date.IsValid()),
          message: 'Registration date must be a real date',
        }),
        validation({
          when: Self().not.match(Condition.Date.IsBefore('2025-01-01')),
          message: 'Registration date must be before 31 December 2024',
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
          code: `field<GovUKDateInputFull>({
  variant: 'govukDateInputFull',
  code: 'playground_before_date',
  fieldset: {
    legend: { text: 'Registration date' },
  },
  hint: 'Must be before 31 December 2024',
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Enter a registration date',
    }),
    validation({
      when: Self().not.match(Condition.Date.IsValid()),
      message: 'Registration date must be a real date',
    }),
    validation({
      when: Self().not.match(Condition.Date.IsBefore('2025-01-01')),
      message: 'Registration date must be before 31 December 2024',
    }),
  ],
})`,
        }),
      ],
    }),

    // Date After Specific Date
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Date After Specific Date</h2>
        <p class="govuk-body">
          Employment must have started after 1 January 2020. Try an earlier date.
        </p>
      `,
    }),

    field<GovUKDateInputFull>({
      variant: 'govukDateInputFull',
      code: 'playground_after_date',
      fieldset: {
        legend: { text: 'Employment start date' },
      },
      hint: 'Must be after 1 January 2020',
      validate: [
        validation({
          when: Self().not.match(Condition.IsRequired()),
          message: 'Enter an employment start date',
        }),
        validation({
          when: Self().not.match(Condition.Date.IsValid()),
          message: 'Employment start date must be a real date',
        }),
        validation({
          when: Self().not.match(Condition.Date.IsAfter('2019-12-31')),
          message: 'Employment must have started after 1 January 2020',
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
          code: `field<GovUKDateInputFull>({
  variant: 'govukDateInputFull',
  code: 'playground_after_date',
  fieldset: {
    legend: { text: 'Employment start date' },
  },
  hint: 'Must be after 1 January 2020',
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Enter an employment start date',
    }),
    validation({
      when: Self().not.match(Condition.Date.IsValid()),
      message: 'Employment start date must be a real date',
    }),
    validation({
      when: Self().not.match(Condition.Date.IsAfter('2019-12-31')),
      message: 'Employment must have started after 1 January 2020',
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
              href: '/forms/form-engine-developer-guide/validation/playground/numbers',
              labelText: 'Number Validation',
            },
            next: {
              href: '/forms/form-engine-developer-guide/validation/playground/arrays',
              labelText: 'Array Validation',
            },
          }),
        ],
      },
    }),
  ],
})
