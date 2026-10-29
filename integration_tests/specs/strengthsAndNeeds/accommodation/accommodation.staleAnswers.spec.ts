import { expect } from '@playwright/test'
import { CommonOption } from '@server/forms/strengths-and-needs/versions/v1.0/constants/commonOption'
import { Option } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/accommodation/constants/option'
import { Question } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/accommodation/constants/question'
import { Step } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/accommodation/constants/step'
import AccommodationPage from 'pages/strengthsAndNeeds/accommodationPage'
import { test, TargetService } from '../../../support/fixtures'
import { navigateToStrengthsAndNeeds, storedAnswers } from '../sanUtils'

test.describe('Stale answers', () => {
  // Who they live with is asked on details but only applies to some kinds of
  // accommodation. Changing the kind must not let the section
  // be completed until details has been saved again and dropped the answer.
  test('accommodation status: changing to approved premises removes who they live with', async ({
    page,
    createSession,
    strengthsAndNeedsBuilder,
    aapClient,
  }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId)
      .withAnswers([
        { question: Question.current_accommodation, value: Option.temporary },
        { question: Question.type_of_temporary_accommodation, value: Option.short_term },
        { question: Question.living_with, value: [Option.family] },
        { question: Question.suitable_housing_location, value: CommonOption.yes },
        { question: Question.suitable_housing, value: CommonOption.yes },
        { question: Question.suitable_housing_planned, value: CommonOption.yes },
        { question: Question.future_accommodation_type, value: Option.buying_house },
        { question: Question.accommodation_changes, value: CommonOption.not_present },
      ])
      .withUserSubmittedSteps([
        Step.accommodation_status.code,
        Step.accommodation_details.code,
        Step.accommodation_summary.code,
      ])
      .save()

    await navigateToStrengthsAndNeeds(page, handoverLink, Step.accommodation_summary.path)
    const accommodationPage = new AccommodationPage(page)
    const { questions } = accommodationPage
    const accommodationUrl = page.url().replace(Step.accommodation_summary.path, '')

    await page.goto(`${accommodationUrl}${Step.accommodation_status.path}`)
    await questions.type_of_temporary_accommodation.option(Option.approved_premises).check()
    await accommodationPage.saveAndContinue.click()
    await expect(page).toHaveURL(`${accommodationUrl}${Step.accommodation_details.path}`)

    await page.goto(`${accommodationUrl}${Step.accommodation_summary.path}`)
    await expect(page).toHaveURL(`${accommodationUrl}${Step.accommodation_status.path}`)

    await page.goto(`${accommodationUrl}${Step.accommodation_details.path}`)
    await accommodationPage.saveAndContinue.click()
    await expect(page).toHaveURL(`${accommodationUrl}${Step.accommodation_summary.path}`)

    const answers = await storedAnswers(aapClient, sanAssessmentId)
    expect(answers).not.toHaveProperty(Question.living_with)
  })
})
