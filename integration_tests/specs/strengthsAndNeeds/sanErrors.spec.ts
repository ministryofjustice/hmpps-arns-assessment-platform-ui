import AccommodationPage from 'pages/strengthsAndNeeds/accommodationPage'
import EmploymentAndEducationPage from 'pages/strengthsAndNeeds/employmentAndEducationPage'
import { expect, test, TargetService } from '../../support/fixtures'
import { navigateToStrengthsAndNeeds } from './sanUtils'

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

  test('Access denied', async ({ baseURL, page, createSession, strengthsAndNeedsBuilder }) => {
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
    await expect(accommodationPage.returnToOASys).toHaveAttribute('href', baseURL)
  })
})
