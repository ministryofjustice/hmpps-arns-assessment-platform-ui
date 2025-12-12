import { step, block } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { GovUKPagination } from '@form-engine-govuk-components/components'

/**
 * Blocks & Fields - Introduction
 *
 * High-level overview of what blocks and fields are, their relationship,
 * and how they compose to create form pages.
 */
export const introStep = step({
  path: '/intro',
  title: 'Understanding Blocks & Fields',
  isEntryPoint: true,
  blocks: [
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <h1 class="govuk-heading-l">Blocks & Fields</h1>

        <p class="govuk-body-l">
          Every step in a journey is composed of <strong>blocks</strong> and <strong>fields</strong>.
          These are the building blocks that create the content and interactivity on each page.
        </p>

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <h2 class="govuk-heading-m">What is a Block?</h2>

        <p class="govuk-body">
          A <strong>block</strong> is a unit of content that displays information to the user.
          Blocks are read-only &mdash; they present content but don't collect input.
        </p>

        <ul class="govuk-list govuk-list--bullet">
          <li>Display headings, paragraphs, and formatted text</li>
          <li>Show tables, lists, and structured content</li>
          <li>Render components like panels, warning text, and details</li>
          <li>Wrap other blocks in templates for complex layouts</li>
        </ul>

        <p class="govuk-body">
          Common block types include <code>html</code> for raw HTML content,
          <code>templateWrapper</code> for composing layouts with slots,
          and component-specific blocks like <code>govukDetails</code> or <code>govukCodeBlock</code>.
        </p>

        <hr class="govuk-section-break govuk-section-break--m govuk-section-break--visible">

        <h2 class="govuk-heading-m">What is a Field?</h2>

        <p class="govuk-body">
          A <strong>field</strong> is a special type of block that collects user input.
          Fields are interactive elements that users fill in, select, or interact with.
        </p>

        <ul class="govuk-list govuk-list--bullet">
          <li>Collect text input (names, emails, descriptions)</li>
          <li>Provide selection options (radio buttons, checkboxes, dropdowns)</li>
          <li>Capture dates, numbers, and other structured data</li>
          <li>Support validation, formatting, and conditional logic</li>
        </ul>

        <p class="govuk-body">
          Every field has a <code>code</code> &mdash; a unique identifier used to store and
          reference the user's answer. When a form is submitted, field values are collected
          using their codes.
        </p>

        <hr class="govuk-section-break govuk-section-break--m govuk-section-break--visible">

        <h2 class="govuk-heading-m">Blocks vs Fields</h2>

        <p class="govuk-body">
          The key difference is simple:
        </p>

        <table class="govuk-table">
          <thead class="govuk-table__head">
            <tr class="govuk-table__row">
              <th scope="col" class="govuk-table__header">Aspect</th>
              <th scope="col" class="govuk-table__header">Block</th>
              <th scope="col" class="govuk-table__header">Field</th>
            </tr>
          </thead>
          <tbody class="govuk-table__body">
            <tr class="govuk-table__row">
              <td class="govuk-table__cell">Purpose</td>
              <td class="govuk-table__cell">Display content</td>
              <td class="govuk-table__cell">Collect input</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell">Builder function</td>
              <td class="govuk-table__cell"><code>block()</code></td>
              <td class="govuk-table__cell"><code>field()</code></td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell">Has <code>code</code></td>
              <td class="govuk-table__cell">No</td>
              <td class="govuk-table__cell">Yes (required)</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell">Validation</td>
              <td class="govuk-table__cell">Not applicable</td>
              <td class="govuk-table__cell">Supported</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell">In form data</td>
              <td class="govuk-table__cell">No</td>
              <td class="govuk-table__cell">Yes</td>
            </tr>
          </tbody>
        </table>

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <h2 class="govuk-heading-m">The Hierarchy</h2>

        <p class="govuk-body">
          Blocks and fields live inside steps. A step's <code>blocks</code> array contains
          both blocks and fields in the order they should appear:
        </p>

        <div class="govuk-inset-text" style="font-family: monospace; white-space: pre;">
Step
  \u251c\u2500\u2500 Block (heading)
  \u251c\u2500\u2500 Block (intro text)
  \u251c\u2500\u2500 Field (text input)
  \u251c\u2500\u2500 Field (radio buttons)
  \u251c\u2500\u2500 Block (help text)
  \u2514\u2500\u2500 Block (submit button)</div>

        <p class="govuk-body">
          The order in the <code>blocks</code> array determines the order on the page.
          You can freely mix blocks and fields to create the layout you need.
        </p>

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <h2 class="govuk-heading-m">Live Example</h2>

        <p class="govuk-body">
          This very page demonstrates the concept. Everything you're reading is rendered
          using blocks:
        </p>

        <ul class="govuk-list govuk-list--bullet">
          <li>The heading, paragraphs, and lists are <code>html</code> blocks</li>
          <li>The tables are part of an <code>html</code> block</li>
          <li>The navigation below uses <code>templateWrapper</code> with a <code>govukPagination</code> component</li>
        </ul>

        <p class="govuk-body">
          Since this is a documentation page (not a form), it uses only blocks &mdash; no fields.
          In the following pages, you'll see how to use both.
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
              href: '/forms/form-engine-developer-guide/blocks-and-fields/blocks',
              labelText: 'Block Types',
            },
          }),
        ],
      },
    }),
  ],
})
