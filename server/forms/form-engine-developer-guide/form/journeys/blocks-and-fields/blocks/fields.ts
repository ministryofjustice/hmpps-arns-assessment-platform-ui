import { TemplateWrapper } from '@form-engine/registry/components'
import { GovUKDetails, GovUKPagination, GovUKWarningText } from '@form-engine-govuk-components/components'
import { CodeBlock } from '../../../../components'
import { parseGovUKMarkdown } from '../../../../helpers/markdown'

/**
 * Blocks & Fields - Block Types
 *
 * Deep dive into the block() builder and the various block types available.
 */
export const pageContent = TemplateWrapper({
  template: parseGovUKMarkdown(`
  # Block Types

  The \`block()\` builder creates display components. Each block type
  has a \`variant\` that determines how it renders. {.lead}

  ---

  ## The block() Builder

  Basic usage:

  {{slot:basicUsageCode}}

  ---

  ## Common Block Properties

  All blocks share these base properties:

  ### \`variant\` <span class="govuk-tag govuk-tag--red">Required</span>

  Identifies the block type. Determines which component renders the block
  and what additional properties are available.

  {{slot:variantExampleCode}}

  ### \`metadata\` <span class="govuk-tag govuk-tag--grey">Optional</span>

  Optional custom data attached to the block. Useful for application-specific
  logic or debugging.

  {{slot:metadataExampleCode}}

  ---

  ## Core Block Types

  These are the foundational block types available in the form-engine core.

  ### HTML Block

  \`variant: 'html'\`

  Renders raw HTML content directly to the page. The most flexible block type
  for displaying custom content.

  **Properties:**
  - \`content\` — HTML string to render
  - \`classes\` — CSS classes for wrapper element
  - \`attributes\` — HTML attributes for wrapper

  {{slot:htmlBlockCode}}

  {{slot:htmlBlockWarning}}

  ---

  ### Template Wrapper Block

  \`variant: 'templateWrapper'\`

  Wraps child blocks in an HTML template with slot injection. Perfect for
  creating reusable layouts and composing complex structures.

  **Properties:**
  - \`template\` — HTML with \`{{slot:name}}\` and \`{{valueName}}\` placeholders
  - \`slots\` — Object mapping slot names to arrays of blocks
  - \`values\` — Object mapping value names to strings
  - \`classes\` — CSS classes for wrapper element
  - \`attributes\` — HTML attributes for wrapper

  {{slot:templateWrapperCode}}

  ---

  ### Collection Block

  \`CollectionBlock({ ... })\`

  Iterates over a data source to produce repeated templates. Each item in the
  collection generates one instance of the template with \`@item\` references
  resolved to the current item.

  **Properties:**
  - \`collection\` — Expression returning an array to iterate
  - \`template\` — Array of blocks to repeat for each item
  - \`fallback\` — Blocks to show when collection is empty
  - \`classes\` — CSS classes for wrapper element

  {{slot:collectionBlockCode}}

  ---

  ## GOV.UK Component Blocks

  The GOV.UK Frontend component library provides additional block types for
  common UI patterns.

  ### Details (Expandable)

  \`variant: 'govukDetails'\`

  Creates expandable/collapsible content sections.

  **Properties:**
  - \`summaryText\` or \`summaryHtml\` — Clickable trigger text
  - \`text\`, \`html\`, or \`content\` — Expandable content
  - \`open\` — Whether expanded by default

  {{slot:detailsBlockCode}}

  ---

  ### Pagination

  \`variant: 'govukPagination'\`

  Provides previous/next navigation links, typically used at the bottom of pages.

  **Properties:**
  - \`previous\` — Object with \`href\` and \`labelText\`
  - \`next\` — Object with \`href\` and \`labelText\`
  - \`items\` — Array of page numbers (for numbered pagination)
  - \`classes\` — e.g., \`'govuk-pagination--inline'\`

  {{slot:paginationBlockCode}}

  ---

  ### Button

  \`variant: 'govukButton'\`

  Renders a button for form submission or actions.

  **Properties:**
  - \`text\` — Button label
  - \`buttonType\` — 'submit' (default), 'button', or 'reset'
  - \`name\` — Form field name (default: 'action')
  - \`value\` — Form field value
  - \`isStartButton\` — Render as a start button
  - \`disabled\` — Disable the button
  - \`preventDoubleClick\` — Prevent accidental double submissions

  {{slot:buttonBlockCode}}

  ---

  ## Dynamic Content

  Block properties can be dynamic using expressions. This allows content to
  change based on form data or external sources.

  {{slot:dynamicContentDetails}}

  ---

  {{slot:pagination}}

  [← Back to Guide Hub](/form-engine-developer-guide/hub)
`),
  slots: {
    basicUsageCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          import { block } from '@form-engine/form/builders'
          import { HtmlBlock } from '@form-engine/registry/components/html'

          HtmlBlock({
            content: '<p>Hello world</p>',
          })
        `,
      }),
    ],
    variantExampleCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          variant: 'html'
          variant: 'templateWrapper'
          variant: 'govukDetails'
        `,
      }),
    ],
    metadataExampleCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          metadata: { section: 'intro', analyticsId: 'welcome-text' }
        `,
      }),
    ],
    htmlBlockCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          HtmlBlock({
            content: \`
              <h1 class="govuk-heading-l">Welcome</h1>
              <p class="govuk-body">
                Complete this form to register your business.
              </p>
            \`,
            classes: 'app-intro-section',
          })
        `,
      }),
    ],
    htmlBlockWarning: [
      GovUKWarningText({
        text: 'HTML content is not sanitised. Only use trusted content sources.',
      }),
    ],
    templateWrapperCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          TemplateWrapper({
            template: \`
              <div class="app-card">
                <h2 class="app-card__title">{{title}}</h2>
                <div class="app-card__content">
                  {{slot:content}}
                </div>
                <div class="app-card__actions">
                  {{slot:actions}}
                </div>
              </div>
            \`,
            values: {
              title: 'Your Details',
            },
            slots: {
              content: [
                HtmlBlock({
                  content: '<p>Review your information below.</p>',
                }),
              ],
              actions: [
                GovUKButton({
                  text: 'Continue',
                }),
              ],
            },
          })
        `,
      }),
    ],
    collectionBlockCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          import { Data, Item, Iterator, Format } from '@form-engine/form/builders'
          import { CollectionBlock } from '@form-engine/registry/components'
          import { HtmlBlock } from '@form-engine/registry/components/html'

          CollectionBlock({
            collection: Data('users').each(
              Iterator.Map(
                HtmlBlock({
                  content: Format(
                    '<p><strong>%1</strong> - %2</p>',
                    Item().path('name'),
                    Item().path('email')
                  ),
                })
              )
            ),
            fallback: [
              HtmlBlock({
                content: '<p>No users found.</p>',
              }),
            ],
          })
        `,
      }),
    ],
    detailsBlockCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          GovUKDetails({
            summaryText: 'Help with national insurance number',
            content: [
              HtmlBlock({
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
          })
        `,
      }),
    ],
    codeBlockCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          GovUKCodeBlock({
            language: 'typescript',
            title: 'Example function',
            code: \`
              function greet(name: string): string {
                return \\\`Hello, \\\${name}!\\\`
              }
            \`,
          })
        `,
      }),
    ],
    paginationBlockCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          GovUKPagination({
            classes: 'govuk-pagination--inline',
            previous: {
              href: '/forms/my-journey/step-1',
              labelText: 'Personal details',
            },
            next: {
              href: '/forms/my-journey/step-3',
              labelText: 'Review and submit',
            },
          })
        `,
      }),
    ],
    buttonBlockCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          GovUKButton({
            text: 'Save and continue',
            buttonType: 'submit',
            preventDoubleClick: true,
          })

          // Start button with arrow
          GovUKButton({
            text: 'Start now',
            isStartButton: true,
          })
        `,
      }),
    ],
    dynamicContentDetails: [
      GovUKDetails({
        summaryText: 'View dynamic content examples',
        content: [
          CodeBlock({
            language: 'typescript',
            code: `
              import { block, Answer, Format, Data } from '@form-engine/form/builders'

              // Using Answer() to reference field values
              HtmlBlock({
                content: Format(
                  '<p>Hello, %1! Your email is %2.</p>',
                  Answer('fullName'),
                  Answer('email')
                ),
              })

              // Using Data() to reference step data
              HtmlBlock({
                content: Format(
                  '<p>Your reference number is: <strong>%1</strong></p>',
                  Data('referenceNumber')
                ),
              })

              // Conditional content with ternary-style expression
              HtmlBlock({
                content: {
                  if: Answer('isRegistered').match(Condition.String.Equals('yes')),
                  then: '<p>Welcome back!</p>',
                  else: '<p>Create an account to continue.</p>',
                },
              })
            `,
          }),
        ],
      }),
    ],
    pagination: [
      GovUKPagination({
        classes: 'govuk-pagination--inline',
        previous: {
          href: '/form-engine-developer-guide/blocks-and-fields/intro',
          labelText: 'Introduction',
        },
        next: {
          href: '/form-engine-developer-guide/blocks-and-fields/fields',
          labelText: 'Field Types',
        },
      }),
    ],
  },
})
