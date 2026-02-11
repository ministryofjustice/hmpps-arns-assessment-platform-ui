import { expect } from '@playwright/test'
import { test, TargetService } from '../../../support/fixtures'
import PlanHistoryPage from '../../../pages/sentencePlan/planHistoryPage'
import { handlePrivacyScreenIfPresent } from '../sentencePlanUtils'

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
    await expect(planHistoryPage.mainContent).toMatchAriaSnapshot(`
      - paragraph: View all updates and changes made to this plan.
      - separator
      - paragraph:
        - strong: Goal added back into plan
        - text: /by Jane Smith/
      - paragraph:
        - strong: Find stable accommodation
      - paragraph: Circumstances have changed, goal is now relevant again.
      - paragraph:
        - link "View latest version":
          - /url: /update-goal-steps/
    `)
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
    await expect(planHistoryPage.mainContent).toMatchAriaSnapshot(`
      - paragraph:
        - strong: Goal added back into plan
        - text: /by John Doe/
      - paragraph:
        - strong: Build positive relationships
      - paragraph:
        - link "View latest version":
          - /url: /update-goal-steps/
    `)
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
    await expect(planHistoryPage.mainContent).toMatchAriaSnapshot(`
      - separator
      - paragraph:
        - strong: Goal added back into plan
      - separator
      - paragraph:
        - strong: Agreement updated
      - separator
      - paragraph:
        - strong: Plan created
    `)
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
    await expect(planHistoryPage.mainContent).toMatchAriaSnapshot(`
      - paragraph:
        - strong: Goal added back into plan
        - text: /by Re-add Practitioner/
      - paragraph:
        - strong: Goal with full history
      - paragraph: Circumstances changed, goal is relevant again.
      - paragraph:
        - link "View latest version":
          - /url: /update-goal-steps/
      - separator
      - paragraph:
        - strong: Goal removed
        - text: /by Removal Practitioner/
      - paragraph:
        - strong: Goal with full history
      - paragraph: Goal no longer relevant at this time.
      - paragraph:
        - link "View latest version":
          - /url: /update-goal-steps/
    `)
  })
})
