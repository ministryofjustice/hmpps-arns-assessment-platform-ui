import { Option } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/finance/constants/option'
import FinancesPage from 'pages/strengthsAndNeedsV2/financesPage'
import { test, TargetService } from '../../../support/fixtures'
import { checkAccessibility } from '../sanUtils'

test.describe('Accessibility', () => {
  test('finance-income page should be accessible', async ({
    page,
    createSession,
    strengthsAndNeedsBuilder,
    baseURL,
  }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder.fresh().save()

    await FinancesPage.navigateTo(page, handoverLink, baseURL, sanAssessmentId)
    await checkAccessibility(page, {
      // https://github.com/alphagov/govuk-design-system-backlog/issues/59#issuecomment-2854891330
      disableRules: ['aria-allowed-attr'],
    })
  })

  test('finance-concerns page should be accessible', async ({
    page,
    createSession,
    strengthsAndNeedsBuilder,
    baseURL,
  }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder.fresh().save()

    await FinancesPage.navigateTo(page, handoverLink, baseURL, sanAssessmentId)
    const financesPage = new FinancesPage(page)
    await financesPage.questions.finance_income.option(Option.employment).check()
    await financesPage.saveAndContinue.click()
    await checkAccessibility(page, {
      disableRules: ['aria-allowed-attr'],
    })
  })

  test('community-finance-income-friends-family page should be accessible', async ({
    page,
    createSession,
    strengthsAndNeedsBuilder,
    baseURL,
  }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder.fresh().save()

    await FinancesPage.navigateTo(page, handoverLink, baseURL, sanAssessmentId)
    const financesPage = new FinancesPage(page)
    await financesPage.questions.finance_income.option(Option.family_or_friends).check()
    await financesPage.saveAndContinue.click()
    await checkAccessibility(page, {
      disableRules: ['aria-allowed-attr'],
    })
  })
})
