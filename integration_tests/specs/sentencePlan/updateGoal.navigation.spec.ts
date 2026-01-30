import { expect } from '@playwright/test'
import { test, TargetService } from '../../support/fixtures'
import UpdateGoalAndStepsPage from '../../pages/sentencePlan/updateGoalAndStepsPage'
import PlanOverviewPage from '../../pages/sentencePlan/planOverviewPage'
import ConfirmAchievedGoalPage from '../../pages/sentencePlan/confirmAchievedGoalPage'
import { currentGoals, futureGoals } from '../../builders/sentencePlanFactories'
import {
  getDatePlusDaysAsISO,
  navigateToSentencePlan,
  sentencePlanV1URLs,
} from './sentencePlanUtils'

const updateGoalAndStepsPath = '/update-goal-steps'
const confirmAchievedGoalPath = '/confirm-achieved-goal'
const changeGoalPath = '/change-goal'
const addStepsPath = '/add-steps'
const confirmRemoveGoalPath = '/confirm-remove-goal'
const planOverviewPageCurrentGoalsTabPath = `${sentencePlanV1URLs.PLAN_OVERVIEW}?type=current`
const planOverviewPageFutureGoalsTabPath = `${sentencePlanV1URLs.PLAN_OVERVIEW}?type=future`
const planOverviewPageAchievedGoalsTabPath = `${sentencePlanV1URLs.PLAN_OVERVIEW}?type=achieved`

