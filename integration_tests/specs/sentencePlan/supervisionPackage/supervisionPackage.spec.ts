import { expect } from '@playwright/test'
import { test, TargetService } from '../../../support/fixtures'
import PlanOverviewPage from '../../../pages/sentencePlan/planOverviewPage'
import { checkAccessibility, navigateToSentencePlan, sentencePlanV1URLs } from '../sentencePlanUtils'

/**
 * Every CRN gets the fully populated default from the wiremock catch-alls: an early
 * engagement package (the component's richest view — progress bar, appointment
 * allowance, guidance), a confirmed B2 tier and one upcoming appointment. The named
 * CRNs below are overrides for specific variations — see the mappings in
 * docker/wiremock/mappings/{supervision-package-api,tier-api}.
 */
const CRN_IN_STANDARD_PHASE = 'X444444'
const CRN_WITHOUT_PACKAGE = 'X888888'
const CRN_WITH_PROVISIONAL_TIER = 'X555555'
const CRN_WITHOUT_APPOINTMENTS = 'X222222'
const CRN_IN_BREACH_WITH_OPD = 'X333333'
const CRN_WITH_FAILING_TIER_ONLY = 'X777777'
const CRN_WITH_FAILING_APIS = 'X666666'

test.describe('Supervision package', () => {
  test('shows the tab and the component for any person', async ({ page, createSession }) => {
    const { handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
    await navigateToSentencePlan(page, handoverLink)

    const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)
    const supervisionPackageLink = planOverviewPage.primaryNavigation.getByRole('link', {
      name: 'Supervision package',
    })

    await expect(supervisionPackageLink).toBeVisible()

    await supervisionPackageLink.click()

    await expect(planOverviewPage.pageHeading).toHaveText('Supervision package')
    await expect(page.getByText('Early engagement stage')).toBeVisible()
    await expect(page.getByText('3 of 8 appointments used')).toBeVisible()

    await checkAccessibility(page)
  })

  test('shows the next appointment when the person has one scheduled', async ({ page, createSession }) => {
    const { handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
    await navigateToSentencePlan(page, handoverLink)

    await PlanOverviewPage.verifyOnPage(page)
    await page.goto(sentencePlanV1URLs.SUPERVISION_PACKAGE)

    await expect(page.getByRole('heading', { name: 'Next appointment' })).toBeVisible()
    // No next-appointment href is passed (the arrange-appointment journey lives in MPoP),
    // so the component renders the appointment as text rather than a link.
    await expect(page.getByText(/Planned office visit:.*12 Aug/i)).toBeVisible()
  })

  test('shows the standard stage when early engagement is complete', async ({ page, createSession }) => {
    const { handoverLink } = await createSession({
      targetService: TargetService.SENTENCE_PLAN,
      crn: CRN_IN_STANDARD_PHASE,
    })
    await navigateToSentencePlan(page, handoverLink)

    await PlanOverviewPage.verifyOnPage(page)
    await page.goto(sentencePlanV1URLs.SUPERVISION_PACKAGE)

    await expect(page.getByText('Standard stage')).toBeVisible()
  })

  test('shows the breach warning and status tags when the person is in breach on the OPD pathway', async ({
    page,
    createSession,
  }) => {
    const { handoverLink } = await createSession({
      targetService: TargetService.SENTENCE_PLAN,
      crn: CRN_IN_BREACH_WITH_OPD,
    })
    await navigateToSentencePlan(page, handoverLink)

    await PlanOverviewPage.verifyOnPage(page)
    await page.goto(sentencePlanV1URLs.SUPERVISION_PACKAGE)

    await expect(page.getByText('In breach', { exact: true })).toBeVisible()
    await expect(page.getByText('Offender personality disorder', { exact: true })).toBeVisible()
  })

  test('shows the package but an unavailable tier when only the tier API fails', async ({ page, createSession }) => {
    const { handoverLink } = await createSession({
      targetService: TargetService.SENTENCE_PLAN,
      crn: CRN_WITH_FAILING_TIER_ONLY,
    })
    await navigateToSentencePlan(page, handoverLink)

    await PlanOverviewPage.verifyOnPage(page)
    await page.goto(sentencePlanV1URLs.SUPERVISION_PACKAGE)

    // The package still renders — one API failing must not take the others down.
    await expect(page.getByText('Early engagement stage')).toBeVisible()
    await expect(page.getByText('Unavailable', { exact: true })).toBeVisible()
  })

  test('shows no appointments scheduled when the schedule is empty', async ({ page, createSession }) => {
    const { handoverLink } = await createSession({
      targetService: TargetService.SENTENCE_PLAN,
      crn: CRN_WITHOUT_APPOINTMENTS,
    })
    await navigateToSentencePlan(page, handoverLink)

    await PlanOverviewPage.verifyOnPage(page)
    await page.goto(sentencePlanV1URLs.SUPERVISION_PACKAGE)

    await expect(page.getByText('No appointments scheduled')).toBeVisible()
  })

  test('hides the tab when the person has no supervision package (AC3)', async ({ page, createSession }) => {
    const { handoverLink } = await createSession({
      targetService: TargetService.SENTENCE_PLAN,
      crn: CRN_WITHOUT_PACKAGE,
    })
    await navigateToSentencePlan(page, handoverLink)

    const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

    // No package (404) is "not displayable", so the tab is hidden entirely.
    await expect(planOverviewPage.primaryNavigation.getByRole('link', { name: 'Supervision package' })).toBeHidden()
  })

  test('hides the tab and redirects when the package is not in a renderable phase (AC3)', async ({
    page,
    createSession,
  }) => {
    const { handoverLink } = await createSession({
      targetService: TargetService.SENTENCE_PLAN,
      crn: CRN_WITH_PROVISIONAL_TIER,
    })
    await navigateToSentencePlan(page, handoverLink)

    const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)
    await expect(planOverviewPage.primaryNavigation.getByRole('link', { name: 'Supervision package' })).toBeHidden()

    // Direct navigation is blocked too — it redirects to the plan overview, so the
    // supervision package heading is not shown.
    await page.goto(sentencePlanV1URLs.SUPERVISION_PACKAGE)
    await expect(page.getByRole('heading', { name: 'Supervision package' })).toBeHidden()
  })

  test('shows the tab and an error message when the supervision package API fails (AC4)', async ({
    page,
    createSession,
  }) => {
    const { handoverLink } = await createSession({
      targetService: TargetService.SENTENCE_PLAN,
      crn: CRN_WITH_FAILING_APIS,
    })
    await navigateToSentencePlan(page, handoverLink)

    const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)
    const supervisionPackageLink = planOverviewPage.primaryNavigation.getByRole('link', {
      name: 'Supervision package',
    })

    // A 500/503 is "not available" — the tab stays visible so the user can reach the error.
    await expect(supervisionPackageLink).toBeVisible()

    await supervisionPackageLink.click()

    await expect(planOverviewPage.pageHeading).toHaveText('Supervision package')
    await expect(page.getByText(/problem getting the supervision package information/i)).toBeVisible()
  })
})
