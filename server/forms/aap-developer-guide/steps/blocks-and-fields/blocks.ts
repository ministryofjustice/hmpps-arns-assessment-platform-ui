import { step, block } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { CodeBlock } from '@form-engine/registry/components/codeBlock'
import { GovUKDetails, GovUKPagination, GovUKWarningText } from '@form-engine-govuk-components/components'

/**
 * Blocks & Fields - Block Types
 *
 * Deep dive into the block() builder and the various block types available.
 */
export const blocksStep = step({
  path: '/blocks',
  title: 'Blocks',
  blocks: [
    // Page header
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <h1 class="govuk-heading-l">Block Types</h1>
        <p class="govuk-body-l">
          The <code>block()</code> builder creates display components. Each block type
          has a <code>variant</code> that determines how it renders.
        </p>
      `,
    }),

    // The block() Builder section
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">The block() Builder</h2>
        <p class="govuk-body">Basic usage:</p>
        {{slot:code}}
      `,
      slots: {
        code: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `
import { block } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'

block<HtmlBlock>({
  variant: 'html',
  content: '<p>Hello world</p>',
})`,
          }),
        ],
      },
    }),

    // Block Properties section
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Common Block Properties</h2>
        <p class="govuk-body">All blocks share these base properties:</p>
      `,
    }),

    // variant property
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <h3 class="govuk-heading-s"><code>{{name}}</code> <span class="govuk-tag govuk-tag--red">Required</span></h3>
        {{slot:description}}
        {{slot:example}}
      `,
      values: { name: 'variant' },
      slots: {
        description: [
          block<HtmlBlock>({
            variant: 'html',
            content: `
              <p class="govuk-body">
                Identifies the block type. Determines which component renders the block
                and what additional properties are available.
              </p>
            `,
          }),
        ],
        example: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `variant: 'html'
variant: 'templateWrapper'
variant: 'govukDetails'`,
          }),
        ],
      },
    }),

    // metadata property
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <h3 class="govuk-heading-s"><code>{{name}}</code></h3>
        {{slot:description}}
        {{slot:example}}
      `,
      values: { name: 'metadata' },
      slots: {
        description: [
          block<HtmlBlock>({
            variant: 'html',
            content: `
              <p class="govuk-body">
                Optional custom data attached to the block. Useful for application-specific
                logic or debugging.
              </p>
            `,
          }),
        ],
        example: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `metadata: { section: 'intro', analyticsId: 'welcome-text' }`,
          }),
        ],
      },
    }),

    // Core Block Types header
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Core Block Types</h2>
        <p class="govuk-body">
          These are the foundational block types available in the form-engine core.
        </p>
      `,
    }),

    // HTML Block
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <h3 class="govuk-heading-s">HTML Block</h3>
        <p class="govuk-body"><code>variant: 'html'</code></p>
        {{slot:description}}
        {{slot:example}}
        {{slot:warning}}
      `,
      slots: {
        description: [
          block<HtmlBlock>({
            variant: 'html',
            content: `
              <p class="govuk-body">
                Renders raw HTML content directly to the page. The most flexible block type
                for displaying custom content.
              </p>
              <p class="govuk-body"><strong>Properties:</strong></p>
              <ul class="govuk-list govuk-list--bullet">
                <li><code>content</code> &mdash; HTML string to render</li>
                <li><code>classes</code> &mdash; CSS classes for wrapper element</li>
                <li><code>attributes</code> &mdash; HTML attributes for wrapper</li>
              </ul>
            `,
          }),
        ],
        example: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `
block<HtmlBlock>({
  variant: 'html',
  content: \`
    <h1 class="govuk-heading-l">Welcome</h1>
    <p class="govuk-body">
      Complete this form to register your business.
    </p>
  \`,
  classes: 'app-intro-section',
})`,
          }),
        ],
        warning: [
          block<GovUKWarningText>({
            variant: 'govukWarningText',
            text: 'HTML content is not sanitised. Only use trusted content sources.',
          }),
        ],
      },
    }),

    // Template Wrapper Block
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <hr class="govuk-section-break govuk-section-break--m govuk-section-break--visible">
        <h3 class="govuk-heading-s">Template Wrapper Block</h3>
        <p class="govuk-body"><code>variant: 'templateWrapper'</code></p>
        {{slot:description}}
        {{slot:example}}
      `,
      slots: {
        description: [
          block<HtmlBlock>({
            variant: 'html',
            content: `
              <p class="govuk-body">
                Wraps child blocks in an HTML template with slot injection. Perfect for
                creating reusable layouts and composing complex structures.
              </p>
              <p class="govuk-body"><strong>Properties:</strong></p>
              <ul class="govuk-list govuk-list--bullet">
                <li><code>template</code> &mdash; HTML with <code>${'{{'}slot:name}}</code> and <code>${'{{'}valueName}}</code> placeholders</li>
                <li><code>slots</code> &mdash; Object mapping slot names to arrays of blocks</li>
                <li><code>values</code> &mdash; Object mapping value names to strings</li>
                <li><code>classes</code> &mdash; CSS classes for wrapper element</li>
                <li><code>attributes</code> &mdash; HTML attributes for wrapper</li>
              </ul>
            `,
          }),
        ],
        example: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `
