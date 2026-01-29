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
    await expect(planHistoryPage.mainContent).toMatchAriaSnapshot(`
      - paragraph: View all updates and changes made to this plan.
      - separator
      - paragraph:
        - strong: Goal marked as achieved
        - text: /Jane Smith/
      - paragraph:
        - strong: Reduce alcohol use
      - paragraph: The goal was achieved through dedicated effort and support.
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
    await expect(planHistoryPage.mainContent).toMatchAriaSnapshot(`
      - paragraph:
        - strong: Goal marked as achieved
        - text: /John Doe/
      - paragraph:
        - strong: Build positive relationships
      - paragraph:
        - link "View goal":
          - /url: /goal/
    `)
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
    await expect(planHistoryPage.mainContent).toMatchAriaSnapshot(`
      - paragraph:
        - strong: Goal marked as achieved
      - separator
      - paragraph:
        - strong: Agreement updated
      - separator
      - paragraph:
        - strong: Plan created
    `)
  })
})
