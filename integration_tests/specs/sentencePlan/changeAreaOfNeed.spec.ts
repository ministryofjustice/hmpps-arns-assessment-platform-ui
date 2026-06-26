import { expect } from '@playwright/test'
import { test, TargetService } from '../../support/fixtures'
import ChangeGoalPage from '../../pages/sentencePlan/changeGoalPage'
import ChangeAreaOfNeedPage from '../../pages/sentencePlan/changeAreaOfNeedPage'
import AddStepsPage from '../../pages/sentencePlan/addStepsPage'
import type { GoalConfig } from '../../builders/types'
import { getDatePlusDaysAsISO, navigateToSentencePlan, sentencePlanV1UrlBuilders } from './sentencePlanUtils'

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

      expect(await changeAreaPage.isAreaSelected('accommodation')).toBe(true)
    })

    test('changing the area of need updates the goal and returns to the Update goal page', async ({
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

      // Back on the Update goal page, the inset now reflects the new area
      const changeGoalPage = await ChangeGoalPage.verifyOnPage(page)
      const insetText = await changeGoalPage.getAreaOfNeedInsetText()
      expect(insetText).toContain('Area of need: finances')
    })

    test("changing the area to one of the goal's related areas removes the overlap", async ({
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
      // Change the primary area to a related area — it should be dropped from the related list
      await changeAreaPage.selectAreaAndContinue('finances')

      const changeGoalPage = await ChangeGoalPage.verifyOnPage(page)
      const insetText = await changeGoalPage.getAreaOfNeedInsetText()
      expect(insetText).toContain('Area of need: finances')

      // The only related area (finances) became the primary area, so the goal now has no related areas
      await expect(changeGoalPage.isRelatedNo).toBeChecked()
    })
  })
})
