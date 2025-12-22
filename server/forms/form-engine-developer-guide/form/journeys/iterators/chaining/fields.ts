import { block, Format, Item, Iterator, Literal } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { CollectionBlock } from '@form-engine/registry/components/collectionBlock'
import { GovUKDetails, GovUKPagination } from '@form-engine-govuk-components/components'
import { Transformer } from '@form-engine/registry/transformers'
import { CodeBlock } from '../../../../components/code-block/codeBlock'
import { parseGovUKMarkdown } from '../../../../helpers/markdown'

const tableRows = [
  { name: 'Alice Johnson', role: 'Developer', status: 'active' },
  { name: 'Bob Smith', role: 'Designer', status: 'inactive' },
  { name: 'Carol Williams', role: 'Manager', status: 'active' },
  { name: 'David Brown', role: 'Developer', status: 'inactive' },
  { name: 'Eve Davis', role: 'Analyst', status: 'active' },
]

const simpleListItems = [
  { name: 'First item' },
  { name: 'Second item' },
  { name: 'Third item' },
  { name: 'Fourth item' },
]

const categories = [
  {
    name: 'Development',
    tasks: [{ name: 'Build feature' }, { name: 'Write tests' }, { name: 'Code review' }],
  },
  {
    name: 'Design',
    tasks: [{ name: 'Create mockups' }, { name: 'User research' }],
  },
]

/**
 * Iterators - Chaining
 *
 * Combining multiple iterators and transformers.
 */
export const pageContent = block<TemplateWrapper>({
  variant: 'templateWrapper',
  template: parseGovUKMarkdown(`
  # Chaining Iterators

  Multiple iterators can be chained with successive \`.each()\` calls.
  Each iterator operates on the result of the previous one. After iteration,
  use \`.pipe()\` to apply whole-array transformations. {.lead}

  ---

  ## Filter then Map

  The most common pattern is filtering first, then transforming the results:

  {{slot:filterMapCode}}

  ### Live Example: Active Team Members

  Filter to active members, then format as a list:

  {{slot:filterMapExample}}

  {{slot:filterMapExampleCode}}

  ---

  ## Exiting Iteration with .pipe()

  After iterating, use \`.pipe()\` to apply whole-array transformations
  like slicing, sorting, or flattening:

  {{slot:pipeCode}}

  > **FlatMap Pattern:** There's no \`Iterator.FlatMap\` because you can
  > achieve the same result with \`Iterator.Map\` followed by
  > \`.pipe(Transformer.Array.Flatten())\`.

  ### Live Example: First 2 Items Only

  Filter, map, then slice to show only the first 2 results:

  {{slot:sliceExample}}

  {{slot:sliceExampleCode}}

  ---

  ## Nested Iterations

  Iterators can be nested to process hierarchical data.
  Use \`Item().parent\` to access the outer iteration's scope:

  {{slot:nestedExample}}

  ---

  ## Operation Order Summary

  1. **Filter first** — Reduce the dataset before transforming
  2. **Map second** — Transform each remaining item
  3. **Pipe last** — Apply whole-array transforms (slice, flatten, etc.)

  This order minimizes work by filtering early and transforming only what's needed.

  ---

  {{slot:pagination}}
`),
  slots: {
    filterMapCode: [
      block<CodeBlock>({
        variant: 'codeBlock',
        language: 'typescript',
        code: `
          // Filter to active items, then transform to select options
          items: Data('areas')
            .each(Iterator.Filter(
              Item().path('active').match(Condition.IsTrue())
            ))
            .each(Iterator.Map({
              value: Item().path('id'),
              text: Item().path('name'),
            }))
        `,
      }),
    ],
    filterMapExample: [
      block<CollectionBlock>({
        variant: 'collection-block',
        classes: 'govuk-!-margin-bottom-4',
        collection: Literal(tableRows)
          .each(Iterator.Filter(Item().path('status').match(Condition.Equals('active'))))
          .each(
            Iterator.Map(Format('<li class="govuk-body">%1 &mdash; %2</li>', Item().path('name'), Item().path('role'))),
          ),
      }),
    ],
    filterMapExampleCode: [
      block<GovUKDetails>({
        variant: 'govukDetails',
        summaryText: 'View code',
        content: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `
              const tableRows = [
                { name: 'Alice Johnson', role: 'Developer', status: 'active' },
                { name: 'Bob Smith', role: 'Designer', status: 'inactive' },
                { name: 'Carol Williams', role: 'Manager', status: 'active' },
                // ...
              ]

              Literal(tableRows)
                .each(Iterator.Filter(Item().path('status').match(Condition.Equals('active'))))
                .each(Iterator.Map(
                  Format('<li>%1 &mdash; %2</li>', Item().path('name'), Item().path('role'))
                ))
            `,
          }),
        ],
      }),
    ],
    pipeCode: [
      block<CodeBlock>({
        variant: 'codeBlock',
        language: 'typescript',
        code: `// Filter, map, then slice to first 3
Data('items')
  .each(Iterator.Filter(Item().path('active').match(Condition.IsTrue())))
  .each(Iterator.Map({ label: Item().path('name') }))
  .pipe(Transformer.Array.Slice(0, 3))

// Map then flatten (for FlatMap behavior)
Data('categories')
  .each(Iterator.Map(Item().path('subItems')))
  .pipe(Transformer.Array.Flatten())`,
      }),
    ],
    sliceExample: [
      block<CollectionBlock>({
        variant: 'collection-block',
        classes: 'govuk-!-margin-bottom-4',
        collection: Literal(simpleListItems)
          .each(
            Iterator.Map(
              Format(
                '<span class="govuk-tag govuk-!-margin-right-2 govuk-!-margin-bottom-2">%1</span>',
                Item().path('name'),
              ),
            ),
          )
          .pipe(Transformer.Array.Slice(0, 2)),
      }),
    ],
    sliceExampleCode: [
      block<GovUKDetails>({
        variant: 'govukDetails',
        summaryText: 'View code',
        content: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `const simpleListItems = [
  { name: 'First item' },
  { name: 'Second item' },
  { name: 'Third item' },
  { name: 'Fourth item' },
]

Literal(simpleListItems)
  .each(Iterator.Map(
    Format('<span class="govuk-tag">%1</span>', Item().path('name'))
  ))
  .pipe(Transformer.Array.Slice(0, 2))`,
          }),
        ],
      }),
    ],
    nestedExample: [
      block<CollectionBlock>({
        variant: 'collection-block',
        classes: 'govuk-!-margin-bottom-4',
        collection: Literal(categories).each(
          Iterator.Map(
            block<TemplateWrapper>({
              variant: 'templateWrapper',
              template: `
                <div>
                    <p>Category title: {{title}}</p>
                    <ul>{{tasks}}</ul>
                </div>
              `,
              values: {
                title: Item().path('name'),
                tasks: Item()
                  .path('tasks')
                  .each(Iterator.Map(Format('<li>%1</li>', Item().path('name')))),
              },
            }),
          ),
        ),
      }),
    ],
    pagination: [
      block<GovUKPagination>({
        variant: 'govukPagination',
        classes: 'govuk-pagination--inline',
        previous: {
          href: '/forms/form-engine-developer-guide/iterators/find',
          labelText: 'Iterator.Find',
        },
        next: {
          href: '/forms/form-engine-developer-guide/iterators/playground/intro',
          labelText: 'Iterators Playground',
        },
      }),
    ],
  },
})
