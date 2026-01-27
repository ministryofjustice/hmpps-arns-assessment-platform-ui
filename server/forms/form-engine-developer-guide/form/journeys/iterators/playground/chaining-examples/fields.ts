import { Format, Item, Data, Iterator } from '@form-engine/form/builders'
import { HtmlBlock, TemplateWrapper, CollectionBlock } from '@form-engine/registry/components'
import { Condition } from '@form-engine/registry/conditions'
import { GovUKDetails, GovUKPagination } from '@form-engine-govuk-components/components'
import { Transformer } from '@form-engine/registry/transformers'
import { CodeBlock } from '../../../../../components'
import { parseGovUKMarkdown } from '../../../../../helpers/markdown'

/**
 * Iterators Playground - Chaining Examples
 *
 * Interactive examples of chaining iterators and using .pipe().
 */
export const pageContent = TemplateWrapper({
  template: parseGovUKMarkdown(`
  # Chaining Examples

  See iterator chaining in action: Filter → Map → Pipe patterns,
  nested iterations, and complex transformations. {.lead}

  ---

  ## 1. Filter Then Map

  The most common pattern: filter first to reduce the dataset,
  then map to transform:

  {{slot:example1}}

  {{slot:example1Code}}

  ---

  ## 2. Limit Results with .pipe()

  Use \`.pipe(Transformer.Array.Slice(0, n))\` to limit results:

  *Showing first 2 items only:*

  {{slot:example2}}

  {{slot:example2Code}}

  ---

  ## 3. Nested Iterations

  Access parent scope with \`Item().parent\`:

  {{slot:example3}}

  {{slot:example3Code}}

  ---

  ## 4. Find and Extract Property

  Use \`Iterator.Find\` with \`.pipe()\` to lookup and extract:

  {{slot:example4}}

  {{slot:example4Code}}

  ---

  ## 5. Complete Pipeline

  A complex example combining filter, map, and slice:

  *Articles that are published, formatted as cards, limited to 2:*

  {{slot:example5}}

  {{slot:example5Code}}

  ---

  ## Chaining Best Practices

  1. **Filter early** — Reduce dataset size before transforming
  2. **Map to shape** — Transform items to the exact structure needed
  3. **Pipe for array ops** — Use \`.pipe()\` for slice, flatten, etc.
  4. **Use parent** — Access outer scope with \`Item().parent\` in nested loops

  ---

  {{slot:pagination}}
`),
  slots: {
    example1: [
      CollectionBlock({
        classes: 'govuk-!-margin-bottom-4',
        collection: Data('tableRows')
          .each(Iterator.Filter(Item().path('status').match(Condition.Equals('active'))))
          .each(
            Iterator.Map(Format('<li class="govuk-body">%1 &mdash; %2</li>', Item().path('name'), Item().path('role'))),
          ),
      }),
    ],
    example1Code: [
      GovUKDetails({
        summaryText: 'View code',
        content: [
          CodeBlock({
            language: 'typescript',
            code: `
              Data('tableRows')
                .each(Iterator.Filter(
                  Item().path('status').match(Condition.Equals('active'))
                ))
                .each(Iterator.Map(
                  Format(
                    '<li>%1 &mdash; %2</li>',
                    Item().path('name'),
                    Item().path('role')
                  )
                ))
            `,
          }),
        ],
      }),
    ],
    example2: [
      CollectionBlock({
        classes: 'govuk-!-margin-bottom-4',
        collection: Data('simpleListItems')
          .each(
            Iterator.Map(
              Format(
                '<span class="govuk-tag govuk-tag--blue govuk-!-margin-right-2 govuk-!-margin-bottom-2">%1</span>',
                Item().path('name'),
              ),
            ),
          )
          .pipe(Transformer.Array.Slice(0, 2)),
      }),
    ],
    example2Code: [
      GovUKDetails({
        summaryText: 'View code',
        content: [
          CodeBlock({
            language: 'typescript',
            code: `
              Data('simpleListItems')
                .each(Iterator.Map(
                  Format(
                    '<span class="govuk-tag govuk-tag--blue">%1</span>',
                    Item().path('name')
                  )
                ))
                .pipe(Transformer.Array.Slice(0, 2))
            `,
          }),
        ],
      }),
    ],
    example3: [
      CollectionBlock({
        classes: 'govuk-!-margin-bottom-4',
        collection: Data('categories').each(
          Iterator.Map(
            TemplateWrapper({
              template: `
                <div class="govuk-!-margin-bottom-4">
                  <h4 class="govuk-heading-s"><strong class="govuk-tag govuk-tag--{{color}}">{{name}}</strong></h4>
                  <ul class="govuk-list govuk-list--bullet">{{tasks}}</ul>
                </div>
              `,
              values: {
                color: Item().path('color'),
                name: Item().path('name'),
                tasks: Item()
                  .path('tasks')
                  .each(Iterator.Map(Format('<li>%1</li>', Item().path('name')))),
              },
            }),
          ),
        ),
      }),
    ],
    example3Code: [
      GovUKDetails({
        summaryText: 'View code',
        content: [
          CodeBlock({
            language: 'typescript',
            code: `
              Data('categories').each(Iterator.Map(
                TemplateWrapper({
                  template: \`
                    <div>
                      <h4><strong class="govuk-tag govuk-tag--{{color}}">{{name}}</strong></h4>
                      <ul>{{tasks}}</ul>
                    </div>
                  \`,
                  values: {
                    color: Item().path('color'),
                    name: Item().path('name'),
                    tasks: Item()
                      .path('tasks')
                      .each(Iterator.Map(Format('<li>%1</li>', Item().path('name')))),
                  },
                })
              ))
            `,
          }),
        ],
      }),
    ],
    example4: [
      HtmlBlock({
        hidden: Data('tasks')
          .each(Iterator.Find(Item().path('priority').match(Condition.Equals('high'))))
          .not.match(Condition.IsRequired()),
        content: `
          <div class="govuk-inset-text">
            <strong>High priority task found!</strong> Iterator.Find returned a matching item.
          </div>
        `,
      }),
    ],
    example4Code: [
      GovUKDetails({
        summaryText: 'View code',
        content: [
          CodeBlock({
            language: 'typescript',
            code: `
              // Show content only when a high priority task is found
              // (hidden when NOT found)
              HtmlBlock({
                hidden: Data('tasks')
                  .each(Iterator.Find(
                    Item().path('priority').match(Condition.Equals('high'))
                  ))
                  .not.match(Condition.IsRequired()),
                content: '<div class="govuk-inset-text">High priority task found!</div>',
              })
            `,
          }),
        ],
      }),
    ],
    example5: [
      CollectionBlock({
        classes: 'govuk-!-margin-bottom-4',
        collection: Data('articles')
          .each(Iterator.Filter(Item().path('status').match(Condition.Equals('published'))))
          .each(
            Iterator.Map(
              Format(
                `<div class="govuk-summary-card govuk-!-margin-bottom-3">
                  <div class="govuk-summary-card__title-wrapper">
                    <h3 class="govuk-summary-card__title">%1</h3>
                    <ul class="govuk-summary-card__actions">
                      <li class="govuk-summary-card__action">
                        <strong class="govuk-tag govuk-tag--green">Published</strong>
                      </li>
                    </ul>
                  </div>
                  <div class="govuk-summary-card__content">
                    <p class="govuk-body">%2</p>
                    <p class="govuk-body-s">%3 views</p>
                  </div>
                </div>`,
                Item().path('title'),
                Item().path('description'),
                Item().path('views'),
              ),
            ),
          )
          .pipe(Transformer.Array.Slice(0, 2)),
      }),
    ],
    example5Code: [
      GovUKDetails({
        summaryText: 'View code',
        content: [
          CodeBlock({
            language: 'typescript',
            code: `
              Data('articles')
                .each(Iterator.Filter(
                  Item().path('status').match(Condition.Equals('published'))
                ))
                .each(Iterator.Map(
                  Format(
                    \`<div class="govuk-summary-card">
                      <div class="govuk-summary-card__title-wrapper">
                        <h3>%1</h3>
                        <ul class="govuk-summary-card__actions">
                          <li><strong class="govuk-tag govuk-tag--green">Published</strong></li>
                        </ul>
                      </div>
                      <div class="govuk-summary-card__content">
                        <p>%2</p>
                        <p>%3 views</p>
                      </div>
                    </div>\`,
                    Item().path('title'),
                    Item().path('description'),
                    Item().path('views')
                  )
                ))
                .pipe(Transformer.Array.Slice(0, 2))
            `,
          }),
        ],
      }),
    ],
    pagination: [
      GovUKPagination({
        classes: 'govuk-pagination--inline',
        previous: {
          href: '/form-engine-developer-guide/iterators/playground/dynamic-fields',
          labelText: 'Dynamic Fields',
        },
        next: {
          href: '/form-engine-developer-guide/iterators/playground/hub',
          labelText: 'Hub-and-Spoke Demo',
        },
      }),
    ],
  },
})
