import { HtmlBlock } from '@form-engine/registry/components/html'
import { CollectionBlock } from '@form-engine/registry/components/collectionBlock'
import { GovUKButton } from '@form-engine-govuk-components/components/button/govukButton'
import { block, Collection, Data, Format, Item } from '@form-engine/form/builders'

export const menuByCategoryHeading = block<HtmlBlock>({
  variant: 'html',
  content: `
    <h1 class="govuk-heading-l">Menu by Category</h1>
    <p class="govuk-body">This demonstrates a nested collection - categories containing items.</p>
  `,
})

/**
 * Nested collection demonstration:
 * - Outer collection iterates over categories (Data('menuByCategory'))
 * - Inner collection iterates over items within each category (Item().path('items'))
 */
export const menuByCategoryCollection = block<CollectionBlock>({
  variant: 'collection-block',
  collection: Collection({
    // Outer collection: categories
    collection: Data('menuByCategory'),
    template: [
      // Category header with name and description
      block<HtmlBlock>({
        variant: 'html',
        content: Format(
          `
          <div class="govuk-summary-card">
            <div class="govuk-summary-card__title-wrapper">
              <h2 class="govuk-summary-card__title">%1</h2>
            </div>
            <div class="govuk-summary-card__content">
              <p class="govuk-body-s govuk-!-margin-bottom-2">%2</p>
          `,
          Item().path('name'),
          Item().path('description'),
        ),
      }),

      // Inner collection: items within category
      // Uses Item().parent to access the outer category scope
      block<CollectionBlock>({
        variant: 'collection-block',
        collection: Collection({
          collection: Item().path('items'),
          template: [
            block<HtmlBlock>({
              variant: 'html',
              content: Format(
                `
                <div class="govuk-summary-list__row">
                  <dt class="govuk-summary-list__key">%1</dt>
                  <dd class="govuk-summary-list__value">£%2</dd>
                  <dd class="govuk-summary-list__actions">
                    <span class="govuk-tag govuk-tag--grey">%3</span>
                  </dd>
                </div>
                `,
                Item().path('name'),
                Item().path('price'),
                // Access parent scope (category) from within item iteration
                Item().parent.path('name'),
              ),
            }),
          ],
          fallback: [
            block<HtmlBlock>({
              variant: 'html',
              content: '<p class="govuk-body-s">No items in this category.</p>',
            }),
          ],
        }),
      }),

      // Close the category card
      block<HtmlBlock>({
        variant: 'html',
        content: `
            </div>
          </div>
        `,
      }),
    ],
    fallback: [
      block<HtmlBlock>({
        variant: 'html',
        content: '<p class="govuk-body">No categories defined.</p>',
      }),
    ],
  }),
})

export const continueButton = block<GovUKButton>({
  variant: 'govukButton',
  text: 'Continue',
  name: 'action',
  value: 'continue',
})
