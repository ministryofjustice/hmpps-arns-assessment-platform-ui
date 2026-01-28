import { expect } from '@playwright/test'
import { test, TargetService } from '../../support/fixtures'
import PlanHistoryPage from '../../pages/sentencePlan/planHistoryPage'
import { handlePrivacyScreenIfPresent } from './sentencePlanUtils'

test.describe('Plan History - Removed Goals', () => {
  test('displays removed goal entry with title, remover name, reason, and view link', async ({
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
        status: 'REMOVED',
        notes: [
          {
            type: 'REMOVED',
            note: 'Goal no longer relevant due to change in circumstances.',
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

    // Should have 2 entries: the removed goal and the plan agreement
    const entryCount = await planHistoryPage.getHistoryEntryCount()
    expect(entryCount).toBe(2)

    // Find the removed goal entry (should be most recent, index 0)
    const firstEntryHeader = await planHistoryPage.getEntryHeaderText(0)
    expect(firstEntryHeader).toContain('Goal removed')
    expect(firstEntryHeader).toContain('Jane Smith')

    // Verify the goal title is displayed in bold
    const hasGoalTitle = await planHistoryPage.entryContainsText(0, 'Reduce alcohol use')
    expect(hasGoalTitle).toBe(true)

    // Verify the removal reason is displayed
    const hasReason = await planHistoryPage.entryContainsText(
      0,
      'Goal no longer relevant due to change in circumstances.',
    )
    expect(hasReason).toBe(true)

    // Verify the "View goal" link is present
    const hasViewLink = await planHistoryPage.entryHasViewGoalLink(0)
    expect(hasViewLink).toBe(true)
  })

  test('displays removed goal without reason when none was provided', async ({
    page,
    createSession,
    sentencePlanBuilder,
  }) => {
    // Create a plan with a removed goal but no removal note
    const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
    await sentencePlanBuilder
      .extend(sentencePlanId)
      .withGoal({
        title: 'Build positive relationships',
        areaOfNeed: 'personal-relationships-and-community',
        status: 'REMOVED',
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

    // Verify the removed goal entry is present
    const firstEntryHeader = await planHistoryPage.getEntryHeaderText(0)
    expect(firstEntryHeader).toContain('Goal removed')

    // Verify the goal title is displayed
    const hasGoalTitle = await planHistoryPage.entryContainsText(0, 'Build positive relationships')
    expect(hasGoalTitle).toBe(true)

    // Verify the "View goal" link is still present
    const hasViewLink = await planHistoryPage.entryHasViewGoalLink(0)
    expect(hasViewLink).toBe(true)
  })

  test('navigates to view goal details when clicking View goal link', async ({
    page,
    createSession,
    sentencePlanBuilder,
  }) => {
    const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
    await sentencePlanBuilder
      .extend(sentencePlanId)
      .withGoal({
        title: 'Test removed goal',
        areaOfNeed: 'accommodation',
        status: 'REMOVED',
        notes: [
          {
            type: 'REMOVED',
            note: 'Test removal reason',
            createdBy: 'Test Practitioner',
          },
        ],
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

    // Click the "View goal" link
    const viewGoalLink = await planHistoryPage.getViewGoalLink(0)
    await viewGoalLink.click()

    // Verify we're on the view inactive goal page
    await expect(page).toHaveURL(/view-inactive-goal/)
    await expect(page.locator('h2')).toContainText('Test removed goal')
  })

  test('displays removed goal in correct chronological order with other events', async ({
    page,
    createSession,
    sentencePlanBuilder,
  }) => {
    // Create a plan with multiple events in chronological order
    const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
    await sentencePlanBuilder
      .extend(sentencePlanId)
      .withGoal({
        title: 'Removed goal',
        areaOfNeed: 'alcohol-use',
        status: 'REMOVED',
        notes: [
          {
            type: 'REMOVED',
            note: 'No longer needed',
            createdBy: 'Removal Practitioner',
          },
        ],
      })
      .withPlanAgreements([
        {
          status: 'COULD_NOT_ANSWER',
          createdBy: 'Initial Practitioner',
          detailsCouldNotAnswer: 'Person unavailable',
          dateOffset: -172800000, // 2 days ago (oldest)
        },
        {
          status: 'UPDATED_AGREED',
          createdBy: 'Follow-up Practitioner',
          dateOffset: -43200000, // 12 hours ago (middle)
        },
      ])
      .save()

    await page.goto(handoverLink)
    await handlePrivacyScreenIfPresent(page)
    await page.getByRole('link', { name: /View plan history/i }).click()

    const planHistoryPage = await PlanHistoryPage.verifyOnPage(page)

    // Should have 3 entries total
    const entryCount = await planHistoryPage.getHistoryEntryCount()
    expect(entryCount).toBe(3)

    // Most recent should be the removed goal (created with current timestamp)
    const firstEntryHeader = await planHistoryPage.getEntryHeaderText(0)
    expect(firstEntryHeader).toContain('Goal removed')

    // Second should be "Agreement updated"
    const secondEntryHeading = await planHistoryPage.getEntryStatusHeading(1)
    expect(secondEntryHeading).toBe('Agreement updated')

    // Third should be "Plan created"
    const thirdEntryHeading = await planHistoryPage.getEntryStatusHeading(2)
    expect(thirdEntryHeading).toBe('Plan created')
  })
})
