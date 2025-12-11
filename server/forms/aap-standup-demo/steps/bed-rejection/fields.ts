import { GovUKButton } from '@form-engine-govuk-components/components/button/govukButton'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { block } from '@form-engine/form/builders'

export const rejectionNotice = block<HtmlBlock>({
  variant: 'html',
  content: `
    <div class="govuk-panel govuk-panel--confirmation" style="background-color: #d4351c;">
      <h1 class="govuk-panel__title">Request Denied</h1>
      <div class="govuk-panel__body">
        You know that's not an option
      </div>
    </div>

    <p class="govuk-body">The SLT overlords will not allow it.</p>
    <p class="govuk-body">Your bed remains empty. The standup must go on.</p>
  `,
})

export const begrudgedButton = block<GovUKButton>({
  variant: 'govukButton',
  text: 'Fine... one more week till this is ready?!',
  name: 'action',
  value: 'continue',
})
