import { expect } from '@playwright/test'
import { test, TargetService } from '../../../support/fixtures'
import PlanOverviewPage from '../../../pages/sentencePlan/planOverviewPage'
import { currentGoals } from '../../../builders/sentencePlanFactories'
import { navigateToSentencePlan, sentencePlanV1URLs, sentencePlanV1UrlBuilders } from '../sentencePlanUtils'

test.describe('READ_ONLY Access Mode', () => {
  test.describe('Privacy Screen', () => {
    test('skips privacy screen and lands directly on plan overview', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, handoverLink } = await createSession({
        targetService: TargetService.SENTENCE_PLAN,
        planAccessMode: 'READ_ONLY',
      })
      await sentencePlanBuilder.extend(sentencePlanId).save()

      // Navigate via handover link - should NOT show privacy screen
      await page.goto(handoverLink)

      // Should land directly on plan overview without privacy screen
      await expect(page).toHaveURL(/\/plan\/overview/)
      await PlanOverviewPage.verifyOnPage(page)
    })
  })

  test.describe('Header Buttons', () => {
    test('hides Create Goal button', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({
        targetService: TargetService.SENTENCE_PLAN,
        planAccessMode: 'READ_ONLY',
      })
      await sentencePlanBuilder.extend(sentencePlanId).save()

      await navigateToSentencePlan(page, handoverLink)
      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

      await expect(planOverviewPage.createGoalButton).not.toBeVisible()
    })

    test('hides Agree Plan button', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({
        targetService: TargetService.SENTENCE_PLAN,
        planAccessMode: 'READ_ONLY',
      })
      await sentencePlanBuilder.extend(sentencePlanId).withGoals(currentGoals(1)).save()

      await navigateToSentencePlan(page, handoverLink)
      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

      await expect(planOverviewPage.agreePlanButton).not.toBeVisible()
    })
  })

  test.describe('Sub-navigation', () => {
    test('tab navigation still works in READ_ONLY mode', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({
        targetService: TargetService.SENTENCE_PLAN,
        planAccessMode: 'READ_ONLY',
      })
      await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals([
          { title: 'Current Goal', status: 'ACTIVE', areaOfNeed: 'accommodation', targetDate: '2025-06-01' },
          { title: 'Future Goal', status: 'FUTURE', areaOfNeed: 'finances' },
        ])
        .save()

      await navigateToSentencePlan(page, handoverLink)
      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

      // Should be on current tab by default
      await expect(page).toHaveURL(/type=current/)

      // Switch to future tab
      await planOverviewPage.clickFutureGoalsTab()
      await expect(page).toHaveURL(/type=future/)

      const goalTitle = await planOverviewPage.getGoalCardTitle(0)
      expect(goalTitle).toContain('Future Goal')
    })
  })

  test.describe('Primary navigation', () => {
    test('shows primary navigation links in READ_ONLY mode', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({
        targetService: TargetService.SENTENCE_PLAN,
        planAccessMode: 'READ_ONLY',
      })
      await sentencePlanBuilder.extend(sentencePlanId).withGoals(currentGoals(1)).withAgreementStatus('AGREED').save()

      await navigateToSentencePlan(page, handoverLink)
      await PlanOverviewPage.verifyOnPage(page)

      const primaryNavigation = page.getByLabel('Primary navigation')
      await expect(primaryNavigation).toBeVisible()
      await expect(primaryNavigation.getByRole('link', { name: /'s plan/i })).toBeVisible()
      await expect(primaryNavigation.getByRole('link', { name: 'Plan history' })).toBeVisible()
      await expect(primaryNavigation.getByRole('link', { name: /^About /i })).toBeVisible()
    })

    test('hides Create goal button on About page in READ_ONLY mode', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, handoverLink } = await createSession({
        targetService: TargetService.SENTENCE_PLAN,
        planAccessMode: 'READ_ONLY',
      })
      await sentencePlanBuilder.extend(sentencePlanId).withGoals(currentGoals(1)).withAgreementStatus('AGREED').save()

      await navigateToSentencePlan(page, handoverLink)
      await page.goto(sentencePlanV1URLs.ABOUT_PERSON)

      await expect(page).toHaveURL(sentencePlanV1URLs.ABOUT_PERSON)
      await expect(page.getByRole('button', { name: /Create goal/i })).not.toBeVisible()
    })
  })

  test.describe('Direct URL access', () => {
    test('redirects to plan overview when visiting edit routes directly', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, handoverLink } = await createSession({
        targetService: TargetService.SENTENCE_PLAN,
        planAccessMode: 'READ_ONLY',
      })

      const sentencePlan = await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals(currentGoals(2))
        .withAgreementStatus('AGREED')
        .save()

      await navigateToSentencePlan(page, handoverLink)

      const restrictedUrls = [
        sentencePlanV1UrlBuilders.goalChange(sentencePlan.goals[0].uuid),
        sentencePlanV1UrlBuilders.goalUpdateSteps(sentencePlan.goals[0].uuid),
        sentencePlanV1URLs.PLAN_AGREE,
        sentencePlanV1URLs.PLAN_UPDATE_AGREE,
        sentencePlanV1UrlBuilders.planReorderGoal(sentencePlan.goals[0].uuid, 'down', 'ACTIVE'),
      ]

      await restrictedUrls.reduce(async (previousNavigation, url) => {
        await previousNavigation
        await page.goto(url)
        await expect(page).toHaveURL(`${sentencePlanV1URLs.PLAN_OVERVIEW}?type=current`)
      }, Promise.resolve())
    })

    test('allows visiting non-edit routes directly', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({
        targetService: TargetService.SENTENCE_PLAN,
        planAccessMode: 'READ_ONLY',
      })
      await sentencePlanBuilder.extend(sentencePlanId).withGoals(currentGoals(1)).withAgreementStatus('AGREED').save()

      await navigateToSentencePlan(page, handoverLink)

      await page.goto(sentencePlanV1URLs.ABOUT_PERSON)
      await expect(page).toHaveURL(sentencePlanV1URLs.ABOUT_PERSON)

      await page.goto(sentencePlanV1URLs.PLAN_HISTORY)
      await expect(page).toHaveURL(sentencePlanV1URLs.PLAN_HISTORY)

      await page.goto(sentencePlanV1URLs.PREVIOUS_VERSIONS)
      await expect(page).toHaveURL(sentencePlanV1URLs.PREVIOUS_VERSIONS)
    })
  })

  test.describe('Plan history entries', () => {
    test('hides goal action links in READ_ONLY mode', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({
        targetService: TargetService.SENTENCE_PLAN,
        planAccessMode: 'READ_ONLY',
      })
      await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoal({
          title: 'Removed goal',
          areaOfNeed: 'accommodation',
          status: 'REMOVED',
          notes: [{ type: 'REMOVED', note: 'No longer needed', createdBy: 'Test Practitioner' }],
        })
        .withAgreementStatus('AGREED')
        .save()

      await navigateToSentencePlan(page, handoverLink)
      await page.goto(sentencePlanV1URLs.PLAN_HISTORY)

      await expect(
        page.getByTestId('main-form').getByRole('link', { name: /View goal|View latest version/i }),
      ).toHaveCount(0)
    })
  })
})
