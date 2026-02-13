import { expect } from '@playwright/test'
import { test, TargetService } from '../../../support/fixtures'
import UpdateGoalAndStepsPage from '../../../pages/sentencePlan/updateGoalAndStepsPage'
import { currentGoals, futureGoals } from '../../../builders/sentencePlanFactories'
import {
  getDatePlusDaysAsISO,
  navigateToSentencePlan,
  stepStatusOptions,
  sentencePlanV1URLs,
  buildPageTitle,
  sentencePlanPageTitles,
} from '../sentencePlanUtils'

const updateGoalAndStepsPath = '/update-goal-steps'

test.describe('Update goal and steps page', () => {
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

      await navigateToSentencePlan(page, handoverLink)

      await page.goto(`${sentencePlanV1URLs.GOAL_MANAGEMENT_ROOT_PATH}/${goalUuid}${updateGoalAndStepsPath}`)

      const updatePage = await UpdateGoalAndStepsPage.verifyOnPage(page)

      // ensure page title is correct; no validation on this page so no error title to check
      await expect(page).toHaveTitle(buildPageTitle(sentencePlanPageTitles.updateGoalAndSteps))

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

      await navigateToSentencePlan(page, handoverLink)

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

      await navigateToSentencePlan(page, handoverLink)

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

      await navigateToSentencePlan(page, handoverLink)

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

      await navigateToSentencePlan(page, handoverLink)

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

      await navigateToSentencePlan(page, handoverLink)

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

        await navigateToSentencePlan(page, handoverLink)

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

      await navigateToSentencePlan(page, handoverLink)

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

      await navigateToSentencePlan(page, handoverLink)

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

      await navigateToSentencePlan(page, handoverLink)

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

      await navigateToSentencePlan(page, handoverLink)

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

      await navigateToSentencePlan(page, handoverLink)

      await page.goto(`${sentencePlanV1URLs.GOAL_MANAGEMENT_ROOT_PATH}/${goalUuid}${updateGoalAndStepsPath}`)

      const updatePage = await UpdateGoalAndStepsPage.verifyOnPage(page)

      await expect(updatePage.saveGoalAndStepsButton).toBeVisible()
      await expect(updatePage.markAsAchievedButton).toBeVisible()
      await expect(updatePage.removeGoalLink).toBeVisible()
    })
  })
})
