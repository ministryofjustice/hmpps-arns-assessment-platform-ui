import { expect, Page } from '@playwright/test'
import SessionTimeoutModalPage from 'pages/sentencePlan/sessionTimeoutModalPage'
import { test, TargetService } from '../../support/fixtures'
import { navigateToStrengthsAndNeeds } from './sanUtils'

async function forceShowSessionTimeoutModal(page: Page) {
  await page.waitForFunction(() => {
    const modal = document.querySelector('moj-session-timeout-modal') as any
    return modal && typeof modal.showModal === 'function'
  })
  await page.evaluate(() => {
    const modal = document.querySelector('moj-session-timeout-modal') as any
    modal.showModal()
  })
  await expect(SessionTimeoutModalPage.getInstance(page).modal).toBeVisible()
}

// The modal behaviour is covered by the sentence plan session timeout spec, these cover the SAN wording.
test.describe('Strengths and needs session timeout', () => {
  test('shows SAN wording and sends the user to the shared timeout page', async ({
    page,
    makeAxeBuilder,
    createSession,
    strengthsAndNeedsBuilder,
  }) => {
    const { handoverLink } = await createSession({ targetService: TargetService.STRENGTHS_AND_NEEDS })
    await strengthsAndNeedsBuilder.fresh().save()
    await navigateToStrengthsAndNeeds(page, handoverLink)

    const modalPage = SessionTimeoutModalPage.getInstance(page)
    await forceShowSessionTimeoutModal(page)

    await expect(modalPage.heading).toHaveText('Your session will end soon')
    await expect(page.locator('#session-timeout-description')).toContainText('Your information has been saved.')
    await expect(page.getByRole('button', { name: 'Continue using strengths and needs' })).toBeVisible()

    const accessibilityScanResults = await makeAxeBuilder().include('[data-qa="session-timeout"]').analyze()
    expect(accessibilityScanResults.violations).toEqual([])

    await page.getByRole('link', { name: 'End session' }).click()

    await expect(page).toHaveURL(/\/platform\/session-timeout\?service=strengths-and-needs&auth=OASYS/)
    await expect(page.getByRole('heading', { name: 'Your session has ended' })).toBeVisible()
    await expect(page.getByTestId('session-timeout-content')).toContainText('Your information has been saved.')
    await expect(page.getByRole('button', { name: 'Go to strengths and needs' })).toHaveAttribute(
      'href',
      '/sign-in/handover?service=strengths-and-needs',
    )
  })
})
