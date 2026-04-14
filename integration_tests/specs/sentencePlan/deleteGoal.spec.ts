import { expect } from '@playwright/test'
import { test, TargetService } from '../../support/fixtures'
import PlanOverviewPage from '../../pages/sentencePlan/planOverviewPage'
import { currentGoals, futureGoals } from '../../builders/sentencePlanFactories'
import { checkAccessibility, navigateToSentencePlan, sentencePlanV1UrlBuilders } from './sentencePlanUtils'

test.describe('Delete goal journey', () => {
  test.describe('redirect after deletion', () => {
    test('deleting a current goal redirects to current goals tab', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      const plan = await sentencePlanBuilder.extend(sentencePlanId).withGoals(currentGoals(1)).save()
      const goalUuid = plan.goals[0].uuid

      await navigateToSentencePlan(page, handoverLink)
      await page.goto(sentencePlanV1UrlBuilders.goalConfirmDelete(goalUuid))

      await checkAccessibility(page)

      await page.getByRole('button', { name: 'Confirm' }).click()

      await expect(page).toHaveURL(/type=current/)
      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)
      await expect(planOverviewPage.notificationBanner).toBeVisible()
      await expect(planOverviewPage.notificationBannerText).toContainText(/You deleted a goal from .+'s plan/i)
    })

    test('deleting a future goal redirects to future goals tab', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      const plan = await sentencePlanBuilder.extend(sentencePlanId).withGoals(futureGoals(1)).save()
      const goalUuid = plan.goals[0].uuid

      await navigateToSentencePlan(page, handoverLink)
      await page.goto(sentencePlanV1UrlBuilders.goalConfirmDelete(goalUuid))

      await page.getByRole('button', { name: 'Confirm' }).click()

      await expect(page).toHaveURL(/type=future/)
    })
  })

  test.describe('access control', () => {
    test('redirects to plan overview when plan is agreed', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      const plan = await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals(currentGoals(1))
        .withAgreementStatus('AGREED')
        .save()
      const goalUuid = plan.goals[0].uuid

      await navigateToSentencePlan(page, handoverLink)
      await page.goto(sentencePlanV1UrlBuilders.goalConfirmDelete(goalUuid))

      // Should redirect to plan overview since delete is only for draft plans
      await PlanOverviewPage.verifyOnPage(page)
    })
  })
})
