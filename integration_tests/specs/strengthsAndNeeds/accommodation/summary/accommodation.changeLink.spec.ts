import { accommodation } from '../../sanUtils'
import {
  changeLink,
  expectChangeLinksListed,
  expectEachChangeLinkToLandOnItsQuestion,
  practitionerAnalysisTab,
  Scenario,
  summaryTab,
  test,
} from '../../changeLinkUtils'

/**
 * Accommodation change links
 *
 *   1. Questions: for each branch of the section, every question change link followed
 *   2. Practitioner analysis: every practitioner analysis change link followed
 *   3. Summary: what the summary and analysis pages list
 *
 * Branches: Settled accommodation and no accommodation in order to cover every question
 */

const summaryPage = 'accommodation-summary'
const analysisPage = 'accommodation-analysis'

const settledAccommodation: Scenario = {
  answers: [
    { question: 'current_accommodation', value: 'SETTLED' },
    { question: 'type_of_settled_accommodation', value: 'HOMEOWNER' },
    { question: 'living_with', value: ['FAMILY'] },
    { question: 'suitable_housing_location', value: 'YES' },
    { question: 'suitable_housing', value: 'YES' },
    { question: 'accommodation_changes', value: 'MADE_CHANGES' },
    { question: 'accommodation_changes_made_changes_details', value: 'Some details' },
    { question: 'accommodation_practitioner_analysis_strengths_or_protective_factors', value: 'YES' },
    {
      question: 'accommodation_practitioner_analysis_strengths_or_protective_factors_yes_details',
      value: 'Some details',
    },
    { question: 'accommodation_practitioner_analysis_risk_of_serious_harm', value: 'YES' },
    { question: 'accommodation_practitioner_analysis_risk_of_serious_harm_yes_details', value: 'Some details' },
    { question: 'accommodation_practitioner_analysis_risk_of_reoffending', value: 'YES' },
    { question: 'accommodation_practitioner_analysis_risk_of_reoffending_yes_details', value: 'Some details' },
  ],
  summaryChangeLinks: [
    changeLink('current-accommodation', 'current_accommodation'),
    changeLink('accommodation-details', 'living_with'),
    changeLink('accommodation-details', 'suitable_housing_location'),
    changeLink('accommodation-details', 'suitable_housing'),
    changeLink('accommodation-details', 'accommodation_changes'),
  ],
}

const noAccommodation: Scenario = {
  answers: [
    { question: 'current_accommodation', value: 'NO_ACCOMMODATION' },
    { question: 'type_of_no_accommodation', value: 'CAMPSITE' },
    { question: 'no_accommodation_reason', value: ['ALCOHOL_PROBLEMS'] },
    { question: 'past_accommodation_details', value: 'Some details' },
    { question: 'suitable_housing_planned', value: 'YES' },
    { question: 'future_accommodation_type', value: 'AWAITING_ASSESSMENT' },
    { question: 'future_accommodation_type_awaiting_assessment_details', value: 'Some details' },
    { question: 'accommodation_changes', value: 'MADE_CHANGES' },
    { question: 'accommodation_changes_made_changes_details', value: 'Some details' },
    { question: 'accommodation_practitioner_analysis_strengths_or_protective_factors', value: 'YES' },
    {
      question: 'accommodation_practitioner_analysis_strengths_or_protective_factors_yes_details',
      value: 'Some details',
    },
    { question: 'accommodation_practitioner_analysis_risk_of_serious_harm', value: 'YES' },
    { question: 'accommodation_practitioner_analysis_risk_of_serious_harm_yes_details', value: 'Some details' },
    { question: 'accommodation_practitioner_analysis_risk_of_reoffending', value: 'YES' },
    { question: 'accommodation_practitioner_analysis_risk_of_reoffending_yes_details', value: 'Some details' },
  ],
  summaryChangeLinks: [
    changeLink('current-accommodation', 'current_accommodation'),
    changeLink('accommodation-details', 'no_accommodation_reason'),
    changeLink('accommodation-details', 'past_accommodation_details'),
    changeLink('accommodation-details', 'suitable_housing_planned'),
    changeLink('accommodation-details', 'accommodation_changes'),
  ],
}

const practitionerAnalysisChangeLinks = [
  changeLink('accommodation-summary', 'accommodation_practitioner_analysis_strengths_or_protective_factors'),
  changeLink('accommodation-summary', 'accommodation_practitioner_analysis_risk_of_serious_harm'),
  changeLink('accommodation-summary', 'accommodation_practitioner_analysis_risk_of_reoffending'),
]

test.describe('Accommodation change links', () => {
  test.describe('Questions', () => {
    test.describe('in settled accommodation', () => {
      test('each change link lands on its question', async ({ page, openSection }) => {
        const section = await openSection(accommodation, settledAccommodation.answers)

        await expectEachChangeLinkToLandOnItsQuestion(
          page,
          `${section}/${summaryPage}`,
          settledAccommodation.summaryChangeLinks,
          summaryTab,
        )
      })
    })

    test.describe('with no accommodation', () => {
      test('each change link lands on its question', async ({ page, openSection }) => {
        const section = await openSection(accommodation, noAccommodation.answers)

        await expectEachChangeLinkToLandOnItsQuestion(
          page,
          `${section}/${summaryPage}`,
          noAccommodation.summaryChangeLinks,
          summaryTab,
        )
      })
    })
  })

  test.describe('Practitioner analysis', () => {
    test('each change link lands on its question', async ({ page, openSection }) => {
      const section = await openSection(accommodation, settledAccommodation.answers)

      await expectEachChangeLinkToLandOnItsQuestion(
        page,
        `${section}/${analysisPage}`,
        practitionerAnalysisChangeLinks,
        practitionerAnalysisTab,
      )
    })
  })

  test.describe('Summary', () => {
    test.describe('in settled accommodation', () => {
      test('the summary and analysis pages list every change link', async ({ page, openSection }) => {
        const section = await openSection(accommodation, settledAccommodation.answers)

        await expectChangeLinksListed(
          page,
          `${section}/${summaryPage}`,
          settledAccommodation.summaryChangeLinks,
          summaryTab,
        )
        await expectChangeLinksListed(
          page,
          `${section}/${analysisPage}`,
          settledAccommodation.summaryChangeLinks,
          summaryTab,
        )
        await expectChangeLinksListed(
          page,
          `${section}/${analysisPage}`,
          practitionerAnalysisChangeLinks,
          practitionerAnalysisTab,
        )
      })
    })

    test.describe('with no accommodation', () => {
      test('the summary and analysis pages list every change link', async ({ page, openSection }) => {
        const section = await openSection(accommodation, noAccommodation.answers)

        await expectChangeLinksListed(page, `${section}/${summaryPage}`, noAccommodation.summaryChangeLinks, summaryTab)
        await expectChangeLinksListed(
          page,
          `${section}/${analysisPage}`,
          noAccommodation.summaryChangeLinks,
          summaryTab,
        )
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
