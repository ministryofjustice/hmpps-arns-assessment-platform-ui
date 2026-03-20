import { expect } from '@playwright/test'
import { test, TargetService } from '../../../support/fixtures'
import UpdateGoalAndStepsPage from '../../../pages/sentencePlan/updateGoalAndStepsPage'
import PlanOverviewPage from '../../../pages/sentencePlan/planOverviewPage'
import ConfirmIfAchievedPage from '../../../pages/sentencePlan/confirmIfAchievedPage'
import ConfirmAchievedGoalPage from '../../../pages/sentencePlan/confirmAchievedGoalPage'
import { currentGoals, futureGoals } from '../../../builders/sentencePlanFactories'
import { getDatePlusDaysAsISO, navigateToSentencePlan, sentencePlanV1URLs } from '../sentencePlanUtils'

const updateGoalAndStepsPath = '/update-goal-steps'
const confirmIfAchievedPath = '/confirm-if-achieved'
const confirmAchievedGoalPath = '/confirm-achieved-goal'
const changeGoalPath = '/change-goal'
const addStepsPath = '/add-steps'
const confirmRemoveGoalPath = '/confirm-remove-goal'
const planOverviewPageCurrentGoalsTabPath = `${sentencePlanV1URLs.PLAN_OVERVIEW}?type=current`
const planOverviewPageFutureGoalsTabPath = `${sentencePlanV1URLs.PLAN_OVERVIEW}?type=future`
const planOverviewPageAchievedGoalsTabPath = `${sentencePlanV1URLs.PLAN_OVERVIEW}?type=achieved`

const nonCompletedStepStatuses = ['NOT_STARTED', 'IN_PROGRESS', 'CANNOT_BE_DONE_YET', 'NO_LONGER_NEEDED']

