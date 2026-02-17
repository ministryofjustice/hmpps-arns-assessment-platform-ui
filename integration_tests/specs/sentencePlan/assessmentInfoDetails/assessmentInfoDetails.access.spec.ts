import { expect } from '@playwright/test'
import { test, TargetService } from '../../../support/fixtures'
import CreateGoalPage from '../../../pages/sentencePlan/createGoalPage'
import ChangeGoalPage from '../../../pages/sentencePlan/changeGoalPage'
import AddStepsPage from '../../../pages/sentencePlan/addStepsPage'
import PlanOverviewPage from '../../../pages/sentencePlan/planOverviewPage'
import { navigateToSentencePlan, getDatePlusDaysAsISO } from '../sentencePlanUtils'

test.describe('Assessment Info Details - Access by Assessment Type', () => {
  test.describe('SAN_SP assessment type (private beta)', () => {
    test('shows assessment info details expander on create goal page', async ({ page, createSession }) => {
      const { handoverLink } = await createSession({
        targetService: TargetService.SENTENCE_PLAN,
        assessmentType: 'SAN_SP',
      })

      await navigateToSentencePlan(page, handoverLink)
      await page.goto('/sentence-plan/v1.0/goal/new/add-goal/accommodation')
      const createGoalPage = await CreateGoalPage.verifyOnPage(page)

      await expect(createGoalPage.assessmentInfoDetails).toBeVisible()
    })

    test('shows assessment info details expander on change goal page', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { handoverLink, sentencePlanId } = await createSession({
        targetService: TargetService.SENTENCE_PLAN,
        assessmentType: 'SAN_SP',
      })

      await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals([
          {
            title: 'Test Goal',
            areaOfNeed: 'accommodation',
            status: 'ACTIVE',
            targetDate: getDatePlusDaysAsISO(90),
          },
        ])
        .save()

      await navigateToSentencePlan(page, handoverLink)
      await PlanOverviewPage.verifyOnPage(page)
      await page.getByRole('link', { name: 'Change goal' }).click()

      const changeGoalPage = await ChangeGoalPage.verifyOnPage(page)
      await expect(changeGoalPage.assessmentInfoDetails).toBeVisible()
    })

    test('shows assessment info details expander on add steps page', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { handoverLink, sentencePlanId } = await createSession({
        targetService: TargetService.SENTENCE_PLAN,
        assessmentType: 'SAN_SP',
      })

      await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals([
          {
            title: 'Test Goal',
            areaOfNeed: 'accommodation',
            status: 'ACTIVE',
            targetDate: getDatePlusDaysAsISO(90),
          },
        ])
        .save()

      await navigateToSentencePlan(page, handoverLink)
      await PlanOverviewPage.verifyOnPage(page)
      await page.getByRole('link', { name: 'Add steps' }).click()

      const addStepsPage = await AddStepsPage.verifyOnPage(page)
      await expect(addStepsPage.assessmentInfoDetails).toBeVisible()
    })
  })

  test.describe('SP assessment type (OASys/SP user journey)', () => {
    test('hides assessment info details on create goal page', async ({ page, createSession }) => {
      const { handoverLink } = await createSession({
        targetService: TargetService.SENTENCE_PLAN,
        assessmentType: 'SP',
      })

      await navigateToSentencePlan(page, handoverLink)
      await page.goto('/sentence-plan/v1.0/goal/new/add-goal/accommodation')
      const createGoalPage = await CreateGoalPage.verifyOnPage(page)

      await expect(createGoalPage.assessmentInfoDetails).not.toBeVisible()
    })

    test('hides assessment info details on change goal page', async ({ page, createSession, sentencePlanBuilder }) => {
      const { handoverLink, sentencePlanId } = await createSession({
        targetService: TargetService.SENTENCE_PLAN,
        assessmentType: 'SP',
      })

      await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals([
          {
            title: 'Test Goal',
            areaOfNeed: 'accommodation',
            status: 'ACTIVE',
            targetDate: getDatePlusDaysAsISO(90),
          },
        ])
        .save()

      await navigateToSentencePlan(page, handoverLink)
      await PlanOverviewPage.verifyOnPage(page)
      await page.getByRole('link', { name: 'Change goal' }).click()

      const changeGoalPage = await ChangeGoalPage.verifyOnPage(page)
      await expect(changeGoalPage.assessmentInfoDetails).not.toBeVisible()
    })

    test('hides assessment info details on add steps page', async ({ page, createSession, sentencePlanBuilder }) => {
      const { handoverLink, sentencePlanId } = await createSession({
        targetService: TargetService.SENTENCE_PLAN,
        assessmentType: 'SP',
      })

      await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals([
          {
            title: 'Test Goal',
            areaOfNeed: 'accommodation',
            status: 'ACTIVE',
            targetDate: getDatePlusDaysAsISO(90),
          },
        ])
        .save()

      await navigateToSentencePlan(page, handoverLink)
      await PlanOverviewPage.verifyOnPage(page)
      await page.getByRole('link', { name: 'Add steps' }).click()

      const addStepsPage = await AddStepsPage.verifyOnPage(page)
      await expect(addStepsPage.assessmentInfoDetails).not.toBeVisible()
    })
  })
})
