import { expect } from '@playwright/test'
import { test, TargetService } from '../../../support/fixtures'
import PlanOverviewPage from '../../../pages/sentencePlan/planOverviewPage'
import { navigateToSentencePlan } from '../sentencePlanUtils'

test.describe('Header', () => {
  test('should be accessible', async ({ page, createSession, makeAxeBuilder }) => {
    const { handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
    await navigateToSentencePlan(page, handoverLink)

    await PlanOverviewPage.verifyOnPage(page)

    const accessibilityScanResults = await makeAxeBuilder()
      .include('header')
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('displays subject details', async ({
        page,
        createSession,
      }) => {
        const { handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN, pnc: '123' })
        await navigateToSentencePlan(page, handoverLink)

        const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)
       
        await expect(planOverviewPage.header).toMatchAriaSnapshot(`
            - paragraph: Test User
            - term: "CRN:"
            - definition
            - term: "PNC:"
            - definition
            - term: "Date of birth:"
            - definition
            - link "View previous versions":
                - /url: /previous-versions/
            - heading "Test's plan" [level=1]
            - button "Return to OASys"
            - button "Create goal"
            - button "Agree plan"
        `)
    })

    test('displays unknown PNC', async ({ page, createSession }) => {
        const { handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN, pnc: null })
        await navigateToSentencePlan(page, handoverLink)

        const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

        await expect(page.getByText('PNC: Unknown PNC')).toBeVisible()
    })
})
