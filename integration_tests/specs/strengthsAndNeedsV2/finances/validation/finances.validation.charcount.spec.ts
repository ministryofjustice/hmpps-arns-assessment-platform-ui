import { Step } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/finance/constants/step'
import { CommonOption } from '@server/forms/strengths-and-needs/versions/v2.0/constants/commonOption'
import { Option } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/finance/constants/option'
import { Question } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/finance/constants/question'
import FinancesPage from 'pages/strengthsAndNeedsV2/financesPage'
import { expectTheLimitsOnThePage } from '../../characterCounts'
import { test } from '../../fixtures'
import { changeOptions, finances } from '../../sanUtils'

/**
 * Some finance fields have character limits (v2 flow). These tests exercise each step page to reveal
 * character-count fields, then verify each one holds to its limit: one character over fails validation,
 * exactly the limit passes.
 *
 * Pages are now split across multiple steps (no longer a single /finance step):
 *   finance-income        → income (with family_or_friends details) + income_other_details
 *   community-finance-income-friends-family → over reliant (with yes_details)
 *   finance-concerns      → financial concerns (no_details optional)
 *   finance-money-management → money management (details per option) + debt question
 *   finance-debt          → type of debt details (debt_to_others, formal_debt)
 *   finance-changes       → changes (details per option)
 *   finance-summary       → practitioner analysis
 */

/** Fully-answered answers to seed the assessment so all step pages are reachable. */
const answers = [
  { question: Question.finance_income, value: [Option.employment, Option.family_or_friends, CommonOption.other] },
  { question: Question.finance_income_other_details, value: 'Some details' },
  { question: Question.community_finance_income_friends_family, value: CommonOption.yes },
  { question: Question.community_finance_income_friends_family_yes_details, value: 'Some details' },
  { question: Question.finance_concerns, value: CommonOption.yes },
  { question: Question.finance_money_management, value: Option.fairly_bad },
  { question: Question.finance_money_management_fairly_bad_details, value: 'Some details' },
  { question: Question.finance_debt, value: Option.yes_their_debt },
  { question: Question.yes_type_of_debt, value: [Option.debt_to_others, Option.formal_debt] },
  { question: Question.yes_type_of_debt_debt_to_others_details, value: 'Some details' },
  { question: Question.yes_type_of_debt_formal_debt_details, value: 'Some details' },
  { question: Question.finance_changes, value: CommonOption.thinking_about_making_changes },
  { question: Question.finance_changes_thinking_about_making_changes_details, value: 'Some details' },
  { question: Question.finance_practitioner_analysis_strengths_or_protective_factors, value: CommonOption.yes },
  {
    question: Question.finance_practitioner_analysis_strengths_or_protective_factors_yes_details,
    value: 'Some details',
  },
  { question: Question.finance_practitioner_analysis_risk_of_serious_harm, value: CommonOption.yes },
  { question: Question.finance_practitioner_analysis_risk_of_serious_harm_yes_details, value: 'Some details' },
  { question: Question.finance_practitioner_analysis_risk_of_reoffending, value: CommonOption.yes },
  { question: Question.finance_practitioner_analysis_risk_of_reoffending_yes_details, value: 'Some details' },
]

const userSubmittedSteps = [
  Step.finance_income.code,
  Step.community_finance_income_friends_family.code,
  Step.finance_concerns.code,
  Step.finance_money_management.code,
  Step.finance_debt.code,
  Step.finance_changes.code,
  Step.finance_summary.code,
]

