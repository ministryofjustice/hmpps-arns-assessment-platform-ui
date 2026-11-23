import { expect } from '@playwright/test'
import { CommonOption } from '@server/forms/strengths-and-needs/versions/v2.0/constants/commonOption'
import { Option } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/finance/constants/option'
import { Question } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/finance/constants/question'
import { Step } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/finance/constants/step'
import { test, TargetService } from '../../../support/fixtures'
import { buildPageTitle, sanPageTitles } from '../sanUtils'
import FinancesPage from '../../../pages/strengthsAndNeedsV2/financesPage'

test.describe('Questions', () => {
  test('shows finance income page', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder.fresh().save()

    await FinancesPage.navigateTo(page, handoverLink, baseURL, sanAssessmentId)

    const financesPage = await FinancesPage.verifyOnPage(page, 'currently get their money')

    await expect(page).toHaveTitle(buildPageTitle(sanPageTitles.finances))

    await expect(financesPage.mainForm).toMatchAriaSnapshot(`
      - group "Where does Test currently get their money from?":
        - text: Where does Test currently get their money from? Select all that apply.
        - checkbox "Carer’s allowance"
        - text: Carer’s allowance
        - checkbox "Disability benefits"
        - text: Disability benefits For example, Personal Independence Payment (PIP) (also known as Disability Living Allowance) or Severe Disablement Allowance.
        - checkbox "Employment"
        - text: Employment
        - checkbox "Family or friends"
        - text: Family or friends
        - checkbox "Offending"
        - text: Offending
        - checkbox "Pension"
        - text: Pension
        - checkbox "Student loan"
        - text: Student loan
        - checkbox "Undeclared (includes cash in hand)"
        - text: Undeclared (includes cash in hand)
        - checkbox "Work related benefits"
        - text: Work related benefits For example, Universal Credit or Jobseeker’s Allowance (JSA).
        - checkbox "Other"
        - text: Other
        - checkbox "Unknown"
        - text: Unknown or
        - checkbox "No money"
        - text: No money
      - button "Save and continue"
    `)
  })

  test('shows finance concerns page (financial issues or worries)', async ({
    page,
    createSession,
    strengthsAndNeedsBuilder,
    baseURL,
  }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId)
      .withAnswers([
        { question: Question.finance_income, value: [Option.employment] },
        { question: Question.finance_concerns, value: CommonOption.yes },
      ])
      .withUserSubmittedSteps([Step.finance_income.code, Step.finance_concerns.code])
      .save()

    await FinancesPage.navigateTo(page, handoverLink, baseURL, sanAssessmentId, 'finance-concerns')

    const financesPage = await FinancesPage.verifyOnPage(page, 'financial issues or worries')

    await expect(page).toHaveTitle(buildPageTitle(sanPageTitles.finances))

    await expect(financesPage.mainForm).toMatchAriaSnapshot(`
      - group "Does Test have any financial issues or worries?":
        - radio "Yes"
        - text: "Yes"
        - radio "No"
        - text: "No"
      - button "Save and continue"
    `)
  })

  test('shows over reliant on family or friends page (when family or friends income selected)', async ({
    page,
    createSession,
    strengthsAndNeedsBuilder,
    baseURL,
  }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId)
      .withAnswers([{ question: Question.finance_income, value: [Option.family_or_friends] }])
      .withUserSubmittedSteps([Step.finance_income.code, Step.community_finance_income_friends_family.code])
      .save()

    await FinancesPage.navigateTo(
      page,
      handoverLink,
      baseURL,
      sanAssessmentId,
      'community-finance-income-friends-family',
    )

    const financesPage = await FinancesPage.verifyOnPage(page, 'over reliant on family or friends')

    await expect(page).toHaveTitle(buildPageTitle(sanPageTitles.finances))

    await expect(financesPage.mainForm).toMatchAriaSnapshot(`
      - group "Is Test over reliant on family or friends for money?":
        - radio "Yes"
        - text: "Yes"
        - radio "No"
        - text: "No"
        - radio "Unknown"
        - text: Unknown
      - button "Save and continue"
    `)
  })

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
    await expect(page).toHaveURL(/finance-concerns/)

    await financesPage.questions.finance_concerns.option(CommonOption.yes).check()
    await financesPage.saveAndContinue.click()

    await expect(page).toHaveURL(/finance-money-management/)
    await expect(page.getByText('How good is Test at managing their money?')).toBeVisible()
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
    await expect(page).toHaveURL(/finance-concerns/)

    const concerns = financesPage.questions.finance_concerns
    await concerns.option(CommonOption.yes).check()
    await concerns.option(CommonOption.no).check()
    await expect(concerns.option(CommonOption.no)).toBeChecked()
    await expect(concerns.option(CommonOption.yes)).not.toBeChecked()
    await expect(financesPage.questions.finance_concerns_no_details.input).toBeVisible()
    await financesPage.saveAndContinue.click()

    await expect(page).toHaveURL(/finance-summary/)
    await expect(page.getByText('How good is Test at managing their money?')).not.toBeVisible()
    await page.getByRole('tab', { name: 'Practitioner analysis' }).click()
    await expect(page.getByText('Practitioner analysis not required')).toBeVisible()
    await expect(page.getByText('Are there any strengths or protective factors')).not.toBeVisible()
  })

  for (const debtCase of [
    {
      answer: Option.yes_their_debt,
      visibleQuestion: 'yes_type_of_debt',
      hiddenQuestion: 'yes_someone_elses_type_of_debt',
    },
    {
      answer: Option.yes_someone_elses_debt,
      visibleQuestion: 'yes_someone_elses_type_of_debt',
      hiddenQuestion: 'yes_type_of_debt',
    },
  ] as const) {
    test(`shows only the correct debt type question for ${debtCase.answer}`, async ({
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
      await financesPage.questions.finance_concerns.option(CommonOption.yes).check()
      await financesPage.saveAndContinue.click()
      await financesPage.questions.finance_money_management.option(Option.good).check()
      await financesPage.questions.finance_debt.option(debtCase.answer).check()
      await financesPage.saveAndContinue.click()

      await expect(page).toHaveURL(/finance-debt/)
      await expect(financesPage.questions[debtCase.visibleQuestion].option(Option.debt_to_others)).toBeVisible()
      await expect(financesPage.questions[debtCase.hiddenQuestion].option(Option.debt_to_others)).not.toBeVisible()
      await financesPage.questions[debtCase.visibleQuestion].option(Option.debt_to_others).check()
      await expect(
        financesPage.questions[
          debtCase.visibleQuestion === 'yes_type_of_debt'
            ? 'yes_type_of_debt_debt_to_others_details'
            : 'yes_someone_elses_type_of_debt_debt_to_others_details'
        ].input,
      ).toBeVisible()
    })
  }
})
