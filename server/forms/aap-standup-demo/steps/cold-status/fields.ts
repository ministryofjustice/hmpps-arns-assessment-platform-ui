import { GovUKRadioInput } from '@form-engine-govuk-components/components/radio-input/govukRadioInput'
import { GovUKButton } from '@form-engine-govuk-components/components/button/govukButton'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { block, field, Self, validation } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { coldDecisionOptions } from '../../options'

export const coldNotice = block<HtmlBlock>({
  variant: 'html',
  content: `
    <div class="govuk-warning-text">
      <span class="govuk-warning-text__icon" aria-hidden="true">!</span>
      <strong class="govuk-warning-text__text">
        <span class="govuk-visually-hidden">Warning</span>
        The presenter has lost their voice due to a cold. </br>
        Also I built this form using AI in like 20 mins
      </strong>
    </div>
  `,
})

export const coldDecision = field<GovUKRadioInput>({
  code: 'coldDecision',
  variant: 'govukRadioInput',
  label: 'How should we proceed with this standup?',
  hint: 'Select the most appropriate course of action',
  items: coldDecisionOptions,
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Select how to proceed (there is only one correct answer)',
    }),
  ],
})

export const continueButton = block<GovUKButton>({
  variant: 'govukButton',
  text: 'Accept your fate',
  name: 'action',
  value: 'continue',
})
