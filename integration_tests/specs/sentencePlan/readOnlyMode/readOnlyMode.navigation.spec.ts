import { expect } from '@playwright/test'
import { test, TargetService } from '../../../support/fixtures'
import PlanOverviewPage from '../../../pages/sentencePlan/planOverviewPage'
import { currentGoals } from '../../../builders/sentencePlanFactories'
import { navigateToSentencePlan } from '../sentencePlanUtils'

test.describe('READ_ONLY Access Mode', () => {
  test.describe('Privacy Screen', () => {
    test('skips privacy screen and lands directly on plan overview', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, handoverLink } = await createSession({
        targetService: TargetService.SENTENCE_PLAN,
        accessMode: 'READ_ONLY',
      })
      await sentencePlanBuilder.extend(sentencePlanId).save()

      // Navigate via handover link - should NOT show privacy screen
      await page.goto(handoverLink)

      // Should land directly on plan overview without privacy screen
      await expect(page).toHaveURL(/\/plan\/overview/)
      await PlanOverviewPage.verifyOnPage(page)
    })
  })

  test.describe('Header Buttons', () => {
    test('hides Create Goal button', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({
        targetService: TargetService.SENTENCE_PLAN,
        accessMode: 'READ_ONLY',
      })
      await sentencePlanBuilder.extend(sentencePlanId).save()

      await navigateToSentencePlan(page, handoverLink)
      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

      await expect(planOverviewPage.createGoalButton).not.toBeVisible()
    })

    test('hides Agree Plan button', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({
        targetService: TargetService.SENTENCE_PLAN,
        accessMode: 'READ_ONLY',
      })
      await sentencePlanBuilder.extend(sentencePlanId).withGoals(currentGoals(1)).save()

      await navigateToSentencePlan(page, handoverLink)
      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

      await expect(planOverviewPage.agreePlanButton).not.toBeVisible()
    })
  })

  test.describe('Sub-navigation', () => {
    test('tab navigation still works in READ_ONLY mode', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({
        targetService: TargetService.SENTENCE_PLAN,
        accessMode: 'READ_ONLY',
      })
      await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals([
          { title: 'Current Goal', status: 'ACTIVE', areaOfNeed: 'accommodation', targetDate: '2025-06-01' },
          { title: 'Future Goal', status: 'FUTURE', areaOfNeed: 'finances' },
        ])
        .save()

      await navigateToSentencePlan(page, handoverLink)
      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

      // Should be on current tab by default
      await expect(page).toHaveURL(/type=current/)

      // Switch to future tab
      await planOverviewPage.clickFutureGoalsTab()
      await expect(page).toHaveURL(/type=future/)

      const goalTitle = await planOverviewPage.getGoalCardTitle(0)
      expect(goalTitle).toContain('Future Goal')
    })
  })

  test.describe('Primary navigation', () => {
    test('hides primary navigation links in READ_ONLY mode', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({
        targetService: TargetService.SENTENCE_PLAN,
        accessMode: 'READ_ONLY',
      })
      await sentencePlanBuilder.extend(sentencePlanId).withGoals(currentGoals(1)).save()

      await navigateToSentencePlan(page, handoverLink)
      await PlanOverviewPage.verifyOnPage(page)

      await expect(page.getByLabel('Primary navigation')).toHaveCount(0)
    })
  })
})
