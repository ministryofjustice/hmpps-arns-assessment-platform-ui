import { expect } from '@playwright/test'
import { test, TargetService } from '../../../support/fixtures'
import PlanOverviewPage from '../../../pages/sentencePlan/planOverviewPage'
import { navigateToSentencePlan } from '../sentencePlanUtils'

test.describe('Footer', () => {
  test('should be accessible', async ({ page, createSession, makeAxeBuilder }) => {
    const { handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
    await navigateToSentencePlan(page, handoverLink)

    await PlanOverviewPage.verifyOnPage(page)

    const accessibilityScanResults = await makeAxeBuilder()
      .include('footer')
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('displays content info', async ({ page, createSession }) => {
    const { handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN, pnc: '123' })
    await navigateToSentencePlan(page, handoverLink)

    const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

    await expect(planOverviewPage.footer).toMatchAriaSnapshot(`
          - contentinfo:
            - text: All content is available under the
            - link /Open Government Licence/
            - text: ", except where otherwise stated"
            - link "© Crown copyright"
        `)
  })
})
