import { GovUKTextInput } from '@form-engine-govuk-components/components/text-input/govukTextInput'
import { GovUKCharacterCount } from '@form-engine-govuk-components/components/character-count/govukCharacterCount'
import { GovUKButton } from '@form-engine-govuk-components/components/button/govukButton'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { block, field, Self, validation } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { Transformer } from '@form-engine/registry/transformers'

export const businessName = field<GovUKTextInput>({
  code: 'businessName',
  variant: 'govukTextInput',
  label: 'Business name',
  hint: 'The registered name of your business',
  formatters: [Transformer.String.Trim(), Transformer.String.ToTitleCase()],
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Enter your business name',
    }),
    validation({
      when: Self().not.match(Condition.String.HasMinLength(2)),
      message: 'Business name must be at least 2 characters',
    }),
    validation({
      when: Self().not.match(Condition.String.HasMaxLength(100)),
      message: 'Business name must be 100 characters or less',
    }),
    validation({
      when: Self().not.match(Condition.String.LettersWithCommonPunctuation()),
      message: 'Business name can only include letters, spaces, and common punctuation',
    }),
  ],
})

export const businessDescription = field<GovUKCharacterCount>({
  code: 'businessDescription',
  variant: 'govukCharacterCount',
  label: 'Describe your business',
  hint: 'A brief description of the food you prepare and serve',
  maxLength: 500,
  formatters: [Transformer.String.Trim()],
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Enter a description of your business',
    }),
    validation({
      when: Self().not.match(Condition.String.HasMaxLength(500)),
      message: 'Description must be 500 characters or less',
    }),
  ],
})

export const businessAddressHeading = block<HtmlBlock>({
  variant: 'html',
  content: '<h2 class="govuk-heading-m">Business address</h2>',
})

export const postcode = field<GovUKTextInput>({
  code: 'postcode',
  variant: 'govukTextInput',
  label: 'Postcode',
  hint: "We'll use this to find your address",
  classes: 'govuk-input--width-10',
  autocomplete: 'postal-code',
  formatters: [Transformer.String.Trim(), Transformer.String.ToUpperCase()],
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Enter your postcode',
    }),
    validation({
      when: Self().not.match(Condition.Address.IsValidPostcode()),
      message: 'Enter a valid UK postcode',
    }),
  ],
})

export const findAddressButton = block<GovUKButton>({
  variant: 'govukButton',
  text: 'Find address',
  name: 'action',
  value: 'lookup',
  classes: 'govuk-button--secondary',
})

export const addressLine1 = field<GovUKTextInput>({
  code: 'addressLine1',
  variant: 'govukTextInput',
  label: 'Address line 1',
  autocomplete: 'address-line1',
  formatters: [Transformer.String.Trim()],
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Enter address line 1',
    }),
  ],
})

export const addressLine2 = field<GovUKTextInput>({
  code: 'addressLine2',
  variant: 'govukTextInput',
  label: 'Address line 2 (optional)',
  autocomplete: 'address-line2',
  formatters: [Transformer.String.Trim()],
})

export const town = field<GovUKTextInput>({
  code: 'town',
  variant: 'govukTextInput',
  label: 'Town or city',
  classes: 'govuk-input--width-20',
  autocomplete: 'address-level2',
  formatters: [Transformer.String.Trim(), Transformer.String.ToTitleCase()],
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Enter town or city',
    }),
  ],
})

export const county = field<GovUKTextInput>({
  code: 'county',
  variant: 'govukTextInput',
  label: 'County (optional)',
  classes: 'govuk-input--width-20',
  autocomplete: 'address-level1',
  formatters: [Transformer.String.Trim(), Transformer.String.ToTitleCase()],
})

export const contactDetailsHeading = block<HtmlBlock>({
  variant: 'html',
  content: '<h2 class="govuk-heading-m">Contact details</h2>',
})

export const contactPhone = field<GovUKTextInput>({
  code: 'contactPhone',
  variant: 'govukTextInput',
  label: 'Phone number',
  hint: 'UK phone number for the business',
  classes: 'govuk-input--width-20',
  inputType: 'tel',
  autocomplete: 'tel',
  formatters: [Transformer.String.Trim()],
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Enter a phone number',
    }),
    validation({
      when: Self().not.match(Condition.Phone.IsValidPhoneNumber()),
      message: 'Enter a valid UK phone number',
    }),
  ],
})

export const contactEmail = field<GovUKTextInput>({
  code: 'contactEmail',
  variant: 'govukTextInput',
  label: 'Email address',
  hint: "We'll use this to send confirmation",
  classes: 'govuk-input--width-20',
  inputType: 'email',
  autocomplete: 'email',
  formatters: [Transformer.String.Trim(), Transformer.String.ToLowerCase()],
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Enter an email address',
    }),
    validation({
      when: Self().not.match(Condition.Email.IsValidEmail()),
      message: 'Enter a valid email address',
    }),
  ],
})

export const saveAndContinueButton = block<GovUKButton>({
  variant: 'govukButton',
  text: 'Save and continue',
  name: 'action',
  value: 'continue',
})
