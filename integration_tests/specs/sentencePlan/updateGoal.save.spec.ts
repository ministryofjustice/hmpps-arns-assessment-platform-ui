import { expect } from '@playwright/test'
import { test, TargetService } from '../../support/fixtures'
import UpdateGoalAndStepsPage from '../../pages/sentencePlan/updateGoalAndStepsPage'
import PlanOverviewPage from '../../pages/sentencePlan/planOverviewPage'
import ConfirmIfAchievedPage from '../../pages/sentencePlan/confirmIfAchievedPage'
import {
  getDatePlusDaysAsISO,
  navigateToSentencePlan,
  sentencePlanV1URLs,
} from './sentencePlanUtils'

const updateGoalAndStepsPath = '/update-goal-steps'
const confirmIfAchievedPath = '/confirm-if-achieved'
const planOverviewPageCurrentGoalsTabPath = `${sentencePlanV1URLs.PLAN_OVERVIEW}?type=current`
const planOverviewPageFutureGoalsTabPath = `${sentencePlanV1URLs.PLAN_OVERVIEW}?type=future`

const nonCompletedStepStatuses = ['NOT_STARTED', 'IN_PROGRESS', 'CANNOT_BE_DONE_YET', 'NO_LONGER_NEEDED']

test.describe('Update goal and steps - Save', () => {
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
})
