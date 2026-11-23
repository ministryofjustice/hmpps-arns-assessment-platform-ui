import { CommonOption } from '@server/forms/strengths-and-needs/versions/v2.0/constants/commonOption'
import { Option } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/finance/constants/option'
import { Question } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/finance/constants/question'
import { Step } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/finance/constants/step'
import { finances } from '../../sanUtils'
import {
  changeLink,
  expectChangeLinksListed,
  expectEachChangeLinkToLandOnItsQuestion,
  practitionerAnalysisTab,
  Scenario,
  summaryTab,
} from '../../changeLinkUtils'
import { test } from '../../fixtures'

/**
 * Finances change links (v2 flow)
 *
 * Page order:
 *   1. finance-income        → "Where does [Name] currently get their money from?"
 *   2. community-finance-income-friends-family (conditional: when family_or_friends income selected)
 *                            → "Is [Name] over reliant on family or friends for money?"
 *   3. finance-concerns      → "Does [Name] have any financial issues or worries?"
 *   4. finance-money-management (conditional: when finance_concerns = yes)
 *                            → "How good is [Name] at managing their money?"
 *   5. finance-debt          → "Is [Name] affected by debt?" (radio, not checkbox)
 *   6. finance-debt (type page, conditional: when yes_their_debt or yes_someone_elses_debt)
 *                            → "What type of debt does [Name] have?"
 *   7. finance-changes       → "Does [Name] want to make changes to their finances?"
 *
 * Removed (v1 → v2):
 *   - finance_bank_account   ("Does [Name] have their own bank account?")
 *   - finance_gambling       ("Is [Name] affected by gambling?")
 *
 * Branches: Fully answered (family_or_friends income + yes to concerns + yes_their_debt)
 * to exercise every question and change link.
 */

const summaryPage = Step.finance_summary.path
const analysisPage = Step.finance_analysis.path
const fullyAnswered: Scenario = {
  answers: [
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
  ],
  summaryChangeLinks: [
    changeLink(Step.finance_income.path, Question.finance_income),
    changeLink(Step.community_finance_income_friends_family.path, Question.community_finance_income_friends_family),
    changeLink(Step.finance_concerns.path, Question.finance_concerns),
    changeLink(Step.finance_money_management.path, Question.finance_money_management),
    changeLink(Step.finance_money_management.path, Question.finance_debt),
    changeLink(Step.finance_debt.path, Question.yes_type_of_debt),
    changeLink(Step.finance_changes.path, Question.finance_changes),
  ],
  userSubmittedSteps: [
    Step.finance_income.code,
    Step.community_finance_income_friends_family.code,
    Step.finance_concerns.code,
    Step.finance_money_management.code,
    Step.finance_debt.code,
    Step.finance_changes.code,
    Step.finance_summary.code,
  ],
}

const practitionerAnalysisChangeLinks = [
  changeLink(Step.finance_summary.path, Question.finance_practitioner_analysis_strengths_or_protective_factors),
  changeLink(Step.finance_summary.path, Question.finance_practitioner_analysis_risk_of_serious_harm),
  changeLink(Step.finance_summary.path, Question.finance_practitioner_analysis_risk_of_reoffending),
]

test.describe('Finances change links', () => {
  test.describe('Questions', () => {
    test.describe('fully answered', () => {
      test('each change link lands on its question', async ({ page, openSection }) => {
        const section = await openSection(finances, fullyAnswered.answers, fullyAnswered.userSubmittedSteps)

        await expectEachChangeLinkToLandOnItsQuestion(
          page,
          `${section}/${summaryPage}`,
          fullyAnswered.summaryChangeLinks,
          summaryTab,
        )
      })
    })
  })

  test.describe('Practitioner analysis', () => {
    test('each change link lands on its question', async ({ page, openSection }) => {
      const section = await openSection(finances, fullyAnswered.answers, fullyAnswered.userSubmittedSteps)
      await page.goto(`${section}/${summaryPage}`)
      await page.getByRole('tab', { name: practitionerAnalysisTab }).click()
      await page.getByRole('button', { name: 'Mark as complete' }).click()
      await page.waitForURL(/finance-analysis/)

      await expectEachChangeLinkToLandOnItsQuestion(
        page,
        `${section}/${analysisPage}`,
        practitionerAnalysisChangeLinks,
        practitionerAnalysisTab,
      )
    })
  })

  test.describe('Summary', () => {
    test.describe('fully answered', () => {
      test('the summary and analysis pages list every change link', async ({ page, openSection }) => {
        const section = await openSection(finances, fullyAnswered.answers, fullyAnswered.userSubmittedSteps)

        await expectChangeLinksListed(page, `${section}/${summaryPage}`, fullyAnswered.summaryChangeLinks, summaryTab)
        await expectChangeLinksListed(page, `${section}/${analysisPage}`, fullyAnswered.summaryChangeLinks, summaryTab)
        await expectChangeLinksListed(
          page,
          `${section}/${analysisPage}`,
          practitionerAnalysisChangeLinks,
          practitionerAnalysisTab,
        )
      })
    })
  })
})
