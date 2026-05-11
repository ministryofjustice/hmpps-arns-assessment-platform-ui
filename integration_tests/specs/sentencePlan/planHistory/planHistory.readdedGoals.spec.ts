import { expect } from '@playwright/test'
import { test, TargetService } from '../../../support/fixtures'
import PlanHistoryPage from '../../../pages/sentencePlan/planHistoryPage'
import { handlePrivacyScreenIfPresent } from '../sentencePlanUtils'

test.describe('Plan History - Re-added Goals', () => {
  test('displays re-added goal entry with action, date, assessor, goal title and reason', async ({
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
      - paragraph: View all updates to this plan.
      - button "Show all sections"
      - heading /Goal added back into plan.*Jane Smith.*Find stable accommodation.*Circumstances have changed, goal is now relevant again/
    `)
  })

  test('displays re-added goal without reason when none was provided', async ({
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
      - heading /Goal added back into plan.*John Doe.*Build positive relationships/
    `)
  })

  test('displays re-added goal in correct chronological order with other events', async ({
    page,
    createSession,
    sentencePlanBuilder,
  }) => {
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
      - heading /Goal added back into plan/
      - heading /Agreement updated/
      - heading /Plan created/
    `)
  })

  test('displays both Goal removed and Goal added back into plan events for a re-added goal', async ({
    page,
    createSession,
    sentencePlanBuilder,
  }) => {
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
      - heading /Goal added back into plan.*Re-add Practitioner.*Goal with full history.*Circumstances changed, goal is relevant again/
      - heading /Goal removed.*Removal Practitioner.*Goal with full history.*Goal no longer relevant at this time/
    `)
  })
})
