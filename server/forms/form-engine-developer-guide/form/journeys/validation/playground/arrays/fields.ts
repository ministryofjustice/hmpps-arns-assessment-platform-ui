import { validation, Self } from '@form-engine/form/builders'
import { TemplateWrapper } from '@form-engine/registry/components'
import { Condition } from '@form-engine/registry/conditions'
import { GovUKCheckboxInput, GovUKDetails, GovUKPagination } from '@form-engine-govuk-components/components'
import { CodeBlock } from '../../../../../components'
import { exampleBox } from '../../../../../helpers/exampleBox'
import { parseGovUKMarkdown } from '../../../../../helpers/markdown'

/**
 * Array Validation Playground
 *
 * Interactive examples of array validation conditions (for multi-select fields).
 */
export const pageContent = TemplateWrapper({
  template: parseGovUKMarkdown(`
  # Array Validation Playground

  Try these multi-select fields to see array validation in action. Submit the form to
  trigger validation and see error messages. {.lead}

  Array validation applies to fields with \`multiple: true\`, like checkboxes
  where users can select more than one option.

  ---

  ## At Least One Required

  You must select at least one option. Try submitting without selecting anything.

  {{slot:atLeastOneRequiredExample}}

  {{slot:atLeastOneRequiredCode}}

  ---

  ## Must Contain Specific Value

  You must accept the terms and conditions. Try submitting without selecting "Terms and conditions".

  {{slot:mustContainValueExample}}

  {{slot:mustContainValueCode}}

  ---

  ## Contains Any (At Least One From Set)

  You must select at least one weekday (Monday-Friday). Try selecting only Saturday or Sunday.

  {{slot:containsAnyExample}}

  {{slot:containsAnyCode}}

  ---

  ## Selection Must Be From Allowed Options

  This validates that all selected items are from the expected set.
  In this example, only vegetarian options are allowed.

  {{slot:containsAllExample}}

  {{slot:containsAllCode}}

  ---

  {{slot:pagination}}
`),
  slots: {
    atLeastOneRequiredExample: [
      exampleBox([
        GovUKCheckboxInput({
          code: 'playground_required_array',
          multiple: true,
          fieldset: {
            legend: { text: 'Select your interests' },
          },
          items: [
            { value: 'sports', text: 'Sports' },
            { value: 'music', text: 'Music' },
            { value: 'art', text: 'Art' },
            { value: 'technology', text: 'Technology' },
            { value: 'travel', text: 'Travel' },
          ],
          validate: [
            validation({
              when: Self().not.match(Condition.IsRequired()),
              message: 'Select at least one interest',
            }),
          ],
        }),
      ]),
    ],
    atLeastOneRequiredCode: [
      GovUKDetails({
        summaryText: 'View code',
        content: [
          CodeBlock({
            language: 'typescript',
            code: `
              GovUKCheckboxInput({
              code: 'playground_required_array',
              multiple: true,
              fieldset: {
                legend: { text: 'What are you interested in?' },
              },
              items: [
                { value: 'sports', text: 'Sports' },
                { value: 'music', text: 'Music' },
                { value: 'art', text: 'Art' },
                { value: 'technology', text: 'Technology' },
                { value: 'travel', text: 'Travel' },
              ],
              validate: [
                validation({
                  when: Self().not.match(Condition.IsRequired()),
                  message: 'Select at least one interest',
                }),
              ],
            })`,
          }),
        ],
      }),
    ],
    mustContainValueExample: [
      exampleBox([
        GovUKCheckboxInput({
          code: 'playground_contains_array',
          multiple: true,
          fieldset: {
            legend: { text: 'Please confirm you have read the following:' },
          },
          items: [
            { value: 'privacy', text: 'Privacy policy' },
            { value: 'terms', text: 'Terms and conditions' },
            { value: 'newsletter', text: 'Subscribe to newsletter (optional)' },
          ],
          validate: [
            validation({
              when: Self().not.match(Condition.Array.Contains('terms')),
              message: 'You must accept the terms and conditions',
            }),
          ],
        }),
      ]),
    ],
    mustContainValueCode: [
      GovUKDetails({
        summaryText: 'View code',
        content: [
          CodeBlock({
            language: 'typescript',
            code: `GovUKCheckboxInput({
              code: 'playground_contains_array',
              multiple: true,
              fieldset: {
                legend: { text: 'Please confirm you have read the following:' },
              },
              items: [
                { value: 'privacy', text: 'Privacy policy' },
                { value: 'terms', text: 'Terms and conditions' },
                { value: 'newsletter', text: 'Subscribe to newsletter (optional)' },
              ],
              validate: [
                validation({
                  when: Self().not.match(Condition.Array.Contains('terms')),
                  message: 'You must accept the terms and conditions',
                }),
              ],
            })`,
          }),
        ],
      }),
    ],
    containsAnyExample: [
      exampleBox([
        GovUKCheckboxInput({
          code: 'playground_contains_any_array',
          multiple: true,
          fieldset: {
            legend: { text: 'Which days are you available?' },
          },
          hint: 'Select at least one weekday',
          items: [
            { value: 'monday', text: 'Monday' },
            { value: 'tuesday', text: 'Tuesday' },
            { value: 'wednesday', text: 'Wednesday' },
            { value: 'thursday', text: 'Thursday' },
            { value: 'friday', text: 'Friday' },
            { value: 'saturday', text: 'Saturday' },
            { value: 'sunday', text: 'Sunday' },
          ],
          validate: [
            validation({
              when: Self().not.match(Condition.IsRequired()),
              message: 'Select at least one day',
            }),
            validation({
              when: Self().not.match(
                Condition.Array.ContainsAny(['monday', 'tuesday', 'wednesday', 'thursday', 'friday']),
              ),
              message: 'Select at least one weekday (Monday to Friday)',
            }),
          ],
        }),
      ]),
    ],
    containsAnyCode: [
      GovUKDetails({
        summaryText: 'View code',
        content: [
          CodeBlock({
            language: 'typescript',
            code: `GovUKCheckboxInput({
              code: 'playground_contains_any_array',
              multiple: true,
              fieldset: {
                legend: { text: 'Which days are you available?' },
              },
              hint: 'Select at least one weekday',
              items: [
                { value: 'monday', text: 'Monday' },
                { value: 'tuesday', text: 'Tuesday' },
                { value: 'wednesday', text: 'Wednesday' },
                { value: 'thursday', text: 'Thursday' },
                { value: 'friday', text: 'Friday' },
                { value: 'saturday', text: 'Saturday' },
                { value: 'sunday', text: 'Sunday' },
              ],
              validate: [
                validation({
                  when: Self().not.match(Condition.IsRequired()),
                  message: 'Select at least one day',
                }),
                validation({
                  when: Self().not.match(Condition.Array.ContainsAny(['monday', 'tuesday', 'wednesday', 'thursday', 'friday'])),
                  message: 'Select at least one weekday (Monday to Friday)',
                }),
              ],
            })`,
          }),
        ],
      }),
    ],
    containsAllExample: [
      exampleBox([
        GovUKCheckboxInput({
          code: 'playground_contains_all_array',
          multiple: true,
          fieldset: {
            legend: { text: 'Select your meals (vegetarian menu only)' },
          },
          hint: 'Only vegetarian options are available',
          items: [
            { value: 'salad', text: 'Garden Salad' },
            { value: 'soup', text: 'Vegetable Soup' },
            { value: 'pasta', text: 'Pasta Primavera' },
            { value: 'steak', text: 'Beef Steak (not available)' },
            { value: 'chicken', text: 'Grilled Chicken (not available)' },
          ],
          validate: [
            validation({
              when: Self().not.match(Condition.IsRequired()),
              message: 'Select at least one meal',
            }),
            validation({
              when: Self().not.match(Condition.Array.ContainsAll(['salad', 'soup', 'pasta'])),
              message: 'Only vegetarian options (salad, soup, pasta) are available',
            }),
          ],
        }),
      ]),
    ],
    containsAllCode: [
      GovUKDetails({
        summaryText: 'View code',
        content: [
          CodeBlock({
            language: 'typescript',
            code: `GovUKCheckboxInput({
              code: 'playground_contains_all_array',
              multiple: true,
              fieldset: {
                legend: { text: 'Select your meals (vegetarian menu only)' },
              },
              hint: 'Only vegetarian options are available',
              items: [
                { value: 'salad', text: 'Garden Salad' },
                { value: 'soup', text: 'Vegetable Soup' },
                { value: 'pasta', text: 'Pasta Primavera' },
                { value: 'steak', text: 'Beef Steak (not available)' },
                { value: 'chicken', text: 'Grilled Chicken (not available)' },
              ],
              validate: [
                validation({
                  when: Self().not.match(Condition.IsRequired()),
                  message: 'Select at least one meal',
                }),
                validation({
                  when: Self().not.match(Condition.Array.ContainsAll(['salad', 'soup', 'pasta'])),
                  message: 'Only vegetarian options (salad, soup, pasta) are available',
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
          href: '/forms/form-engine-developer-guide/validation/playground/dates',
          labelText: 'Date Validation',
        },
        next: {
          href: '/forms/form-engine-developer-guide/transformers/intro',
          labelText: 'Transformers',
        },
      }),
    ],
  },
})
