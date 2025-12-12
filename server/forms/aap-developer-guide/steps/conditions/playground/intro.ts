import { step, block } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { GovUKPagination } from '@form-engine-govuk-components/components'

/**
 * Conditions Playground - Hub
 *
 * Entry point to the interactive conditions examples.
 * Unlike the validation playground, these examples show dynamic content
 * that appears/hides based on conditions - no form submission required.
 */
export const introStep = step({
  path: '/intro',
  title: 'Conditions Playground',
  isEntryPoint: true,
  blocks: [
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <h1 class="govuk-heading-l">Conditions Playground</h1>

        <p class="govuk-body-l">
          Try out conditions in real time. Each page below has live fields
          where you can test different conditions and see the validation error messages.
        </p>

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <h2 class="govuk-heading-m">Choose a condition type</h2>

        <ul class="govuk-list">
          <li>
            <a href="/forms/form-engine-developer-guide/conditions/playground/strings" class="govuk-link govuk-link--no-visited-state">
              <strong>String Conditions</strong>
            </a>
            <p class="govuk-body govuk-!-margin-top-1">
              Test equality, length, patterns, and character validation.
            </p>
          </li>
          <li class="govuk-!-margin-top-4">
            <a href="/forms/form-engine-developer-guide/conditions/playground/numbers" class="govuk-link govuk-link--no-visited-state">
              <strong>Number Conditions</strong>
            </a>
            <p class="govuk-body govuk-!-margin-top-1">
              Test numeric comparisons, ranges, and type checks.
            </p>
          </li>
          <li class="govuk-!-margin-top-4">
            <a href="/forms/form-engine-developer-guide/conditions/playground/dates" class="govuk-link govuk-link--no-visited-state">
              <strong>Date Conditions</strong>
            </a>
            <p class="govuk-body govuk-!-margin-top-1">
              Test date validity, comparisons, and relative checks.
            </p>
          </li>
          <li class="govuk-!-margin-top-4">
            <a href="/forms/form-engine-developer-guide/conditions/playground/combinators" class="govuk-link govuk-link--no-visited-state">
              <strong>Predicate Combinators</strong>
            </a>
            <p class="govuk-body govuk-!-margin-top-1">
              Combine conditions with and(), or(), xor(), and not().
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
              href: '/forms/form-engine-developer-guide/conditions/custom',
              labelText: 'Custom Conditions',
            },
            next: {
              href: '/forms/form-engine-developer-guide/conditions/playground/strings',
              labelText: 'String Conditions',
            },
          }),
        ],
      },
    }),
  ],
})
