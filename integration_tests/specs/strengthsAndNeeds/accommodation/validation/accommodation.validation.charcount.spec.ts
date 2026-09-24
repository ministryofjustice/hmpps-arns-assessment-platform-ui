import { Step } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/accommodation/constants/step'
import { CommonOption } from '@server/forms/strengths-and-needs/versions/v1.0/constants/commonOption'
import { Option } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/accommodation/constants/option'
import { Question } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/accommodation/constants/question'
import AccommodationPage from 'pages/strengthsAndNeeds/accommodationPage'
import { expectTheLimitsOnThePage } from '../../characterCounts'
import { test } from '../../fixtures'
import { changeOptions, accommodation } from '../../sanUtils'

/**
 * Some accommodation fields have character limits. These tests exercise the page to reveal the character count
 * fields, then check each one holds to its limit: one character over fails validation, exactly the limit passes.
 */

const answers = [
  { question: Question.current_accommodation, value: Option.settled },
  { question: Question.type_of_settled_accommodation, value: Option.homeowner },
  { question: Question.living_with, value: [Option.family] },
  { question: Question.suitable_housing_location, value: CommonOption.yes },
  { question: Question.suitable_housing, value: CommonOption.yes },
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
]

const noAccommodation = [
  { question: Question.current_accommodation, value: Option.no_accommodation },
  { question: Question.type_of_no_accommodation, value: Option.homeless },
]

test.describe('Accommodation character counts', () => {
  test('accommodation-details: who they live with, and concerns about the area and the housing', async ({
    page,
    openSection,
  }) => {
    const section = await openSection(accommodation, answers)
    const accommodationPage = new AccommodationPage(page)
    const { questions } = accommodationPage
    await page.goto(`${section}/${Step.accommodation_details.path}`)

    await questions.living_with.option(Option.partner).check()
    await questions.living_with.option(CommonOption.other).check()
    await questions.suitable_housing_location.option(CommonOption.no).check()
    await questions.suitable_housing_location_concerns.option(CommonOption.other).check()
    await questions.suitable_housing.option(Option.yes_with_concerns).check()
    await questions.suitable_housing_concerns.option(CommonOption.other).check()

    await expectTheLimitsOnThePage(accommodationPage)
  })

  test('accommodation-details: housing is unsuitable', async ({ page, openSection }) => {
    const section = await openSection(accommodation, answers)
    const accommodationPage = new AccommodationPage(page)
    const { questions } = accommodationPage
    await page.goto(`${section}/${Step.accommodation_details.path}`)

    await questions.suitable_housing.option(CommonOption.no).check()
    await questions.unsuitable_housing_concerns.option(CommonOption.other).check()

    await expectTheLimitsOnThePage(accommodationPage)
  })

  // a test per option, because each one reveals its own details field
  for (const option of changeOptions) {
    test(`accommodation-details: wants to make changes ${option}`, async ({ page, openSection }) => {
      const section = await openSection(accommodation, answers)
      const accommodationPage = new AccommodationPage(page)
      const { questions } = accommodationPage
      await page.goto(`${section}/${Step.accommodation_details.path}`)

      await questions.accommodation_changes.option(option).check()

      await expectTheLimitsOnThePage(accommodationPage)
    })
  }

  for (const option of [Option.awaiting_assessment, Option.awaiting_placement, CommonOption.other]) {
    test(`accommodation-details: no accommodation, and accommodation planned ${option}`, async ({
      page,
      openSection,
    }) => {
      const section = await openSection(accommodation, [...answers, ...noAccommodation])
      const accommodationPage = new AccommodationPage(page)
      const { questions } = accommodationPage
      await page.goto(`${section}/${Step.accommodation_details.path}`)

      await questions.no_accommodation_reason.option(CommonOption.other).check()
      await questions.suitable_housing_planned.option(CommonOption.yes).check()
      await questions.future_accommodation_type.option(option).check()

      await expectTheLimitsOnThePage(accommodationPage)
    })
  }

  for (const answer of [CommonOption.yes, CommonOption.no]) {
    test(`accommodation-summary: practitioner analysis ${answer}`, async ({ page, openSection }) => {
      const section = await openSection(accommodation, answers)
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