test.describe('Finances character counts', () => {
  test('finance-income: income other details', async ({ page, openSection }) => {
    const section = await openSection(finances, answers, userSubmittedSteps)
    const financesPage = new FinancesPage(page)
    const { questions } = financesPage
    await page.goto(`${section}/${Step.finance_income.path}`)

    await questions.finance_income.option(CommonOption.other).check()

    await expectTheLimitsOnThePage(financesPage)
  })

  test('community-finance-income-friends-family: yes details', async ({ page, openSection }) => {
    const section = await openSection(finances, answers, userSubmittedSteps)
    const financesPage = new FinancesPage(page)
    const { questions } = financesPage
    await page.goto(`${section}/${Step.community_finance_income_friends_family.path}`)

    await questions.community_finance_income_friends_family.option(CommonOption.yes).check()

    await expectTheLimitsOnThePage(financesPage)
  })

  test('finance-concerns: no details (optional)', async ({ page, openSection }) => {
    const section = await openSection(finances, answers, userSubmittedSteps)
    const financesPage = new FinancesPage(page)
    const { questions } = financesPage
    await page.goto(`${section}/${Step.finance_concerns.path}`)

    await questions.finance_concerns.option(CommonOption.no).check()

    await expectTheLimitsOnThePage(financesPage)
  })

  // a test per option, because each one reveals its own details field
  for (const option of [Option.good, Option.fairly_good, Option.fairly_bad, Option.bad]) {
    test(`finance-money-management: money management ${option}`, async ({ page, openSection }) => {
      const section = await openSection(finances, answers, userSubmittedSteps)
      const financesPage = new FinancesPage(page)
      const { questions } = financesPage
      await page.goto(`${section}/${Step.finance_money_management.path}`)

      await questions.finance_money_management.option(option).check()

      await expectTheLimitsOnThePage(financesPage)
    })
  }

  test('finance-money-management: debt unknown details', async ({ page, openSection }) => {
    const section = await openSection(finances, answers, userSubmittedSteps)
    const financesPage = new FinancesPage(page)
    const { questions } = financesPage
    await page.goto(`${section}/${Step.finance_money_management.path}`)

    await questions.finance_debt.option(CommonOption.unknown).check()

    await expectTheLimitsOnThePage(financesPage)
  })

  test('finance-debt: type of debt — their own (debt_to_others and formal_debt)', async ({ page, openSection }) => {
    const section = await openSection(finances, answers, userSubmittedSteps)
    const financesPage = new FinancesPage(page)
    const { questions } = financesPage
    await page.goto(`${section}/${Step.finance_debt.path}`)

    await questions.yes_type_of_debt.option(Option.debt_to_others).check()
    await questions.yes_type_of_debt.option(Option.formal_debt).check()

    await expectTheLimitsOnThePage(financesPage)
  })

  test("finance-debt: type of debt — someone else's (debt_to_others and formal_debt)", async ({
    page,
    openSection,
  }) => {
    const someoneElsesDebtAnswers = answers.map(answer =>
      answer.question === Question.finance_debt ? { ...answer, value: Option.yes_someone_elses_debt } : answer,
    )
    const section = await openSection(finances, someoneElsesDebtAnswers, userSubmittedSteps)
    const financesPage = new FinancesPage(page)
    const { questions } = financesPage
    await page.goto(`${section}/${Step.finance_debt.path}`)

    await questions.yes_someone_elses_type_of_debt.option(Option.debt_to_others).check()
    await questions.yes_someone_elses_type_of_debt.option(Option.formal_debt).check()

    await expectTheLimitsOnThePage(financesPage)
  })

  for (const option of changeOptions) {
    test(`finance-changes: wants to make changes ${option}`, async ({ page, openSection }) => {
      const section = await openSection(finances, answers, userSubmittedSteps)
      const financesPage = new FinancesPage(page)
      const { questions } = financesPage
      await page.goto(`${section}/${Step.finance_changes.path}`)

      await questions.finance_changes.option(option).check()

      await expectTheLimitsOnThePage(financesPage)
    })
  }

  for (const answer of [CommonOption.yes, CommonOption.no]) {
    test(`finance-summary: practitioner analysis ${answer}`, async ({ page, openSection }) => {
      const section = await openSection(finances, answers, userSubmittedSteps)
      const financesPage = new FinancesPage(page)
      const { questions } = financesPage
      await page.goto(`${section}/${Step.finance_summary.path}#practitioner-analysis`)

      await questions.finance_practitioner_analysis_strengths_or_protective_factors.option(answer).check()
      await questions.finance_practitioner_analysis_risk_of_serious_harm.option(answer).check()
      await questions.finance_practitioner_analysis_risk_of_reoffending.option(answer).check()

      await expectTheLimitsOnThePage(financesPage, { save: financesPage.markComplete })
    })
  }
})
