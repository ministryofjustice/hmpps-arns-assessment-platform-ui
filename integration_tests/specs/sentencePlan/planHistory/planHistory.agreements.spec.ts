import { expect } from '@playwright/test'
import { test, TargetService } from '../../../support/fixtures'
import PlanHistoryPage from '../../../pages/sentencePlan/planHistoryPage'
import { handlePrivacyScreenIfPresent, navigateToSentencePlan } from '../sentencePlanUtils'

test.describe('Plan History - Agreements', () => {
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

      // Navigate to plan history
      await page.goto(handoverLink)
      await handlePrivacyScreenIfPresent(page)
      await page.getByRole('link', { name: /View plan history/i }).click()

      // Verify we're on the plan history page
      const planHistoryPage = await PlanHistoryPage.verifyOnPage(page)
      await expect(planHistoryPage.mainContent).toMatchAriaSnapshot(`
        - paragraph: View all updates and changes made to this plan.
        - separator
        - paragraph:
          - strong: Agreement updated
          - text: /Follow-up Practitioner and Test/
        - paragraph: Test agreed to this plan.
        - paragraph: Person agreed after reviewing the plan
        - separator
        - paragraph:
          - strong: Plan created
          - text: /^(?=.*Initial Practitioner)(?!.*and).*$/
        - paragraph: Test could not agree to this plan.
        - paragraph: Person was not available to discuss the plan
        - paragraph:
          - link /.+ Back to top/
      `)
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
      await expect(planHistoryPage.mainContent).toMatchAriaSnapshot(`
        - paragraph:
          - strong: Plan agreed
          - text: /Test Practitioner and Test/
      `)
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
      await expect(planHistoryPage.mainContent).toMatchAriaSnapshot(`
        - paragraph:
          - strong: Plan agreed
          - text: /First Practitioner and Test/
      `)
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
      await expect(planHistoryPage.mainContent).toMatchAriaSnapshot(`
        - paragraph: View all updates and changes made to this plan.
        - separator
        - paragraph:
          - strong: Plan created
        - paragraph: /did not agree/
        - paragraph: Person disagrees with the goals set
      `)
    })
  })

  test.describe('Read-only access', () => {
    test('hides update agreement link in read-only mode even when status is COULD_NOT_ANSWER', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, handoverLink } = await createSession({
        targetService: TargetService.SENTENCE_PLAN,
        planAccessMode: 'READ_ONLY',
      })
      await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoal({
          title: 'Improve communication skills',
          areaOfNeed: 'thinking-behaviours-and-attitudes',
          status: 'ACTIVE',
          steps: [{ actor: 'probation_practitioner', description: 'Attend group sessions' }],
        })
        .withPlanAgreements([
          {
            status: 'COULD_NOT_ANSWER',
            createdBy: 'Test Practitioner',
            detailsCouldNotAnswer: 'Person was not available',
            dateOffset: 0,
          },
        ])
        .save()

      await navigateToSentencePlan(page, handoverLink)
      await page.getByRole('link', { name: /Plan history/i }).click()

      const planHistoryPage = await PlanHistoryPage.verifyOnPage(page)
      await expect(planHistoryPage.updateAgreementLink).not.toBeVisible()
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
      await expect(planHistoryPage.mainContent).toMatchAriaSnapshot(`
        - paragraph:
          - strong: Agreement updated
        - separator
        - paragraph:
          - strong: Plan created
      `)
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
      await expect(planHistoryPage.mainContent).toMatchAriaSnapshot(`
        - paragraph:
          - strong: Agreement updated
        - paragraph: Test did not agree to this plan.
        - separator
        - paragraph:
          - strong: Plan created
        - paragraph: Test could not agree to this plan.
      `)
    })
  })
})
