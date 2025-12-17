import { step, block } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { GovUKPagination } from '@form-engine-govuk-components/components'

/**
 * Generators Playground - Hub
 *
 * Entry point to the interactive generator examples.
 * These examples show generators producing values in real time.
 */
export const introStep = step({
  path: '/intro',
  title: 'Generators Playground',
  isEntryPoint: true,
  blocks: [
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <h1 class="govuk-heading-l">Generators Playground</h1>

        <p class="govuk-body-l">
          Try out generators in real time. Each page below has live examples
          where you can see how generators produce dynamic values.
        </p>

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <h2 class="govuk-heading-m">Choose a generator type</h2>

        <ul class="govuk-list">
          <li>
            <a href="/forms/form-engine-developer-guide/generators/playground/dates" class="govuk-link govuk-link--no-visited-state">
              <strong>Date Generators</strong>
            </a>
            <p class="govuk-body govuk-!-margin-top-1">
              Generate current dates and times for use in forms.
            </p>
          </li>
        </ul>

        <div class="govuk-inset-text">
          More generator types will be added in future updates.
        </div>
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
              href: '/forms/form-engine-developer-guide/generators/intro',
              labelText: 'Understanding Generators',
            },
            next: {
              href: '/forms/form-engine-developer-guide/generators/playground/dates',
              labelText: 'Date Generators',
            },
          }),
        ],
      },
    }),
  ],
})
