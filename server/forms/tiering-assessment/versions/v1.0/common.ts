import { Condition, Conditional, Query, redirect } from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKButton } from '@ministryofjustice/hmpps-forge/govuk-components'
import { HtmlBlock } from '@ministryofjustice/hmpps-forge/core/components'

export const checkYourAnswersQuery = Query('returnTo').match(Condition.Equals('check-your-answers'))
export const returnToAnswersQueryText = '?returnTo=check-your-answers'

export const redirectToCheckYourAnswers = redirect({
  when: checkYourAnswersQuery,
  goto: 'check-your-answers',
})

export const continueButton = GovUKButton({
  text: Conditional({
    when: checkYourAnswersQuery,
    then: 'Check your answers',
    else: 'Save and continue',
  }),
})

export const backToTopLink = HtmlBlock({
  content: `
    <p class="govuk-body js-back-to-top govuk-!-display-none-print">
      <a href="#" class="govuk-link" data-ai-id="back-to-top">↑ Back to top</a>
    </p>
  `,
})
