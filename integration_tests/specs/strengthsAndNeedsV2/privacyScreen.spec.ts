import { expect } from '@playwright/test'
import PrivacyScreenPage from 'pages/sentencePlan/privacyScreenPage'
import { Step } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/accommodation/constants/step'
import { test, TargetService } from '../../support/fixtures'
import { accommodation, buildEditUrl, buildPageTitle } from './sanUtils'

// The screen itself is covered by the sentence plan privacy spec, these cover the SAN wiring.
test.describe('Strengths and needs privacy screen', () => {
  test('gates the assessment until it is confirmed, then is not shown again', async ({
    page,
    createSession,
    strengthsAndNeedsBuilder,
    baseURL,
  }) => {
    const { handoverLink, sanAssessmentId } = await createSession({ targetService: TargetService.STRENGTHS_AND_NEEDS })
    await strengthsAndNeedsBuilder.fresh().save()

    await page.goto(handoverLink)

    await expect(page).toHaveURL(/\/strengths-and-needs\/privacy/)
    await expect(page).toHaveTitle(buildPageTitle('Close other applications'))

    const privacyPage = await PrivacyScreenPage.verifyOnPage(page)
    await privacyPage.confirmAndContinue()

    await expect(page).toHaveURL(new RegExp(Step.community_current_accommodation.path))

    await page.goto(
      buildEditUrl(baseURL, sanAssessmentId, `${accommodation}/${Step.community_current_accommodation.path}`),
    )
    await expect(page).toHaveURL(new RegExp(Step.community_current_accommodation.path))
  })

  test('is skipped for a read only assessment (regardless of the plan access mode)', async ({
    page,
    createSession,
    strengthsAndNeedsBuilder,
  }) => {
    const { handoverLink } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
      accessMode: 'READ_ONLY',
      planAccessMode: 'READ_WRITE',
    })
    await strengthsAndNeedsBuilder.fresh().save()

    await page.goto(handoverLink)

    await expect(page).toHaveURL(new RegExp(Step.accommodation_analysis.path))
  })
})
