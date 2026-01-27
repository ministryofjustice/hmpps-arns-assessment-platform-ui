import { expect } from '@playwright/test'
import { test, TargetService } from '../../support/fixtures'
import PlanOverviewPage from '../../pages/sentencePlan/planOverviewPage'
import PlanHistoryPage from '../../pages/sentencePlan/planHistoryPage'

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

      // Try to navigate directly to plan history
      await page.goto(`/forms/sentence-plan/v1.0/plan/plan-history`)

      // Should be redirected back to plan overview
      await expect(page).toHaveURL(/overview/)
    })
  })
})
