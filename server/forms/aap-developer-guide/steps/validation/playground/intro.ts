import { step, block } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { GovUKPagination } from '@form-engine-govuk-components/components'

/**
 * Validation Playground - Hub
 *
 * Entry point to the interactive validation examples.
 */
export const introStep = step({
  path: '/intro',
  title: 'Validation Playground',
  isEntryPoint: true,
  blocks: [
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <h1 class="govuk-heading-l">Validation Playground</h1>

        <p class="govuk-body-l">
          Try out validation conditions in real time. Each page below has live fields
          where you can test different validation rules and see the error messages.
        </p>

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <h2 class="govuk-heading-m">Choose a validation type</h2>

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
      `,
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
    }),
  ],
})
