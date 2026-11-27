import { expect } from '@playwright/test'
import { CommonOption } from '@server/forms/strengths-and-needs/versions/v2.0/constants/commonOption'
import { Option } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/finance/constants/option'
import { Step } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/finance/constants/step'
import FinancesPage from '../../../pages/strengthsAndNeedsV2/financesPage'
import { test, TargetService } from '../../../support/fixtures'

test.describe('Redirection', () => {
  test('continues to money management when financial concerns are answered Yes', async ({
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
    await expect(page).toHaveURL(new RegExp(Step.finance_concerns.path))

    await financesPage.questions.finance_concerns.option(CommonOption.yes).check()
    await financesPage.saveAndContinue.click()

    await expect(page).toHaveURL(new RegExp(Step.finance_money_management.path))
  })

  test('ends the question flow when financial concerns are answered No', async ({
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
    await expect(page).toHaveURL(new RegExp(Step.finance_concerns.path))

    await financesPage.questions.finance_concerns.option(CommonOption.no).check()
    await financesPage.saveAndContinue.click()

    await expect(page).toHaveURL(new RegExp(Step.finance_summary.path))
    await expect(page.getByText('How good is Test at managing their money?')).not.toBeVisible()
    await page.getByRole('tab', { name: 'Practitioner analysis' }).click()
    await expect(page.getByText('Practitioner analysis not required')).toBeVisible()
    await expect(page.getByText('Are there any strengths or protective factors')).not.toBeVisible()
  })
})
