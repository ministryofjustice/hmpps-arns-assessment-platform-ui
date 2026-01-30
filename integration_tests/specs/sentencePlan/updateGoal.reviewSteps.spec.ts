import { expect } from '@playwright/test'
import { test, TargetService } from '../../support/fixtures'
import UpdateGoalAndStepsPage from '../../pages/sentencePlan/updateGoalAndStepsPage'
import {
  getDatePlusDaysAsISO,
  navigateToSentencePlan,
  stepStatusOptions,
  sentencePlanV1URLs,
} from './sentencePlanUtils'

const updateGoalAndStepsPath = '/update-goal-steps'

test.describe('Update goal - Review steps', () => {
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
})