block<TemplateWrapper>({
  variant: 'templateWrapper',
  template: \`
    <div class="app-card">
      <h2 class="app-card__title">${'{{'}title}}</h2>
      <div class="app-card__content">
        ${'{{'}slot:content}}
      </div>
      <div class="app-card__actions">
        ${'{{'}slot:actions}}
      </div>
    </div>
  \`,
  values: {
    title: 'Your Details',
  },
  slots: {
    content: [
      block<HtmlBlock>({
        variant: 'html',
        content: '<p>Review your information below.</p>',
      }),
    ],
    actions: [
      block<GovUKButton>({
        variant: 'govukButton',
        text: 'Continue',
      }),
    ],
  },
})`,
          }),
        ],
      },
    }),

    // Collection Block
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <hr class="govuk-section-break govuk-section-break--m govuk-section-break--visible">
        <h3 class="govuk-heading-s">Collection Block</h3>
        <p class="govuk-body"><code>variant: 'collection-block'</code></p>
        {{slot:description}}
        {{slot:example}}
      `,
      slots: {
        description: [
          block<HtmlBlock>({
            variant: 'html',
            content: `
              <p class="govuk-body">
                Iterates over a data source to produce repeated templates. Each item in the
                collection generates one instance of the template with <code>@item</code> references
                resolved to the current item.
              </p>
              <p class="govuk-body"><strong>Properties:</strong></p>
              <ul class="govuk-list govuk-list--bullet">
                <li><code>collection</code> &mdash; Expression returning an array to iterate</li>
                <li><code>template</code> &mdash; Array of blocks to repeat for each item</li>
                <li><code>fallback</code> &mdash; Blocks to show when collection is empty</li>
                <li><code>classes</code> &mdash; CSS classes for wrapper element</li>
              </ul>
            `,
          }),
        ],
        example: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `
import { Collection, Data, Item, Format } from '@form-engine/form/builders'

Collection({
  collection: Data('users'),
  template: [
    block<HtmlBlock>({
      variant: 'html',
      content: Format(
        '<p><strong>%1</strong> - %2</p>',
        Item().path('name'),
        Item().path('email')
      ),
    }),
  ],
  fallback: [
    block<HtmlBlock>({
      variant: 'html',
      content: '<p>No users found.</p>',
    }),
  ],
})`,
          }),
        ],
      },
    }),

    // GOV.UK Component Blocks header
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">GOV.UK Component Blocks</h2>
        <p class="govuk-body">
          The GOV.UK Frontend component library provides additional block types for
          common UI patterns.
        </p>
      `,
    }),

    // Details Block
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <h3 class="govuk-heading-s">Details (Expandable)</h3>
        <p class="govuk-body"><code>variant: 'govukDetails'</code></p>
        {{slot:description}}
        {{slot:example}}
      `,
      slots: {
        description: [
          block<HtmlBlock>({
            variant: 'html',
            content: `
              <p class="govuk-body">
                Creates expandable/collapsible content sections.
              </p>
              <p class="govuk-body"><strong>Properties:</strong></p>
              <ul class="govuk-list govuk-list--bullet">
                <li><code>summaryText</code> or <code>summaryHtml</code> &mdash; Clickable trigger text</li>
                <li><code>text</code>, <code>html</code>, or <code>content</code> &mdash; Expandable content</li>
                <li><code>open</code> &mdash; Whether expanded by default</li>
              </ul>
            `,
          }),
        ],
        example: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `
block<GovUKDetails>({
  variant: 'govukDetails',
  summaryText: 'Help with national insurance number',
  content: [
    block<HtmlBlock>({
      variant: 'html',
      content: \`
        <p>Your National Insurance number can be found on:</p>
        <ul>
          <li>your payslip</li>
          <li>your P60</li>
          <li>letters from HMRC</li>
        </ul>
      \`,
    }),
  ],
})`,
          }),
        ],
      },
    }),

    // Code Block
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <hr class="govuk-section-break govuk-section-break--m govuk-section-break--visible">
        <h3 class="govuk-heading-s">Code Block</h3>
        <p class="govuk-body"><code>variant: 'govukCodeBlock'</code></p>
        {{slot:description}}
        {{slot:example}}
      `,
      slots: {
        description: [
          block<HtmlBlock>({
            variant: 'html',
            content: `
              <p class="govuk-body">
                Displays syntax-highlighted code. Highlighting is performed server-side,
                so no client JavaScript is required.
              </p>
              <p class="govuk-body"><strong>Properties:</strong></p>
              <ul class="govuk-list govuk-list--bullet">
                <li><code>code</code> &mdash; The code to display</li>
                <li><code>language</code> &mdash; Language for highlighting (typescript, javascript, html, css, json, yaml, bash, etc.)</li>
                <li><code>title</code> &mdash; Optional title above the code block</li>
              </ul>
            `,
          }),
        ],
        example: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `
