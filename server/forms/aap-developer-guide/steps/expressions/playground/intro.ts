import { step, block } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { GovUKPagination } from '@form-engine-govuk-components/components'

/**
 * Expressions Playground - Hub
 *
 * Entry point to the interactive expression examples.
 */
export const introStep = step({
  path: '/intro',
  title: 'Expressions Playground',
  isEntryPoint: true,
  blocks: [
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <h1 class="govuk-heading-l">Expressions Playground</h1>

        <p class="govuk-body-l">
          Try out expressions in real time. Each page below has live fields and
          dynamic content where you can see how expressions work in practice.
        </p>

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <h2 class="govuk-heading-m">Choose an expression type</h2>

        <ul class="govuk-list">
          <li>
            <a href="/forms/form-engine-developer-guide/expressions/playground/format" class="govuk-link govuk-link--no-visited-state">
              <strong>Format Expressions</strong>
            </a>
            <p class="govuk-body govuk-!-margin-top-1">
              String interpolation with <code>Format()</code> - combine values into dynamic text.
            </p>
          </li>
          <li class="govuk-!-margin-top-4">
            <a href="/forms/form-engine-developer-guide/expressions/playground/conditional" class="govuk-link govuk-link--no-visited-state">
              <strong>Conditional Expressions</strong>
            </a>
            <p class="govuk-body govuk-!-margin-top-1">
              If/then/else logic with <code>when()</code> and <code>Conditional()</code>.
            </p>
          </li>
          <li class="govuk-!-margin-top-4">
            <a href="/forms/form-engine-developer-guide/expressions/playground/predicates" class="govuk-link govuk-link--no-visited-state">
              <strong>Predicate Combinators</strong>
            </a>
            <p class="govuk-body govuk-!-margin-top-1">
              Boolean logic with <code>and()</code>, <code>or()</code>, and <code>not()</code>.
            </p>
          </li>
          <li class="govuk-!-margin-top-4">
            <a href="/forms/form-engine-developer-guide/expressions/playground/collection" class="govuk-link govuk-link--no-visited-state">
              <strong>Collection Expressions</strong>
            </a>
            <p class="govuk-body govuk-!-margin-top-1">
              Iteration with <code>Collection()</code> and <code>Item()</code> references.
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
              href: '/forms/form-engine-developer-guide/expressions/collection',
              labelText: 'Collection Expressions',
            },
            next: {
              href: '/forms/form-engine-developer-guide/expressions/playground/format',
              labelText: 'Format Playground',
            },
          }),
        ],
      },
    }),
  ],
})
