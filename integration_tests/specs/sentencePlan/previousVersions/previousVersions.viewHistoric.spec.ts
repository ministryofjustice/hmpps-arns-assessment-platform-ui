import { expect, Page } from '@playwright/test'
import { test, TargetService } from '../../../support/fixtures'
import { currentGoals, futureGoals, mixedGoals } from '../../../builders/sentencePlanFactories'
import { buildPageTitle, navigateToSentencePlan, sentencePlanPageTitles } from '../sentencePlanUtils'
import PreviousVersionsPage from '../../../pages/sentencePlan/previousVersionsPage'
import HistoricPlanPage from '../../../pages/sentencePlan/historicPlanPage'

test.describe('View Historic Plan', () => {
  const startOfDay = new Date(2026, 0, 1, 9)
  const endOfDay = new Date(2026, 0, 1, 17)

  const navigateToHistoricPlan = async (
    page: Page,
    handoverLink: string,
  ): Promise<{ historicPlanPage: HistoricPlanPage; newPage: Page }> => {
    await navigateToSentencePlan(page, handoverLink)
    await page.getByRole('link', { name: /View previous versions/i }).click()
    const previousVersionsPage = await PreviousVersionsPage.verifyOnPage(page)

    const [newPage] = await Promise.all([
      page.waitForEvent('popup'),
      previousVersionsPage.clickViewVersionOnDate('1 January 2026'),
    ])

    await newPage.waitForLoadState()
    const historicPlanPage = await HistoricPlanPage.verifyOnPage(newPage)
    await expect(newPage).toHaveTitle(buildPageTitle(sentencePlanPageTitles.historicPlan))
    await expect(historicPlanPage.alertHeading).toHaveCount(1)
    await expect(historicPlanPage.alertHeading).toContainText('This version is from 1st January 2026')
    return { historicPlanPage, newPage }
  }

  test.describe('Empty State', () => {
    test('shows empty message when no current goals exist', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder.extend(sentencePlanId).withEventsBackdated(startOfDay, endOfDay).save()

      const { historicPlanPage } = await navigateToHistoricPlan(page, handoverLink)

      await expect(historicPlanPage.noGoalsMessage).toBeVisible()
      await expect(historicPlanPage.noGoalsMessage).toContainText(/does not have any goals to work on now/i)
    })

    test('shows empty message when no future goals exist', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder.extend(sentencePlanId).withEventsBackdated(startOfDay, endOfDay).save()

      const { historicPlanPage, newPage } = await navigateToHistoricPlan(page, handoverLink)

      await historicPlanPage.clickFutureGoalsTab()
      await expect(newPage).toHaveURL(/type=future/)

      await expect(historicPlanPage.noFutureGoalsMessage).toBeVisible()
      await expect(historicPlanPage.noFutureGoalsMessage).toContainText(/does not have any future goals/i)
    })
  })

  test.describe('Goal Display', () => {
    test('displays current goals in Goals to work on now section', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals(currentGoals(2))
        .withEventsBackdated(startOfDay, endOfDay)
        .save()

      const { historicPlanPage } = await navigateToHistoricPlan(page, handoverLink)

      const goalCount = await historicPlanPage.getGoalCount()
      expect(goalCount).toBe(2)

      const firstGoalTitle = await historicPlanPage.getGoalCardTitle(0)
      expect(firstGoalTitle).toContain('Current Goal 1')

      const secondGoalTitle = await historicPlanPage.getGoalCardTitle(1)
      expect(secondGoalTitle).toContain('Current Goal 2')
    })

    test('displays future goals in Future goals section', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals(futureGoals(2))
        .withEventsBackdated(startOfDay, endOfDay)
        .save()

      const { historicPlanPage } = await navigateToHistoricPlan(page, handoverLink)

      await historicPlanPage.clickFutureGoalsTab()

      const goalCount = await historicPlanPage.getGoalCount()
      expect(goalCount).toBe(2)

      const firstGoalTitle = await historicPlanPage.getGoalCardTitle(0)
      expect(firstGoalTitle).toContain('Future Goal 1')
    })

    test('shows correct goal count in tab labels', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals(mixedGoals())
        .withEventsBackdated(startOfDay, endOfDay)
        .save()

      const { historicPlanPage } = await navigateToHistoricPlan(page, handoverLink)

      await expect(historicPlanPage.currentGoalsTab).toContainText('2')
      await expect(historicPlanPage.futureGoalsTab).toContainText('1')
    })

    test('goal card shows title and area of need', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals([
          {
            title: 'Find stable housing',
            status: 'ACTIVE',
            areaOfNeed: 'accommodation',
            targetDate: '2025-06-01',
          },
        ])
        .withEventsBackdated(startOfDay, endOfDay)
        .save()

      const { historicPlanPage } = await navigateToHistoricPlan(page, handoverLink)

      const goalTitle = await historicPlanPage.getGoalCardTitle(0)
      expect(goalTitle).toContain('Find stable housing')

      const areaOfNeed = await historicPlanPage.getGoalCardAreaOfNeed(0)
      await expect(areaOfNeed).toContainText(/accommodation/i)
    })

    test('goal card shows No steps added when goal has no steps', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals(currentGoals(1))
        .withEventsBackdated(startOfDay, endOfDay)
        .save()

      const { historicPlanPage } = await navigateToHistoricPlan(page, handoverLink)

      const goalCard = await historicPlanPage.getGoalCardByIndex(0)
      await expect(goalCard).toContainText(/no steps added/i)
    })

    test('goal card shows steps when steps exist', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals([
          {
            title: 'Goal with steps',
            status: 'ACTIVE',
            areaOfNeed: 'accommodation',
            targetDate: '2025-06-01',
            steps: [
              { actor: 'probation_practitioner', description: 'Contact housing services' },
              { actor: 'person_on_probation', description: 'Attend housing appointment' },
            ],
          },
        ])
        .withEventsBackdated(startOfDay, endOfDay)
        .save()

      const { historicPlanPage } = await navigateToHistoricPlan(page, handoverLink)

      const goalCard = await historicPlanPage.getGoalCardByIndex(0)
      await expect(goalCard).toContainText('Contact housing services')
      await expect(goalCard).toContainText('Attend housing appointment')
    })
  })

  test.describe('Tab Navigation', () => {
    test('defaults to current goals tab', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder.extend(sentencePlanId).withEventsBackdated(startOfDay, endOfDay).save()

      const { newPage } = await navigateToHistoricPlan(page, handoverLink)

      await expect(newPage).toHaveURL(/type=current/)
    })

    test('can switch to future goals tab', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals(mixedGoals())
        .withEventsBackdated(startOfDay, endOfDay)
        .save()

      const { historicPlanPage, newPage } = await navigateToHistoricPlan(page, handoverLink)

      await historicPlanPage.clickFutureGoalsTab()

      await expect(newPage).toHaveURL(/type=future/)
      const goalCount = await historicPlanPage.getGoalCount()
      expect(goalCount).toBe(1)
    })

    test('can switch back to current goals tab', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals(mixedGoals())
        .withEventsBackdated(startOfDay, endOfDay)
        .save()

      const { historicPlanPage, newPage } = await navigateToHistoricPlan(page, handoverLink)

      await historicPlanPage.clickFutureGoalsTab()
      await expect(newPage).toHaveURL(/type=future/)

      await historicPlanPage.clickCurrentGoalsTab()
      await expect(newPage).toHaveURL(/type=current/)

      const goalCount = await historicPlanPage.getGoalCount()
      expect(goalCount).toBe(2)
    })
  })
})
