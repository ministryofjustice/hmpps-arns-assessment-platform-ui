import { expect } from '@playwright/test'
import PrivacyScreenPage from 'pages/sentencePlan/privacyScreenPage'
import { test, TargetService } from '../../support/fixtures'
import { buildPageTitle } from './sanUtils'

// The screen itself is covered by the sentence plan privacy spec, these cover the SAN wiring.
test.describe('Strengths and needs privacy screen', () => {
  test('gates the assessment until it is confirmed, then is not shown again', async ({
    page,
    createSession,
    strengthsAndNeedsBuilder,
  }) => {
    const { handoverLink } = await createSession({ targetService: TargetService.STRENGTHS_AND_NEEDS })
    await strengthsAndNeedsBuilder.fresh().save()

    await page.goto(handoverLink)

    await expect(page).toHaveURL(/\/strengths-and-needs\/privacy/)
    await expect(page).toHaveTitle(buildPageTitle('Close other applications'))

    const privacyPage = await PrivacyScreenPage.verifyOnPage(page)
    await privacyPage.confirmAndContinue()
    await expect(page).toHaveURL(/current-accommodation/)

    await page.goto('/strengths-and-needs/v1.0/accommodation/current-accommodation')
    await expect(page).toHaveURL(/current-accommodation/)
  })
})
