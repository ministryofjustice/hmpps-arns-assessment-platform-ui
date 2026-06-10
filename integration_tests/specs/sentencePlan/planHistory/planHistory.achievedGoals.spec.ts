import { expect } from '@playwright/test'
import { test, TargetService } from '../../../support/fixtures'
import PlanHistoryPage from '../../../pages/sentencePlan/planHistoryPage'
import { handlePrivacyScreenIfPresent } from '../sentencePlanUtils'
import ViewInactiveGoalPage from '../../../pages/sentencePlan/viewInactiveGoalPage'

test.describe('Plan History - Achieved Goals', () => {
  test('displays achieved goal entry with action, date, achiever, goal title, notes and view goal link', async ({
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
      - paragraph: View all updates to this plan.
      - button "Show all sections"
      - heading /Goal marked as achieved.*Jane Smith.*Reduce alcohol use.*goal was achieved through dedicated effort/
      - heading /Plan agreed/
    `)

    await planHistoryPage.clickShowAllSectionsButton()
    await planHistoryPage.clickViewGoalLink()
    await ViewInactiveGoalPage.verifyOnPage(page)
  })

  test('displays achieved goal without notes when none were provided', async ({
    page,
    createSession,
    sentencePlanBuilder,
  }) => {
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
      - heading /Goal marked as achieved.*John Doe.*Build positive relationships/
    `)
  })

  test('displays entries sorted by date with newest first', async ({ page, createSession, sentencePlanBuilder }) => {
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
      - heading /Goal marked as achieved/
      - heading /Agreement updated/
      - heading /Plan created/
    `)
  })
})
