import { step, block } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { GovUKPagination } from '@form-engine-govuk-components/components'

/**
 * Journeys & Steps - Introduction
 *
 * High-level overview of what journeys and steps are, their relationship,
 * and a live demonstration of URL path composition.
 */
export const introStep = step({
  path: '/intro',
  title: 'Understanding Journeys & Steps',
  isEntryPoint: true,
  blocks: [
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <h1 class="govuk-heading-l">Journeys & Steps</h1>

        <p class="govuk-body-l">
          In the form-engine, forms are built from two fundamental structures:
          <strong>journeys</strong> and <strong>steps</strong>.
        </p>

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <h2 class="govuk-heading-m">What is a Journey?</h2>

        <p class="govuk-body">
          A <strong>journey</strong> is the top-level container for a form. It defines:
        </p>

        <ul class="govuk-list govuk-list--bullet">
          <li>A unique identifier (<code>code</code>) for the form</li>
          <li>The base URL path where the form lives</li>
          <li>Configuration for how the form renders and behaves</li>
          <li>The steps that make up the form flow</li>
          <li>Optional child journeys for complex, nested structures</li>
        </ul>

        <p class="govuk-body">
          Think of a journey as the "wrapper" that holds everything together.
        </p>

        <hr class="govuk-section-break govuk-section-break--m govuk-section-break--visible">

        <h2 class="govuk-heading-m">What is a Step?</h2>

        <p class="govuk-body">
          A <strong>step</strong> is a single page within a journey. Each step:
        </p>

        <ul class="govuk-list govuk-list--bullet">
          <li>Has its own URL path (relative to the journey)</li>
          <li>Contains blocks for displaying content</li>
          <li>Contains fields for collecting user input</li>
          <li>Can handle form submissions and navigation</li>
        </ul>

        <p class="govuk-body">
          Users progress through steps to complete the journey. A journey can have
          one step (single-page form) or many steps (multi-page wizard).
        </p>

        <hr class="govuk-section-break govuk-section-break--m govuk-section-break--visible">

        <h2 class="govuk-heading-m">The Hierarchy</h2>

        <p class="govuk-body">
          Forms follow a strict containment hierarchy:
        </p>

        <div class="govuk-inset-text" style="font-family: monospace; white-space: pre;">
Journey
  \u251c\u2500\u2500 Step
  \u2502     \u251c\u2500\u2500 Block (display content)
  \u2502     \u251c\u2500\u2500 Field (collect input)
  \u2502     \u2514\u2500\u2500 Field
  \u251c\u2500\u2500 Step
  \u2502     \u2514\u2500\u2500 Block
  \u2514\u2500\u2500 Child Journey (optional)
        \u2514\u2500\u2500 Step
              \u2514\u2500\u2500 Block</div>

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <h2 class="govuk-heading-m">Live Demo: Path Breakdown</h2>

        <p class="govuk-body">
          Look at the URL for this page. It demonstrates how paths compose:
        </p>

        <div class="govuk-panel govuk-panel--confirmation" style="background: #f3f2f1; color: #0b0c0c; text-align: left;">
          <p class="govuk-body" style="margin-bottom: 15px;">
            <strong>Current URL:</strong>
          </p>
          <code style="font-size: 1rem; word-break: break-all;">
            /forms/form-engine-developer-guide/journeys-and-steps/intro
          </code>
        </div>

        <table class="govuk-table">
          <thead class="govuk-table__head">
            <tr class="govuk-table__row">
              <th scope="col" class="govuk-table__header">Segment</th>
              <th scope="col" class="govuk-table__header">Source</th>
              <th scope="col" class="govuk-table__header">Description</th>
            </tr>
          </thead>
          <tbody class="govuk-table__body">
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>/forms</code></td>
              <td class="govuk-table__cell">Server routing</td>
              <td class="govuk-table__cell">Base path where form-engine is mounted</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>/form-engine-developer-guide</code></td>
              <td class="govuk-table__cell">Parent journey <code>path</code></td>
              <td class="govuk-table__cell">The main Developer Guide journey</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>/journeys-and-steps</code></td>
              <td class="govuk-table__cell">Child journey <code>path</code></td>
              <td class="govuk-table__cell">This concept module (a nested journey)</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>/intro</code></td>
              <td class="govuk-table__cell">Step <code>path</code></td>
              <td class="govuk-table__cell">This specific page within the module</td>
            </tr>
          </tbody>
        </table>

        <p class="govuk-body">
          <strong>Key insight:</strong> Paths are composed by concatenating the journey path(s)
          with the step path. This creates clean, hierarchical URLs automatically.
        </p>
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
              href: '/forms/form-engine-developer-guide/hub',
              labelText: 'Guide Hub',
            },
            next: {
              href: '/forms/form-engine-developer-guide/journeys-and-steps/journeys',
              labelText: 'Journey Configuration',
            },
          }),
        ],
      },
    }),
  ],
})
