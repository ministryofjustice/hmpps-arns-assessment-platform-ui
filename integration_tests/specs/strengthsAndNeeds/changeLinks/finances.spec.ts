import { finances } from '../sanUtils'
import {
  changeLink,
  expectChangeLinksListed,
  expectEachChangeLinkToLandOnItsQuestion,
  practitionerAnalysisTab,
  Scenario,
  test,
} from './helpers'

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
    { question: 'finance_income', value: ['EMPLOYMENT', 'FAMILY_OR_FRIENDS', 'OTHER'] },
    { question: 'family_or_friends_details', value: 'YES' },
    { question: 'finance_income_other_details', value: 'Some details' },
    { question: 'finance_bank_account', value: 'NO' },
    { question: 'finance_money_management', value: 'FAIRLY_BAD' },
    { question: 'finance_money_management_fairly_bad_details', value: 'Some details' },
    { question: 'finance_gambling', value: ['YES_THEIR_GAMBLING'] },
    { question: 'finance_gambling_yes_their_gambling_details', value: 'Some details' },
    { question: 'finance_debt', value: ['YES_THEIR_DEBT'] },
    { question: 'yes_type_of_debt', value: ['DEBT_TO_OTHERS', 'FORMAL_DEBT'] },
    { question: 'yes_type_of_debt_debt_to_others_details', value: 'Some details' },
    { question: 'yes_type_of_debt_formal_debt_details', value: 'Some details' },
    { question: 'finance_changes', value: 'THINKING_ABOUT_MAKING_CHANGES' },
    { question: 'finance_changes_thinking_about_making_changes_details', value: 'Some details' },
    { question: 'finance_practitioner_analysis_strengths_or_protective_factors', value: 'YES' },
    { question: 'finance_practitioner_analysis_strengths_or_protective_factors_yes_details', value: 'Some details' },
    { question: 'finance_practitioner_analysis_risk_of_serious_harm', value: 'YES' },
    { question: 'finance_practitioner_analysis_risk_of_serious_harm_yes_details', value: 'Some details' },
    { question: 'finance_practitioner_analysis_risk_of_reoffending', value: 'YES' },
    { question: 'finance_practitioner_analysis_risk_of_reoffending_yes_details', value: 'Some details' },
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
        {
          tab: practitionerAnalysisTab,
        },
      )
    })
  })

  test.describe('Summary', () => {
    test.describe('fully answered', () => {
      test('the summary and analysis pages list every change link', async ({ page, openSection }) => {
        const section = await openSection(finances, fullyAnswered.answers)

        await expectChangeLinksListed(page, `${section}/${summaryPage}`, fullyAnswered.summaryChangeLinks)
        await expectChangeLinksListed(page, `${section}/${analysisPage}`, fullyAnswered.summaryChangeLinks)
        await expectChangeLinksListed(page, `${section}/${analysisPage}`, practitionerAnalysisChangeLinks, {
          tab: practitionerAnalysisTab,
        })
      })
    })
  })
})