test.describe('Update goal - Navigation', () => {
  test.describe('mark as achieved navigation', () => {
    test('marks goal as achieved and verifies it appears in achieved tab', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const goalTitle = 'Goal To Achieve'
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      const plan = await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals([
          {
            title: goalTitle,
            areaOfNeed: 'accommodation',
            status: 'ACTIVE',
            targetDate: getDatePlusDaysAsISO(90),
            steps: [{ actor: 'probation_practitioner', description: 'Step', status: 'COMPLETED' }],
          },
        ])
        .withAgreementStatus('AGREED')
        .save()
      const goalUuid = plan.goals[0].uuid

      await navigateToSentencePlan(page, handoverLink)

      await page.goto(`${sentencePlanV1URLs.GOAL_MANAGEMENT_ROOT_PATH}/${goalUuid}${updateGoalAndStepsPath}`)

      const updatePage = await UpdateGoalAndStepsPage.verifyOnPage(page)

      await updatePage.clickMarkAsAchieved()

      // should redirect to confirm-achieved-goal page
      await expect(page).toHaveURL(
        `${sentencePlanV1URLs.GOAL_MANAGEMENT_ROOT_PATH}/${goalUuid}${confirmAchievedGoalPath}`,
      )

      // confirm the goal as achieved
      const confirmPage = await ConfirmAchievedGoalPage.verifyOnPage(page)
      await confirmPage.clickConfirm()

      // should redirect to achieved goals tab
      await expect(page).toHaveURL(planOverviewPageAchievedGoalsTabPath)

      // verify the goal appears in the achieved goals list
      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)
      const achievedGoalTitle = await planOverviewPage.getGoalCardTitle(0)
      expect(achievedGoalTitle).toContain(goalTitle)
    })
  })

  test.describe('link navigation', () => {
    test('change goal details link navigates to change-goal page', async ({
      page,
      createSession,
      makeAxeBuilder,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      const plan = await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals(currentGoals(1))
        .withAgreementStatus('AGREED')
        .save()
      const goalUuid = plan.goals[0].uuid

      await navigateToSentencePlan(page, handoverLink)

      await page.goto(`${sentencePlanV1URLs.GOAL_MANAGEMENT_ROOT_PATH}/${goalUuid}${updateGoalAndStepsPath}`)

      const updatePage = await UpdateGoalAndStepsPage.verifyOnPage(page)

      await updatePage.clickChangeGoalDetails()

      await expect(page).toHaveURL(`${sentencePlanV1URLs.GOAL_MANAGEMENT_ROOT_PATH}/${goalUuid}${changeGoalPath}`)

      const accessibilityScanResults = await makeAxeBuilder()
      .include('#main-content')
      .analyze()

      expect(accessibilityScanResults.violations).toEqual([])
    })

    test('add or change steps link navigates to add-steps page', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      const plan = await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals([
          {
            title: 'Goal With Steps',
            areaOfNeed: 'accommodation',
            status: 'ACTIVE',
            targetDate: getDatePlusDaysAsISO(90),
            steps: [{ actor: 'probation_practitioner', description: 'Step', status: 'NOT_STARTED' }],
          },
        ])
        .withAgreementStatus('AGREED')
        .save()
      const goalUuid = plan.goals[0].uuid

      await navigateToSentencePlan(page, handoverLink)

      await page.goto(`${sentencePlanV1URLs.GOAL_MANAGEMENT_ROOT_PATH}/${goalUuid}${updateGoalAndStepsPath}`)

      const updatePage = await UpdateGoalAndStepsPage.verifyOnPage(page)

      await updatePage.clickAddOrChangeSteps()

      await expect(page).toHaveURL(`${sentencePlanV1URLs.GOAL_MANAGEMENT_ROOT_PATH}/${goalUuid}${addStepsPath}`)
    })

    test('add steps link (when no steps) navigates to add-steps page', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      const plan = await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals([
          {
            title: 'Goal Without Steps',
            areaOfNeed: 'accommodation',
            status: 'ACTIVE',
            targetDate: getDatePlusDaysAsISO(90),
          },
        ])
        .withAgreementStatus('AGREED')
        .save()
      const goalUuid = plan.goals[0].uuid

      await navigateToSentencePlan(page, handoverLink)

      await page.goto(`${sentencePlanV1URLs.GOAL_MANAGEMENT_ROOT_PATH}/${goalUuid}${updateGoalAndStepsPath}`)

      const updatePage = await UpdateGoalAndStepsPage.verifyOnPage(page)

      await updatePage.clickAddSteps()

      await expect(page).toHaveURL(`${sentencePlanV1URLs.GOAL_MANAGEMENT_ROOT_PATH}/${goalUuid}${addStepsPath}`)
    })

    test('remove goal from plan link navigates to confirm-remove-goal page', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      const plan = await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals(currentGoals(1))
        .withAgreementStatus('AGREED')
        .save()
      const goalUuid = plan.goals[0].uuid

      await navigateToSentencePlan(page, handoverLink)

      await page.goto(`${sentencePlanV1URLs.GOAL_MANAGEMENT_ROOT_PATH}/${goalUuid}${updateGoalAndStepsPath}`)

      const updatePage = await UpdateGoalAndStepsPage.verifyOnPage(page)

      await updatePage.clickRemoveGoal()

      await expect(page).toHaveURL(
        `${sentencePlanV1URLs.GOAL_MANAGEMENT_ROOT_PATH}/${goalUuid}${confirmRemoveGoalPath}`,
      )
    })
  })

  test.describe('back link', () => {
    test('back link navigates to current tab for ACTIVE goal', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      const plan = await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals(currentGoals(1))
        .withAgreementStatus('AGREED')
        .save()
      const goalUuid = plan.goals[0].uuid

      await navigateToSentencePlan(page, handoverLink)

      await page.goto(`${sentencePlanV1URLs.GOAL_MANAGEMENT_ROOT_PATH}/${goalUuid}${updateGoalAndStepsPath}`)

      const updatePage = await UpdateGoalAndStepsPage.verifyOnPage(page)

      await expect(updatePage.backLink).toBeVisible()
      await updatePage.clickBackLink()

      await expect(page).toHaveURL(planOverviewPageCurrentGoalsTabPath)
    })

    test('back link navigates to future tab for FUTURE goal', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      const plan = await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals(futureGoals(1))
        .withAgreementStatus('AGREED')
        .save()
      const goalUuid = plan.goals[0].uuid

      await navigateToSentencePlan(page, handoverLink)

      await page.goto(`${sentencePlanV1URLs.GOAL_MANAGEMENT_ROOT_PATH}/${goalUuid}${updateGoalAndStepsPath}`)

      const updatePage = await UpdateGoalAndStepsPage.verifyOnPage(page)

      await expect(updatePage.backLink).toBeVisible()
      await updatePage.clickBackLink()

      await expect(page).toHaveURL(planOverviewPageFutureGoalsTabPath)
    })
  })
})
