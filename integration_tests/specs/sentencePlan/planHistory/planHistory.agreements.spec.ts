import { expect } from '@playwright/test'
import { test, TargetService } from '../../../support/fixtures'
import PlanHistoryPage from '../../../pages/sentencePlan/planHistoryPage'
import { handlePrivacyScreenIfPresent } from '../sentencePlanUtils'

test.describe('Plan History - Agreements', () => {
  test.describe('Could not answer then agreed scenario', () => {
    test('displays agreement history with correct status headings when plan was initially unanswered then agreed', async ({
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

      await page.goto(handoverLink)
      await handlePrivacyScreenIfPresent(page)
      await page.getByRole('link', { name: /View plan history/i }).click()

      const planHistoryPage = await PlanHistoryPage.verifyOnPage(page)
      await expect(planHistoryPage.mainContent).toMatchAriaSnapshot(`
        - paragraph: View all updates to this plan.
        - button "Show all sections"
        - heading /Agreement updated.*Follow-up Practitioner and Test.*Test agreed to this plan.*Person agreed after reviewing the plan/
        - heading /Plan created.*Initial Practitioner.*Test could not agree to this plan.*Person was not available to discuss the plan/
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
        - heading /Plan agreed.*First Practitioner and Test.*Test agreed to this plan.*Initial agreement notes/
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
        - heading /Plan created.*Test Practitioner.*Test did not agree to this plan.*Person disagrees with the goals set/
      `)
    })
  })

  test.describe('Agreement updates (only possible after COULD_NOT_ANSWER)', () => {
    test('displays "Agreement updated" when person agrees after initially not being able to answer', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
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
        - heading /Agreement updated.*Person is now available and agrees/
        - heading /Plan created.*Person was unavailable/
      `)
    })

    test('displays "Agreement updated" when person does not agree after initially not being able to answer', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
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
        - heading /Agreement updated.*Test did not agree to this plan.*Person does not agree with the plan after reviewing it/
        - heading /Plan created.*Test could not agree to this plan.*Person was in hospital/
      `)
    })
  })
})
