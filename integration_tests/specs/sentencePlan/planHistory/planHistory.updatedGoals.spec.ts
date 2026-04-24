import { expect } from '@playwright/test'
import { test, TargetService } from '../../../support/fixtures'
import PlanHistoryPage from '../../../pages/sentencePlan/planHistoryPage'
import UpdateGoalAndStepsPage from '../../../pages/sentencePlan/updateGoalAndStepsPage'
import PlanOverviewPage from '../../../pages/sentencePlan/planOverviewPage'
import ChangeGoalPage from '../../../pages/sentencePlan/changeGoalPage'
import AddStepsPage from '../../../pages/sentencePlan/addStepsPage'
import {
  checkAccessibility,
  handlePrivacyScreenIfPresent,
  navigateToSentencePlan,
  sentencePlanV1URLs,
} from '../sentencePlanUtils'

test.describe('Plan History - Updated Goals', () => {
  test('displays updated goal entry with title, updater name, and view link', async ({
    page,
    createSession,
    sentencePlanBuilder,
  }) => {
    const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
    await sentencePlanBuilder
      .extend(sentencePlanId)
      .withGoal({
        title: 'I will maintain my current accommodation',
        areaOfNeed: 'accommodation',
        status: 'ACTIVE',
        steps: [{ actor: 'probation_practitioner', description: 'Contact housing services' }],
        notes: [
          {
            type: 'UPDATED',
            note: '',
            createdBy: 'Jane Smith',
          },
        ],
      })
      .withPlanAgreements([
        {
          status: 'AGREED',
          createdBy: 'Test Practitioner',
          dateOffset: -86400000, // 1 day ago
        },
      ])
      .save()

    await page.goto(handoverLink)
    await handlePrivacyScreenIfPresent(page)
    await page.getByRole('link', { name: /View plan history/i }).click()

    const planHistoryPage = await PlanHistoryPage.verifyOnPage(page)
    await expect(planHistoryPage.mainContent).toMatchAriaSnapshot(`
      - paragraph: View all updates and changes made to this plan.
      - separator
      - paragraph:
        - strong: Goal updated
        - text: /Jane Smith/
      - paragraph:
        - strong: I will maintain my current accommodation
      - paragraph:
        - link "View latest version":
          - /url: /goal/
    `)

    // Accessibility
    await checkAccessibility(page)
  })

  test('displays updated goal entry with notes when a progress note was added', async ({
    page,
    createSession,
    sentencePlanBuilder,
  }) => {
    const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
    await sentencePlanBuilder
      .extend(sentencePlanId)
      .withGoal({
        title: 'I will maintain my current accommodation',
        areaOfNeed: 'accommodation',
        status: 'ACTIVE',
        steps: [{ actor: 'probation_practitioner', description: 'Contact housing services' }],
        notes: [
          {
            type: 'UPDATED',
            note: 'Buster has taken steps to maintain his accommodation.',
            createdBy: 'Jane Smith',
          },
        ],
      })
      .withPlanAgreements([
        {
          status: 'AGREED',
          createdBy: 'Test Practitioner',
          dateOffset: -86400000, // 1 day ago
        },
      ])
      .save()

    await page.goto(handoverLink)
    await handlePrivacyScreenIfPresent(page)
    await page.getByRole('link', { name: /View plan history/i }).click()

    const planHistoryPage = await PlanHistoryPage.verifyOnPage(page)
    await expect(planHistoryPage.mainContent).toMatchAriaSnapshot(`
      - paragraph:
        - strong: I will maintain my current accommodation
      - paragraph: Buster has taken steps to maintain his accommodation.
      - paragraph:
        - link "View latest version":
          - /url: /goal/
    `)
  })

  test('shows goal updated entry after changing step status from Not Started to In Progress', async ({
    page,
    createSession,
    sentencePlanBuilder,
  }) => {
    const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
    await sentencePlanBuilder
      .extend(sentencePlanId)
      .withGoal({
        title: 'Find stable accommodation',
        areaOfNeed: 'accommodation',
        status: 'ACTIVE',
        steps: [{ actor: 'probation_practitioner', description: 'Contact housing services', status: 'NOT_STARTED' }],
      })
      .withPlanAgreements([
        {
          status: 'AGREED',
          createdBy: 'Test Practitioner',
          dateOffset: -86400000,
        },
      ])
      .save()

    // Navigate to plan overview
    await navigateToSentencePlan(page, handoverLink)
    const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

    // Click Update on the goal card
    await planOverviewPage.clickUpdateGoal(0)
    const updatePage = await UpdateGoalAndStepsPage.verifyOnPage(page)

    // Change step status from NOT_STARTED to IN_PROGRESS
    await updatePage.setStepStatusByIndex(0, 'IN_PROGRESS')
    await updatePage.clickSaveGoalAndSteps()

    // Should redirect to plan overview
    await expect(page).toHaveURL(`${sentencePlanV1URLs.PLAN_OVERVIEW}?type=current`)

    // Navigate to plan history
    await page.getByRole('link', { name: /View plan history/i }).click()
    const planHistoryPage = await PlanHistoryPage.verifyOnPage(page)

    // Verify the goal updated entry appears
    await expect(planHistoryPage.mainContent).toMatchAriaSnapshot(`
      - paragraph: View all updates and changes made to this plan.
      - separator
      - paragraph:
        - strong: Goal updated
      - paragraph:
        - strong: Find stable accommodation
      - paragraph:
        - link "View latest version":
          - /url: /goal/
    `)
  })

  test('shows goal updated entry with notes after changing step status and adding a progress note', async ({
    page,
    createSession,
    sentencePlanBuilder,
  }) => {
    const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
    await sentencePlanBuilder
      .extend(sentencePlanId)
      .withGoal({
        title: 'Reduce alcohol use',
        areaOfNeed: 'alcohol-use',
        status: 'ACTIVE',
        steps: [{ actor: 'probation_practitioner', description: 'Attend support group', status: 'NOT_STARTED' }],
      })
      .withPlanAgreements([
        {
          status: 'AGREED',
          createdBy: 'Test Practitioner',
          dateOffset: -86400000,
        },
      ])
      .save()

    // Navigate to plan overview
    await navigateToSentencePlan(page, handoverLink)
    const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

    // Click Update on the goal card
    await planOverviewPage.clickUpdateGoal(0)
    const updatePage = await UpdateGoalAndStepsPage.verifyOnPage(page)

    // Change step status and add a progress note
    await updatePage.setStepStatusByIndex(0, 'IN_PROGRESS')
    await updatePage.enterProgressNotes('Good progress being made with support group attendance.')
    await updatePage.clickSaveGoalAndSteps()

    // Should redirect to plan overview
    await expect(page).toHaveURL(`${sentencePlanV1URLs.PLAN_OVERVIEW}?type=current`)

    // Navigate to plan history
    await page.getByRole('link', { name: /View plan history/i }).click()
    const planHistoryPage = await PlanHistoryPage.verifyOnPage(page)

    // Verify the goal updated entry appears with the progress note
    await expect(planHistoryPage.mainContent).toMatchAriaSnapshot(`
      - paragraph: View all updates and changes made to this plan.
      - separator
      - paragraph:
        - strong: Goal updated
      - paragraph:
        - strong: Reduce alcohol use
      - paragraph: Good progress being made with support group attendance.
      - paragraph:
        - link "View latest version":
          - /url: /goal/
    `)
  })

  test('shows goal updated entry after changing step details', async ({ page, createSession, sentencePlanBuilder }) => {
    const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
    await sentencePlanBuilder
      .extend(sentencePlanId)
      .withGoal({
        title: 'Find stable accommodation',
        areaOfNeed: 'accommodation',
        status: 'ACTIVE',
        steps: [{ actor: 'probation_practitioner', description: 'Contact housing services', status: 'NOT_STARTED' }],
      })
      .withPlanAgreements([
        {
          status: 'AGREED',
          createdBy: 'Test Practitioner',
          dateOffset: -86400000,
        },
      ])
      .save()

    await navigateToSentencePlan(page, handoverLink)
    const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

    await planOverviewPage.clickUpdateGoal(0)
    const updatePage = await UpdateGoalAndStepsPage.verifyOnPage(page)

    await updatePage.clickAddOrChangeSteps()
    const addStepsPage = await AddStepsPage.verifyOnPage(page)
    await addStepsPage.enterStep(0, 'person_on_probation', 'Contact the housing officer')
    await addStepsPage.clickSaveAndContinue()

    await page.goto(sentencePlanV1URLs.PLAN_HISTORY)
    const planHistoryPage = await PlanHistoryPage.verifyOnPage(page)

    await expect(planHistoryPage.mainContent).toMatchAriaSnapshot(`
      - paragraph: View all updates and changes made to this plan.
      - separator
      - paragraph:
        - strong: Goal updated
      - paragraph:
        - strong: Find stable accommodation
      - paragraph:
        - link "View latest version":
          - /url: /goal/
    `)
  })

  test('shows goal updated entry after changing goal title via Change goal page', async ({
    page,
    createSession,
    sentencePlanBuilder,
  }) => {
    const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
    await sentencePlanBuilder
      .extend(sentencePlanId)
      .withGoal({
        title: 'Find stable accommodation',
        areaOfNeed: 'accommodation',
        status: 'ACTIVE',
        steps: [{ actor: 'probation_practitioner', description: 'Contact housing services' }],
      })
      .withPlanAgreements([
        {
          status: 'AGREED',
          createdBy: 'Test Practitioner',
          dateOffset: -86400000,
        },
      ])
      .save()

    await navigateToSentencePlan(page, handoverLink)
    const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

    // On an agreed plan the Change goal page is reached via Update > "Change goal details"
    await planOverviewPage.clickUpdateGoal(0)
    const updatePage = await UpdateGoalAndStepsPage.verifyOnPage(page)
    await updatePage.clickChangeGoalDetails()

    const changeGoalPage = await ChangeGoalPage.verifyOnPage(page)
    await changeGoalPage.setGoalTitle('Updated goal title')
    await changeGoalPage.saveGoal()

    await page.goto(sentencePlanV1URLs.PLAN_HISTORY)
    const planHistoryPage = await PlanHistoryPage.verifyOnPage(page)

    await expect(planHistoryPage.mainContent).toMatchAriaSnapshot(`
      - paragraph: View all updates and changes made to this plan.
      - separator
      - paragraph:
        - strong: Goal updated
      - paragraph:
        - strong: Updated goal title
      - paragraph:
        - link "View latest version":
          - /url: /goal/
    `)
  })

  test('shows goal updated entry after changing an active goal to a future goal via Change goal page', async ({
    page,
    createSession,
    sentencePlanBuilder,
  }) => {
    const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
    await sentencePlanBuilder
      .extend(sentencePlanId)
      .withGoal({
        title: 'Find stable accommodation',
        areaOfNeed: 'accommodation',
        status: 'ACTIVE',
        steps: [{ actor: 'probation_practitioner', description: 'Contact housing services' }],
      })
      .withPlanAgreements([
        {
          status: 'AGREED',
          createdBy: 'Test Practitioner',
          dateOffset: -86400000,
        },
      ])
      .save()

    await navigateToSentencePlan(page, handoverLink)
    const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

    await planOverviewPage.clickUpdateGoal(0)
    const updatePage = await UpdateGoalAndStepsPage.verifyOnPage(page)
    await updatePage.clickChangeGoalDetails()

    const changeGoalPage = await ChangeGoalPage.verifyOnPage(page)
    await changeGoalPage.selectCanStartNow(false)
    await changeGoalPage.saveGoal()

    await page.goto(sentencePlanV1URLs.PLAN_HISTORY)
    const planHistoryPage = await PlanHistoryPage.verifyOnPage(page)

    await expect(planHistoryPage.mainContent).toMatchAriaSnapshot(`
      - paragraph: View all updates and changes made to this plan.
      - separator
      - paragraph:
        - strong: Goal updated
      - paragraph:
        - strong: Find stable accommodation
      - paragraph:
        - link "View latest version":
          - /url: /goal/
    `)
  })
})
