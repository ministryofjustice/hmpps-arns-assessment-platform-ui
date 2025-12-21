import { block, Format, Item, Data, Literal, Iterator } from '@form-engine/form/builders'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { CollectionBlock } from '@form-engine/registry/components/collectionBlock'
import { GovUKDetails, GovUKPagination } from '@form-engine-govuk-components/components'
import { Transformer } from '@form-engine/registry/transformers'
import { CodeBlock } from '../../../../components/code-block/codeBlock'
import { parseGovUKMarkdown } from '../../../../helpers/markdown'

/**
 * Iterators - Map
 *
 * Using Iterator.Map to transform each item to a new shape.
 */
export const pageContent = block<TemplateWrapper>({
  variant: 'templateWrapper',
  template: parseGovUKMarkdown(`
  # Iterator.Map

  \`Iterator.Map\` transforms each item in a collection to a new shape
  using a \`yield\` template. The template can contain \`Item()\`
  references that are resolved for each element. {.lead}

  ---

  ## Basic Syntax

  The map iterator takes an object with a \`yield\` property that defines
  the output shape for each item:

  {{slot:syntaxCode}}

  ---

  ## Live Example: Property Extraction

  Transform a list of team members into a simple name list:

  {{slot:propertyExtractionExample}}

  {{slot:propertyExtractionCode}}

  ---

  ## Live Example: Numbered List

  Transform items to include their position using \`Item().index()\`:

  {{slot:numberedListExample}}

  {{slot:numberedListCode}}

  ---

  ## Complex Transformations

  The yield template supports nested structures and computed values:

  {{slot:complexCode}}

  ---

  ## Using with Static Arrays

  For static arrays defined in your form, wrap them with \`Literal()\`:

  {{slot:literalCode}}

  ### Live Example with Literal()

  {{slot:literalExample}}

  {{slot:literalExampleCode}}

  ---

  {{slot:pagination}}
`),
  slots: {
    syntaxCode: [
      block<CodeBlock>({
        variant: 'codeBlock',
        language: 'typescript',
        code: `
          // Transform items to label/value pairs for a select input
          items: Data('countries').each(Iterator.Map({
            value: Item().path('code'),
            text: Item().path('name'),
          }))

          // Extract a single property from each item
          Data('users').each(Iterator.Map(Item().path('email')))
          // Result: ['alice@example.com', 'bob@example.com', ...]
        `,
      }),
    ],
    propertyExtractionExample: [
      block<CollectionBlock>({
        variant: 'collection-block',
        classes: 'govuk-!-margin-bottom-4',
        collection: Data('teamMembers').each(
          Iterator.Map(
            block<HtmlBlock>({
              variant: 'html',
              content: Format(
                '<p class="govuk-body govuk-!-margin-bottom-1">%1 - <em>%2</em></p>',
                Item().path('name'),
                Item().path('role'),
              ),
            }),
          ),
        ),
      }),
    ],
    propertyExtractionCode: [
      block<GovUKDetails>({
        variant: 'govukDetails',
        summaryText: 'View code',
        content: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `
              Data('teamMembers').each(Iterator.Map(
                block<HtmlBlock>({
                  variant: 'html',
                  content: Format('<p>%1 - <em>%2</em></p>', Item().path('name'), Item().path('role')),
                })
              ))
            `,
          }),
        ],
      }),
    ],
    numberedListExample: [
      block<CollectionBlock>({
        variant: 'collection-block',
        classes: 'govuk-!-margin-bottom-4',
        collection: Data('simpleListItems').each(
          Iterator.Map(
            block<HtmlBlock>({
              variant: 'html',
              content: Format(
                '<p class="govuk-body govuk-!-margin-bottom-1"><strong>%1.</strong> %2</p>',
                Item().index().pipe(Transformer.Number.Add(1)),
                Item().path('name'),
              ),
            }),
          ),
        ),
      }),
    ],
    numberedListCode: [
      block<GovUKDetails>({
        variant: 'govukDetails',
        summaryText: 'View code',
        content: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `
              Data('simpleListItems').each(Iterator.Map(
                block<HtmlBlock>({
                  variant: 'html',
                  content: Format('<p><strong>%1.</strong> %2</p>',
                    Item().index().pipe(Transformer.Number.Add(1)),
                    Item().path('name')
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
          // Transform with nested structures
          Data('orders').each(Iterator.Map({
            id: Item().path('orderId'),
            customer: {
              name: Item().path('customerName'),
              email: Item().path('customerEmail'),
            },
            total: Item().path('amount'),
          }))

          // Transform with Format() for computed values
          Data('users').each(Iterator.Map({
            value: Item().path('id'),
            text: Format('%1 (%2)', Item().path('name'), Item().path('email')),
          }))
        `,
      }),
    ],
    literalCode: [
      block<CodeBlock>({
        variant: 'codeBlock',
        language: 'typescript',
        code: `
          const areasOfNeed = [
            { slug: 'accommodation', value: 'area_accommodation', text: 'Accommodation' },
            { slug: 'finances', value: 'area_finances', text: 'Finances' },
            { slug: 'health', value: 'area_health', text: 'Health and wellbeing' },
          ]

          // Use Literal() to make static arrays iterable
          field<GovUKSelect>({
            variant: 'govukSelect',
            code: 'selectedArea',
            items: Literal(areasOfNeed).each(Iterator.Map({
              value: Item().path('value'),
              text: Item().path('text'),
            })),
          })
        `,
      }),
    ],
    literalExample: [
      block<CollectionBlock>({
        variant: 'collection-block',
        classes: 'govuk-!-margin-bottom-4',
        collection: Literal([
          { emoji: '🏠', name: 'Accommodation' },
          { emoji: '💰', name: 'Finance' },
          { emoji: '🏥', name: 'Health' },
          { emoji: '💼', name: 'Employment' },
        ]).each(
          Iterator.Map(
            block<HtmlBlock>({
              variant: 'html',
              content: Format(
                '<span class="govuk-tag govuk-!-margin-right-2 govuk-!-margin-bottom-2">%1 %2</span>',
                Item().path('emoji'),
                Item().path('name'),
              ),
            }),
          ),
        ),
      }),
    ],
    literalExampleCode: [
      block<GovUKDetails>({
        variant: 'govukDetails',
        summaryText: 'View code',
        content: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `
              Literal([
                { emoji: '🏠', name: 'Accommodation' },
                { emoji: '💰', name: 'Finance' },
                { emoji: '🏥', name: 'Health' },
                { emoji: '💼', name: 'Employment' },
              ]).each(Iterator.Map(
                block<HtmlBlock>({
                  variant: 'html',
                  content: Format('<span class="govuk-tag">%1 %2</span>',
                    Item().path('emoji'),
                    Item().path('name')
                  ),
                })
              ))
            `,
          }),
        ],
      }),
    ],
    pagination: [
      block<GovUKPagination>({
        variant: 'govukPagination',
        classes: 'govuk-pagination--inline',
        previous: {
          href: '/forms/form-engine-developer-guide/iterators/intro',
          labelText: 'Understanding Iterators',
        },
        next: {
          href: '/forms/form-engine-developer-guide/iterators/filter',
          labelText: 'Iterator.Filter',
        },
      }),
    ],
  },
})
