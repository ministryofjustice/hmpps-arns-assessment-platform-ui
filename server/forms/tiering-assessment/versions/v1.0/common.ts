import { Condition, Conditional, Query, redirect } from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKButton } from '@ministryofjustice/hmpps-forge/govuk-components'

const checkYourAnswersQuery = Query('returnTo').match(Condition.Equals('check-your-answers'))

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
