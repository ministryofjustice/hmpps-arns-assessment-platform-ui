import { expect } from '@playwright/test'
import { test, TargetService } from '../../support/fixtures'
import ChangeGoalPage from '../../pages/sentencePlan/changeGoalPage'
import ChangeAreaOfNeedPage from '../../pages/sentencePlan/changeAreaOfNeedPage'
import AddStepsPage from '../../pages/sentencePlan/addStepsPage'
import type { GoalConfig } from '../../builders/types'
import {
  buildPageTitle,
  getDatePlusDaysAsISO,
  navigateToSentencePlan,
  sentencePlanPageTitles,
  sentencePlanV1UrlBuilders,
} from './sentencePlanUtils'

const activeGoal = (overrides: Partial<GoalConfig> = {}): GoalConfig[] => [
  {
    title: 'Find suitable housing',
    areaOfNeed: 'accommodation',
    status: 'ACTIVE',
    targetDate: getDatePlusDaysAsISO(90),
    steps: [{ actor: 'probation_practitioner', description: 'Existing step', status: 'NOT_STARTED' }],
    ...overrides,
  },
]

test.describe('Change area of need', () => {
  test.describe('Update goal page', () => {
    test('shows the area of need inset, change area link and add or update steps button', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      const plan = await sentencePlanBuilder.extend(sentencePlanId).withGoals(activeGoal()).save()
      const goalUuid = plan.goals[0].uuid

      await navigateToSentencePlan(page, handoverLink)
      await page.goto(sentencePlanV1UrlBuilders.goalChange(goalUuid))

      const changeGoalPage = await ChangeGoalPage.verifyOnPage(page)

      const insetText = await changeGoalPage.getAreaOfNeedInsetText()
      expect(insetText).toContain('Area of need: accommodation')

      await expect(changeGoalPage.changeAreaOfNeedLink).toBeVisible()
      await expect(changeGoalPage.addOrUpdateStepsButton).toBeVisible()
    })

    test('"Change area of need" link navigates to the change area of need page', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      const plan = await sentencePlanBuilder.extend(sentencePlanId).withGoals(activeGoal()).save()
      const goalUuid = plan.goals[0].uuid

      await navigateToSentencePlan(page, handoverLink)
      await page.goto(sentencePlanV1UrlBuilders.goalChange(goalUuid))

      const changeGoalPage = await ChangeGoalPage.verifyOnPage(page)
      await changeGoalPage.clickChangeAreaOfNeed()

      await ChangeAreaOfNeedPage.verifyOnPage(page)
    })

    test('"Add or update steps" button navigates to the add steps page', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      const plan = await sentencePlanBuilder.extend(sentencePlanId).withGoals(activeGoal()).save()
      const goalUuid = plan.goals[0].uuid

      await navigateToSentencePlan(page, handoverLink)
      await page.goto(sentencePlanV1UrlBuilders.goalChange(goalUuid))

      const changeGoalPage = await ChangeGoalPage.verifyOnPage(page)
      await changeGoalPage.clickAddOrUpdateSteps()

      await AddStepsPage.verifyOnPage(page)
    })
  })

  test.describe('Change area of need page', () => {
    test("pre-selects the goal's current area of need", async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      const plan = await sentencePlanBuilder.extend(sentencePlanId).withGoals(activeGoal()).save()
      const goalUuid = plan.goals[0].uuid

      await navigateToSentencePlan(page, handoverLink)
      await page.goto(sentencePlanV1UrlBuilders.goalChangeArea(goalUuid))

      const changeAreaPage = await ChangeAreaOfNeedPage.verifyOnPage(page)

      await expect(page).toHaveTitle(buildPageTitle(sentencePlanPageTitles.changeAreaOfNeed))
      expect(await changeAreaPage.isAreaSelected('accommodation')).toBe(true)
    })

    test('carries the chosen area back as a pending change and persists it on Save', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      const plan = await sentencePlanBuilder.extend(sentencePlanId).withGoals(activeGoal()).save()
      const goalUuid = plan.goals[0].uuid

      await navigateToSentencePlan(page, handoverLink)
      await page.goto(sentencePlanV1UrlBuilders.goalChangeArea(goalUuid))

      const changeAreaPage = await ChangeAreaOfNeedPage.verifyOnPage(page)
      await changeAreaPage.selectAreaAndContinue('finances')

      // Back on the Update goal page the inset reflects the pending area
      const changeGoalPage = await ChangeGoalPage.verifyOnPage(page)
      expect(await changeGoalPage.getAreaOfNeedInsetText()).toContain('Area of need: finances')

      // The change is only persisted once the goal is saved
      await changeGoalPage.saveGoal()

      // Re-open the Update goal page fresh (no pending query) — the new area has stuck
      await page.goto(sentencePlanV1UrlBuilders.goalChange(goalUuid))
      const reloaded = await ChangeGoalPage.verifyOnPage(page)
      expect(await reloaded.getAreaOfNeedInsetText()).toContain('Area of need: finances')
    })

    test('does not persist the area change if the user leaves without saving', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      const plan = await sentencePlanBuilder.extend(sentencePlanId).withGoals(activeGoal()).save()
      const goalUuid = plan.goals[0].uuid

      await navigateToSentencePlan(page, handoverLink)
      await page.goto(sentencePlanV1UrlBuilders.goalChangeArea(goalUuid))

      const changeAreaPage = await ChangeAreaOfNeedPage.verifyOnPage(page)
      await changeAreaPage.selectAreaAndContinue('finances')

      // Pending change is shown, but the user leaves without saving
      const changeGoalPage = await ChangeGoalPage.verifyOnPage(page)
      expect(await changeGoalPage.getAreaOfNeedInsetText()).toContain('Area of need: finances')

      // Re-open the Update goal page fresh — the area is unchanged
      await page.goto(sentencePlanV1UrlBuilders.goalChange(goalUuid))
      const reloaded = await ChangeGoalPage.verifyOnPage(page)
      expect(await reloaded.getAreaOfNeedInsetText()).toContain('Area of need: accommodation')
    })

    test('ignores an invalid area in the query and keeps the saved area on save', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      const plan = await sentencePlanBuilder.extend(sentencePlanId).withGoals(activeGoal()).save()
      const goalUuid = plan.goals[0].uuid

      await navigateToSentencePlan(page, handoverLink)

      // A tampered query param that isn't a real area-of-need slug
      await page.goto(`${sentencePlanV1UrlBuilders.goalChange(goalUuid)}?area=banana`)

      const changeGoalPage = await ChangeGoalPage.verifyOnPage(page)
      // The invalid area is ignored — the inset still shows the saved area
      expect(await changeGoalPage.getAreaOfNeedInsetText()).toContain('Area of need: accommodation')

      await changeGoalPage.saveGoal()

      await page.goto(sentencePlanV1UrlBuilders.goalChange(goalUuid))
      const reloaded = await ChangeGoalPage.verifyOnPage(page)
      expect(await reloaded.getAreaOfNeedInsetText()).toContain('Area of need: accommodation')
    })

    test("changing the area to one of the goal's related areas removes the overlap on save", async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      const plan = await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals(activeGoal({ relatedAreasOfNeed: ['finances'] }))
        .save()
      const goalUuid = plan.goals[0].uuid

      await navigateToSentencePlan(page, handoverLink)
      await page.goto(sentencePlanV1UrlBuilders.goalChangeArea(goalUuid))

      const changeAreaPage = await ChangeAreaOfNeedPage.verifyOnPage(page)
      // Change the primary area to a related area — it should be dropped from the related areas
      await changeAreaPage.selectAreaAndContinue('finances')

      const changeGoalPage = await ChangeGoalPage.verifyOnPage(page)
      expect(await changeGoalPage.getAreaOfNeedInsetText()).toContain('Area of need: finances')
      // finances became the primary area, so it is no longer offered/selected as a related area
      await expect(changeGoalPage.isRelatedNo).toBeChecked()

      // Persist and confirm the overlap is gone after a fresh reload
      await changeGoalPage.saveGoal()
      await page.goto(sentencePlanV1UrlBuilders.goalChange(goalUuid))
      const reloaded = await ChangeGoalPage.verifyOnPage(page)
      expect(await reloaded.getAreaOfNeedInsetText()).toContain('Area of need: finances')
      await expect(reloaded.isRelatedNo).toBeChecked()
    })
  })
})
