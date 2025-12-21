import { block } from '@form-engine/form/builders'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { GovUKPagination } from '@form-engine-govuk-components/components'
import { parseGovUKMarkdown } from '../../../../helpers/markdown'

/**
 * Blocks & Fields - Introduction
 *
 * High-level overview of what blocks and fields are, their relationship,
 * and how they compose to create form pages.
 */
export const pageContent = block<TemplateWrapper>({
  variant: 'templateWrapper',
  template: parseGovUKMarkdown(`
  # Blocks & Fields

  Every step in a journey is composed of **blocks** and **fields**.
  These are the building blocks that create the content and interactivity on each page. {.lead}

  ---

  ## What is a Block?

  A **block** is a unit of content that displays information to the user.
  Blocks are read-only — they present content but don't collect input.

  - Display headings, paragraphs, and formatted text
  - Show tables, lists, and structured content
  - Render components like panels, warning text, and details
  - Wrap other blocks in templates for complex layouts

  Common block types include \`html\` for raw HTML content,
  \`templateWrapper\` for composing layouts with slots,
  and component-specific blocks like \`govukDetails\` or \`govukCodeBlock\`.

  ---

  ## What is a Field?

  A **field** is a special type of block that collects user input.
  Fields are interactive elements that users fill in, select, or interact with.

  - Collect text input (names, emails, descriptions)
  - Provide selection options (radio buttons, checkboxes, dropdowns)
  - Capture dates, numbers, and other structured data
  - Support validation, formatting, and conditional logic

  Every field has a \`code\` — a unique identifier used to store and
  reference the user's answer. When a form is submitted, field values are collected
  using their codes.

  ---

  ## Blocks vs Fields

  The key difference is simple:

  | Aspect | Block | Field |
  |--------|-------|-------|
  | Purpose | Display content | Collect input |
  | Builder function | \`block()\` | \`field()\` |
  | Has \`code\` | No | Yes (required) |
  | Validation | Not applicable | Supported |
  | In form data | No | Yes |

  ---

  ## The Hierarchy

  Blocks and fields live inside steps. A step's \`blocks\` array contains
  both blocks and fields in the order they should appear:

  \`\`\`
  Step
  ├── Block (heading)
  ├── Block (intro text)
  ├── Field (text input)
  ├── Field (radio buttons)
  ├── Block (help text)
  └── Block (submit button)
  \`\`\`

  The order in the \`blocks\` array determines the order on the page.
  You can freely mix blocks and fields to create the layout you need.

  ---

  ## Live Example

  This very page demonstrates the concept. Everything you're reading is rendered
  using blocks:

  - The heading, paragraphs, and lists are \`html\` blocks
  - The tables are part of an \`html\` block
  - The navigation below uses \`templateWrapper\` with a \`govukPagination\` component

  Since this is a documentation page (not a form), it uses only blocks — no fields.
  In the following pages, you'll see how to use both.

  ---

  {{slot:pagination}}
`),
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
})
