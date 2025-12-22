import { block, Format, Item, Data, Iterator, and, when } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { CollectionBlock } from '@form-engine/registry/components/collectionBlock'
import { GovUKDetails, GovUKPagination } from '@form-engine-govuk-components/components'
import { CodeBlock } from '../../../../components/code-block/codeBlock'
import { parseGovUKMarkdown } from '../../../../helpers/markdown'

/**
 * Iterators - Filter
 *
 * Using Iterator.Filter to keep only items matching a predicate.
 */
export const pageContent = block<TemplateWrapper>({
  variant: 'templateWrapper',
  template: parseGovUKMarkdown(`
  # Iterator.Filter

  \`Iterator.Filter\` keeps only the items where the predicate evaluates to true.
  It returns an array of the original items that passed the filter —
  unlike \`Iterator.Map\`, it doesn't transform them. {.lead}

  ---

  ## Basic Syntax

  Pass a predicate expression using \`Item()\` references:

  {{slot:syntaxCode}}

  ---

  ## Live Example: Filter by Status

  Show only active team members from the table data:

  {{slot:filterStatusExample}}

  {{slot:filterStatusCode}}

  ---

  ## Live Example: Exclude Items

  Show all tasks except completed ones using \`.not.match()\`:

  {{slot:excludeExample}}

  {{slot:excludeCode}}

  ---

  ## Complex Predicates

  Combine multiple conditions using \`and()\`, \`or()\`, and \`xor()\`:

  {{slot:complexCode}}

  ### Live Example: Combined Conditions

  Show only high priority, non-completed tasks:

  {{slot:combinedExample}}

  {{slot:combinedCode}}

  ---

  ## Chaining Multiple Filters

  You can chain multiple filter operations. Each filter operates on the result
  of the previous one:

  {{slot:chainingCode}}

  ---

  {{slot:pagination}}
`),
  slots: {
    syntaxCode: [
      block<CodeBlock>({
        variant: 'codeBlock',
        language: 'typescript',
        code: `
          // Keep only active users
          Data('users').each(Iterator.Filter(
            Item().path('active').match(Condition.IsTrue())
          ))

          // Exclude items matching a value (using .not)
          Data('areas').each(Iterator.Filter(
            Item().path('slug').not.match(Condition.Equals(Params('currentArea')))
          ))
        `,
      }),
    ],
    filterStatusExample: [
      block<CollectionBlock>({
        variant: 'collection-block',
        classes: 'govuk-!-margin-bottom-4',
        collection: Data('tableRows')
          .each(Iterator.Filter(Item().path('status').match(Condition.Equals('active'))))
          .each(
            Iterator.Map(
              block<HtmlBlock>({
                variant: 'html',
                content: Format(
                  '<p class="govuk-body govuk-!-margin-bottom-1"><strong class="govuk-tag govuk-tag--green govuk-!-margin-right-2">Active</strong> %1 (%2)</p>',
                  Item().path('name'),
                  Item().path('role'),
                ),
              }),
            ),
          ),
      }),
    ],
    filterStatusCode: [
      block<GovUKDetails>({
        variant: 'govukDetails',
        summaryText: 'View code',
        content: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `
              Data('tableRows')
                .each(Iterator.Filter(Item().path('status').match(Condition.Equals('active'))))
                .each(Iterator.Map(
                  block<HtmlBlock>({
                    variant: 'html',
                    content: Format('<p><strong class="govuk-tag govuk-tag--green">Active</strong> %1 (%2)</p>',
                      Item().path('name'),
                      Item().path('role')
                    ),
                  })
                ))
            `,
          }),
        ],
      }),
    ],
    excludeExample: [
      block<CollectionBlock>({
        variant: 'collection-block',
        classes: 'govuk-!-margin-bottom-4',
        collection: Data('tasks')
          .each(Iterator.Filter(Item().path('status').not.match(Condition.Equals('completed'))))
          .each(
            Iterator.Map(
              block<HtmlBlock>({
                variant: 'html',
                content: Format(
                  '<p class="govuk-body govuk-!-margin-bottom-1">%1 %2</p>',
                  when(Item().path('status').match(Condition.Equals('in_progress')))
                    .then('<strong class="govuk-tag govuk-tag--blue">In Progress</strong>')
                    .else('<strong class="govuk-tag govuk-tag--grey">Pending</strong>'),
                  Item().path('task'),
                ),
              }),
            ),
          ),
      }),
    ],
    excludeCode: [
      block<GovUKDetails>({
        variant: 'govukDetails',
        summaryText: 'View code',
        content: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `
              Data('tasks')
                .each(Iterator.Filter(Item().path('status').not.match(Condition.Equals('completed'))))
                .each(Iterator.Map(
                  block<HtmlBlock>({
                    variant: 'html',
                    content: Format('<p>%1 %2</p>',
                      when(Item().path('status').match(Condition.Equals('in_progress')))
                        .then('<strong class="govuk-tag govuk-tag--blue">In Progress</strong>')
                        .else('<strong class="govuk-tag govuk-tag--grey">Pending</strong>'),
                      Item().path('task')
                    ),
                  })
                ))
            `,
          }),
        ],
      }),
    ],
    complexCode: [
      block<CodeBlock>({
        variant: 'codeBlock',
        language: 'typescript',
        code: `
          // Multiple conditions with and()
          Data('products').each(Iterator.Filter(
            and(
              Item().path('inStock').match(Condition.IsTrue()),
              Item().path('price').match(Condition.LessThan(100))
            )
          ))

          // Multiple conditions with or()
          Data('users').each(Iterator.Filter(
            or(
              Item().path('role').match(Condition.Equals('admin')),
              Item().path('role').match(Condition.Equals('moderator'))
            )
          ))
        `,
      }),
    ],
    combinedExample: [
      block<CollectionBlock>({
        variant: 'collection-block',
        classes: 'govuk-!-margin-bottom-4',
        collection: Data('tasks')
          .each(
            Iterator.Filter(
              and(
                Item().path('priority').match(Condition.Equals('high')),
                Item().path('status').not.match(Condition.Equals('completed')),
              ),
            ),
          )
          .each(
            Iterator.Map(
              block<HtmlBlock>({
                variant: 'html',
                content: Format(
                  '<p class="govuk-body govuk-!-margin-bottom-1"><strong class="govuk-tag govuk-tag--red govuk-!-margin-right-2">High Priority</strong> %1</p>',
                  Item().path('task'),
                ),
              }),
            ),
          ),
      }),
    ],
    combinedCode: [
      block<GovUKDetails>({
        variant: 'govukDetails',
        summaryText: 'View code',
        content: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `
              Data('tasks')
                .each(Iterator.Filter(
                  and(
                    Item().path('priority').match(Condition.Equals('high')),
                    Item().path('status').not.match(Condition.Equals('completed'))
                  )
                ))
                .each(Iterator.Map(
                  block<HtmlBlock>({
                    variant: 'html',
                    content: Format('<p><strong class="govuk-tag govuk-tag--red">High Priority</strong> %1</p>',
                      Item().path('task')
                    ),
                  })
                ))
            `,
          }),
        ],
      }),
    ],
    chainingCode: [
      block<CodeBlock>({
        variant: 'codeBlock',
        language: 'typescript',
        code: `
          // Apply multiple filter conditions in sequence
          Data('products')
            .each(Iterator.Filter(Item().path('available').match(Condition.IsTrue())))
            .each(Iterator.Filter(Item().path('category').match(Condition.Equals('electronics'))))
            .each(Iterator.Filter(Item().path('price').match(Condition.LessThan(500))))

          // This is equivalent to using and() but more readable for complex logic
          // and allows you to add/remove filters easily
        `,
      }),
    ],
    pagination: [
      block<GovUKPagination>({
        variant: 'govukPagination',
        classes: 'govuk-pagination--inline',
        previous: {
          href: '/forms/form-engine-developer-guide/iterators/map',
          labelText: 'Iterator.Map',
        },
        next: {
          href: '/forms/form-engine-developer-guide/iterators/find',
          labelText: 'Iterator.Find',
        },
      }),
    ],
  },
})
