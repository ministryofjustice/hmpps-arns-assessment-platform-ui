import { HtmlBlock } from '@form-engine/registry/components/html'
import { GovUKTextInput } from '@form-engine-govuk-components/components/text-input/govukTextInput'
import { GovUKCharacterCount } from '@form-engine-govuk-components/components/character-count/govukCharacterCount'
import { GovUKRadioInput } from '@form-engine-govuk-components/components/radio-input/govukRadioInput'
import { GovUKCheckboxInput } from '@form-engine-govuk-components/components/checkbox-input/govukCheckboxInput'
import { GovUKButton } from '@form-engine-govuk-components/components/button/govukButton'
import { block, field, Params, Self, validation } from '@form-engine/form/builders'
import { when } from '@form-engine/form/builders/ConditionalExprBuilder'
import { Condition } from '@form-engine/registry/conditions'
import { Transformer } from '@form-engine/registry/transformers'

export const menuItemHeading = block<HtmlBlock>({
  variant: 'html',
  content: when(Params('itemId').match(Condition.Equals('new')))
    .then('<h1 class="govuk-heading-l">Add a menu item</h1>')
    .else('<h1 class="govuk-heading-l">Edit menu item</h1>'),
})

export const itemName = field<GovUKTextInput>({
  code: 'itemName',
  variant: 'govukTextInput',
  label: 'Item name',
  hint: 'The name of the dish or product',
  formatters: [Transformer.String.Trim()],
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Enter the item name',
    }),
    validation({
      when: Self().not.match(Condition.String.HasMaxLength(100)),
      message: 'Item name must be 100 characters or less',
    }),
  ],
})

export const itemDescription = field<GovUKCharacterCount>({
  code: 'itemDescription',
  variant: 'govukCharacterCount',
  label: 'Description',
  hint: 'A brief description of the item',
  maxLength: 500,
  formatters: [Transformer.String.Trim()],
  validate: [
    validation({
      when: Self().not.match(Condition.String.HasMaxLength(500)),
      message: 'Description must be 500 characters or less',
    }),
  ],
})

export const itemCategory = field<GovUKRadioInput>({
  code: 'itemCategory',
  variant: 'govukRadioInput',
  label: 'Category',
  hint: 'What type of item is this?',
  items: [
    { value: 'starter', text: 'Starter or appetizer' },
    { value: 'main', text: 'Main course' },
    { value: 'dessert', text: 'Dessert' },
    { value: 'drink', text: 'Drink' },
    { value: 'side', text: 'Side dish' },
    { value: 'snack', text: 'Snack' },
  ],
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Select a category',
    }),
  ],
})

export const itemPrice = field<GovUKTextInput>({
  code: 'itemPrice',
  variant: 'govukTextInput',
  label: 'Price',
  hint: 'Price in pounds (for example, 12.50)',
  classes: 'govuk-input--width-5',
  prefix: { text: '£' },
  inputMode: 'decimal',
  formatters: [Transformer.String.Trim()],
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Enter the price',
    }),
    validation({
      when: Self().not.match(Condition.String.MatchesRegex('^\\d+(\\.\\d{1,2})?$')),
      message: 'Enter a valid price (for example, 12.50)',
    }),
  ],
})

export const itemDietary = field<GovUKCheckboxInput>({
  code: 'itemDietary',
  variant: 'govukCheckboxInput',
  multiple: true,
  label: 'Dietary information (optional)',
  hint: 'Select all that apply to this item',
  items: [
    { value: 'vegetarian', text: 'Vegetarian' },
    { value: 'vegan', text: 'Vegan' },
    { value: 'gluten-free', text: 'Gluten free' },
    { value: 'dairy-free', text: 'Dairy free' },
  ],
})

export const itemAllergens = field<GovUKCheckboxInput>({
  code: 'itemAllergens',
  variant: 'govukCheckboxInput',
  multiple: true,
  label: 'Does this item contain any of the 14 major allergens?',
  hint: 'Select all allergens that this item contains',
  items: [
    { value: 'gluten', text: 'Cereals containing gluten' },
    { value: 'crustaceans', text: 'Crustaceans' },
    { value: 'eggs', text: 'Eggs' },
    { value: 'fish', text: 'Fish' },
    { value: 'peanuts', text: 'Peanuts' },
    { value: 'soybeans', text: 'Soybeans' },
    { value: 'milk', text: 'Milk' },
    { value: 'nuts', text: 'Nuts' },
    { value: 'celery', text: 'Celery' },
    { value: 'mustard', text: 'Mustard' },
    { value: 'sesame', text: 'Sesame seeds' },
    { value: 'sulphites', text: 'Sulphur dioxide and sulphites' },
    { value: 'lupin', text: 'Lupin' },
    { value: 'molluscs', text: 'Molluscs' },
    { value: 'none', text: 'None of these allergens', behaviour: 'exclusive' },
  ],
})

export const saveButton = block<GovUKButton>({
  variant: 'govukButton',
  text: 'Save',
  name: 'action',
  value: 'save',
})

export const saveAndAddAnotherButton = block<GovUKButton>({
  variant: 'govukButton',
  text: 'Save and add another',
  name: 'action',
  value: 'saveAndAdd',
  classes: 'govuk-button--secondary',
})
