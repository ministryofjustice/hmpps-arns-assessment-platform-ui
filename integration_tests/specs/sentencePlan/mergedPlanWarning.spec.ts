import { expect, type Page } from '@playwright/test'
import MergedPlanWarningPage from '../../pages/sentencePlan/mergedPlanWarningPage'
import { test, TargetService } from '../../support/fixtures'
import { login } from '../../testUtils'
import { sentencePlanV1URLs } from './sentencePlanUtils'

const navigateViaMpop = async (page: Page, crn: string): Promise<void> => {
  await login(page)
  await page.goto(`${sentencePlanV1URLs.CRN_ENTRY_POINT}/${crn}`)
}

test.describe('Merged plan warning page', () => {
  test.describe('MPoP access with merged plan', () => {
    test('redirects to merged plan warning when accessing via MPoP with a merged plan', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, crn } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder.extend(sentencePlanId).withProperty('MERGED', 'true').save()

      await navigateViaMpop(page, crn)

      await MergedPlanWarningPage.verifyOnPage(page)
      await expect(page).toHaveURL(/\/sentence-plan\/merged-plan-warning/)
    })

    test('displays the correct heading', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, crn } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder.extend(sentencePlanId).withProperty('MERGED', 'true').save()

      await navigateViaMpop(page, crn)

      const warningPage = await MergedPlanWarningPage.verifyOnPage(page)
      await expect(warningPage.pageHeading).toHaveText('You need to use OASys to access this plan')
    })

    test('displays the merged case explanation', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, crn } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder.extend(sentencePlanId).withProperty('MERGED', 'true').save()

      await navigateViaMpop(page, crn)

      const warningPage = await MergedPlanWarningPage.verifyOnPage(page)
      await expect(warningPage.warningContent).toContainText('This is because it is a merged case.')
    })

    test('displays a link to OASys', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, crn } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder.extend(sentencePlanId).withProperty('MERGED', 'true').save()

      await navigateViaMpop(page, crn)

      const warningPage = await MergedPlanWarningPage.verifyOnPage(page)
      await expect(warningPage.oasysLink).toBeVisible()
    })

    test('does not show plan navigation', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, crn } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder.extend(sentencePlanId).withProperty('MERGED', 'true').save()

      await navigateViaMpop(page, crn)

      await MergedPlanWarningPage.verifyOnPage(page)
      await expect(page.getByLabel('Primary navigation')).toHaveCount(0)
    })

    test('redirects back to warning when attempting to access plan overview directly', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, crn } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder.extend(sentencePlanId).withProperty('MERGED', 'true').save()
      await navigateViaMpop(page, crn)
      await MergedPlanWarningPage.verifyOnPage(page)

      await page.goto(`${sentencePlanV1URLs.PLAN_OVERVIEW}?type=current`)

      await expect(page).toHaveURL(/\/sentence-plan\/merged-plan-warning/)
      await MergedPlanWarningPage.verifyOnPage(page)
    })
  })

  test.describe('Non-merged plan via MPoP', () => {
    test('allows access to plan overview when plan is not merged', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, crn } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder.extend(sentencePlanId).save()

      await navigateViaMpop(page, crn)

      // Should go through to privacy/plan overview, not the warning page
      await expect(page).not.toHaveURL(/\/merged-plan-warning/)
    })
  })

  test.describe('Merged plan via OASys handover', () => {
    test('allows access to plan overview when accessing via OASys even if plan is merged', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, handoverLink } = await createSession({
        targetService: TargetService.SENTENCE_PLAN,
      })
      await sentencePlanBuilder.extend(sentencePlanId).withProperty('MERGED', 'true').save()

      await page.goto(handoverLink)

      // OASys users should not be blocked by the merge warning
      await expect(page).not.toHaveURL(/\/merged-plan-warning/)
    })
  })
})
