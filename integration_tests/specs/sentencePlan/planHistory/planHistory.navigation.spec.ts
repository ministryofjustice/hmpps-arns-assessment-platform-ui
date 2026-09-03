import { expect } from '@playwright/test'
import { test, TargetService } from '../../../support/fixtures'
import PlanHistoryPage from '../../../pages/sentencePlan/planHistoryPage'
import { handlePrivacyScreenIfPresent } from '../sentencePlanUtils'

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

    const viewHistoryLink = page.getByRole('link', { name: /View plan history/i })
    await expect(viewHistoryLink).toBeVisible()

    const createGoalButton = page.getByRole('button', { name: /Create goal/i })
    await expect(createGoalButton).toBeVisible()

    await viewHistoryLink.click()

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

    await page.goto(`/sentence-plan/v1.0/plan/plan-history`)

    await expect(page).toHaveURL(/overview/)
  })
})
