import { expect } from '@playwright/test'
import { test, TargetService } from '../../support/fixtures'
import SessionTimeoutModalPage from '../../pages/sentencePlan/sessionTimeoutModalPage'
import PlanOverviewPage from '../../pages/sentencePlan/planOverviewPage'
import { navigateToSentencePlan } from './sentencePlanUtils'

async function forceShowSessionTimeoutModal(page: import('@playwright/test').Page) {
  await page.waitForFunction(() => {
    const modal = document.querySelector('moj-session-timeout-modal') as any
    return modal && typeof modal.showModal === 'function'
  })
  await page.evaluate(() => {
    const modal = document.querySelector('moj-session-timeout-modal') as any
    modal.showModal()
  })
  await page.waitForTimeout(100)
}

test.describe('Session Timeout Modal', () => {
  test('Delete link redirects to unsaved-information-deleted page', async ({
    page,
    createSession,
    sentencePlanBuilder,
  }) => {
    const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
    await sentencePlanBuilder.extend(sentencePlanId).save()

    await navigateToSentencePlan(page, handoverLink)
    await PlanOverviewPage.verifyOnPage(page)

    const modalPage = SessionTimeoutModalPage.getInstance(page)
    await expect(modalPage.modal).toBeHidden()

    await forceShowSessionTimeoutModal(page)

    await expect(modalPage.modal).toBeVisible()
    await expect(modalPage.heading).toContainText('Your unsaved information will be deleted soon')

    await modalPage.clickDelete()

    await expect(page).toHaveURL(/\/unsaved-information-deleted/)
    await expect(page.locator('h1')).toContainText('Your unsaved information has been deleted')
    await expect(page.locator('.govuk-grid-column-two-thirds')).toContainText('This is to protect your information')
    await expect(page.getByRole('button', { name: 'Go to the plan' })).toBeVisible()
  })

  test('Continue button extends session and closes modal', async ({ page, createSession, sentencePlanBuilder }) => {
    const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
    await sentencePlanBuilder.extend(sentencePlanId).save()

    await navigateToSentencePlan(page, handoverLink)
    await PlanOverviewPage.verifyOnPage(page)

    const modalPage = SessionTimeoutModalPage.getInstance(page)
    await forceShowSessionTimeoutModal(page)

    await expect(modalPage.modal).toBeVisible()

    const responsePromise = page.waitForResponse(
      response => response.url().includes('/session/extend') && response.request().method() === 'POST',
    )

    await modalPage.clickContinue()

    const response = await responsePromise
    expect(response.status()).toBe(204)

    await expect(modalPage.modal).toBeHidden()
    await expect(page).toHaveURL(/\/plan\/overview/)
    await PlanOverviewPage.verifyOnPage(page)
  })

  test('countdown expires and automatically redirects to unsaved-information-deleted page', async ({
    page,
    createSession,
    sentencePlanBuilder,
  }) => {
    const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
    await sentencePlanBuilder.extend(sentencePlanId).save()

    await navigateToSentencePlan(page, handoverLink)
    await PlanOverviewPage.verifyOnPage(page)

    const modalPage = SessionTimeoutModalPage.getInstance(page)
    await forceShowSessionTimeoutModal(page)

    await expect(modalPage.modal).toBeVisible()

    const countdownText = await modalPage.getCountdownText()
    expect(countdownText).toMatch(/\d+ (minutes?|seconds?)/)

    await page.evaluate(() => {
      const modal = document.querySelector('moj-session-timeout-modal') as any
      if (modal) modal.handleSessionExpired()
    })

    await expect(page).toHaveURL(/\/unsaved-information-deleted/)
    await expect(page.locator('h1')).toContainText('Your unsaved information has been deleted')
  })
})
