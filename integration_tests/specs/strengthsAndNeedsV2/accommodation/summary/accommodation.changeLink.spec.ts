import { CommonOption } from '@server/forms/strengths-and-needs/versions/v2.0/constants/commonOption'
import { Option } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/accommodation/constants/option'
import { Question } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/accommodation/constants/question'
import { Step } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/accommodation/constants/step'

import { accommodation } from 'specs/strengthsAndNeedsV2/sanUtils'
import { details } from 'testUtils'
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
    { question: Question.community_current_accommodation, value: Option.settled },
    { question: Question.community_current_accommodation_settled, value: CommonOption.yes },
    { question: Question.community_suitable_housing_location, value: CommonOption.no },
    {
      question: Question.community_suitable_housing_location_concerns,
      value: [Option.criminal_associates, Option.victimisation, CommonOption.other],
    },
    {
      question: Question.community_suitable_housing_location_concerns_other_details,
      value: details('location concerns other'),
    },
    { question: Question.community_suitable_housing, value: CommonOption.no },
    {
      question: Question.community_unsuitable_housing_concerns,
      value: [Option.facilities, Option.overcrowding, CommonOption.other],
    },
    {
      question: Question.community_unsuitable_housing_concerns_other_details,
      value: details('housing concerns other'),
    },
    { question: Question.accommodation_changes, value: CommonOption.making_changes },
    {
      question: Question.accommodation_changes_making_changes_details,
      value: details('actively making changings'),
    },

    { question: Question.accommodation_practitioner_analysis_strengths_or_protective_factors, value: CommonOption.yes },
    {
      question: Question.accommodation_practitioner_analysis_strengths_or_protective_factors_yes_details,
      value: details('accommodation strengths'),
    },
    { question: Question.accommodation_practitioner_analysis_risk_of_serious_harm, value: CommonOption.no },
    {
      question: Question.accommodation_practitioner_analysis_risk_of_serious_harm_no_details,
      value: details('no serious harm'),
    },
    { question: Question.accommodation_practitioner_analysis_risk_of_reoffending, value: CommonOption.yes },
    {
      question: Question.accommodation_practitioner_analysis_risk_of_reoffending_yes_details,
      value: details('reoffending risk'),
    },
  ],
  summaryChangeLinks: [
    changeLink(
      Step.community_current_accommodation.path,
      'community_current_accommodation',
    ),
    changeLink(
      Step.community_current_accommodation_settled.path,
      'community_current_accommodation_settled',
    ),
    changeLink(
      Step.community_suitable_housing_location.path,
      'community_suitable_housing_location',
    ),
    changeLink(
      Step.community_suitable_housing_location_concerns.path,
      'community_suitable_housing_location_concerns',
    ),
    changeLink(Step.community_suitable_housing.path, 'community_suitable_housing'),
    changeLink(
      Step.community_suitable_housing_concerns.path,
      'community_unsuitable_housing_concerns',
    ),
    changeLink(Step.accommodation_changes.path, 'accommodation_changes'),
  ],
  userSubmittedSteps: [
    Step.community_current_accommodation.code,
    Step.community_current_accommodation_settled.code,
    Step.community_suitable_housing_location.code,
    Step.community_suitable_housing_location_concerns.code,
    Step.community_suitable_housing.code,
    Step.community_suitable_housing_concerns.code,
    Step.accommodation_changes.code,
    Step.accommodation_summary.code,
  ],
}

const noAccommodation: Scenario = {
  answers: [
    { question: Question.community_current_accommodation, value: Option.no_accommodation },
    { question: Question.community_no_accommodation_reason, value: Option.alcohol_problems },
    { question: Question.accommodation_changes, value: CommonOption.made_changes },
    { question: Question.accommodation_changes_made_changes_details, value: 'Some details' },
    { question: Question.accommodation_practitioner_analysis_strengths_or_protective_factors, value: CommonOption.yes },
    {
      question: Question.accommodation_practitioner_analysis_strengths_or_protective_factors_yes_details,
      value: 'Some details',
    },
    { question: Question.accommodation_practitioner_analysis_risk_of_serious_harm, value: CommonOption.yes },
    { question: Question.accommodation_practitioner_analysis_risk_of_serious_harm_yes_details, value: 'Some details' },
    { question: Question.accommodation_practitioner_analysis_risk_of_reoffending, value: CommonOption.yes },
    { question: Question.accommodation_practitioner_analysis_risk_of_reoffending_yes_details, value: 'Some details' },
  ],
  summaryChangeLinks: [
    changeLink(
      Step.community_current_accommodation.path,
      Step.community_current_accommodation.code,
    ),
    changeLink(
      Step.community_no_accommodation_reason.path,
      Step.community_no_accommodation_reason.code,
    ),
    changeLink(Step.accommodation_changes.path, Step.accommodation_changes.code),
  ],
  userSubmittedSteps: [
    Step.community_current_accommodation.code,
    Step.community_no_accommodation_reason.code,
    Step.accommodation_changes.code,
    Step.accommodation_summary.code,
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
        const section = await openSection(
          accommodation,
          settledAccommodation.answers,
          settledAccommodation.userSubmittedSteps,
        )

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
        const section = await openSection(accommodation, noAccommodation.answers, noAccommodation.userSubmittedSteps)

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
      const section = await openSection(
        accommodation,
        settledAccommodation.answers,
        settledAccommodation.userSubmittedSteps,
      )

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
        const section = await openSection(
          accommodation,
          settledAccommodation.answers,
          settledAccommodation.userSubmittedSteps,
        )

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
        const section = await openSection(accommodation, noAccommodation.answers, noAccommodation.userSubmittedSteps)

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
