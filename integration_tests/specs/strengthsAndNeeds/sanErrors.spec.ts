import AccommodationPage from 'pages/strengthsAndNeeds/accommodationPage'
import EmploymentAndEducationPage from 'pages/strengthsAndNeeds/employmentAndEducationPage'
import { login } from 'testUtils'
import { expect, test, TargetService } from '../../support/fixtures'
import { employment, navigateToStrengthsAndNeeds, sanFormPath, v1Path } from './sanUtils'

test.describe('Errors', () => {
  test('Page not found', async ({ baseURL, page, createSession, strengthsAndNeedsBuilder }) => {
    const { handoverLink } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
      accessMode: 'READ_ONLY',
      planAccessMode: 'READ_WRITE',
    })
    await strengthsAndNeedsBuilder.fresh().save()

    await EmploymentAndEducationPage.navigateToEmploymentAndEducation(page, handoverLink, baseURL, 'not-found')

    await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible()
  })

  test('Access denied', async ({ page, createSession, strengthsAndNeedsBuilder }) => {
    const { handoverLink } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
      accessMode: 'READ_ONLY',
      planAccessMode: 'READ_WRITE',
    })
    await strengthsAndNeedsBuilder.fresh().save()

    await navigateToStrengthsAndNeeds(page, handoverLink)
    const accommodationPage = await AccommodationPage.verifyOnPage(page, 'What type of accommodation')
    await navigateToStrengthsAndNeeds(page, handoverLink, 'access-denied')

    await expect(page.getByRole('heading', { name: 'You need to sign in to use this service' })).toBeVisible()
    await expect(accommodationPage.returnToOASys).toBeVisible()
  })
})

test.describe('HMPPS Auth error', () => {
  test('forbidden', async ({ baseURL, page, createSession, strengthsAndNeedsBuilder }) => {
    const { sanAssessmentId } = await createSession({ targetService: TargetService.STRENGTHS_AND_NEEDS })
    await strengthsAndNeedsBuilder.extend(sanAssessmentId).save()

    // HMPPS Auth login
    await login(page)

    await page.goto(`${baseURL}${sanFormPath}${v1Path}${employment}/current-employment`)

    await expect(page.getByRole('heading', { name: 'there is a problem with the service' })).toBeVisible()
  })
})
