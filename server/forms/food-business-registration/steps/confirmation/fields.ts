import { HtmlBlock } from '@form-engine/registry/components/html'
import { block } from '@form-engine/form/builders'

export const confirmationPanel = block<HtmlBlock>({
  variant: 'html',
  content: `
    <div class="govuk-panel govuk-panel--confirmation">
      <h1 class="govuk-panel__title">Registration complete</h1>
      <div class="govuk-panel__body">
        Your food business registration has been submitted
      </div>
    </div>

    <h2 class="govuk-heading-m">What happens next</h2>
    <p class="govuk-body">We've sent you a confirmation email.</p>
    <p class="govuk-body">Your local authority will contact you to arrange a food hygiene inspection.</p>
    <p class="govuk-body">This usually happens within 28 days of registration.</p>

    <h2 class="govuk-heading-m">Your registration details</h2>
    <dl class="govuk-summary-list">
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">Business name</dt>
        <dd class="govuk-summary-list__value" id="confirm-business-name"></dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">Email address</dt>
        <dd class="govuk-summary-list__value" id="confirm-email"></dd>
      </div>
    </dl>
  `,
})
