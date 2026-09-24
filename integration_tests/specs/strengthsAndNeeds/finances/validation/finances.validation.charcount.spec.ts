import { Step } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/finance/constants/step'
import { CommonOption } from '@server/forms/strengths-and-needs/versions/v1.0/constants/commonOption'
import { Option } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/finance/constants/option'
import { Question } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/finance/constants/question'
import FinancesPage from 'pages/strengthsAndNeeds/financesPage'
import { expectTheLimitsOnThePage } from '../../characterCounts'
import { test } from '../../fixtures'
import { changeOptions, finances } from '../../sanUtils'

/**
 * Some finances fields have character limits. These tests exercise the page to reveal the character count fields,
 * then check each one holds to its limit: one character over fails validation, exactly the limit passes.
 */

const answers = [
  { question: Question.finance_income, value: [Option.employment, Option.family_or_friends, CommonOption.other] },
  { question: Question.family_or_friends_details, value: CommonOption.yes },
  { question: Question.finance_income_other_details, value: 'Some details' },
  { question: Question.finance_bank_account, value: CommonOption.no },
  { question: Question.finance_money_management, value: Option.fairly_bad },
  { question: Question.finance_money_management_fairly_bad_details, value: 'Some details' },
  { question: Question.finance_gambling, value: [Option.yes_their_gambling] },
  { question: Question.finance_gambling_yes_their_gambling_details, value: 'Some details' },
  { question: Question.finance_debt, value: [Option.yes_their_debt] },
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

test.describe('Finances character counts', () => {
  test('finance: income and gambling details', async ({ page, openSection }) => {
    const section = await openSection(finances, answers)
    const financesPage = new FinancesPage(page)
    const { questions } = financesPage
    await page.goto(`${section}/${Step.finance.path}`)

    await questions.finance_income.option(CommonOption.other).check()
    await questions.finance_gambling.option(Option.yes_their_gambling).check()
    await questions.finance_gambling.option(Option.yes_someone_elses_gambling).check()

    await expectTheLimitsOnThePage(financesPage)
  })

  test('finance: no money, and gambling unknown', async ({ page, openSection }) => {
    const section = await openSection(finances, answers)
    const financesPage = new FinancesPage(page)
    const { questions } = financesPage
    await page.goto(`${section}/${Step.finance.path}`)

    await questions.finance_income.option(Option.no_money).check()
    await questions.finance_gambling.option(CommonOption.unknown).check()

    await expectTheLimitsOnThePage(financesPage)
  })

  test('finance: debt, their own and someone else’s', async ({ page, openSection }) => {
    const section = await openSection(finances, answers)
    const financesPage = new FinancesPage(page)
    const { questions } = financesPage
    await page.goto(`${section}/${Step.finance.path}`)

    await questions.finance_debt.option(Option.yes_their_debt).check()
    await questions.finance_debt.option(Option.yes_someone_elses_debt).check()
    await questions.yes_type_of_debt.option(Option.debt_to_others).check()
    await questions.yes_type_of_debt.option(Option.formal_debt).check()
    await questions.yes_someone_elses_type_of_debt.option(Option.debt_to_others).check()
    await questions.yes_someone_elses_type_of_debt.option(Option.formal_debt).check()

    await expectTheLimitsOnThePage(financesPage)
  })

  test('finance: debt unknown', async ({ page, openSection }) => {
    const section = await openSection(finances, answers)
    const financesPage = new FinancesPage(page)
    const { questions } = financesPage
    await page.goto(`${section}/${Step.finance.path}`)

    await questions.finance_debt.option(CommonOption.unknown).check()

    await expectTheLimitsOnThePage(financesPage)
  })

  // a test per option, because each one reveals its own details field
  for (const option of [Option.good, Option.fairly_good, Option.fairly_bad, Option.bad]) {
    test(`finance: money management ${option}`, async ({ page, openSection }) => {
      const section = await openSection(finances, answers)
      const financesPage = new FinancesPage(page)
      const { questions } = financesPage
      await page.goto(`${section}/${Step.finance.path}`)

      await questions.finance_money_management.option(option).check()

      await expectTheLimitsOnThePage(financesPage)
    })
  }

  for (const option of changeOptions) {
    test(`finance: wants to make changes ${option}`, async ({ page, openSection }) => {
      const section = await openSection(finances, answers)
      const financesPage = new FinancesPage(page)
      const { questions } = financesPage
      await page.goto(`${section}/${Step.finance.path}`)

      await questions.finance_changes.option(option).check()

      await expectTheLimitsOnThePage(financesPage)
    })
  }

  for (const answer of [CommonOption.yes, CommonOption.no]) {
    test(`finance-summary: practitioner analysis ${answer}`, async ({ page, openSection }) => {
      const section = await openSection(finances, answers)
      const financesPage = new FinancesPage(page)
      const { questions } = financesPage
      await page.goto(`${section}/${Step.financeSummary.path}#practitioner-analysis`)

      await questions.finance_practitioner_analysis_strengths_or_protective_factors.option(answer).check()
      await questions.finance_practitioner_analysis_risk_of_serious_harm.option(answer).check()
      await questions.finance_practitioner_analysis_risk_of_reoffending.option(answer).check()

      await expectTheLimitsOnThePage(financesPage, { save: financesPage.markComplete })
    })
  }
})
