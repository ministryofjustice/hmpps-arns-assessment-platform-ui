import { expect } from '@playwright/test'
import { test, TargetService } from '../../../support/fixtures'
import PlanHistoryPage from '../../../pages/sentencePlan/planHistoryPage'
import { handlePrivacyScreenIfPresent } from '../sentencePlanUtils'

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
    await expect(planHistoryPage.mainContent).toMatchAriaSnapshot(`
      - paragraph:
        - strong: Goal removed
        - text: /by Jane Smith/
      - paragraph:
        - strong: Reduce alcohol use
      - paragraph: Goal no longer relevant due to change in circumstances.
      - paragraph:
        - link "View goal":
          - /url: /view-inactive-goal/
    `)
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
    await expect(page.locator('[data-qa="main-form"] h2')).toContainText('Test removed goal')
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
    await expect(planHistoryPage.mainContent).toMatchAriaSnapshot(`
      - paragraph:
        - strong: Goal removed
      - separator
      - paragraph:
        - strong: Agreement updated
      - separator
      - paragraph:
        - strong: Plan created
    `)
  })
})
