import { block } from '@form-engine/form/builders'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { GovUKPagination } from '@form-engine-govuk-components/components'
import { parseGovUKMarkdown } from '../../../../../helpers/markdown'

/**
 * Iterators Playground - Intro
 *
 * Entry point to the interactive iterator examples.
 */
export const pageContent = block<TemplateWrapper>({
  variant: 'templateWrapper',
  template: parseGovUKMarkdown(`
  # Iterators Playground

  Try out iterator patterns with interactive examples.
  See Map, Filter, Find, and chaining in action with live output. {.lead}

  ---

  ## Choose an example

  - [**Iterator.Map Examples**](/forms/form-engine-developer-guide/iterators/playground/map-examples)

    Transform items to new shapes: property extraction, object mapping,
    and using \`Literal()\` for static arrays.

  - [**Iterator.Filter Examples**](/forms/form-engine-developer-guide/iterators/playground/filter-examples)

    Filter collections by conditions: equality checks, negation,
    and combining predicates with \`and()\` / \`or()\`.

  - [**Iterator.Find Examples**](/forms/form-engine-developer-guide/iterators/playground/find-examples)

    Find single items: lookup by ID, existence checks,
    and extracting properties from found items.

  - [**Dynamic Fields**](/forms/form-engine-developer-guide/iterators/playground/dynamic-fields)

    Generate form fields inside collections using \`Format()\`
    for unique field codes based on item ID or index.

  - [**Chaining Examples**](/forms/form-engine-developer-guide/iterators/playground/chaining-examples)

    Combine iterators: filter then map, nested iterations,
    and using \`.pipe()\` for array transforms.

  - [**Hub-and-Spoke CRUD**](/forms/form-engine-developer-guide/iterators/playground/hub)

    Fully interactive task manager demonstrating Iterator syntax for CRUD operations.

  ---

  ## Sample Data

  The playground uses sample data loaded into \`Data()\`:

  - \`Data('teamMembers')\` — Team member objects with name, email, role
  - \`Data('tableRows')\` — Table data with name, role, status (active/away)
  - \`Data('tasks')\` — Task items with status and priority
  - \`Data('categories')\` — Nested data with category.tasks arrays
  - \`Data('simpleListItems')\` — Simple objects with name property

  Each example shows the live output alongside the code that generates it.

  ---

  {{slot:pagination}}
`),
  slots: {
    pagination: [
      block<GovUKPagination>({
        variant: 'govukPagination',
        classes: 'govuk-pagination--inline',
        previous: {
          href: '/forms/form-engine-developer-guide/iterators/chaining',
          labelText: 'Chaining Iterators',
        },
        next: {
          href: '/forms/form-engine-developer-guide/iterators/playground/map-examples',
          labelText: 'Map Examples',
        },
      }),
    ],
  },
})
