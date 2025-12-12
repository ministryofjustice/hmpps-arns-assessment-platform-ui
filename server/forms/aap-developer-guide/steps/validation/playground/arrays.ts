import { step, block, field, validation, Self, submitTransition } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { CodeBlock } from '@form-engine/registry/components/codeBlock'
import {
  GovUKCheckboxInput,
  GovUKDetails,
  GovUKPagination,
  GovUKButton,
} from '@form-engine-govuk-components/components'

/**
 * Validation Playground - Arrays
 *
 * Interactive examples of array validation conditions (for multi-select fields).
 */
export const arraysStep = step({
  path: '/arrays',
  title: 'Array Validation',
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
        <h1 class="govuk-heading-l">Array Validation Playground</h1>

        <p class="govuk-body-l">
          Try these multi-select fields to see array validation in action. Submit the form to
          trigger validation and see error messages.
        </p>

        <p class="govuk-body">
          Array validation applies to fields with <code>multiple: true</code>, like checkboxes
          where users can select more than one option.
        </p>
      `,
    }),

    // At Least One Required
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">At Least One Required</h2>
        <p class="govuk-body">You must select at least one option. Try submitting without selecting anything.</p>
      `,
    }),

    field<GovUKCheckboxInput>({
      variant: 'govukCheckboxInput',
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
    }),

    block<GovUKDetails>({
      variant: 'govukDetails',
      summaryText: 'View code',
      content: [
        block<CodeBlock>({
          variant: 'codeBlock',
          language: 'typescript',
          code: `field<GovUKCheckboxInput>({
  variant: 'govukCheckboxInput',
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

    // Must Contain Specific Value
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Must Contain Specific Value</h2>
        <p class="govuk-body">
          You must accept the terms and conditions. Try submitting without selecting "Terms and conditions".
        </p>
      `,
    }),

    field<GovUKCheckboxInput>({
      variant: 'govukCheckboxInput',
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

    block<GovUKDetails>({
      variant: 'govukDetails',
      summaryText: 'View code',
      content: [
        block<CodeBlock>({
          variant: 'codeBlock',
          language: 'typescript',
          code: `field<GovUKCheckboxInput>({
  variant: 'govukCheckboxInput',
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

    // Contains Any
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Contains Any (At Least One From Set)</h2>
        <p class="govuk-body">
          You must select at least one weekday (Monday-Friday). Try selecting only Saturday or Sunday.
        </p>
      `,
    }),

    field<GovUKCheckboxInput>({
      variant: 'govukCheckboxInput',
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
    }),

    block<GovUKDetails>({
      variant: 'govukDetails',
      summaryText: 'View code',
      content: [
        block<CodeBlock>({
          variant: 'codeBlock',
          language: 'typescript',
          code: `field<GovUKCheckboxInput>({
  variant: 'govukCheckboxInput',
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

    // Contains All (Value exists in expected)
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Selection Must Be From Allowed Options</h2>
        <p class="govuk-body">
          This validates that all selected items are from the expected set.
          In this example, only vegetarian options are allowed.
        </p>
      `,
    }),

    field<GovUKCheckboxInput>({
      variant: 'govukCheckboxInput',
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

    block<GovUKDetails>({
      variant: 'govukDetails',
      summaryText: 'View code',
      content: [
        block<CodeBlock>({
          variant: 'codeBlock',
          language: 'typescript',
          code: `field<GovUKCheckboxInput>({
  variant: 'govukCheckboxInput',
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
    }),
  ],
})
