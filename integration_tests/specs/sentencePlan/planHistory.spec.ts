import { expect } from '@playwright/test'
import { test, TargetService } from '../../support/fixtures'
import PlanOverviewPage from '../../pages/sentencePlan/planOverviewPage'
import PlanHistoryPage from '../../pages/sentencePlan/planHistoryPage'
import { handlePrivacyScreenIfPresent } from './sentencePlanUtils'

test.describe('Plan History Page', () => {
  test.describe('Could not answer then agreed scenario', () => {
    test('displays agreement history with correct status headings when plan was initially unanswered then agreed', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      // Create a plan with two agreements:
      // 1. Initial: Could not answer (older - "Plan created")
      // 2. Update: Agreed (newer - "Agreement updated")
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
            status: 'COULD_NOT_ANSWER',
            createdBy: 'Initial Practitioner',
            detailsCouldNotAnswer: 'Person was not available to discuss the plan',
            dateOffset: -86400000, // 1 day ago (older)
          },
          {
            status: 'UPDATED_AGREED',
            createdBy: 'Follow-up Practitioner',
            notes: 'Person agreed after reviewing the plan',
            dateOffset: 0, // now (most recent)
          },
        ])
        .save()

      // Navigate to plan overview
      await page.goto(handoverLink)
      await handlePrivacyScreenIfPresent(page)
      await PlanOverviewPage.verifyOnPage(page)

      // Click the "View plan history" link
      await page.getByRole('link', { name: /View plan history/i }).click()

      // Verify we're on the plan history page
      const planHistoryPage = await PlanHistoryPage.verifyOnPage(page)

      // Verify subtitle is visible
      await expect(planHistoryPage.subtitleText).toBeVisible()

      // Verify we have 2 history entries
      const entryCount = await planHistoryPage.getHistoryEntryCount()
      expect(entryCount).toBe(2)

      // Verify the most recent entry (index 0) shows "Agreement updated" (UPDATED_AGREED)
      const firstEntryHeading = await planHistoryPage.getEntryStatusHeading(0)
      expect(firstEntryHeading).toBe('Agreement updated')

      // Verify the first entry header includes practitioner name and person name
      const firstEntryHeader = await planHistoryPage.getEntryHeaderText(0)
      expect(firstEntryHeader).toContain('Follow-up Practitioner')
      expect(firstEntryHeader).toContain(' and ') // Should include person's name

      // Verify the first entry description
      const firstEntryDescription = await planHistoryPage.getEntryDescriptionText(0)
      expect(firstEntryDescription).toContain('agreed to this plan')

      // Verify the older entry (index 1) shows "Plan created" (COULD_NOT_ANSWER)
      const secondEntryHeading = await planHistoryPage.getEntryStatusHeading(1)
      expect(secondEntryHeading).toBe('Plan created')

      // Verify the second entry header only shows practitioner name (no person name for non-agreed)
      const secondEntryHeader = await planHistoryPage.getEntryHeaderText(1)
      expect(secondEntryHeader).toContain('Initial Practitioner')
      expect(secondEntryHeader).not.toContain(' and ')

      // Verify the second entry description
      const secondEntryDescription = await planHistoryPage.getEntryDescriptionText(1)
      expect(secondEntryDescription).toContain('could not answer')

      // Verify the reason and notes are displayed
      const secondEntryContainsReason = await planHistoryPage.entryContainsText(
        1,
        'Person was not available to discuss the plan',
      )
      expect(secondEntryContainsReason).toBe(true)

      const firstEntryContainsNotes = await planHistoryPage.entryContainsText(
        0,
        'Person agreed after reviewing the plan',
      )
      expect(firstEntryContainsNotes).toBe(true)

      // Verify there's a section break between entries
      const hasSectionBreak = await planHistoryPage.hasSectionBreakBetweenEntries()
      expect(hasSectionBreak).toBe(true)
    })

    test('hides update agreement link when plan is agreed', async ({ page, createSession, sentencePlanBuilder }) => {
      // Create a plan that has been agreed
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoal({
          title: 'Reduce alcohol use',
          areaOfNeed: 'alcohol-use',
          status: 'ACTIVE',
          steps: [{ actor: 'person_on_probation', description: 'Attend support group' }],
        })
        .withPlanAgreements([
          {
            status: 'AGREED',
            createdBy: 'Test Practitioner',
            dateOffset: 0,
          },
        ])
        .save()

      await page.goto(handoverLink)
      await handlePrivacyScreenIfPresent(page)
      await page.getByRole('link', { name: /View plan history/i }).click()

      const planHistoryPage = await PlanHistoryPage.verifyOnPage(page)

      // Verify the update agreement link is NOT visible
      const isLinkVisible = await planHistoryPage.isUpdateAgreementLinkVisible()
      expect(isLinkVisible).toBe(false)
    })
  })

  test.describe('Initial plan agreement', () => {
    test('displays "Plan agreed" for first-time agreement', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoal({
          title: 'Build positive relationships',
          areaOfNeed: 'personal-relationships-and-community',
          status: 'ACTIVE',
          steps: [{ actor: 'person_on_probation', description: 'Reconnect with family' }],
        })
        .withPlanAgreements([
          {
            status: 'AGREED',
            createdBy: 'First Practitioner',
            notes: 'Initial agreement notes',
            dateOffset: 0,
          },
        ])
        .save()

      await page.goto(handoverLink)
      await handlePrivacyScreenIfPresent(page)
      await page.getByRole('link', { name: /View plan history/i }).click()

      const planHistoryPage = await PlanHistoryPage.verifyOnPage(page)

      // Verify the entry shows "Plan agreed" (not "Agreement updated")
      const entryHeading = await planHistoryPage.getEntryStatusHeading(0)
      expect(entryHeading).toBe('Plan agreed')

      // Verify the header includes "and" (person's name)
      const entryHeader = await planHistoryPage.getEntryHeaderText(0)
      expect(entryHeader).toContain(' and ')
    })

    test('displays "Plan created" for initial non-agreement (DO_NOT_AGREE)', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoal({
          title: 'Address thinking patterns',
          areaOfNeed: 'thinking-behaviours-and-attitudes',
          status: 'ACTIVE',
          steps: [{ actor: 'probation_practitioner', description: 'Discuss cognitive exercises' }],
        })
        .withPlanAgreements([
          {
            status: 'DO_NOT_AGREE',
            createdBy: 'Test Practitioner',
            detailsNo: 'Person disagrees with the goals set',
            dateOffset: 0,
          },
        ])
        .save()

      await page.goto(handoverLink)
      await handlePrivacyScreenIfPresent(page)
      await page.getByRole('link', { name: /View plan history/i }).click()

      const planHistoryPage = await PlanHistoryPage.verifyOnPage(page)

      // Verify the entry shows "Plan created"
      const entryHeading = await planHistoryPage.getEntryStatusHeading(0)
      expect(entryHeading).toBe('Plan created')

      // Verify the description mentions not agreeing
      const entryDescription = await planHistoryPage.getEntryDescriptionText(0)
      expect(entryDescription).toContain('did not agree')

      // Verify the reason is displayed
      const containsReason = await planHistoryPage.entryContainsText(0, 'Person disagrees with the goals set')
      expect(containsReason).toBe(true)
    })
  })

  test.describe('Agreement updates (only possible after COULD_NOT_ANSWER)', () => {
    test('displays "Agreement updated" when person agrees after initially not being able to answer', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      // Valid flow: COULD_NOT_ANSWER → UPDATED_AGREED
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoal({
          title: 'Manage finances better',
          areaOfNeed: 'finances',
          status: 'ACTIVE',
          steps: [{ actor: 'person_on_probation', description: 'Create a budget' }],
        })
        .withPlanAgreements([
          {
            status: 'COULD_NOT_ANSWER',
            createdBy: 'First Practitioner',
            detailsCouldNotAnswer: 'Person was unavailable',
            dateOffset: -172800000, // 2 days ago
          },
          {
            status: 'UPDATED_AGREED',
            createdBy: 'Second Practitioner',
            notes: 'Person is now available and agrees',
            dateOffset: 0, // now
          },
        ])
        .save()

      await page.goto(handoverLink)
      await handlePrivacyScreenIfPresent(page)
      await page.getByRole('link', { name: /View plan history/i }).click()

      const planHistoryPage = await PlanHistoryPage.verifyOnPage(page)

      // Most recent should be "Agreement updated"
      const firstEntryHeading = await planHistoryPage.getEntryStatusHeading(0)
      expect(firstEntryHeading).toBe('Agreement updated')

      // Older should be "Plan created" (COULD_NOT_ANSWER)
      const secondEntryHeading = await planHistoryPage.getEntryStatusHeading(1)
      expect(secondEntryHeading).toBe('Plan created')
    })

    test('displays "Agreement updated" when person does not agree after initially not being able to answer', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      // Valid flow: COULD_NOT_ANSWER → UPDATED_DO_NOT_AGREE
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoal({
          title: 'Improve health',
          areaOfNeed: 'health-and-wellbeing',
          status: 'ACTIVE',
          steps: [{ actor: 'person_on_probation', description: 'Attend health check' }],
        })
        .withPlanAgreements([
          {
            status: 'COULD_NOT_ANSWER',
            createdBy: 'First Practitioner',
            detailsCouldNotAnswer: 'Person was in hospital',
            dateOffset: -172800000, // 2 days ago
          },
          {
            status: 'UPDATED_DO_NOT_AGREE',
            createdBy: 'Second Practitioner',
            detailsNo: 'Person does not agree with the plan after reviewing it',
            dateOffset: 0, // now
          },
        ])
        .save()

      await page.goto(handoverLink)
      await handlePrivacyScreenIfPresent(page)
      await page.getByRole('link', { name: /View plan history/i }).click()

      const planHistoryPage = await PlanHistoryPage.verifyOnPage(page)

      // Most recent should be "Agreement updated"
      const firstEntryHeading = await planHistoryPage.getEntryStatusHeading(0)
      expect(firstEntryHeading).toBe('Agreement updated')

      // Should show "did not agree" in description
      const firstEntryDescription = await planHistoryPage.getEntryDescriptionText(0)
      expect(firstEntryDescription).toContain('did not agree')

      // Older should be "Plan created" (COULD_NOT_ANSWER)
      const secondEntryHeading = await planHistoryPage.getEntryStatusHeading(1)
      expect(secondEntryHeading).toBe('Plan created')
    })
  })

  test.describe('Achieved goals', () => {
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

  test.describe('Removed goals', () => {
    test('displays removed goal entry with title, remover name, reason, and view link', async ({
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
          title: 'Active goal',
          areaOfNeed: 'accommodation',
          status: 'ACTIVE',
          steps: [{ actor: 'probation_practitioner', description: 'Test step' }],
        })
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

  test.describe('Navigation', () => {
    test('can navigate to plan history from plan overview', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoal({
          title: 'Test goal',
          areaOfNeed: 'accommodation',
          status: 'ACTIVE',
          steps: [{ actor: 'probation_practitioner', description: 'Test step' }],
        })
        .withAgreementStatus('AGREED')
        .save()

      await page.goto(handoverLink)
      await handlePrivacyScreenIfPresent(page)

      // Verify the "View plan history" link is visible
      const viewHistoryLink = page.getByRole('link', { name: /View plan history/i })
      await expect(viewHistoryLink).toBeVisible()

      // Click the link
      await viewHistoryLink.click()

      // Verify we're on the plan history page
      await expect(page).toHaveURL(/plan-history/)
      await PlanHistoryPage.verifyOnPage(page)
    })

    test('redirects to plan overview when plan has no agreement status', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      // Create a plan without any agreement (draft state)
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoal({
          title: 'Draft goal',
          areaOfNeed: 'accommodation',
          status: 'ACTIVE',
        })
        .save()

      await page.goto(handoverLink)
      await handlePrivacyScreenIfPresent(page)

      // Try to navigate directly to plan history
      await page.goto(`/forms/sentence-plan/v1.0/plan/plan-history`)

      // Should be redirected back to plan overview
      await expect(page).toHaveURL(/overview/)
    })
  })
})
