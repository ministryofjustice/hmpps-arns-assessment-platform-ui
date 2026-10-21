import { Step } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/accommodation/constants/step'
import { CommonOption } from '@server/forms/strengths-and-needs/versions/v2.0/constants/commonOption'
import { Option } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/accommodation/constants/option'
import { Question } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/accommodation/constants/question'
import AccommodationPage from 'pages/strengthsAndNeedsV2/accommodationPage'
import { changeOptions, accommodation } from 'specs/strengthsAndNeedsV2/sanUtils'
import { details } from 'testUtils'
import { expectTheLimitsOnThePage } from '../../characterCounts'
import { test } from '../../fixtures'

/**
 * Some accommodation fields have character limits. These tests exercise the page to reveal the character count
 * fields, then check each one holds to its limit: one character over fails validation, exactly the limit passes.
 */

// const answers = [
//   { question: Question.current_accommodation, value: Option.settled },
//   { question: Question.type_of_settled_accommodation, value: Option.homeowner },
//   { question: Question.living_with, value: [Option.family] },
//   { question: Question.suitable_housing_location, value: CommonOption.yes },
//   { question: Question.suitable_housing, value: CommonOption.yes },
//   { question: Question.accommodation_changes, value: CommonOption.made_changes },
//   { question: Question.accommodation_changes_made_changes_details, value: 'Some details' },
//   { question: Question.accommodation_practitioner_analysis_strengths_or_protective_factors, value: CommonOption.yes },
//   {
//     question: Question.accommodation_practitioner_analysis_strengths_or_protective_factors_yes_details,
//     value: 'Some details',
//   },
//   { question: Question.accommodation_practitioner_analysis_risk_of_serious_harm, value: CommonOption.yes },
//   { question: Question.accommodation_practitioner_analysis_risk_of_serious_harm_yes_details, value: 'Some details' },
//   { question: Question.accommodation_practitioner_analysis_risk_of_reoffending, value: CommonOption.yes },
//   { question: Question.accommodation_practitioner_analysis_risk_of_reoffending_yes_details, value: 'Some details' },
// ]
const answers = [
  { question: Question.accommodation_community_current_accommodation, value: Option.settled },
  { question: Question.accommodation_community_current_accommodation_settled, value: CommonOption.yes },
  { question: Question.accommodation_community_suitable_housing_location, value: CommonOption.no },
  {
    question: Question.accommodation_community_suitable_housing_location_concerns,
    value: [Option.criminal_associates, Option.victimisation, CommonOption.other],
  },
  {
    question: Question.accommodation_community_suitable_housing_location_concerns_other_details,
    value: details('location concerns other'),
  },
  { question: Question.accommodation_community_suitable_housing, value: Option.yes_with_concerns },
  {
    question: Question.accommodation_community_suitable_housing_concerns,
    value: [Option.facilities, Option.overcrowding, CommonOption.other],
  },
  {
    question: Question.accommodation_community_suitable_housing_concerns_other_details,
    value: details('housing concerns other'),
  },
  { question: Question.accommodation_changes, value: CommonOption.making_changes },
  {
    question: Question.accommodation_changes_making_changes_details,
    value: details('actively making changings'),
  },
]

const noAccommodation = [
  { question: Question.accommodation_community_current_accommodation, value: Option.no_accommodation },
  { question: Question.accommodation_community_no_accommodation_reason, value: Option.alcohol_problems },
]

const userSubmittedSteps = [
  Step.accommodation_community_current_accommodation.code,
  Step.accommodation_community_current_accommodation_settled.code,
  Step.accommodation_community_suitable_housing_location.code,
  Step.accommodation_community_suitable_housing_location_concerns.code,
  Step.accommodation_community_suitable_housing.code,
  Step.accommodation_community_suitable_housing_concerns.code,
  Step.accommodation_changes.code,
  Step.accommodation_summary.code,
]

test.describe('Accommodation character counts', () => {
  test('Housing location is unsuitable concerns', async ({ page, openSection }) => {
    const section = await openSection(accommodation, answers, userSubmittedSteps)
    const accommodationPage = new AccommodationPage(page)
    const { questions } = accommodationPage
    await page.goto(`${section}/${Step.accommodation_community_suitable_housing_location_concerns.path}`)

    await questions.accommodation_community_suitable_housing_location_concerns.option(CommonOption.other).check()

    await expectTheLimitsOnThePage(accommodationPage)
  })

  test('Housing is suitable with concerns', async ({ page, openSection }) => {
    const section = await openSection(accommodation, answers, userSubmittedSteps)
    const accommodationPage = new AccommodationPage(page)
    const { questions } = accommodationPage
    await page.goto(`${section}/${Step.accommodation_community_suitable_housing_concerns.path}`)

    await questions.accommodation_community_suitable_housing_concerns.option(CommonOption.other).check()

    await expectTheLimitsOnThePage(accommodationPage)
  })

  test('No accommodation reasons', async ({ page, openSection }) => {
    const section = await openSection(accommodation, noAccommodation, userSubmittedSteps)
    const accommodationPage = new AccommodationPage(page)
    const { questions } = accommodationPage
    await page.goto(`${section}/${Step.accommodation_community_no_accommodation_reason.path}`)

    await questions.accommodation_community_no_accommodation_reason.option(CommonOption.other).check()

    await expectTheLimitsOnThePage(accommodationPage)
  })

  // a test per option, because each one reveals its own details field
  for (const option of changeOptions) {
    test(`Wants to make changes ${option}`, async ({ page, openSection }) => {
      const section = await openSection(accommodation, answers, userSubmittedSteps)
      const accommodationPage = new AccommodationPage(page)
      const { questions } = accommodationPage
      await page.goto(`${section}/${Step.accommodation_changes.path}`)

      await questions.accommodation_changes.option(option).check()

      await expectTheLimitsOnThePage(accommodationPage)
    })
  }

  for (const answer of [CommonOption.yes, CommonOption.no]) {
    test(`accommodation-summary: practitioner analysis ${answer}`, async ({ page, openSection }) => {
      const section = await openSection(accommodation, answers, userSubmittedSteps)
      const accommodationPage = new AccommodationPage(page)
      const { questions } = accommodationPage
      await page.goto(`${section}/${Step.accommodation_summary.path}#practitioner-analysis`)

      await questions.accommodation_practitioner_analysis_strengths_or_protective_factors.option(answer).check()
      await questions.accommodation_practitioner_analysis_risk_of_serious_harm.option(answer).check()
      await questions.accommodation_practitioner_analysis_risk_of_reoffending.option(answer).check()

      await expectTheLimitsOnThePage(accommodationPage, { save: accommodationPage.markComplete })
    })
  }
})
