import { expect } from '@playwright/test'
import PrivacyScreenPage from 'pages/sentencePlan/privacyScreenPage'
import { test, TargetService } from '../../support/fixtures'
import { buildPageTitle, sanFormPath, v2Path } from './sanUtils'

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
    // TODO Uncomment it during ACT-750 Accommodation framework
    // await expect(page).toHaveURL(/accommodation-status/)
    //
    // await page.goto(`${baseURL}/${sanFormPath}/${v2Path}/edit/${sanAssessmentId}/accommodation/accommodation-status`)
    // await expect(page).toHaveURL(/alcohol-use-details/)

    await expect(page).toHaveURL(/alcohol-use-details/)

    await page.goto(`${baseURL}/${sanFormPath}/${v2Path}/edit/${sanAssessmentId}/alcohol-use/alcohol-use-details`)
    await expect(page).toHaveURL(/alcohol-use-details/)
  })

  // TODO Uncomment it during ACT-750 Accommodation framework (because of entryWhen: isReadOnlyMode)
  // test('is skipped for a read only assessment (regardless of the plan access mode)', async ({
  //   page,
  //   createSession,
  //   strengthsAndNeedsBuilder,
  // }) => {
  //   const { handoverLink } = await createSession({
  //     targetService: TargetService.STRENGTHS_AND_NEEDS,
  //     accessMode: 'READ_ONLY',
  //     planAccessMode: 'READ_WRITE',
  //   })
  //   await strengthsAndNeedsBuilder.fresh().save()

  //   await page.goto(handoverLink)

  //   await expect(page).toHaveURL(/accommodation-analysis/)
  // })
})
