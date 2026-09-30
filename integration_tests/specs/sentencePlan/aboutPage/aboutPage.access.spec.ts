import { expect } from '@playwright/test'
import { test, TargetService } from '../../../support/fixtures'
import { navigateToPlanOverviewViaMpop, sentencePlanV1URLs } from '../sentencePlanUtils'

test.describe('About Person Tab', () => {
  test.describe('SAN_SP assessment type (private beta)', () => {
    test('shows About tab in primary navigation', async ({ page, openSentencePlan }) => {
      await openSentencePlan({ session: { assessmentType: 'SAN_SP' } })

      const primaryNavigation = page.getByLabel('Primary navigation')
      await expect(primaryNavigation.getByRole('link', { name: /^About /i })).toBeVisible()
    })

    test('can navigate to About page', async ({ page, openSentencePlan }) => {
      await openSentencePlan({ session: { assessmentType: 'SAN_SP' } })

      await page.goto(sentencePlanV1URLs.ABOUT_PERSON)
      await expect(page).toHaveURL(sentencePlanV1URLs.ABOUT_PERSON)
    })

    test('shows "view information from assessment" link on plan overview', async ({
      page,

      openSentencePlan,
    }) => {
      await openSentencePlan({ session: { assessmentType: 'SAN_SP' } })

      await expect(page.getByRole('link', { name: /view information from .+'s assessment/i })).toBeVisible()
    })
  })

  test.describe('SP assessment type (national rollout)', () => {
    test('hides About tab in primary navigation', async ({ page, openSentencePlan }) => {
      await openSentencePlan({ session: { assessmentType: 'SP' } })

      const primaryNavigation = page.getByLabel('Primary navigation')
      await expect(primaryNavigation.getByRole('link', { name: /^About /i })).not.toBeVisible()
    })

    test('redirects to plan overview when visiting About page directly', async ({ page, openSentencePlan }) => {
      await openSentencePlan({ session: { assessmentType: 'SP' } })

      await page.goto(sentencePlanV1URLs.ABOUT_PERSON)
      await expect(page).toHaveURL(/\/plan\/overview/)
    })

    test('hides "view information from assessment" link on plan overview', async ({
      page,

      openSentencePlan,
    }) => {
      await openSentencePlan({ session: { assessmentType: 'SP' } })

      await expect(page.getByRole('link', { name: /view information from .+'s assessment/i })).not.toBeVisible()
    })
  })

  test.describe('SAN_SP assessment type with no CRN', () => {
    test('hides About tab in primary navigation', async ({ page, openSentencePlan }) => {
      await openSentencePlan({ session: { assessmentType: 'SAN_SP', noCrn: true } })

      const primaryNavigation = page.getByLabel('Primary navigation')
      await expect(primaryNavigation.getByRole('link', { name: /^About /i })).not.toBeVisible()
    })

    test('redirects to plan overview when visiting About page directly', async ({ page, openSentencePlan }) => {
      await openSentencePlan({ session: { assessmentType: 'SAN_SP', noCrn: true } })

      await page.goto(sentencePlanV1URLs.ABOUT_PERSON)
      await expect(page).toHaveURL(/\/plan\/overview/)
    })

    test('hides "view information from assessment" link on plan overview', async ({
      page,

      openSentencePlan,
    }) => {
      await openSentencePlan({ session: { assessmentType: 'SAN_SP', noCrn: true } })

      await expect(page.getByRole('link', { name: /view information from .+'s assessment/i })).not.toBeVisible()
    })
  })

  test.describe('SAN_SP assessment type via MPoP access', () => {
    test.beforeEach(async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, crn } = await createSession({
        targetService: TargetService.SENTENCE_PLAN,
        assessmentType: 'SAN_SP',
      })
      await sentencePlanBuilder.extend(sentencePlanId).save()
      await navigateToPlanOverviewViaMpop(page, crn)
    })

    test('hides About tab in primary navigation', async ({ page }) => {
      // The About nav item is omitted server-side in MPoP, so assert it is absent from the DOM.
      const primaryNavigation = page.getByLabel('Primary navigation')
      await expect(primaryNavigation.getByRole('link', { name: /^About /i })).toHaveCount(0)
    })

    test('redirects to plan overview when visiting About page directly', async ({ page }) => {
      await page.goto(sentencePlanV1URLs.ABOUT_PERSON)
      await expect(page).toHaveURL(/\/plan\/overview/)
    })

    test('hides "view information from assessment" link on plan overview', async ({ page }) => {
      // The assessment-info link is omitted server-side in MPoP, so assert it is absent from the DOM.
      await expect(page.getByRole('link', { name: /view information from .+'s assessment/i })).toHaveCount(0)
    })
  })

  test.describe('SP assessment type via MPoP access (national rollout)', () => {
    test.beforeEach(async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, crn } = await createSession({
        targetService: TargetService.SENTENCE_PLAN,
        assessmentType: 'SP',
      })
      await sentencePlanBuilder.extend(sentencePlanId).save()
      await navigateToPlanOverviewViaMpop(page, crn)
    })

    test('hides About tab in primary navigation', async ({ page }) => {
      // The About nav item is omitted server-side in MPoP, so assert it is absent from the DOM.
      const primaryNavigation = page.getByLabel('Primary navigation')
      await expect(primaryNavigation.getByRole('link', { name: /^About /i })).toHaveCount(0)
    })

    test('redirects to plan overview when visiting About page directly', async ({ page }) => {
      await page.goto(sentencePlanV1URLs.ABOUT_PERSON)
      await expect(page).toHaveURL(/\/plan\/overview/)
    })

    test('hides "view information from assessment" link on plan overview', async ({ page }) => {
      // The assessment-info link is omitted server-side in MPoP, so assert it is absent from the DOM.
      await expect(page.getByRole('link', { name: /view information from .+'s assessment/i })).toHaveCount(0)
    })
  })
})
