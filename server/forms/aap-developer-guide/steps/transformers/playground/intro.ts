import { step, block } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { GovUKPagination } from '@form-engine-govuk-components/components'

/**
 * Transformers Playground - Hub
 *
 * Entry point to the interactive transformer examples.
 * These examples show live transformations as users type or submit forms.
 */
export const introStep = step({
  path: '/intro',
  title: 'Transformers Playground',
  isEntryPoint: true,
  blocks: [
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <h1 class="govuk-heading-l">Transformers Playground</h1>

        <p class="govuk-body-l">
          Try out transformers in real time. Each page below has live fields
          where you can see how transformers clean, format, and convert values.
        </p>

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <h2 class="govuk-heading-m">Choose a transformer type</h2>

        <ul class="govuk-list">
          <li>
            <a href="/forms/form-engine-developer-guide/transformers/playground/strings" class="govuk-link govuk-link--no-visited-state">
              <strong>String Transformers</strong>
            </a>
            <p class="govuk-body govuk-!-margin-top-1">
              Trim whitespace, change case, replace text, and convert types.
            </p>
          </li>
          <li class="govuk-!-margin-top-4">
            <a href="/forms/form-engine-developer-guide/transformers/playground/numbers" class="govuk-link govuk-link--no-visited-state">
              <strong>Number Transformers</strong>
            </a>
            <p class="govuk-body govuk-!-margin-top-1">
              Round, clamp, and perform arithmetic operations.
            </p>
          </li>
          <li class="govuk-!-margin-top-4">
            <a href="/forms/form-engine-developer-guide/transformers/playground/arrays" class="govuk-link govuk-link--no-visited-state">
              <strong>Array Transformers</strong>
            </a>
            <p class="govuk-body govuk-!-margin-top-1">
              Join, slice, filter, and transform array values.
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
              href: '/forms/form-engine-developer-guide/transformers/custom',
              labelText: 'Custom Transformers',
            },
            next: {
              href: '/forms/form-engine-developer-guide/transformers/playground/strings',
              labelText: 'String Transformers',
            },
          }),
        ],
      },
    }),
  ],
})