block<GovUKCodeBlock>({
  variant: 'govukCodeBlock',
  language: 'typescript',
  title: 'Example function',
  code: \`
function greet(name: string): string {
  return \\\`Hello, \\\${name}!\\\`
}
  \`,
})`,
          }),
        ],
      },
    }),

    // Pagination Block
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <hr class="govuk-section-break govuk-section-break--m govuk-section-break--visible">
        <h3 class="govuk-heading-s">Pagination</h3>
        <p class="govuk-body"><code>variant: 'govukPagination'</code></p>
        {{slot:description}}
        {{slot:example}}
      `,
      slots: {
        description: [
          block<HtmlBlock>({
            variant: 'html',
            content: `
              <p class="govuk-body">
                Provides previous/next navigation links, typically used at the bottom of pages.
              </p>
              <p class="govuk-body"><strong>Properties:</strong></p>
              <ul class="govuk-list govuk-list--bullet">
                <li><code>previous</code> &mdash; Object with <code>href</code> and <code>labelText</code></li>
                <li><code>next</code> &mdash; Object with <code>href</code> and <code>labelText</code></li>
                <li><code>items</code> &mdash; Array of page numbers (for numbered pagination)</li>
                <li><code>classes</code> &mdash; e.g., <code>'govuk-pagination--inline'</code></li>
              </ul>
            `,
          }),
        ],
        example: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `
block<GovUKPagination>({
  variant: 'govukPagination',
  classes: 'govuk-pagination--inline',
  previous: {
    href: '/forms/my-journey/step-1',
    labelText: 'Personal details',
  },
  next: {
    href: '/forms/my-journey/step-3',
    labelText: 'Review and submit',
  },
})`,
          }),
        ],
      },
    }),

    // Button Block
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <hr class="govuk-section-break govuk-section-break--m govuk-section-break--visible">
        <h3 class="govuk-heading-s">Button</h3>
        <p class="govuk-body"><code>variant: 'govukButton'</code></p>
        {{slot:description}}
        {{slot:example}}
      `,
      slots: {
        description: [
          block<HtmlBlock>({
            variant: 'html',
            content: `
              <p class="govuk-body">
                Renders a button for form submission or actions.
              </p>
              <p class="govuk-body"><strong>Properties:</strong></p>
              <ul class="govuk-list govuk-list--bullet">
                <li><code>text</code> &mdash; Button label</li>
                <li><code>buttonType</code> &mdash; 'submit' (default), 'button', or 'reset'</li>
                <li><code>name</code> &mdash; Form field name (default: 'action')</li>
                <li><code>value</code> &mdash; Form field value</li>
                <li><code>isStartButton</code> &mdash; Render as a start button</li>
                <li><code>disabled</code> &mdash; Disable the button</li>
                <li><code>preventDoubleClick</code> &mdash; Prevent accidental double submissions</li>
              </ul>
            `,
          }),
        ],
        example: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `
block<GovUKButton>({
  variant: 'govukButton',
  text: 'Save and continue',
  buttonType: 'submit',
  preventDoubleClick: true,
})

// Start button with arrow
block<GovUKButton>({
  variant: 'govukButton',
  text: 'Start now',
  isStartButton: true,
})`,
          }),
        ],
      },
    }),

    // Conditional content section
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Dynamic Content</h2>
        <p class="govuk-body">
          Block properties can be dynamic using expressions. This allows content to
          change based on form data or external sources.
        </p>
      `,
    }),

    block<GovUKDetails>({
      variant: 'govukDetails',
      summaryText: 'View dynamic content examples',
      content: [
        block<CodeBlock>({
          variant: 'codeBlock',
          language: 'typescript',
          code: `
import { block, Answer, Format, Data } from '@form-engine/form/builders'

// Using Answer() to reference field values
block<HtmlBlock>({
  variant: 'html',
  content: Format(
    '<p>Hello, %1! Your email is %2.</p>',
    Answer('fullName'),
    Answer('email')
  ),
})

// Using Data() to reference step data
block<HtmlBlock>({
  variant: 'html',
  content: Format(
    '<p>Your reference number is: <strong>%1</strong></p>',
    Data('referenceNumber')
  ),
})

// Conditional content with ternary-style expression
block<HtmlBlock>({
  variant: 'html',
  content: {
    if: Answer('isRegistered').match(Condition.String.Equals('yes')),
    then: '<p>Welcome back!</p>',
    else: '<p>Create an account to continue.</p>',
  },
})`,
        }),
      ],
    }),

    // Navigation
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        {{slot:pagination}}
        <p class="govuk-body govuk-!-margin-top-6">
          <a href="/forms/form-engine-developer-guide/hub" class="govuk-link">&larr; Back to Guide Hub</a>
        </p>
      `,
      slots: {
        pagination: [
          block<GovUKPagination>({
            variant: 'govukPagination',
            classes: 'govuk-pagination--inline',
            previous: {
              href: '/forms/form-engine-developer-guide/blocks-and-fields/intro',
              labelText: 'Introduction',
            },
            next: {
              href: '/forms/form-engine-developer-guide/blocks-and-fields/fields',
              labelText: 'Field Types',
            },
          }),
        ],
      },
    }),
  ],
})