test.describe('Update goal and steps page - navigation', () => {
  test.describe('save goal and steps navigation', () => {
    test('redirects to current tab when not all steps completed for ACTIVE goal', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      const plan = await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals([
          {
            title: 'Active Goal',
            areaOfNeed: 'accommodation',
            status: 'ACTIVE',
            targetDate: getDatePlusDaysAsISO(90),
            steps: [
              { actor: 'probation_practitioner', description: 'Step 1', status: 'COMPLETED' },
              { actor: 'person_on_probation', description: 'Step 2', status: 'NOT_STARTED' },
            ],
          },
        ])
        .withAgreementStatus('AGREED')
        .save()
      const goalUuid = plan.goals[0].uuid

      await navigateToSentencePlan(page, handoverLink)

      await page.goto(`${sentencePlanV1URLs.GOAL_MANAGEMENT_ROOT_PATH}/${goalUuid}${updateGoalAndStepsPath}`)

      const updatePage = await UpdateGoalAndStepsPage.verifyOnPage(page)

      await updatePage.clickSaveGoalAndSteps()

      // should redirect to current goals tab
      await expect(page).toHaveURL(planOverviewPageCurrentGoalsTabPath)
      await PlanOverviewPage.verifyOnPage(page)
    })

    test('redirects to future tab when not all steps completed for FUTURE goal', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      const plan = await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals([
          {
            title: 'Future Goal',
            areaOfNeed: 'finances',
            status: 'FUTURE',
            steps: [
              { actor: 'probation_practitioner', description: 'Step 1', status: 'IN_PROGRESS' },
              { actor: 'person_on_probation', description: 'Step 2', status: 'NOT_STARTED' },
            ],
          },
        ])
        .withAgreementStatus('AGREED')
        .save()
      const goalUuid = plan.goals[0].uuid

      await navigateToSentencePlan(page, handoverLink)

      await page.goto(`${sentencePlanV1URLs.GOAL_MANAGEMENT_ROOT_PATH}/${goalUuid}${updateGoalAndStepsPath}`)

      const updatePage = await UpdateGoalAndStepsPage.verifyOnPage(page)

      await updatePage.clickSaveGoalAndSteps()

      // should redirect to future goals tab
      await expect(page).toHaveURL(planOverviewPageFutureGoalsTabPath)
    })

    test('redirects to confirm-if-achieved when all steps are marked COMPLETED', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      const plan = await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals([
          {
            title: 'Goal With Incomplete Steps',
            areaOfNeed: 'accommodation',
            status: 'ACTIVE',
            targetDate: getDatePlusDaysAsISO(90),
            steps: [
              { actor: 'probation_practitioner', description: 'Step 1', status: 'NOT_STARTED' },
              { actor: 'person_on_probation', description: 'Step 2', status: 'IN_PROGRESS' },
            ],
          },
        ])
        .withAgreementStatus('AGREED')
        .save()
      const goalUuid = plan.goals[0].uuid

      await navigateToSentencePlan(page, handoverLink)

      await page.goto(`${sentencePlanV1URLs.GOAL_MANAGEMENT_ROOT_PATH}/${goalUuid}${updateGoalAndStepsPath}`)

      const updatePage = await UpdateGoalAndStepsPage.verifyOnPage(page)

      // mark all steps as completed
      await updatePage.setStepStatusByIndex(0, 'COMPLETED')
      await updatePage.setStepStatusByIndex(1, 'COMPLETED')

      await updatePage.clickSaveGoalAndSteps()

      // should redirect to confirm-if-achieved page
      await expect(page).toHaveURL(
        `${sentencePlanV1URLs.GOAL_MANAGEMENT_ROOT_PATH}/${goalUuid}${confirmIfAchievedPath}`,
      )
      await ConfirmIfAchievedPage.verifyOnPage(page)
    })

    for (const nonCompletedStepStatus of nonCompletedStepStatuses) {
      test(`does not redirect to confirm-if-achieved when steps have ${nonCompletedStepStatus} status`, async ({
        page,
        createSession,
        sentencePlanBuilder,
      }) => {
        const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
        const plan = await sentencePlanBuilder
          .extend(sentencePlanId)
          .withGoals([
            {
              title: 'Goal With Blocked Steps',
              areaOfNeed: 'accommodation',
              status: 'ACTIVE',
              targetDate: getDatePlusDaysAsISO(90),
              steps: [
                { actor: 'probation_practitioner', description: 'Step 1', status: 'NOT_STARTED' },
                { actor: 'person_on_probation', description: 'Step 2', status: 'NOT_STARTED' },
              ],
            },
          ])
          .withAgreementStatus('AGREED')
          .save()
        const goalUuid = plan.goals[0].uuid

        await navigateToSentencePlan(page, handoverLink)

        await page.goto(`${sentencePlanV1URLs.GOAL_MANAGEMENT_ROOT_PATH}/${goalUuid}${updateGoalAndStepsPath}`)

        const updatePage = await UpdateGoalAndStepsPage.verifyOnPage(page)

        // mark one as completed and one as cannot be done yet
        await updatePage.setStepStatusByIndex(0, 'COMPLETED')
        await updatePage.setStepStatusByIndex(1, nonCompletedStepStatus)

        await updatePage.clickSaveGoalAndSteps()

        // should redirect to plan overview not confirm-if-achieved
        await expect(page).toHaveURL(planOverviewPageCurrentGoalsTabPath)
      })
    }

    test('can save progress notes along with step status changes', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      const plan = await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals([
          {
            title: 'Goal To Update',
            areaOfNeed: 'accommodation',
            status: 'ACTIVE',
            targetDate: getDatePlusDaysAsISO(90),
            steps: [{ actor: 'probation_practitioner', description: 'Step 1', status: 'NOT_STARTED' }],
          },
        ])
        .withAgreementStatus('AGREED')
        .save()
      const goalUuid = plan.goals[0].uuid

      await navigateToSentencePlan(page, handoverLink)

      await page.goto(`${sentencePlanV1URLs.GOAL_MANAGEMENT_ROOT_PATH}/${goalUuid}${updateGoalAndStepsPath}`)

      let updatePage = await UpdateGoalAndStepsPage.verifyOnPage(page)

      // update step status and add notes
      await updatePage.setStepStatusByIndex(0, 'IN_PROGRESS')
      await updatePage.enterProgressNotes('Good progress being made')

      await updatePage.clickSaveGoalAndSteps()

      // should save and redirect to overview
      await expect(page).toHaveURL(planOverviewPageCurrentGoalsTabPath)

      // navigate back to update page to verify changes were persisted
      await page.goto(`${sentencePlanV1URLs.GOAL_MANAGEMENT_ROOT_PATH}/${goalUuid}${updateGoalAndStepsPath}`)
      updatePage = await UpdateGoalAndStepsPage.verifyOnPage(page)

      // verify step status was saved
      const savedStatus = await updatePage.getStepStatusByIndex(0)
      expect(savedStatus).toBe('IN_PROGRESS')

      // verify progress notes were saved (should appear in notes history)
      await updatePage.expandViewAllNotes()
      const notesContent = await updatePage.getNotesContent()
      expect(notesContent).toContain('Good progress being made')
    })
  })

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
