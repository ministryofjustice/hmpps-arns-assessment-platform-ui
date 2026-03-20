import { expect } from '@playwright/test'
import { test, TargetService } from '../../../support/fixtures'
import PlanOverviewPage from '../../../pages/sentencePlan/planOverviewPage'
import { navigateToSentencePlan } from '../sentencePlanUtils'

test.describe('Top navigation', () => {
  test('should be accessible', async ({ page, createSession, makeAxeBuilder }) => {
    const { handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
    await navigateToSentencePlan(page, handoverLink)

    await PlanOverviewPage.verifyOnPage(page)

    const topNavAccessibilityScanResults = await makeAxeBuilder().include('[data-qa="hmpps-header"]').analyze()
    const primaryNavAccessibilityScanResults = await makeAxeBuilder()
      .include('[aria-label="Primary navigation"]')
      .analyze()

    expect(topNavAccessibilityScanResults.violations).toEqual([])
    expect(primaryNavAccessibilityScanResults.violations).toEqual([])
  })

  test('displays top navigation', async ({ page, createSession }) => {
    const { handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN, pnc: '123' })
    await navigateToSentencePlan(page, handoverLink)

    const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

    await expect(page.getByRole('link', { name: 'Assess and plan' })).toHaveAttribute(
      'href',
      '/sentence-plan/v1.0/plan/overview',
    )

    await expect(planOverviewPage.banner.getByRole('navigation', { name: 'Navigation menu' })).toMatchAriaSnapshot(`
          - navigation "Navigation menu":
            - heading "Navigation menu" [level=2]
            - text: OASys Account T. User
        `)

    await page.getByRole('link', { name: 'Assess and plan' }).click()

    await expect(planOverviewPage.pageHeading).toHaveText("Test's plan")
  })

  test('displays primary navigation', async ({ page, createSession }) => {
    const { handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN, pnc: '123' })
    await navigateToSentencePlan(page, handoverLink)

    const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

    await expect(planOverviewPage.primaryNavigation).toMatchAriaSnapshot(`
          - navigation "Primary navigation":
            - list:
              - listitem:
                - link "Test's plan":
                  - /url: /sentence-plan/v1.0/plan/overview
              - listitem:
                - link "About Test":
                  - /url: /sentence-plan/v1.0/about-person
        `)

    await page.getByRole('link', { name: 'About Test' }).click()

    await expect(planOverviewPage.pageHeading).toHaveText('About Test')

    await page.getByRole('link', { name: "Test's plan" }).click()

    await expect(planOverviewPage.pageHeading).toHaveText("Test's plan")
  })
})
