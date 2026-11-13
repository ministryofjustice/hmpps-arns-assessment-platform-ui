import { expect } from '@playwright/test'
import { CommonOption } from '@server/forms/strengths-and-needs/versions/v2.0/constants/commonOption'
import { Option } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/accommodation/constants/option'
import { Question } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/accommodation/constants/question'
import { Step } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/accommodation/constants/step'
import AccommodationPage from 'pages/strengthsAndNeedsV2/accommodationPage'
import { test, TargetService } from '../../../support/fixtures'
import { navigateToStrengthsAndNeeds, storedAnswers } from '../sanUtils'
import { details } from '../../../testUtils'

test.describe('Stale answers', () => {
  // Question that are dependent on previous answers must be cleared on change.
  // e.g. community_suitable_housing_location_concerns and community_suitable_housing_location_concerns_other_details
  // must be cleared when community_suitable_housing_location changes from No to Yes
  test('accommodation: changing suitable housing location from no to yes removes housing location concerns', async ({
    page,
    createSession,
    strengthsAndNeedsBuilder,
    aapClient,
  }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })

    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId).withAnswers([
        { question: Question.community_current_accommodation, value: CommonOption.yes },
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
        { question: Question.community_suitable_housing, value: Option.yes_with_concerns },
        {
          question: Question.community_suitable_housing_concerns,
          value: [Option.facilities, Option.overcrowding, CommonOption.other],
        },
        {
          question: Question.community_suitable_housing_concerns_other_details,
          value: details('housing concerns other'),
        },
        { question: Question.accommodation_changes, value: CommonOption.making_changes },
        {
          question: Question.accommodation_changes_making_changes_details,
          value: details('actively making changings'),
        },
      ])
      .withUserSubmittedSteps([
        Step.community_current_accommodation.code,
        Step.community_current_accommodation_settled.code,
        Step.community_suitable_housing_location.code,
        Step.community_suitable_housing_location_concerns.code,
        Step.community_suitable_housing.code,
        Step.community_suitable_housing_concerns.code,
        Step.accommodation_changes.code,
        Step.accommodation_summary.code,
      ])
      .save()

    await navigateToStrengthsAndNeeds(page, handoverLink, Step.accommodation_summary.path)
    const accommodationPage = new AccommodationPage(page)
    const { questions } = accommodationPage
    const accommodationUrl = page.url().replace(Step.accommodation_summary.path, '')

    await page.goto(`${accommodationUrl}${Step.community_suitable_housing_location.path}`)
    await questions.community_suitable_housing_location.option(CommonOption.yes).check()
    await accommodationPage.saveAndContinue.click()

    await expect(page).toHaveURL(`${accommodationUrl}${Step.community_suitable_housing.path}`)
    await accommodationPage.saveAndContinue.click()
    await expect(page).toHaveURL(`${accommodationUrl}${Step.community_suitable_housing_concerns.path}`)
    await accommodationPage.saveAndContinue.click()
    await expect(page).toHaveURL(`${accommodationUrl}${Step.accommodation_changes.path}`)
    await accommodationPage.saveAndContinue.click()
    await expect(page).toHaveURL(`${accommodationUrl}${Step.accommodation_summary.path}`)

    const answers = await storedAnswers(aapClient, sanAssessmentId)
    expect(answers).not.toHaveProperty(Question.community_suitable_housing_location_concerns)
    expect(answers).not.toHaveProperty(Question.community_suitable_housing_location_concerns_other_details)
  })
})
