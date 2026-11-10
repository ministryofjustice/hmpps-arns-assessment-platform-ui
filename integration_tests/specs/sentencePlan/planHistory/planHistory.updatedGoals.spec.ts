import { expect } from '@playwright/test'
import { test, TargetService } from '../../../support/fixtures'
import PlanHistoryPage from '../../../pages/sentencePlan/planHistoryPage'
import ReorderStepsPage from '../../../pages/sentencePlan/reorderStepsPage'
import UpdateGoalAndStepsPage from '../../../pages/sentencePlan/updateGoalAndStepsPage'
import PlanOverviewPage from '../../../pages/sentencePlan/planOverviewPage'
import ChangeGoalPage from '../../../pages/sentencePlan/changeGoalPage'
import AddStepsPage from '../../../pages/sentencePlan/addStepsPage'
import {
  checkAccessibility,
  getDatePlusDaysAsISO,
  handlePrivacyScreenIfPresent,
  oneDayAgoMs,
  sentencePlanV1URLs,
} from '../sentencePlanUtils'

test.describe('Plan History - Updated Goals', () => {
  test('displays updated goal entry with action, date, updater, goal title and view goal link', async ({
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
          dateOffset: oneDayAgoMs,
        },
      ])
      .save()

    await page.goto(handoverLink)
    await handlePrivacyScreenIfPresent(page)
    await page.getByRole('link', { name: /View plan history/i }).click()

    const planHistoryPage = await PlanHistoryPage.verifyOnPage(page)
    await expect(planHistoryPage.mainContent).toMatchAriaSnapshot(`
      - paragraph: View all updates to this plan.
      - button "Show all sections"
      - heading /Goal updated.*Jane Smith.*I will maintain my current accommodation/
    `)

    await checkAccessibility(page)

    await planHistoryPage.clickShowAllSectionsButton()
    await planHistoryPage.clickViewGoalLink()
    await UpdateGoalAndStepsPage.verifyOnPage(page)
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
          dateOffset: oneDayAgoMs,
        },
      ])
      .save()

    await page.goto(handoverLink)
    await handlePrivacyScreenIfPresent(page)
    await page.getByRole('link', { name: /View plan history/i }).click()

    const planHistoryPage = await PlanHistoryPage.verifyOnPage(page)
    await expect(planHistoryPage.mainContent).toMatchAriaSnapshot(`
      - heading /Goal updated.*Jane Smith.*I will maintain my current accommodation.*Buster has taken steps to maintain his accommodation/
    `)
  })

  test('shows goal updated entry after changing step status from Not Started to In Progress', async ({
    page,
    openSentencePlan,
  }) => {
    await openSentencePlan({
      plan: builder =>
        builder
          .withGoal({
            title: 'Find stable accommodation',
            areaOfNeed: 'accommodation',
            status: 'ACTIVE',
            steps: [
              { actor: 'probation_practitioner', description: 'Contact housing services', status: 'NOT_STARTED' },
            ],
          })
          .withPlanAgreements([
            {
              status: 'AGREED',
              createdBy: 'Test Practitioner',
              dateOffset: oneDayAgoMs,
            },
          ]),
    })

    const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

    await planOverviewPage.clickUpdateGoal(0)
    const updatePage = await UpdateGoalAndStepsPage.verifyOnPage(page)

    await updatePage.setStepStatusByIndex(0, 'IN_PROGRESS')
    await updatePage.clickSaveGoalAndSteps()

    await expect(page).toHaveURL(`${sentencePlanV1URLs.PLAN_OVERVIEW}?goalStatusTab=current`)

    await page.getByRole('link', { name: /View plan history/i }).click()
    const planHistoryPage = await PlanHistoryPage.verifyOnPage(page)

    await expect(
      planHistoryPage.mainContent.getByRole('heading', { name: /Goal updated.*Find stable accommodation/ }),
    ).toBeVisible()
  })

  test('shows goal updated entry with notes after changing step status and adding a progress note', async ({
    page,
    openSentencePlan,
  }) => {
    await openSentencePlan({
      plan: builder =>
        builder
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
              dateOffset: oneDayAgoMs,
            },
          ]),
    })

    const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

    await planOverviewPage.clickUpdateGoal(0)
    const updatePage = await UpdateGoalAndStepsPage.verifyOnPage(page)

    await updatePage.setStepStatusByIndex(0, 'IN_PROGRESS')
    await updatePage.enterProgressNotes('Good progress being made with support group attendance.')
    await updatePage.clickSaveGoalAndSteps()

    await expect(page).toHaveURL(`${sentencePlanV1URLs.PLAN_OVERVIEW}?goalStatusTab=current`)

    await page.getByRole('link', { name: /View plan history/i }).click()
    const planHistoryPage = await PlanHistoryPage.verifyOnPage(page)

    await expect(
      planHistoryPage.mainContent.getByRole('heading', {
        name: /Goal updated.*Reduce alcohol use.*Good progress being made with support group attendance/,
      }),
    ).toBeVisible()
  })

  test('shows goal updated entry after changing step details', async ({ page, openSentencePlan }) => {
    await openSentencePlan({
      plan: builder =>
        builder
          .withGoal({
            title: 'Find stable accommodation',
            areaOfNeed: 'accommodation',
            status: 'ACTIVE',
            steps: [
              { actor: 'probation_practitioner', description: 'Contact housing services', status: 'NOT_STARTED' },
            ],
          })
          .withPlanAgreements([
            {
              status: 'AGREED',
              createdBy: 'Test Practitioner',
              dateOffset: oneDayAgoMs,
            },
          ]),
    })

    const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

    await planOverviewPage.clickUpdateGoal(0)
    const updatePage = await UpdateGoalAndStepsPage.verifyOnPage(page)

    await updatePage.clickAddOrChangeSteps()
    const addStepsPage = await AddStepsPage.verifyOnPage(page)
    await addStepsPage.enterStep(0, 'person_on_probation', 'Contact the housing officer')
    await addStepsPage.clickSaveAndContinue()

    await page.goto(sentencePlanV1URLs.PLAN_HISTORY)
    const planHistoryPage = await PlanHistoryPage.verifyOnPage(page)

    await expect(
      planHistoryPage.mainContent.getByRole('heading', { name: /Goal updated.*Find stable accommodation/ }),
    ).toBeVisible()
  })

  test('shows goal updated entry after changing goal title via Change goal page', async ({
    page,
    openSentencePlan,
  }) => {
    await openSentencePlan({
      plan: builder =>
        builder
          .withGoal({
            title: 'Find stable accommodation',
            areaOfNeed: 'accommodation',
            status: 'ACTIVE',
            targetDate: getDatePlusDaysAsISO(90),
            steps: [{ actor: 'probation_practitioner', description: 'Contact housing services' }],
          })
          .withPlanAgreements([
            {
              status: 'AGREED',
              createdBy: 'Test Practitioner',
              dateOffset: oneDayAgoMs,
            },
          ]),
    })

    const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

    await planOverviewPage.clickUpdateGoal(0)
    const updatePage = await UpdateGoalAndStepsPage.verifyOnPage(page)
    await updatePage.clickChangeGoalDetails()

    const changeGoalPage = await ChangeGoalPage.verifyOnPage(page)
    await changeGoalPage.setGoalTitle('Updated goal title')
    await changeGoalPage.saveGoal()

    await page.goto(sentencePlanV1URLs.PLAN_HISTORY)
    const planHistoryPage = await PlanHistoryPage.verifyOnPage(page)

    await expect(
      planHistoryPage.mainContent.getByRole('heading', { name: /Goal updated.*Updated goal title/ }),
    ).toBeVisible()
  })

  test('shows goal updated entry after changing an active goal to a future goal via Change goal page', async ({
    page,
    openSentencePlan,
  }) => {
    await openSentencePlan({
      plan: builder =>
        builder
          .withGoal({
            title: 'Find stable accommodation',
            areaOfNeed: 'accommodation',
            status: 'ACTIVE',
            targetDate: getDatePlusDaysAsISO(90),
            steps: [{ actor: 'probation_practitioner', description: 'Contact housing services' }],
          })
          .withPlanAgreements([
            {
              status: 'AGREED',
              createdBy: 'Test Practitioner',
              dateOffset: oneDayAgoMs,
            },
          ]),
    })

    const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

    await planOverviewPage.clickUpdateGoal(0)
    const updatePage = await UpdateGoalAndStepsPage.verifyOnPage(page)
    await updatePage.clickChangeGoalDetails()

    const changeGoalPage = await ChangeGoalPage.verifyOnPage(page)
    await changeGoalPage.selectCanStartNow(false)
    await changeGoalPage.saveGoal()

    await page.goto(sentencePlanV1URLs.PLAN_HISTORY)
    const planHistoryPage = await PlanHistoryPage.verifyOnPage(page)

    await expect(
      planHistoryPage.mainContent.getByRole('heading', { name: /Goal updated.*Find stable accommodation/ }),
    ).toBeVisible()
  })

  test('should create one plan history entry per reorder and preserve the step order snapshot', async ({
    page,
    openSentencePlan,
  }) => {
    await openSentencePlan({
      plan: builder =>
        builder
          .withGoal({
            title: 'Find stable accommodation',
            areaOfNeed: 'accommodation',
            status: 'ACTIVE',
            targetDate: getDatePlusDaysAsISO(90),
            steps: [
              { actor: 'probation_practitioner', description: 'Step A', status: 'NOT_STARTED' },
              { actor: 'person_on_probation', description: 'Step B', status: 'NOT_STARTED' },
            ],
          })
          .withPlanAgreements([
            {
              status: 'AGREED',
              createdBy: 'Test Practitioner',
              dateOffset: oneDayAgoMs,
            },
          ]),
    })

    const goalUpdatedSelector = { name: /Goal updated.*Find stable accommodation/ }

    // reorder: A,B >> B,A
    const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)
    await planOverviewPage.clickUpdateGoal(0)
    const updatePage = await UpdateGoalAndStepsPage.verifyOnPage(page)
    await updatePage.clickReorderSteps()

    const reorderPage = await ReorderStepsPage.verifyOnPage(page)
    await reorderPage.clickMoveDown(0)
    await reorderPage.clickSaveAndContinue()
    await UpdateGoalAndStepsPage.verifyOnPage(page)

    await page.getByRole('link', { name: 'Plan history' }).click()
    const planHistoryPage = await PlanHistoryPage.verifyOnPage(page)
    await expect(planHistoryPage.mainContent.getByRole('heading', goalUpdatedSelector)).toHaveCount(1)

    // reorder back: B,A >> A,B
    await page.getByRole('link', { name: /'s plan/i }).click()
    await planOverviewPage.clickUpdateGoal(0)
    await updatePage.clickReorderSteps()

    await reorderPage.clickMoveDown(0)
    await reorderPage.clickSaveAndContinue()

    await page.getByRole('link', { name: 'Plan history' }).click()
    await expect(planHistoryPage.mainContent.getByRole('heading', goalUpdatedSelector)).toHaveCount(2)

    // verify the older entry preserved the B,A snapshot
    await planHistoryPage.clickShowAllSectionsButton()

    expect(await planHistoryPage.getStepDescription(1, 0)).toBe('Step B')
    expect(await planHistoryPage.getStepDescription(1, 1)).toBe('Step A')
  })
})
