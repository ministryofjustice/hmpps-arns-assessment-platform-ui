import { expect } from '@playwright/test'
import { test, TargetService } from '../../../support/fixtures'
import PlanOverviewPage from '../../../pages/sentencePlan/planOverviewPage'
import { navigateToSentencePlan } from '../sentencePlanUtils'

test.describe('Top navigation', () => {
  test('should be accessible', async ({ page, createSession, makeAxeBuilder }) => {
    const { handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
    await navigateToSentencePlan(page, handoverLink)

    await PlanOverviewPage.verifyOnPage(page)

    const accessibilityScanResults = await makeAxeBuilder()
      .include('[data-qa="hmpps-header"]')
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('displays navigation', async ({ page, createSession }) => {
    const { handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN, pnc: '123' })
    await navigateToSentencePlan(page, handoverLink)

    const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

    await expect(planOverviewPage.banner).toMatchAriaSnapshot(`
          - banner:
            - text: HMPPS
            - link "Assess and plan":
              - /url: /sentence-plan/(.*?)/plan/overview/
            - navigation "Account navigation":
              - list:
                - listitem:
                  - link "Manage your details":
                    - /url: /account-details/
                - listitem:
                  - link "Sign out":
                    - /url: /sign-out/
        `)
  })
})
