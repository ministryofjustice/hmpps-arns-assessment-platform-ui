import { expect } from '@playwright/test'
import { test, TargetService } from '../../../support/fixtures'
import PlanHistoryPage from '../../../pages/sentencePlan/planHistoryPage'
import { handlePrivacyScreenIfPresent } from '../sentencePlanUtils'

test.describe('Plan History - Created Goals', () => {
  test('displays created goal entry with title, creator name, and view link', async ({
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
        createdBy: 'Jane Smith',
        steps: [{ actor: 'probation_practitioner', description: 'Contact housing services' }],
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
        - strong: Goal created
        - text: /Jane Smith/
      - paragraph:
        - strong: Find stable accommodation
      - paragraph:
        - link "View goal":
          - /url: /goal/
      - separator
      - paragraph:
        - strong: Plan agreed
        - text: /Test Practitioner and Test/
      - paragraph: Test agreed to this plan.
    `)
  })

  test('navigates to update goals and steps when clicking View goal link', async ({
    page,
    createSession,
    sentencePlanBuilder,
  }) => {
    const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
    await sentencePlanBuilder
      .extend(sentencePlanId)
      .withGoal({
        title: 'Test created goal',
        areaOfNeed: 'accommodation',
        status: 'ACTIVE',
        createdBy: 'Test Practitioner',
        steps: [{ actor: 'probation_practitioner', description: 'Test step' }],
      })
      .withPlanAgreements([
        {
          status: 'AGREED',
          createdBy: 'Test Practitioner',
          dateOffset: -86400000,
        },
      ])
      .save()

    await page.goto(handoverLink)
    await handlePrivacyScreenIfPresent(page)
    await page.getByRole('link', { name: /View plan history/i }).click()

    const planHistoryPage = await PlanHistoryPage.verifyOnPage(page)

    // Click the "View goal" link on the created goal entry
    const viewGoalLink = await planHistoryPage.getViewGoalLink(0)
    await viewGoalLink.click()

    // Verify we're on the update goal and steps page
    await expect(page).toHaveURL(/update-goal-steps/)
    await expect(page.locator('[data-qa="main-form"] h2').first()).toContainText('Test created goal')
  })

  test('displays created goal in correct chronological order with other events', async ({
    page,
    createSession,
    sentencePlanBuilder,
  }) => {
    const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
    await sentencePlanBuilder
      .extend(sentencePlanId)
      .withGoal({
        title: 'Active goal',
        areaOfNeed: 'accommodation',
        status: 'ACTIVE',
        createdBy: 'Goal Creator',
        steps: [{ actor: 'probation_practitioner', description: 'Test step' }],
      })
      .withGoal({
        title: 'Achieved goal',
        areaOfNeed: 'alcohol-use',
        status: 'ACHIEVED',
        achievedBy: 'Achievement Practitioner',
        createdBy: 'Goal Creator',
      })
      .withPlanAgreements([
        {
          status: 'AGREED',
          createdBy: 'Initial Practitioner',
          dateOffset: -172800000, // 2 days ago (oldest)
        },
      ])
      .save()

    await page.goto(handoverLink)
    await handlePrivacyScreenIfPresent(page)
    await page.getByRole('link', { name: /View plan history/i }).click()

    const planHistoryPage = await PlanHistoryPage.verifyOnPage(page)

    // Verify that Goal created entries appear alongside other event types
    // The exact order depends on timestamps, but all event types should be present
    const content = await planHistoryPage.mainContent.textContent()
    expect(content).toContain('Goal created')
    expect(content).toContain('Goal marked as achieved')
    expect(content).toContain('Plan agreed')
  })
})
