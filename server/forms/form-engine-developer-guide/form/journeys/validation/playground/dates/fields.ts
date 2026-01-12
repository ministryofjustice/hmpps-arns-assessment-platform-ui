import { validation, Self, and } from '@form-engine/form/builders'
import { TemplateWrapper } from '@form-engine/registry/components'
import { Condition } from '@form-engine/registry/conditions'
import { Transformer } from '@form-engine/registry/transformers'
import { GovUKDateInputFull, GovUKDetails, GovUKPagination } from '@form-engine-govuk-components/components'
import { MOJDatePicker } from '@form-engine-moj-components/components'
import { CodeBlock } from '../../../../../components'
import { exampleBox } from '../../../../../helpers/exampleBox'
import { parseGovUKMarkdown } from '../../../../../helpers/markdown'

/**
 * Date Validation Playground
 *
 * Interactive examples of date validation conditions.
 */
export const pageContent = TemplateWrapper({
  template: parseGovUKMarkdown(`
  # Date Validation Playground

  Try these date fields to see date validation in action. Submit the form to
  trigger validation and see error messages. {.lead}

  <div class="govuk-inset-text">
    <strong>Note:</strong> Date conditions work with ISO format strings (YYYY-MM-DD).
    <ul class="govuk-list govuk-list--bullet">
      <li><strong>GOV.UK Date Input</strong>: Use <code>formatters: [Transformer.Object.ToISO()]</code></li>
      <li><strong>MOJ Date Picker</strong>: Use <code>formatters: [Transformer.String.ToISODate()]</code></li>
    </ul>
    Both components handle ISO format on re-display automatically.
  </div>

  ## GOV.UK Date Input Examples

  The GOV.UK date input provides separate day, month, and year fields.

  ---

  ## Valid Date

  Try entering an invalid date like 31/2/2024 or 99/99/9999.

  {{slot:validDateExample}}

  {{slot:validDateCode}}

  ---

  ## Date in Future

  Appointment date must be in the future. Try entering yesterday's date or today.

  {{slot:futureDateExample}}

  {{slot:futureDateCode}}

  ---

  ## Date Before Specific Date

  Registration closed on 31 December 2024. Try entering a date after that.

  {{slot:beforeDateExample}}

  {{slot:beforeDateCode}}

  ---

  ## Date After Specific Date

  Employment must have started after 1 January 2020. Try an earlier date.

  {{slot:afterDateExample}}

  {{slot:afterDateCode}}

  ---

  ## MOJ Date Picker Examples

  The MOJ Date Picker provides a calendar widget for date selection.
  It outputs dates in UK format (DD/MM/YYYY), but the component automatically handles
  ISO format (YYYY-MM-DD) on re-display, so you can use \`formatters\` to store dates
  in ISO format.

  ---

  ### Valid Date (Date Picker)

  Try entering an invalid date manually, or use the calendar to select.

  {{slot:mojValidDateExample}}

  {{slot:mojValidDateCode}}

  ---

  ### Future Date (Date Picker)

  The booking must be for a future date.

  {{slot:mojFutureDateExample}}

  {{slot:mojFutureDateCode}}

  ---

  ### Date Range with Calendar Restrictions

  The MOJ Date Picker supports \`minDate\` and \`maxDate\` to restrict
  selectable dates in the calendar. Note: users can still type dates outside the range,
  so server-side validation is still required.

  {{slot:mojRangeDateExample}}

  {{slot:mojRangeDateCode}}

  ---

  ### Excluding Weekends

  Use \`excludedDays\` to disable specific days of the week in the calendar.
  Weekends are disabled in this example.

  {{slot:mojWeekdayDateExample}}

  {{slot:mojWeekdayDateCode}}

  ---

  {{slot:pagination}}
`),
  slots: {
    validDateExample: [
      exampleBox([
        GovUKDateInputFull({
          code: 'playground_valid_date',
          fieldset: {
            legend: { text: 'When did this happen?' },
          },
          hint: 'For example, 27 3 2024',
          formatters: [Transformer.Object.ToISO({ year: 'year', month: 'month', day: 'day' })],
          validate: [
            validation({
              when: and(
                Self().match(Condition.Object.IsObject()),
                Self().not.match(Condition.Object.PropertyHasValue('day')),
              ),
              message: 'Date must include a day',
              details: { field: 'day' },
            }),
            validation({
              when: and(
                Self().match(Condition.Object.IsObject()),
                Self().not.match(Condition.Object.PropertyHasValue('month')),
              ),
              message: 'Date must include a month',
              details: { field: 'month' },
            }),
            validation({
              when: and(
                Self().match(Condition.Object.IsObject()),
                Self().not.match(Condition.Object.PropertyHasValue('year')),
              ),
              message: 'Date must include a year',
              details: { field: 'year' },
            }),
            validation({
              when: Self().not.match(Condition.Date.IsValid()),
              message: 'Enter a real date',
            }),
          ],
        }),
      ]),
    ],
    validDateCode: [
      GovUKDetails({
        summaryText: 'View code',
        content: [
          CodeBlock({
            language: 'typescript',
            code: `GovUKDateInputFull({
              code: 'playground_valid_date',
              fieldset: {
                legend: { text: 'When did this happen?' },
              },
              hint: 'For example, 27 3 2024',
              formatters: [Transformer.Object.ToISO({ year: 'year', month: 'month', day: 'day' })],
              validate: [
                // Field-specific validations - guarded with IsObject() since PropertyHasValue throws on non-objects
                validation({
                  when: and(
                    Self().match(Condition.Object.IsObject()),
                    Self().not.match(Condition.Object.PropertyHasValue('day'))
                  ),
                  message: 'Date must include a day',
                  details: { field: 'day' },
                }),
                validation({
                  when: and(
                    Self().match(Condition.Object.IsObject()),
                    Self().not.match(Condition.Object.PropertyHasValue('month'))
                  ),
                  message: 'Date must include a month',
                  details: { field: 'month' },
                }),
                validation({
                  when: and(
                    Self().match(Condition.Object.IsObject()),
                    Self().not.match(Condition.Object.PropertyHasValue('year'))
                  ),
                  message: 'Date must include a year',
                  details: { field: 'year' },
                }),
                // Overall date validation - runs when ToISO succeeded (string)
                validation({
                  when: Self().not.match(Condition.Date.IsValid()),
                  message: 'Enter a real date',
                }),
              ],
            })`,
          }),
        ],
      }),
    ],
    futureDateExample: [
      exampleBox([
        GovUKDateInputFull({
          code: 'playground_future_date',
          fieldset: {
            legend: { text: 'Appointment date' },
          },
          hint: 'The appointment must be scheduled for a future date',
          formatters: [Transformer.Object.ToISO({ year: 'year', month: 'month', day: 'day' })],
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
      ]),
    ],
    futureDateCode: [
      GovUKDetails({
        summaryText: 'View code',
        content: [
          CodeBlock({
            language: 'typescript',
            code: `GovUKDateInputFull({
              code: 'playground_future_date',
              fieldset: {
                legend: { text: 'Appointment date' },
              },
              hint: 'The appointment must be scheduled for a future date',
              formatters: [Transformer.Object.ToISO({ year: 'year', month: 'month', day: 'day' })],
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
    ],
    beforeDateExample: [
      exampleBox([
        GovUKDateInputFull({
          code: 'playground_before_date',
          fieldset: {
            legend: { text: 'Registration date' },
          },
          hint: 'Must be before 31 December 2024',
          formatters: [Transformer.Object.ToISO({ year: 'year', month: 'month', day: 'day' })],
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
      ]),
    ],
    beforeDateCode: [
      GovUKDetails({
        summaryText: 'View code',
        content: [
          CodeBlock({
            language: 'typescript',
            code: `GovUKDateInputFull({
              code: 'playground_before_date',
              fieldset: {
                legend: { text: 'Registration date' },
              },
              hint: 'Must be before 31 December 2024',
              formatters: [Transformer.Object.ToISO({ year: 'year', month: 'month', day: 'day' })],
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
    ],
    afterDateExample: [
      exampleBox([
        GovUKDateInputFull({
          code: 'playground_after_date',
          fieldset: {
            legend: { text: 'Employment start date' },
          },
          hint: 'Must be after 1 January 2020',
          formatters: [Transformer.Object.ToISO({ year: 'year', month: 'month', day: 'day' })],
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
      ]),
    ],
    afterDateCode: [
      GovUKDetails({
        summaryText: 'View code',
        content: [
          CodeBlock({
            language: 'typescript',
            code: `GovUKDateInputFull({
              code: 'playground_after_date',
              fieldset: {
                legend: { text: 'Employment start date' },
              },
              hint: 'Must be after 1 January 2020',
              formatters: [Transformer.Object.ToISO({ year: 'year', month: 'month', day: 'day' })],
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
    ],
    mojValidDateExample: [
      exampleBox([
        MOJDatePicker({
          code: 'playground_moj_valid_date',
          label: { text: 'Event date' },
          hint: 'For example, 17/5/2024',
          formatters: [Transformer.String.ToISODate()],
          validate: [
            validation({
              when: Self().not.match(Condition.IsRequired()),
              message: 'Enter an event date',
            }),
            validation({
              when: Self().not.match(Condition.Date.IsValid()),
              message: 'Event date must be a real date',
            }),
          ],
        }),
      ]),
    ],
    mojValidDateCode: [
      GovUKDetails({
        summaryText: 'View code',
        content: [
          CodeBlock({
            language: 'typescript',
            code: `MOJDatePicker({
              code: 'playground_moj_valid_date',
              label: { text: 'Event date' },
              hint: 'For example, 17/5/2024',
              formatters: [Transformer.String.ToISODate()],
              validate: [
                validation({
                  when: Self().not.match(Condition.IsRequired()),
                  message: 'Enter an event date',
                }),
                validation({
                  when: Self().not.match(Condition.Date.IsValid()),
                  message: 'Event date must be a real date',
                }),
              ],
            })`,
          }),
        ],
      }),
    ],
    mojFutureDateExample: [
      exampleBox([
        MOJDatePicker({
          code: 'playground_moj_future_date',
          label: { text: 'Booking date' },
          hint: 'Select a date for your appointment',
          formatters: [Transformer.String.ToISODate()],
          validate: [
            validation({
              when: Self().not.match(Condition.IsRequired()),
              message: 'Enter a booking date',
            }),
            validation({
              when: Self().not.match(Condition.Date.IsValid()),
              message: 'Booking date must be a real date',
            }),
            validation({
              when: Self().not.match(Condition.Date.IsFutureDate()),
              message: 'Booking date must be in the future',
            }),
          ],
        }),
      ]),
    ],
    mojFutureDateCode: [
      GovUKDetails({
        summaryText: 'View code',
        content: [
          CodeBlock({
            language: 'typescript',
            code: `MOJDatePicker({
              code: 'playground_moj_future_date',
              label: { text: 'Booking date' },
              hint: 'Select a date for your appointment',
              formatters: [Transformer.String.ToISODate()],
              validate: [
                validation({
                  when: Self().not.match(Condition.IsRequired()),
                  message: 'Enter a booking date',
                }),
                validation({
                  when: Self().not.match(Condition.Date.IsValid()),
                  message: 'Booking date must be a real date',
                }),
                validation({
                  when: Self().not.match(Condition.Date.IsFutureDate()),
                  message: 'Booking date must be in the future',
                }),
              ],
            })`,
          }),
        ],
      }),
    ],
    mojRangeDateExample: [
      exampleBox([
        MOJDatePicker({
          code: 'playground_moj_range_date',
          label: { text: 'Conference date' },
          hint: 'Select a date in January 2025',
          minDate: '01/01/2025',
          maxDate: '31/01/2025',
          formatters: [Transformer.String.ToISODate()],
          validate: [
            validation({
              when: Self().not.match(Condition.IsRequired()),
              message: 'Enter a conference date',
            }),
            validation({
              when: Self().not.match(Condition.Date.IsValid()),
              message: 'Conference date must be a real date',
            }),
            validation({
              when: Self().not.match(Condition.Date.IsAfter('2024-12-31')),
              message: 'Conference date must be in January 2025 or later',
            }),
            validation({
              when: Self().not.match(Condition.Date.IsBefore('2025-02-01')),
              message: 'Conference date must be before February 2025',
            }),
          ],
        }),
      ]),
    ],
    mojRangeDateCode: [
      GovUKDetails({
        summaryText: 'View code',
        content: [
          CodeBlock({
            language: 'typescript',
            code: `MOJDatePicker({
              code: 'playground_moj_range_date',
              label: { text: 'Conference date' },
              hint: 'Select a date in January 2025',
              minDate: '01/01/2025',
              maxDate: '31/01/2025',
              formatters: [Transformer.String.ToISODate()],
              validate: [
                validation({
                  when: Self().not.match(Condition.IsRequired()),
                  message: 'Enter a conference date',
                }),
                validation({
                  when: Self().not.match(Condition.Date.IsValid()),
                  message: 'Conference date must be a real date',
                }),
                validation({
                  when: Self().not.match(Condition.Date.IsAfter('2024-12-31')),
                  message: 'Conference date must be in January 2025 or later',
                }),
                validation({
                  when: Self().not.match(Condition.Date.IsBefore('2025-02-01')),
                  message: 'Conference date must be before February 2025',
                }),
              ],
            })`,
          }),
        ],
      }),
    ],
    mojWeekdayDateExample: [
      exampleBox([
        MOJDatePicker({
          code: 'playground_moj_weekday_date',
          label: { text: 'Office appointment date' },
          hint: 'Appointments are only available on weekdays',
          excludedDays: ['saturday', 'sunday'],
          formatters: [Transformer.String.ToISODate()],
          validate: [
            validation({
              when: Self().not.match(Condition.IsRequired()),
              message: 'Enter an appointment date',
            }),
            validation({
              when: Self().not.match(Condition.Date.IsValid()),
              message: 'Appointment date must be a real date',
            }),
          ],
        }),
      ]),
    ],
    mojWeekdayDateCode: [
      GovUKDetails({
        summaryText: 'View code',
        content: [
          CodeBlock({
            language: 'typescript',
            code: `MOJDatePicker({
              code: 'playground_moj_weekday_date',
              label: { text: 'Office appointment date' },
              hint: 'Appointments are only available on weekdays',
              excludedDays: ['saturday', 'sunday'],
              formatters: [Transformer.String.ToISODate()],
              validate: [
                validation({
                  when: Self().not.match(Condition.IsRequired()),
                  message: 'Enter an appointment date',
                }),
                validation({
                  when: Self().not.match(Condition.Date.IsValid()),
                  message: 'Appointment date must be a real date',
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
})
