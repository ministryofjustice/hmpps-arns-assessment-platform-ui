import { expect } from '@playwright/test'
import { test, TargetService } from '../../support/fixtures'
import PlanHistoryPage from '../../pages/sentencePlan/planHistoryPage'
import { handlePrivacyScreenIfPresent } from './sentencePlanUtils'

test.describe('Plan History - Re-added Goals', () => {
  test('displays re-added goal entry with title, assessor name, reason, and view link', async ({
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
        notes: [
          {
            type: 'READDED',
            note: 'Circumstances have changed, goal is now relevant again.',
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

    // Should have 2 entries: the re-added goal and the plan agreement
    const entryCount = await planHistoryPage.getHistoryEntryCount()
    expect(entryCount).toBe(2)

    // Find the re-added goal entry (should be most recent, index 0)
    const firstEntryHeader = await planHistoryPage.getEntryHeaderText(0)
    expect(firstEntryHeader).toContain('Goal added back into plan')
    expect(firstEntryHeader).toContain('Jane Smith')

    // Verify the goal title is displayed in bold
    const hasGoalTitle = await planHistoryPage.entryContainsText(0, 'Find stable accommodation')
    expect(hasGoalTitle).toBe(true)

    // Verify the reason is displayed
    const hasReason = await planHistoryPage.entryContainsText(
      0,
      'Circumstances have changed, goal is now relevant again.',
    )
    expect(hasReason).toBe(true)

    // Verify the "View latest version" link is present
    const viewLink = await planHistoryPage.getViewGoalLink(0)
    expect(await viewLink.textContent()).toContain('View latest version')
  })

  test('displays re-added goal without reason when none was provided', async ({
    page,
    createSession,
    sentencePlanBuilder,
  }) => {
    // Create a plan with a re-added goal but no reason note
    const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
    await sentencePlanBuilder
      .extend(sentencePlanId)
      .withGoal({
        title: 'Build positive relationships',
        areaOfNeed: 'personal-relationships-and-community',
        status: 'ACTIVE',
        steps: [{ actor: 'person_on_probation', description: 'Reconnect with family' }],
        notes: [
          {
            type: 'READDED',
            note: '',
            createdBy: 'John Doe',
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

    // Verify the re-added goal entry is present
    const firstEntryHeader = await planHistoryPage.getEntryHeaderText(0)
    expect(firstEntryHeader).toContain('Goal added back into plan')
    expect(firstEntryHeader).toContain('John Doe')

    // Verify the goal title is displayed
    const hasGoalTitle = await planHistoryPage.entryContainsText(0, 'Build positive relationships')
    expect(hasGoalTitle).toBe(true)

    // Verify the "View latest version" link is still present
    const viewLink = await planHistoryPage.getViewGoalLink(0)
    expect(await viewLink.textContent()).toContain('View latest version')
  })

  test('navigates to update goal and steps page when clicking View latest version link', async ({
    page,
    createSession,
    sentencePlanBuilder,
  }) => {
    const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
    await sentencePlanBuilder
      .extend(sentencePlanId)
      .withGoal({
        title: 'Test re-added goal',
        areaOfNeed: 'accommodation',
        status: 'ACTIVE',
        steps: [{ actor: 'probation_practitioner', description: 'Test step' }],
        notes: [
          {
            type: 'READDED',
            note: 'Test re-add reason',
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

    // Click the "View latest version" link
    const viewLink = await planHistoryPage.getViewGoalLink(0)
    await viewLink.click()

    // Verify we're on the update goal and steps page
    await expect(page).toHaveURL(/update-goal-steps/)
    await expect(page.locator('h1')).toContainText('Update goal and steps')
  })

  test('displays re-added goal in correct chronological order with other events', async ({
    page,
    createSession,
    sentencePlanBuilder,
  }) => {
    // Create a plan with multiple events in chronological order
    const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
    await sentencePlanBuilder
      .extend(sentencePlanId)
      .withGoal({
        title: 'Re-added goal',
        areaOfNeed: 'alcohol-use',
        status: 'ACTIVE',
        steps: [{ actor: 'person_on_probation', description: 'Attend support group' }],
        notes: [
          {
            type: 'READDED',
            note: 'Goal is now relevant again',
            createdBy: 'Re-add Practitioner',
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

    // Most recent should be the re-added goal (created with current timestamp)
    const firstEntryHeader = await planHistoryPage.getEntryHeaderText(0)
    expect(firstEntryHeader).toContain('Goal added back into plan')

    // Second should be "Agreement updated"
    const secondEntryHeading = await planHistoryPage.getEntryStatusHeading(1)
    expect(secondEntryHeading).toBe('Agreement updated')

    // Third should be "Plan created"
    const thirdEntryHeading = await planHistoryPage.getEntryStatusHeading(2)
    expect(thirdEntryHeading).toBe('Plan created')
  })

  test('displays both Goal removed and Goal added back into plan events for a re-added goal', async ({
    page,
    createSession,
    sentencePlanBuilder,
  }) => {
    // Create a plan with a goal that was removed and then re-added
    // Both events should appear in the history
    const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
    await sentencePlanBuilder
      .extend(sentencePlanId)
      .withGoal({
        title: 'Goal with full history',
        areaOfNeed: 'accommodation',
        status: 'ACTIVE',
        steps: [{ actor: 'probation_practitioner', description: 'Contact housing services' }],
        notes: [
          {
            type: 'REMOVED',
            note: 'Goal no longer relevant at this time.',
            createdBy: 'Removal Practitioner',
          },
          {
            type: 'READDED',
            note: 'Circumstances changed, goal is relevant again.',
            createdBy: 'Re-add Practitioner',
          },
        ],
      })
      .withPlanAgreements([
        {
          status: 'AGREED',
          createdBy: 'Test Practitioner',
          dateOffset: -172800000, // 2 days ago
        },
      ])
      .save()

    await page.goto(handoverLink)
    await handlePrivacyScreenIfPresent(page)
    await page.getByRole('link', { name: /View plan history/i }).click()

    const planHistoryPage = await PlanHistoryPage.verifyOnPage(page)

    // Should have 3 entries: re-added, removed, and plan agreement
    const entryCount = await planHistoryPage.getHistoryEntryCount()
    expect(entryCount).toBe(3)

    const allEntriesText = await Promise.all([
      planHistoryPage.getEntryHeaderText(0),
      planHistoryPage.getEntryHeaderText(1),
      planHistoryPage.getEntryHeaderText(2),
    ])

    const readdedIndex = allEntriesText.findIndex(text => text.includes('Goal added back into plan'))
    const removedIndex = allEntriesText.findIndex(text => text.includes('Goal removed'))
    const agreementIndex = allEntriesText.findIndex(text => text.includes('Plan agreed'))

    expect(readdedIndex).toBeGreaterThanOrEqual(0)
    expect(removedIndex).toBeGreaterThanOrEqual(0)
    expect(agreementIndex).toBeGreaterThanOrEqual(0)

    // Verify removal reason is displayed
    const hasRemovalReason = await planHistoryPage.entryContainsText(
      removedIndex,
      'Goal no longer relevant at this time.',
    )
    expect(hasRemovalReason).toBe(true)

    // Verify re-add reason is displayed
    const hasReaddReason = await planHistoryPage.entryContainsText(
      readdedIndex,
      'Circumstances changed, goal is relevant again.',
    )
    expect(hasReaddReason).toBe(true)

    // Both goal entries should show "View latest version" since the goal is now active
    const readdedViewLink = await planHistoryPage.getViewGoalLink(readdedIndex)
    expect(await readdedViewLink.textContent()).toContain('View latest version')

    const removedViewLink = await planHistoryPage.getViewGoalLink(removedIndex)
    expect(await removedViewLink.textContent()).toContain('View latest version')
  })
})
