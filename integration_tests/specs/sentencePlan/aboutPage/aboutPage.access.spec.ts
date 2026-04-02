import { expect, type Page } from '@playwright/test'
import { test, TargetService } from '../../../support/fixtures'
import { login } from '../../../testUtils'
import { navigateToSentencePlan, sentencePlanV1URLs } from '../sentencePlanUtils'
import PrivacyScreenPage from '../../../pages/sentencePlan/privacyScreenPage'
import PlanOverviewPage from '../../../pages/sentencePlan/planOverviewPage'

const navigateToPlanOverviewViaMpop = async (page: Page, crn: string): Promise<void> => {
  await login(page)
  await page.goto(`${sentencePlanV1URLs.CRN_ENTRY_POINT}/${crn}`)
  const privacyScreenPage = await PrivacyScreenPage.verifyOnPage(page)
  await privacyScreenPage.confirmAndContinue()
  await PlanOverviewPage.verifyOnPage(page)
}

test.describe('About Person Tab', () => {
  test.describe('SAN_SP assessment type (private beta)', () => {
    test('shows About tab in primary navigation', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({
        targetService: TargetService.SENTENCE_PLAN,
        assessmentType: 'SAN_SP',
      })
      await sentencePlanBuilder.extend(sentencePlanId).save()

      await navigateToSentencePlan(page, handoverLink)

      const primaryNavigation = page.getByLabel('Primary navigation')
      await expect(primaryNavigation.getByRole('link', { name: /^About /i })).toBeVisible()
    })

    test('can navigate to About page', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({
        targetService: TargetService.SENTENCE_PLAN,
        assessmentType: 'SAN_SP',
      })
      await sentencePlanBuilder.extend(sentencePlanId).save()

      await navigateToSentencePlan(page, handoverLink)

      await page.goto(sentencePlanV1URLs.ABOUT_PERSON)
      await expect(page).toHaveURL(sentencePlanV1URLs.ABOUT_PERSON)
    })

    test('shows "view information from assessment" link on plan overview', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, handoverLink } = await createSession({
        targetService: TargetService.SENTENCE_PLAN,
        assessmentType: 'SAN_SP',
      })
      await sentencePlanBuilder.extend(sentencePlanId).save()

      await navigateToSentencePlan(page, handoverLink)

      await expect(page.getByRole('link', { name: /view information from .+'s assessment/i })).toBeVisible()
    })
  })

  test.describe('SP assessment type (national rollout)', () => {
    test('hides About tab in primary navigation', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({
        targetService: TargetService.SENTENCE_PLAN,
        assessmentType: 'SP',
      })
      await sentencePlanBuilder.extend(sentencePlanId).save()

      await navigateToSentencePlan(page, handoverLink)

      const primaryNavigation = page.getByLabel('Primary navigation')
      await expect(primaryNavigation.getByRole('link', { name: /^About /i })).not.toBeVisible()
    })

    test('redirects to plan overview when visiting About page directly', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, handoverLink } = await createSession({
        targetService: TargetService.SENTENCE_PLAN,
        assessmentType: 'SP',
      })
      await sentencePlanBuilder.extend(sentencePlanId).save()

      await navigateToSentencePlan(page, handoverLink)

      await page.goto(sentencePlanV1URLs.ABOUT_PERSON)
      await expect(page).toHaveURL(/\/plan\/overview/)
    })

    test('hides "view information from assessment" link on plan overview', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, handoverLink } = await createSession({
        targetService: TargetService.SENTENCE_PLAN,
        assessmentType: 'SP',
      })
      await sentencePlanBuilder.extend(sentencePlanId).save()

      await navigateToSentencePlan(page, handoverLink)

      await expect(page.getByRole('link', { name: /view information from .+'s assessment/i })).not.toBeVisible()
    })
  })

  test.describe('SAN_SP assessment type via MPoP access', () => {
    test('hides About tab in primary navigation', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, crn } = await createSession({
        targetService: TargetService.SENTENCE_PLAN,
        assessmentType: 'SAN_SP',
      })
      await sentencePlanBuilder.extend(sentencePlanId).save()

      await navigateToPlanOverviewViaMpop(page, crn)

      const primaryNavigation = page.getByLabel('Primary navigation')
      await expect(primaryNavigation.getByRole('link', { name: /^About /i })).not.toBeVisible()
    })

    test('redirects to plan overview when visiting About page directly', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, crn } = await createSession({
        targetService: TargetService.SENTENCE_PLAN,
        assessmentType: 'SAN_SP',
      })
      await sentencePlanBuilder.extend(sentencePlanId).save()

      await navigateToPlanOverviewViaMpop(page, crn)

      await page.goto(sentencePlanV1URLs.ABOUT_PERSON)
      await expect(page).toHaveURL(/\/plan\/overview/)
    })

    test('hides "view information from assessment" link on plan overview', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, crn } = await createSession({
        targetService: TargetService.SENTENCE_PLAN,
        assessmentType: 'SAN_SP',
      })
      await sentencePlanBuilder.extend(sentencePlanId).save()

      await navigateToPlanOverviewViaMpop(page, crn)

      await expect(page.getByRole('link', { name: /view information from .+'s assessment/i })).not.toBeVisible()
    })
  })

  test.describe('SP assessment type via MPoP access (national rollout)', () => {
    test('hides About tab in primary navigation', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, crn } = await createSession({
        targetService: TargetService.SENTENCE_PLAN,
        assessmentType: 'SP',
      })
      await sentencePlanBuilder.extend(sentencePlanId).save()

      await navigateToPlanOverviewViaMpop(page, crn)

      const primaryNavigation = page.getByLabel('Primary navigation')
      await expect(primaryNavigation.getByRole('link', { name: /^About /i })).not.toBeVisible()
    })

    test('redirects to plan overview when visiting About page directly', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, crn } = await createSession({
        targetService: TargetService.SENTENCE_PLAN,
        assessmentType: 'SP',
      })
      await sentencePlanBuilder.extend(sentencePlanId).save()

      await navigateToPlanOverviewViaMpop(page, crn)

      await page.goto(sentencePlanV1URLs.ABOUT_PERSON)
      await expect(page).toHaveURL(/\/plan\/overview/)
    })

    test('hides "view information from assessment" link on plan overview', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, crn } = await createSession({
        targetService: TargetService.SENTENCE_PLAN,
        assessmentType: 'SP',
      })
      await sentencePlanBuilder.extend(sentencePlanId).save()

      await navigateToPlanOverviewViaMpop(page, crn)

      await expect(page.getByRole('link', { name: /view information from .+'s assessment/i })).not.toBeVisible()
    })
  })
})
