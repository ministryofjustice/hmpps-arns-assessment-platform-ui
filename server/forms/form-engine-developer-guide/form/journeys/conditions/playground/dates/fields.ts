import { validation, Self, Answer, and } from '@form-engine/form/builders'
import { TemplateWrapper } from '@form-engine/registry/components'
import { Condition } from '@form-engine/registry/conditions'
import { GovUKDateInputFull, GovUKDetails, GovUKPagination } from '@form-engine-govuk-components/components'
import { CodeBlock } from '../../../../../components'
import { exampleBox } from '../../../../../helpers/exampleBox'
import { parseGovUKMarkdown } from '../../../../../helpers/markdown'

/**
 * Conditions Playground - Dates
 *
 * Interactive examples of date conditions with validation.
 */
export const pageContent = TemplateWrapper({
  template: parseGovUKMarkdown(`
  # Date Conditions Playground

  Try these fields to see date conditions in action. Submit the form to
  trigger validation and see error messages. {.lead}

  <div class="govuk-inset-text">
    <strong>Note:</strong> Date conditions expect ISO-8601 format (YYYY-MM-DD).
    The GOV.UK date input automatically converts to this format.
  </div>

  ---

  ## Condition.Date.IsValid()

  Enter an invalid date like 31 February to see the validation error.

  {{slot:isValidExample}}

  {{slot:isValidCode}}

  ---

  ## Condition.Date.IsFutureDate()

  Enter today's date or earlier to see the validation error.

  {{slot:futureExample}}

  {{slot:futureCode}}

  ---

  ## Condition.Date.IsAfter()

  Enter a date on or before 1st January 2020 to see the validation error.

  {{slot:afterExample}}

  {{slot:afterCode}}

  ---

  ## Condition.Date.IsBefore()

  Enter a date on or after 1st January 2000 to see the validation error.

  {{slot:beforeExample}}

  {{slot:beforeCode}}

  ---

  ## Dynamic Date Comparison (Cross-Field)

  Date condition arguments can be **expressions**. This example validates
  that the end date is after the start date using
  \`Condition.Date.IsAfter(Answer('startDate'))\`.

  {{slot:dynamicExample}}

  {{slot:dynamicCode}}

  ---

  {{slot:pagination}}
`),
  slots: {
    isValidExample: [
      exampleBox([
        GovUKDateInputFull({
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
    ],
    isValidCode: [
      GovUKDetails({
        summaryText: 'View code',
        content: [
          CodeBlock({
            language: 'typescript',
            code: `
              GovUKDateInputFull({
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
              })
            `,
          }),
        ],
      }),
    ],
    futureExample: [
      exampleBox([
        GovUKDateInputFull({
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
    ],
    futureCode: [
      GovUKDetails({
        summaryText: 'View code',
        content: [
          CodeBlock({
            language: 'typescript',
            code: `
              GovUKDateInputFull({
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
              })
            `,
          }),
        ],
      }),
    ],
    afterExample: [
      exampleBox([
        GovUKDateInputFull({
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
    ],
    afterCode: [
      GovUKDetails({
        summaryText: 'View code',
        content: [
          CodeBlock({
            language: 'typescript',
            code: `
              GovUKDateInputFull({
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
              })
            `,
          }),
        ],
      }),
    ],
    beforeExample: [
      exampleBox([
        GovUKDateInputFull({
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
    ],
    beforeCode: [
      GovUKDetails({
        summaryText: 'View code',
        content: [
          CodeBlock({
            language: 'typescript',
            code: `
              GovUKDateInputFull({
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
              })
            `,
          }),
        ],
      }),
    ],
    dynamicExample: [
      exampleBox([
        GovUKDateInputFull({
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
        GovUKDateInputFull({
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
    ],
    dynamicCode: [
      GovUKDetails({
        summaryText: 'View code',
        content: [
          CodeBlock({
            language: 'typescript',
            code: `
              // End date validates against start date's value
              GovUKDateInputFull({
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
})
