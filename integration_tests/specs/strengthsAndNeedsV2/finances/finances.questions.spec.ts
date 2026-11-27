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

  test('shows money management and debt questions', async ({
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
      .withUserSubmittedSteps([
        Step.finance_income.code,
        Step.finance_concerns.code,
        Step.finance_money_management.code,
      ])
      .save()

    await FinancesPage.navigateTo(page, handoverLink, baseURL, sanAssessmentId, Step.finance_money_management.path)

    const financesPage = await FinancesPage.verifyOnPage(page, 'managing their money')
    await expect(financesPage.mainForm).toMatchAriaSnapshot(`
      - group "How good is Test at managing their money?":
        - text: How good is Test at managing their money? This includes things like budgeting, prioritising bills and paying rent.
        - radio "Able to manage their money well and is a strength"
        - text: Able to manage their money well and is a strength
        - radio "Able to manage their money for everyday necessities"
        - text: Able to manage their money for everyday necessities
        - radio "Unable to manage their money well"
        - text: Unable to manage their money well
        - radio "Unable to manage their money which is creating other problems"
        - text: Unable to manage their money which is creating other problems
      - group "Is Test affected by debt?":
        - text: Is Test affected by debt?
        - radio "Yes, their own debt"
        - text: Yes, their own debt
        - radio "Yes, someone else’s debt"
        - text: Yes, someone else’s debt or
        - radio "No"
        - text: "No"
        - radio "Unknown"
        - text: Unknown
      - button "Save and continue"
    `)
  })

  test('shows debt type question', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId)
      .withAnswers([
        { question: Question.finance_income, value: [Option.employment] },
        { question: Question.finance_concerns, value: CommonOption.yes },
        { question: Question.finance_money_management, value: Option.good },
        { question: Question.finance_debt, value: Option.yes_their_debt },
      ])
      .withUserSubmittedSteps([
        Step.finance_income.code,
        Step.finance_concerns.code,
        Step.finance_money_management.code,
      ])
      .save()

    await FinancesPage.navigateTo(page, handoverLink, baseURL, sanAssessmentId, Step.finance_debt.path)

    const financesPage = await FinancesPage.verifyOnPage(page, 'What type of debt')
    await expect(financesPage.mainForm).toMatchAriaSnapshot(`
      - group "What type of debt does Test have?":
        - text: What type of debt does Test have? Select all that apply.
        - checkbox "Debt to others"
        - text: Debt to others
        - checkbox "Formal debt"
        - text: Formal debt
      - button "Save and continue"
    `)
  })

  test('shows finance changes question', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
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
    await financesPage.questions.finance_debt.option(CommonOption.no).check()
    await financesPage.saveAndContinue.click()

    await expect(page).toHaveURL(new RegExp(Step.finance_changes.path))
    await expect(financesPage.mainForm).toMatchAriaSnapshot(`
      - group "Does Test want to make changes to their finances?":
        - text: Does Test want to make changes to their finances? Test must answer this question.
        - radio "I have already made positive changes and want to maintain them"
        - text: I have already made positive changes and want to maintain them
        - radio "I am actively making changes"
        - text: I am actively making changes
        - radio "I want to make changes and know how to"
        - text: I want to make changes and know how to
        - radio "I want to make changes but need help"
        - text: I want to make changes but need help
        - radio "I am thinking about making changes"
        - text: I am thinking about making changes
        - radio "I do not want to make changes"
        - text: I do not want to make changes
        - radio "I do not want to answer"
        - text: I do not want to answer or
        - radio "Test is not present"
        - text: Test is not present
        - radio "Not applicable"
        - text: Not applicable
      - button "Save and continue"
    `)
  })

  for (const debtCase of [
    {
      answer: Option.yes_their_debt,
      visibleQuestion: Question.yes_type_of_debt,
      hiddenQuestion: Question.yes_someone_elses_type_of_debt,
      detailsQuestion: Question.yes_type_of_debt_debt_to_others_details,
    },
    {
      answer: Option.yes_someone_elses_debt,
      visibleQuestion: Question.yes_someone_elses_type_of_debt,
      hiddenQuestion: Question.yes_type_of_debt,
      detailsQuestion: Question.yes_someone_elses_type_of_debt_debt_to_others_details,
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
      await expect(financesPage.questions[debtCase.detailsQuestion].input).toBeVisible()
    })
  }
})
