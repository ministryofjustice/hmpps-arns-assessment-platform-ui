import { block } from '@form-engine/form/builders'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { GovUKPagination } from '@form-engine-govuk-components/components'
import { parseGovUKMarkdown } from '../../../../../helpers/markdown'

/**
 * Validation Playground - Hub
 *
 * Entry point to the interactive validation examples.
 */
export const pageContent = block<TemplateWrapper>({
  variant: 'templateWrapper',
  template: parseGovUKMarkdown(`
  # Validation Playground

  Try out validation conditions in real time. Each page below has live fields
  where you can test different validation rules and see the error messages. {.lead}

  ---

  ## Choose a validation type

  <ul class="govuk-list">
    <li>
      <a href="/forms/form-engine-developer-guide/validation/playground/strings" class="govuk-link govuk-link--no-visited-state">
        <strong>String Validation</strong>
      </a>
      <p class="govuk-body govuk-!-margin-top-1">
        Test emptiness, length, patterns, and format conditions.
      </p>
    </li>
    <li class="govuk-!-margin-top-4">
      <a href="/forms/form-engine-developer-guide/validation/playground/numbers" class="govuk-link govuk-link--no-visited-state">
        <strong>Number Validation</strong>
      </a>
      <p class="govuk-body govuk-!-margin-top-1">
        Test numeric comparisons, ranges, and type checks.
      </p>
    </li>
    <li class="govuk-!-margin-top-4">
      <a href="/forms/form-engine-developer-guide/validation/playground/dates" class="govuk-link govuk-link--no-visited-state">
        <strong>Date Validation</strong>
      </a>
      <p class="govuk-body govuk-!-margin-top-1">
        Test date validity, comparisons, and relative checks.
      </p>
    </li>
    <li class="govuk-!-margin-top-4">
      <a href="/forms/form-engine-developer-guide/validation/playground/arrays" class="govuk-link govuk-link--no-visited-state">
        <strong>Array Validation</strong>
      </a>
      <p class="govuk-body govuk-!-margin-top-1">
        Test multi-select fields with length and content conditions.
      </p>
    </li>
  </ul>

  ---

  {{slot:pagination}}
`),
  slots: {
    pagination: [
      block<GovUKPagination>({
        variant: 'govukPagination',
        classes: 'govuk-pagination--inline',
        previous: {
          href: '/forms/form-engine-developer-guide/validation/patterns',
          labelText: 'Common Patterns',
        },
        next: {
          href: '/forms/form-engine-developer-guide/validation/playground/strings',
          labelText: 'String Validation',
        },
      }),
    ],
  },
})
