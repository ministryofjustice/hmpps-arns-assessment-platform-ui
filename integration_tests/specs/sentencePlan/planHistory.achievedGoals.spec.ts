import { expect } from '@playwright/test'
import { test, TargetService } from '../../support/fixtures'
import PlanHistoryPage from '../../pages/sentencePlan/planHistoryPage'
import { handlePrivacyScreenIfPresent } from './sentencePlanUtils'

test.describe('Plan History - Achieved Goals', () => {
  test('displays achieved goal entry with title, achiever name, and view link', async ({
    page,
    createSession,
    sentencePlanBuilder,
  }) => {
    // Create a plan with an achieved goal
    const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
    await sentencePlanBuilder
      .extend(sentencePlanId)
      .withGoal({
        title: 'Find stable accommodation',
        areaOfNeed: 'accommodation',
        status: 'ACTIVE',
        steps: [{ actor: 'probation_practitioner', description: 'Contact housing services' }],
      })
      .withGoal({
        title: 'Reduce alcohol use',
        areaOfNeed: 'alcohol-use',
        status: 'ACHIEVED',
        achievedBy: 'Jane Smith',
        notes: [
          {
            type: 'ACHIEVED',
            note: 'The goal was achieved through dedicated effort and support.',
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

    // Should have 2 entries: the achieved goal and the plan agreement
    const entryCount = await planHistoryPage.getHistoryEntryCount()
    expect(entryCount).toBe(2)

    // Find the achieved goal entry (should be most recent, index 0)
    const firstEntryHeader = await planHistoryPage.getEntryHeaderText(0)
    expect(firstEntryHeader).toContain('Goal marked as achieved')
    expect(firstEntryHeader).toContain('Jane Smith')

    // Verify the goal title is displayed in bold
    const hasGoalTitle = await planHistoryPage.entryContainsText(0, 'Reduce alcohol use')
    expect(hasGoalTitle).toBe(true)

    // Verify the notes are displayed
    const hasNotes = await planHistoryPage.entryContainsText(
      0,
      'The goal was achieved through dedicated effort and support.',
    )
    expect(hasNotes).toBe(true)

    // Verify the "View goal" link is present
    const hasViewLink = await planHistoryPage.entryHasViewGoalLink(0)
    expect(hasViewLink).toBe(true)
  })

  test('displays achieved goal without notes when none were provided', async ({
    page,
    createSession,
    sentencePlanBuilder,
  }) => {
    // Create a plan with an achieved goal but no notes
    const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
    await sentencePlanBuilder
      .extend(sentencePlanId)
      .withGoal({
        title: 'Build positive relationships',
        areaOfNeed: 'personal-relationships-and-community',
        status: 'ACHIEVED',
        achievedBy: 'John Doe',
        // No notes provided
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

    // Verify the achieved goal entry is present
    const firstEntryHeader = await planHistoryPage.getEntryHeaderText(0)
    expect(firstEntryHeader).toContain('Goal marked as achieved')
    expect(firstEntryHeader).toContain('John Doe')

    // Verify the goal title is displayed
    const hasGoalTitle = await planHistoryPage.entryContainsText(0, 'Build positive relationships')
    expect(hasGoalTitle).toBe(true)

    // Verify the "View goal" link is still present
    const hasViewLink = await planHistoryPage.entryHasViewGoalLink(0)
    expect(hasViewLink).toBe(true)
  })

  test('displays entries sorted by date with newest first', async ({ page, createSession, sentencePlanBuilder }) => {
    // Create a plan with multiple events in chronological order
    const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
    await sentencePlanBuilder
      .extend(sentencePlanId)
      .withGoal({
        title: 'Active goal',
        areaOfNeed: 'accommodation',
        status: 'ACTIVE',
        steps: [{ actor: 'probation_practitioner', description: 'Test step' }],
      })
      .withGoal({
        title: 'Achieved goal',
        areaOfNeed: 'alcohol-use',
        status: 'ACHIEVED',
        achievedBy: 'Achievement Practitioner',
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

    // Most recent should be the achieved goal (created with current timestamp)
    const firstEntryHeader = await planHistoryPage.getEntryHeaderText(0)
    expect(firstEntryHeader).toContain('Goal marked as achieved')

    // Second should be "Agreement updated"
    const secondEntryHeading = await planHistoryPage.getEntryStatusHeading(1)
    expect(secondEntryHeading).toBe('Agreement updated')

    // Third should be "Plan created"
    const thirdEntryHeading = await planHistoryPage.getEntryStatusHeading(2)
    expect(thirdEntryHeading).toBe('Plan created')
  })
})
