import { HtmlBlock } from '@form-engine/registry/components/html'
import { CollectionBlock } from '@form-engine/registry/components/collectionBlock'
import { GovUKButton } from '@form-engine-govuk-components/components/button/govukButton'
import { block, Collection, Data, Format, Item } from '@form-engine/form/builders'

export const menuItemsHeading = block<HtmlBlock>({
  variant: 'html',
  content: `
    <h1 class="govuk-heading-l">Menu items</h1>
    <p class="govuk-body">Add the items you will be serving.</p>
    <p class="govuk-body">You must add at least one menu item to continue.</p>
  `,
})

export const menuItemsCollection = block<CollectionBlock>({
  variant: 'collection-block',
  collection: Collection({
    collection: Data('menuItems'),
    template: [
      block<HtmlBlock>({
        variant: 'html',
        content: Format(
          `
          <div class="govuk-summary-card">
            <div class="govuk-summary-card__title-wrapper">
              <h2 class="govuk-summary-card__title">%1</h2>
            </div>
            <div class="govuk-summary-card__content">
              <dl class="govuk-summary-list">
                <div class="govuk-summary-list__row">
                  <dt class="govuk-summary-list__key">Category</dt>
                  <dd class="govuk-summary-list__value">%2</dd>
                </div>
                <div class="govuk-summary-list__row">
                  <dt class="govuk-summary-list__key">Price</dt>
                  <dd class="govuk-summary-list__value">£%3</dd>
                </div>
                <div class="govuk-summary-list__row">
                  <dt class="govuk-summary-list__key">Description</dt>
                  <dd class="govuk-summary-list__value">%4</dd>
                </div>
              </dl>
              <p class="govuk-body">
                <a href="menu-items/%5/edit" class="govuk-link">Edit item</a>
              </p>
            </div>
          </div>
          `,
          Item().path('name'),
          Item().path('category'),
          Item().path('price'),
          Item().path('description'),
          Item().path('id'),
        ),
      }),
    ],
    fallback: [
      block<HtmlBlock>({
        variant: 'html',
        content: '<p class="govuk-body">No menu items added yet.</p>',
      }),
    ],
  }),
})

export const addMenuItemButton = block<HtmlBlock>({
  variant: 'html',
  content: `
    <p class="govuk-body">
      <a href="menu-items/new/edit" class="govuk-button govuk-button--secondary" role="button">
        Add a menu item
      </a>
    </p>
  `,
})

export const continueButton = block<GovUKButton>({
  variant: 'govukButton',
  text: 'Continue',
  name: 'action',
  value: 'continue',
})
