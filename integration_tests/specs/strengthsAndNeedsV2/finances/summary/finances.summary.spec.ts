import { expect } from '@playwright/test'
import { CommonOption } from '@server/forms/strengths-and-needs/versions/v2.0/constants/commonOption'
import { Option } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/finance/constants/option'
import { Question } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/finance/constants/question'
import { Step } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/finance/constants/step'
import FinancesPage from 'pages/strengthsAndNeedsV2/financesPage'
import { test, TargetService } from '../../../../support/fixtures'

const walkToFinanceSummary = async (
  page: Parameters<typeof FinancesPage.navigateTo>[0],
  handoverLink: string,
  baseURL: string,
  sanAssessmentId: string,
  hasFinancialConcerns: boolean,
): Promise<FinancesPage> => {
  await FinancesPage.navigateTo(page, handoverLink, baseURL, sanAssessmentId)
  const financesPage = new FinancesPage(page)

  await financesPage.questions.finance_income.option(Option.carers_allowance).check()
  await financesPage.saveAndContinue.click()
  await expect(page).toHaveURL(new RegExp(Step.finance_concerns.path))

  await financesPage.questions.finance_concerns
    .option(hasFinancialConcerns ? CommonOption.yes : CommonOption.no)
    .check()
  await financesPage.saveAndContinue.click()

  if (hasFinancialConcerns) {
    await expect(page).toHaveURL(new RegExp(Step.finance_money_management.path))
    await financesPage.questions.finance_money_management.option(Option.good).check()
    await financesPage.questions.finance_debt.option(CommonOption.no).check()
    await financesPage.saveAndContinue.click()
    await expect(page).toHaveURL(new RegExp(Step.finance_changes.path))
    await financesPage.questions.finance_changes.option(CommonOption.not_present).check()
    await financesPage.saveAndContinue.click()
  }

  await expect(page).toHaveURL(new RegExp(Step.finance_summary.path))
  return financesPage
}

test.describe('Summary', () => {
  test('shows summary page (no financial concerns)', async ({
    page,
    createSession,
    strengthsAndNeedsBuilder,
    baseURL,
  }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder.fresh().save()

    const financesPage = await walkToFinanceSummary(page, handoverLink, baseURL, sanAssessmentId, false)

    await expect(financesPage.summary).toMatchAriaSnapshot(`
      - tabpanel "Summary":
        - term: Where does Test currently get their money from?
        - definition:
          - paragraph: Carer’s allowance
        - definition:
          - link "Change Where does Test currently get their money from?":
            - /url: ${Step.finance_income.path}#${Question.finance_income}-question
        - term: Does Test have any financial issues or worries?
        - definition:
          - paragraph: "No"
        - definition:
          - link "Change Does Test have any financial issues or worries?":
            - /url: ${Step.finance_concerns.path}#${Question.finance_concerns}-question
        - button "Mark as complete"
    `)
    await page.getByRole('tab', { name: 'Practitioner analysis' }).click()
    await expect(page.getByText('Practitioner analysis not required')).toBeVisible()
    await expect(page.getByText('Are there any strengths or protective factors')).not.toBeVisible()
    await page.getByRole('tab', { name: 'Summary' }).click()

    await page.getByRole('button', { name: 'Mark as complete' }).click()
    await expect(page).toHaveURL(new RegExp(Step.finance_analysis.path))
    await expect(financesPage.alert).not.toBeVisible()
  })

  test('shows summary page (with financial concerns, no debt)', async ({
    page,
    createSession,
    strengthsAndNeedsBuilder,
    baseURL,
  }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder.fresh().save()

    const financesPage = await walkToFinanceSummary(page, handoverLink, baseURL, sanAssessmentId, true)

    await expect(financesPage.summary).toMatchAriaSnapshot(`
      - tabpanel "Summary":
        - term: Where does Test currently get their money from?
        - definition:
          - paragraph: Carer’s allowance
        - definition:
          - link "Change Where does Test currently get their money from?":
            - /url: ${Step.finance_income.path}#${Question.finance_income}-question
        - term: Does Test have any financial issues or worries?
        - definition:
          - paragraph: "Yes"
        - definition:
          - link "Change Does Test have any financial issues or worries?":
            - /url: ${Step.finance_concerns.path}#${Question.finance_concerns}-question
        - term: How good is Test at managing their money?
        - definition:
          - paragraph: Able to manage their money well and is a strength
        - definition:
          - link "Change How good is Test at managing their money?":
            - /url: ${Step.finance_money_management.path}#${Question.finance_money_management}-question
        - term: Is Test affected by debt?
        - definition:
          - paragraph: "No"
        - definition:
          - link "Change Is Test affected by debt?":
            - /url: ${Step.finance_money_management.path}#${Question.finance_debt}-question
        - term: Does Test want to make changes to their finances?
        - definition:
          - paragraph: Test is not present
        - definition:
          - link "Change Does Test want to make changes to their finances?":
            - /url: ${Step.finance_changes.path}#${Question.finance_changes}-question
        - button "Go to practitioner analysis"
    `)
  })

  test('practitioner analysis', async ({ baseURL, page, createSession, strengthsAndNeedsBuilder }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder.fresh().save()

    const financesPage = await walkToFinanceSummary(page, handoverLink, baseURL, sanAssessmentId, true)
    await financesPage.goToPractitionerAnalysis.click()
    await expect(page.getByText('Are there any strengths or protective factors')).toBeVisible()
  })

  test('mark complete', async ({ baseURL, page, createSession, strengthsAndNeedsBuilder }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder.fresh().save()

    const financesPage = await walkToFinanceSummary(page, handoverLink, baseURL, sanAssessmentId, true)
    await financesPage.goToPractitionerAnalysis.click()

    await financesPage.questions.finance_practitioner_analysis_strengths_or_protective_factors
      .option(CommonOption.no)
      .check()
    await financesPage.questions.finance_practitioner_analysis_risk_of_serious_harm.option(CommonOption.no).check()
    await financesPage.questions.finance_practitioner_analysis_risk_of_reoffending.option(CommonOption.no).check()

    await financesPage.markComplete.click()
    await expect(financesPage.complete).toBeVisible()
    expect(page.url()).toContain('finance-analysis')
  })
})
