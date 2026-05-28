import { block } from '@ministryofjustice/hmpps-forge/core/authoring'
import { HtmlBlock } from '@ministryofjustice/hmpps-forge/core/components'
import config from '../../../../config'

export const warningContent = block<HtmlBlock>({
  variant: 'html',
  content: `
    <div class="govuk-grid-column-two-thirds">
      <h1 class="govuk-heading-l govuk-!-margin-top-6">You need to use OASys to access this plan</h1>
      <p class="govuk-body">This is because it is a merged case.</p>
      <p class="govuk-body">
        <a href="${config.oasysUrl}" class="govuk-link">Go to OASys to access the sentence plan.</a>
      </p>
    </div>
  `,
})
