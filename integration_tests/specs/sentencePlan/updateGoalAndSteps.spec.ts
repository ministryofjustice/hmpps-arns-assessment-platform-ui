import { expect } from '@playwright/test'
import { test, TargetService } from '../../support/fixtures'
import UpdateGoalAndStepsPage from '../../pages/sentencePlan/updateGoalAndStepsPage'
import PlanOverviewPage from '../../pages/sentencePlan/planOverviewPage'
import ConfirmIfAchievedPage from '../../pages/sentencePlan/confirmIfAchievedPage'
import ConfirmAchievedGoalPage from '../../pages/sentencePlan/confirmAchievedGoalPage'
import { currentGoals, futureGoals } from '../../builders/sentencePlanFactories'
import {
  getDatePlusDaysAsISO,
  postAgreementProcessStatuses,
  stepStatusOptions,
  sentencePlanV1URLs,
} from './sentencePlanUtils'

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

test.describe('Update goal and steps page', () => {
  test.describe('access control', () => {
    test('redirects to plan overview when plan is not agreed', async ({ page, createSession, sentencePlanBuilder }) => {
      // create a plan with 'DRAFT' agreement status
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      const plan = await sentencePlanBuilder.extend(sentencePlanId).withGoals(currentGoals(1)).save()
      const goalUuid = plan.goals[0].uuid

      await page.goto(handoverLink)

      // try to access update-goal-steps page directly
      await page.goto(`${sentencePlanV1URLs.GOAL_MANAGEMENT_ROOT_PATH}/${goalUuid}${updateGoalAndStepsPath}`)

      // should be redirected to plan overview
      await expect(page).toHaveURL(/\/plan\/overview/)
    })

    for (const agreedPlanStatus of postAgreementProcessStatuses) {
      test(`allows access when plan status is ${agreedPlanStatus}`, async ({
        page,
        createSession,
        sentencePlanBuilder,
      }) => {
        const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
        const plan = await sentencePlanBuilder
          .extend(sentencePlanId)
          .withGoals(currentGoals(1))
          .withAgreementStatus(agreedPlanStatus)
          .save()
        const goalUuid = plan.goals[0].uuid

        await page.goto(handoverLink)

        await page.goto(`${sentencePlanV1URLs.GOAL_MANAGEMENT_ROOT_PATH}/${goalUuid}${updateGoalAndStepsPath}`)

        // should be on the update-goal-steps page
        await UpdateGoalAndStepsPage.verifyOnPage(page)
        await expect(page).toHaveURL(
          `${sentencePlanV1URLs.GOAL_MANAGEMENT_ROOT_PATH}/${goalUuid}${updateGoalAndStepsPath}`,
        )
      })
    }

    test('redirects to plan overview when goal does not exist', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder.extend(sentencePlanId).withGoals(currentGoals(1)).withAgreementStatus('AGREED').save()

      await page.goto(handoverLink)

      // try to access with a non-existent goal UUID
      const nonExistentUuid = '00000000-0000-0000-0000-000000000000'
      await page.goto(`${sentencePlanV1URLs.GOAL_MANAGEMENT_ROOT_PATH}/${nonExistentUuid}${updateGoalAndStepsPath}`)

      // should be redirected to plan overview
      await expect(page).toHaveURL(/\/plan\/overview/)
    })
  })

  test.describe('page content - ACTIVE goal', () => {
    test('displays page heading, target date message and change goal details link correctly', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      const plan = await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals([
          {
            title: 'Test Goal Title',
            areaOfNeed: 'accommodation',
            status: 'ACTIVE',
            targetDate: getDatePlusDaysAsISO(90),
            steps: [{ actor: 'probation_practitioner', description: 'Test step', status: 'NOT_STARTED' }],
          },
        ])
        .withAgreementStatus('AGREED')
        .save()
      const goalUuid = plan.goals[0].uuid

      await page.goto(handoverLink)

      await page.goto(`${sentencePlanV1URLs.GOAL_MANAGEMENT_ROOT_PATH}/${goalUuid}${updateGoalAndStepsPath}`)

      const updatePage = await UpdateGoalAndStepsPage.verifyOnPage(page)

      // check heading elements
      await expect(updatePage.pageHeading).toContainText('Update goal and steps')
      const areaOfNeedCaption = await updatePage.getAreaOfNeedCaption()
      expect(areaOfNeedCaption).toContain('Accommodation')
      const goalTitle = await updatePage.getGoalTitleText()
      expect(goalTitle).toContain('Test Goal Title')

      // should show target date message
      await expect(updatePage.targetDateMessage).toBeVisible()
      const message = await updatePage.getTargetDateMessage()
      expect(message).toContain('Aim to achieve this by')

      // should NOT show future goal message
      await expect(updatePage.futureGoalMessage).toBeHidden()

      // check change goal details link is visible
      await expect(updatePage.changeGoalDetailsLink).toBeVisible()
    })

    test('displays related areas of need in page heading when goal has related areas', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      const plan = await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals([
          {
            title: 'Test Goal With Related Areas',
            areaOfNeed: 'accommodation',
            relatedAreasOfNeed: ['finances', 'employment-and-education'],
            status: 'ACTIVE',
            targetDate: getDatePlusDaysAsISO(90),
            steps: [{ actor: 'probation_practitioner', description: 'Test step', status: 'NOT_STARTED' }],
          },
        ])
        .withAgreementStatus('AGREED')
        .save()
      const goalUuid = plan.goals[0].uuid

      await page.goto(handoverLink)

      await page.goto(`${sentencePlanV1URLs.GOAL_MANAGEMENT_ROOT_PATH}/${goalUuid}${updateGoalAndStepsPath}`)

      const updatePage = await UpdateGoalAndStepsPage.verifyOnPage(page)

      // check heading elements include related areas of need
      const areaOfNeedCaption = await updatePage.getAreaOfNeedCaption()
      expect(areaOfNeedCaption).toContain('Accommodation')
      expect(areaOfNeedCaption).toContain('(and')
      // related areas should be joined with "; " in lowercase
      expect(areaOfNeedCaption).toContain('employment and education; finances')
    })
  })

  test.describe('page content - FUTURE goal', () => {
    test('displays future goal message instead of target date', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      const plan = await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals(futureGoals(1))
        .withAgreementStatus('AGREED')
        .save()
      const goalUuid = plan.goals[0].uuid

      await page.goto(handoverLink)

      await page.goto(`${sentencePlanV1URLs.GOAL_MANAGEMENT_ROOT_PATH}/${goalUuid}${updateGoalAndStepsPath}`)

      const updatePage = await UpdateGoalAndStepsPage.verifyOnPage(page)

      // should show future goal message
      await expect(updatePage.futureGoalMessage).toBeVisible()
      const message = await updatePage.getFutureGoalMessage()
      expect(message).toContain('This is a future goal')

      // should NOT show target date message
      await expect(updatePage.targetDateMessage).toBeHidden()
    })
  })

  test.describe('steps table', () => {
    test('displays table and its headers as well as add or change steps link correctly for goal with steps', async ({
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
            steps: [
              { actor: 'probation_practitioner', description: 'First step description', status: 'NOT_STARTED' },
              { actor: 'person_on_probation', description: 'Second step description', status: 'IN_PROGRESS' },
            ],
          },
        ])
        .withAgreementStatus('AGREED')
        .save()
      const goalUuid = plan.goals[0].uuid

      await page.goto(handoverLink)

      await page.goto(`${sentencePlanV1URLs.GOAL_MANAGEMENT_ROOT_PATH}/${goalUuid}${updateGoalAndStepsPath}`)

      const updatePage = await UpdateGoalAndStepsPage.verifyOnPage(page)

      // should display steps table
      expect(await updatePage.hasStepsTable()).toBe(true)
      expect(await updatePage.hasNoStepsMessage()).toBe(false)

      // check table headers
      const table = page.locator('table.goal-summary-card__steps')
      await expect(table.locator('th').filter({ hasText: 'Who will do this' })).toBeVisible()
      await expect(table.locator('th').filter({ hasText: 'Steps' })).toBeVisible()
      await expect(table.locator('th').filter({ hasText: 'Status' })).toBeVisible()

      // should have correct number of steps
      const stepCount = await updatePage.getStepCount()
      expect(stepCount).toBe(2)

      // should display step details correctly
      expect(await updatePage.getStepDescriptionByIndex(0)).toContain('First step description')
      expect(await updatePage.getStepDescriptionByIndex(1)).toContain('Second step description')

      // check that add or change steps link is visible
      await expect(updatePage.addOrChangeStepsLink).toBeVisible()
    })

    test('displays no steps message when goal has no steps', async ({ page, createSession, sentencePlanBuilder }) => {
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

      await page.goto(handoverLink)

      await page.goto(`${sentencePlanV1URLs.GOAL_MANAGEMENT_ROOT_PATH}/${goalUuid}${updateGoalAndStepsPath}`)

      const updatePage = await UpdateGoalAndStepsPage.verifyOnPage(page)

      // Should display no steps message
      expect(await updatePage.hasNoStepsMessage()).toBe(true)
      expect(await updatePage.hasStepsTable()).toBe(false)

      // Should have add steps link
      await expect(updatePage.addStepsLink).toBeVisible()
    })
  })

  test.describe('step status dropdown', () => {
    test('displays current step status as selected', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      const plan = await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals([
          {
            title: 'Goal With Step',
            areaOfNeed: 'accommodation',
            status: 'ACTIVE',
            targetDate: getDatePlusDaysAsISO(90),
            steps: [{ actor: 'probation_practitioner', description: 'Step', status: 'IN_PROGRESS' }],
          },
        ])
        .withAgreementStatus('AGREED')
        .save()
      const goalUuid = plan.goals[0].uuid

      await page.goto(handoverLink)

      await page.goto(`${sentencePlanV1URLs.GOAL_MANAGEMENT_ROOT_PATH}/${goalUuid}${updateGoalAndStepsPath}`)

      const updatePage = await UpdateGoalAndStepsPage.verifyOnPage(page)

      const currentStatus = await updatePage.getStepStatusByIndex(0)
      expect(currentStatus).toBe(stepStatusOptions[1])
    })

    for (const targetStatus of stepStatusOptions) {
      test(`can change step status to ${targetStatus}`, async ({ page, createSession, sentencePlanBuilder }) => {
        const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
        const plan = await sentencePlanBuilder
          .extend(sentencePlanId)
          .withGoals([
            {
              title: 'Goal With Step',
              areaOfNeed: 'accommodation',
              status: 'ACTIVE',
              targetDate: getDatePlusDaysAsISO(90),
              steps: [{ actor: 'probation_practitioner', description: 'Step', status: 'NOT_STARTED' }],
            },
          ])
          .withAgreementStatus('AGREED')
          .save()
        const goalUuid = plan.goals[0].uuid

        await page.goto(handoverLink)

        await page.goto(`${sentencePlanV1URLs.GOAL_MANAGEMENT_ROOT_PATH}/${goalUuid}${updateGoalAndStepsPath}`)

        const updatePage = await UpdateGoalAndStepsPage.verifyOnPage(page)

        await updatePage.setStepStatusByIndex(0, targetStatus)

        const newStatus = await updatePage.getStepStatusByIndex(0)
        expect(newStatus).toBe(targetStatus)
      })
    }
  })

  test.describe('progress notes', () => {
    test('displays progress notes section with textarea, label, and hint text', async ({
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

      await page.goto(handoverLink)

      await page.goto(`${sentencePlanV1URLs.GOAL_MANAGEMENT_ROOT_PATH}/${goalUuid}${updateGoalAndStepsPath}`)

      const updatePage = await UpdateGoalAndStepsPage.verifyOnPage(page)

      // check textarea is visible
      await expect(updatePage.progressNotesTextarea).toBeVisible()

      // check label with optional indicator
      const labelText = await updatePage.getProgressNotesLabelText()
      expect(labelText).toContain('Add notes about progress')
      expect(labelText).toContain('(optional)')

      // check hint text
      const hintText = await updatePage.getProgressNotesHintText()
      expect(hintText).toContain('how')
      expect(hintText).toContain('feels about their progress')
    })

    test('can enter progress notes', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      const plan = await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals(currentGoals(1))
        .withAgreementStatus('AGREED')
        .save()
      const goalUuid = plan.goals[0].uuid

      await page.goto(handoverLink)

      await page.goto(`${sentencePlanV1URLs.GOAL_MANAGEMENT_ROOT_PATH}/${goalUuid}${updateGoalAndStepsPath}`)

      const updatePage = await UpdateGoalAndStepsPage.verifyOnPage(page)

      const testNotes = 'This person is making good progress towards their goal'
      await updatePage.enterProgressNotes(testNotes)

      const enteredNotes = await updatePage.getProgressNotesValue()
      expect(enteredNotes).toBe(testNotes)
    })
  })

  test.describe('view all notes', () => {
    test('displays view and expand all notes details component and see noo notes message when goal has no notes ', async ({
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

      await page.goto(handoverLink)

      await page.goto(`${sentencePlanV1URLs.GOAL_MANAGEMENT_ROOT_PATH}/${goalUuid}${updateGoalAndStepsPath}`)

      const updatePage = await UpdateGoalAndStepsPage.verifyOnPage(page)

      await expect(updatePage.viewAllNotesDetails).toBeVisible()
      await expect(updatePage.viewAllNotesSummary).toContainText('View all notes')

      // initially collapsed
      expect(await updatePage.isViewAllNotesExpanded()).toBe(false)

      await updatePage.expandViewAllNotes()

      // should be expanded
      expect(await updatePage.isViewAllNotesExpanded()).toBe(true)

      // displays no notes message when goal has no notes
      await expect(updatePage.noNotesMessage).toBeVisible()
    })

    test('displays notes when goal has notes history', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      const plan = await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals([
          {
            title: 'Goal With Notes',
            areaOfNeed: 'accommodation',
            status: 'ACTIVE',
            targetDate: getDatePlusDaysAsISO(90),
            steps: [{ actor: 'probation_practitioner', description: 'Step', status: 'NOT_STARTED' }],
            notes: [{ type: 'PROGRESS', note: 'Progress update: Making good headway on accommodation' }],
          },
        ])
        .withAgreementStatus('AGREED')
        .save()
      const goalUuid = plan.goals[0].uuid

      await page.goto(handoverLink)

      await page.goto(`${sentencePlanV1URLs.GOAL_MANAGEMENT_ROOT_PATH}/${goalUuid}${updateGoalAndStepsPath}`)

      const updatePage = await UpdateGoalAndStepsPage.verifyOnPage(page)

      await updatePage.expandViewAllNotes()

      const notesContent = await updatePage.getNotesContent()
      expect(notesContent).toContain('Making good headway on accommodation')
    })
  })

  test.describe('action buttons', () => {
    test('displays "save goal and steps" and "mark as achieved" buttons as well as "remove goal from plan" link', async ({
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

      await page.goto(handoverLink)

      await page.goto(`${sentencePlanV1URLs.GOAL_MANAGEMENT_ROOT_PATH}/${goalUuid}${updateGoalAndStepsPath}`)

      const updatePage = await UpdateGoalAndStepsPage.verifyOnPage(page)

      await expect(updatePage.saveGoalAndStepsButton).toBeVisible()
      await expect(updatePage.markAsAchievedButton).toBeVisible()
      await expect(updatePage.removeGoalLink).toBeVisible()
    })
  })

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

      await page.goto(handoverLink)

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

      await page.goto(handoverLink)

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

      await page.goto(handoverLink)

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

        await page.goto(handoverLink)

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

      await page.goto(handoverLink)

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

      await page.goto(handoverLink)

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

      await page.goto(handoverLink)

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

      await page.goto(handoverLink)

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

      await page.goto(handoverLink)

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

      await page.goto(handoverLink)

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

      await page.goto(handoverLink)

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

      await page.goto(handoverLink)

      await page.goto(`${sentencePlanV1URLs.GOAL_MANAGEMENT_ROOT_PATH}/${goalUuid}${updateGoalAndStepsPath}`)

      const updatePage = await UpdateGoalAndStepsPage.verifyOnPage(page)

      await expect(updatePage.backLink).toBeVisible()
      await updatePage.clickBackLink()

      await expect(page).toHaveURL(planOverviewPageFutureGoalsTabPath)
    })
  })
})
