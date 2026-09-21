import { CommonOption } from '@server/forms/strengths-and-needs/versions/v1.0/constants/commonOption'
import { Option } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/alcohol-use/constants/option'
import { Question } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/alcohol-use/constants/question'
import { expect } from '@playwright/test'
import { alcohol } from '../../sanUtils'
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
 * Alcohol use change links
 *
 *   1. Questions: for each branch of the section, every question change link followed
 *   2. Practitioner analysis: every practitioner analysis change link followed
 *   3. Summary: what the summary and analysis pages list
 *   4. Practitioner analysis tab and Read only mode: change link behaviour that is the
 *      same in every section.
 *
 * Branches: Having drunk alcohol in the last 3 months in order to cover every question
 */

const summaryPage = 'alcohol-use-summary'
const analysisPage = 'alcohol-use-analysis'

const fullyAnswered: Scenario = {
  answers: [
    { question: Question.alcohol_use, value: Option.yes_within_last_three_months },
    { question: Question.alcohol_frequency, value: Option.more_than_4_times_a_week },
    { question: Question.alcohol_units, value: Option.units_7_to_9 },
    { question: Question.alcohol_binge_drinking, value: CommonOption.yes },
    { question: Question.alcohol_binge_drinking_frequency, value: Option.weekly },
    { question: Question.alcohol_evidence_of_excess_drinking, value: Option.yes_with_evidence },
    { question: Question.alcohol_past_issues, value: CommonOption.yes },
    { question: Question.alcohol_past_issues_yes_details, value: 'Some details' },
    {
      question: Question.alcohol_reasons_for_use,
      value: [Option.social, Option.managing_emotional_issues, CommonOption.other],
    },
    { question: Question.alcohol_reasons_for_use_other_details, value: 'Some details' },
    { question: Question.alcohol_impact_of_use, value: [Option.finances, Option.relationships, CommonOption.other] },
    { question: Question.alcohol_impact_of_use_other_details, value: 'Some details' },
    { question: Question.alcohol_stopped_or_reduced, value: CommonOption.yes },
    { question: Question.alcohol_stopped_or_reduced_yes_details, value: 'Some details' },
    { question: Question.alcohol_use_changes, value: CommonOption.does_not_want_to_make_changes },
    { question: Question.alcohol_use_changes_does_not_want_to_make_changes_details, value: 'Some details' },
    { question: Question.alcohol_use_practitioner_analysis_strengths_or_protective_factors, value: CommonOption.no },
    {
      question: Question.alcohol_use_practitioner_analysis_strengths_or_protective_factors_no_details,
      value: 'Some details',
    },
    { question: Question.alcohol_use_practitioner_analysis_risk_of_serious_harm, value: CommonOption.yes },
    { question: Question.alcohol_use_practitioner_analysis_risk_of_serious_harm_yes_details, value: 'Some details' },
    { question: Question.alcohol_use_practitioner_analysis_risk_of_reoffending, value: CommonOption.yes },
    { question: Question.alcohol_use_practitioner_analysis_risk_of_reoffending_yes_details, value: 'Some details' },
  ],
  summaryChangeLinks: [
    changeLink('alcohol-use', 'alcohol_use'),
    changeLink('alcohol-use-details', 'alcohol_frequency'),
    changeLink('alcohol-use-details', 'alcohol_units'),
    changeLink('alcohol-use-details', 'alcohol_binge_drinking'),
    changeLink('alcohol-use-details', 'alcohol_evidence_of_excess_drinking'),
    changeLink('alcohol-use-details', 'alcohol_past_issues'),
    changeLink('alcohol-use-details', 'alcohol_reasons_for_use'),
    changeLink('alcohol-use-details', 'alcohol_impact_of_use'),
    changeLink('alcohol-use-details', 'alcohol_stopped_or_reduced'),
    changeLink('alcohol-use-details', 'alcohol_use_changes'),
  ],
}

const practitionerAnalysisChangeLinks = [
  changeLink('alcohol-use-summary', 'alcohol_use_practitioner_analysis_strengths_or_protective_factors'),
  changeLink('alcohol-use-summary', 'alcohol_use_practitioner_analysis_risk_of_serious_harm'),
  changeLink('alcohol-use-summary', 'alcohol_use_practitioner_analysis_risk_of_reoffending'),
]

const question = 'alcohol_use_practitioner_analysis_risk_of_reoffending'
const changeHref = `${summaryPage}#${question}-question`
const landedOnQuestion = new RegExp(`/${summaryPage}#${question}-question$`)

test.describe('Alcohol use change links', () => {
  test.describe('Questions', () => {
    test.describe('fully answered', () => {
      test('each change link lands on its question', async ({ page, openSection }) => {
        const section = await openSection(alcohol, fullyAnswered.answers)

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
      const section = await openSection(alcohol, fullyAnswered.answers)

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
        const section = await openSection(alcohol, fullyAnswered.answers)

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

  test.describe('Practitioner analysis tab', () => {
    test('a link into the tab survives switching tabs and going Back and Forward', async ({ page, openSection }) => {
      const section = await openSection(alcohol, fullyAnswered.answers)
      const firstInput = page.locator(`#${question}-question input`).first()

      await page.goto(`${section}/${analysisPage}`)
      await page.getByRole('tab', { name: practitionerAnalysisTab }).click()
      await page.locator(`main a[href="${changeHref}"]`).click()
      await expect(page).toHaveURL(landedOnQuestion)
      await expect(firstInput).toBeFocused()

      // Switching tabs works as normal from there...
      await page.getByRole('tab', { name: 'Summary' }).click()
      await expect(page.locator('#summary')).toBeVisible()
      await page.getByRole('tab', { name: practitionerAnalysisTab }).click()
      await expect(page.locator('#practitioner-analysis')).toBeVisible()

      // ...and going Back to the question reopens its tab and lands on it again.
      await page.goBack()
      await expect(page.locator('#summary')).toBeVisible()
      await page.goBack()
      await expect(page).toHaveURL(landedOnQuestion)
      await expect(page.locator('#practitioner-analysis')).toBeVisible()
      await expect(firstInput).toBeFocused()

      // Landing on the question added no history entry of its own.
      await page.goBack()
      await expect(page).toHaveURL(new RegExp(`/${analysisPage}#practitioner-analysis$`))
      await page.goForward()
      await expect(page.locator('#practitioner-analysis')).toBeVisible()
      await expect(firstInput).toBeFocused()
    })
  })

  test.describe('Read only mode', () => {
    test('no change links are shown', async ({ page, openSection }) => {
      const section = await openSection(alcohol, fullyAnswered.answers)

      await page.goto(`${section.replace('/edit/', '/view/')}/${analysisPage}`)

      await expect(page.locator('#summary')).toBeVisible()
      await expect(page.getByRole('link', { name: /^Change\b/ })).toHaveCount(0)
    })
  })
})
