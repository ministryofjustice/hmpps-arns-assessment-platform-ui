import { CommonOption } from '@server/forms/strengths-and-needs/versions/v1.0/constants/commonOption'
import { Option } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/finance/constants/option'
import { Question } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/finance/constants/question'
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
 * Finances change links
 *
 *   1. Questions: for each branch of the section, every question change link followed
 *   2. Practitioner analysis: every practitioner analysis change link followed
 *   3. Summary: what the summary and analysis pages list
 *
 * Branches: Fully answered in order to cover every question
 */

const summaryPage = 'finance-summary'
const analysisPage = 'finance-analysis'

const fullyAnswered: Scenario = {
  answers: [
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
  ],
  summaryChangeLinks: [
    changeLink('finance', 'finance_income'),
    changeLink('finance', 'finance_bank_account'),
    changeLink('finance', 'finance_money_management'),
    changeLink('finance', 'finance_gambling'),
    changeLink('finance', 'finance_debt'),
    changeLink('finance', 'finance_changes'),
  ],
}

const practitionerAnalysisChangeLinks = [
  changeLink('finance-summary', 'finance_practitioner_analysis_strengths_or_protective_factors'),
  changeLink('finance-summary', 'finance_practitioner_analysis_risk_of_serious_harm'),
  changeLink('finance-summary', 'finance_practitioner_analysis_risk_of_reoffending'),
]

test.describe('Finances change links', () => {
  test.describe('Questions', () => {
    test.describe('fully answered', () => {
      test('each change link lands on its question', async ({ page, openSection }) => {
        const section = await openSection(finances, fullyAnswered.answers)

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
      const section = await openSection(finances, fullyAnswered.answers)

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
        const section = await openSection(finances, fullyAnswered.answers)

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
