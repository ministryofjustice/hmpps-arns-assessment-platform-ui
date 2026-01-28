import { expect } from '@playwright/test'
import { test, TargetService } from '../../support/fixtures'
import PlanHistoryPage from '../../pages/sentencePlan/planHistoryPage'
import { handlePrivacyScreenIfPresent } from './sentencePlanUtils'

test.describe('Plan History - Navigation', () => {
  test('can navigate to plan history from plan overview', async ({ page, createSession, sentencePlanBuilder }) => {
    const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
    await sentencePlanBuilder
      .extend(sentencePlanId)
      .withGoal({
        title: 'Test goal',
        areaOfNeed: 'accommodation',
        status: 'ACTIVE',
        steps: [{ actor: 'probation_practitioner', description: 'Test step' }],
      })
      .withAgreementStatus('AGREED')
      .save()

    await page.goto(handoverLink)
    await handlePrivacyScreenIfPresent(page)

    // Verify the "View plan history" link is visible
    const viewHistoryLink = page.getByRole('link', { name: /View plan history/i })
    await expect(viewHistoryLink).toBeVisible()

    // Click the link
    await viewHistoryLink.click()

    // Verify we're on the plan history page
    await expect(page).toHaveURL(/plan-history/)
    await PlanHistoryPage.verifyOnPage(page)
  })

  test('redirects to plan overview when plan has no agreement status', async ({
    page,
    createSession,
    sentencePlanBuilder,
  }) => {
    // Create a plan without any agreement (draft state)
    const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
    await sentencePlanBuilder
      .extend(sentencePlanId)
      .withGoal({
        title: 'Draft goal',
        areaOfNeed: 'accommodation',
        status: 'ACTIVE',
      })
      .save()

    await page.goto(handoverLink)
    await handlePrivacyScreenIfPresent(page)

    // Try to navigate directly to plan history
    await page.goto(`/sentence-plan/v1.0/plan/plan-history`)

    // Should be redirected back to plan overview
    await expect(page).toHaveURL(/overview/)
  })
})
