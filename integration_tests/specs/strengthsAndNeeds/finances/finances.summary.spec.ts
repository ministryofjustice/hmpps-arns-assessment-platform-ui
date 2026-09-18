import { expect } from '@playwright/test'
import FinancesPage from 'pages/strengthsAndNeeds/financesPage'
import { test, TargetService } from '../../../support/fixtures'

test.describe('Summary', () => {
  test('shows summary page', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId).withAnswers([
        { question: 'finance_income', value: ['CARERS_ALLOWANCE'] },
        { question: 'finance_bank_account', value: 'YES' },
        { question: 'finance_money_management', value: 'GOOD' },
        { question: 'finance_money_management_good_details', value: '' },
        { question: 'finance_gambling', value: ['YES_THEIR_GAMBLING'] },
        { question: 'finance_gambling_yes_their_gambling_details', value: '' },
        { question: 'finance_debt', value: ['NO'] },
        { question: 'finance_changes', value: 'NOT_PRESENT' },
      ]).save()

    await FinancesPage.navigateToFinances(page, handoverLink, baseURL, sanAssessmentId, 'finance-summary')

    const financesPage = await FinancesPage.verifyOnPage(page, 'Summary')

    await expect(financesPage.summary).toMatchAriaSnapshot(`
      - tabpanel "Summary":
        - term: Where does Test currently get their money from?
        - definition:
          - paragraph: Carer’s allowance
        - definition:
          - link "Change Where does Test currently get their money from?":
            - /url: finance#finance_income-question
        - term: Does Test have their own bank account?
        - definition:
          - paragraph: "Yes"
        - definition:
          - link "Change Does Test have their own bank account?":
            - /url: finance#finance_bank_account-question
        - term: How good is Test at managing their money?
        - definition:
          - paragraph: Able to manage their money well and is a strength
        - definition:
          - link "Change How good is Test at managing their money?":
            - /url: finance#finance_money_management-question
        - term: Is Test affected by gambling?
        - definition:
          - paragraph: Yes, their own gambling
        - definition:
          - link "Change Is Test affected by gambling?":
            - /url: finance#finance_gambling-question
        - term: Is Test affected by debt?
        - definition:
          - paragraph: "No"
        - definition:
          - link "Change Is Test affected by debt?":
            - /url: finance#finance_debt-question
        - term: Does Test want to make changes to their finances?
        - definition:
          - paragraph: Test is not present
        - definition:
          - link "Change Does Test want to make changes to their finances?":
            - /url: finance#finance_changes-question
        - button "Go to practitioner analysis"
    `)
  })

  test('practitioner analysis', async ({ baseURL, page, createSession, strengthsAndNeedsBuilder }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId).withAnswers([
        { question: 'finance_income', value: ['CARERS_ALLOWANCE'] },
        { question: 'finance_bank_account', value: 'YES' },
        { question: 'finance_money_management', value: 'GOOD' },
        { question: 'finance_money_management_good_details', value: '' },
        { question: 'finance_gambling', value: ['YES_THEIR_GAMBLING'] },
        { question: 'finance_gambling_yes_their_gambling_details', value: '' },
        { question: 'finance_debt', value: ['NO'] },
        { question: 'finance_changes', value: 'NOT_PRESENT' },
      ]).save()

    await FinancesPage.navigateToFinances(page, handoverLink, baseURL, sanAssessmentId, 'finance-summary')
    const financesPage = await FinancesPage.verifyOnPage(page, 'Summary')

    await financesPage.goToPractitionerAnalysis.click()
    await expect(page.getByText('Are there any strengths or protective factors')).toBeVisible()
  })

  test('mark complete', async ({ baseURL, page, createSession, strengthsAndNeedsBuilder }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId).withAnswers([
        { question: 'finance_income', value: ['CARERS_ALLOWANCE'] },
        { question: 'finance_bank_account', value: 'YES' },
        { question: 'finance_money_management', value: 'GOOD' },
        { question: 'finance_money_management_good_details', value: '' },
        { question: 'finance_gambling', value: ['YES_THEIR_GAMBLING'] },
        { question: 'finance_gambling_yes_their_gambling_details', value: '' },
        { question: 'finance_debt', value: ['NO'] },
        { question: 'finance_changes', value: 'NOT_PRESENT' },
        { question: 'finance_practitioner_analysis_strengths_or_protective_factors', value: 'NO' },
        { question: 'finance_practitioner_analysis_strengths_or_protective_factors_no_details', value: '' },
        { question: 'finance_practitioner_analysis_risk_of_serious_harm', value: 'NO' },
        { question: 'finance_practitioner_analysis_risk_of_serious_harm_no_details', value: '' },
      ]).save()

    await FinancesPage.navigateToFinances(
      page,
      handoverLink,
      baseURL,
      sanAssessmentId,
      'finance-summary#practitioner-analysis',
    )
    const financesPage = await FinancesPage.verifyOnPage(page, 'strengths or protective factors')

    await financesPage.linkedToRiskOfReoffending.click()
    await financesPage.markComplete.click()
    await expect(financesPage.complete).toBeVisible()
    expect(page.url()).toContain('finance-analysis')
  })
})
