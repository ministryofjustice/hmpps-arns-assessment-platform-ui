import { expect } from '@playwright/test'
import { test, TargetService } from '../../../support/fixtures'
import CreateGoalPage from '../../../pages/sentencePlan/createGoalPage'
import PlanOverviewPage from '../../../pages/sentencePlan/planOverviewPage'
import SelectAreaOfNeedPage from '../../../pages/sentencePlan/selectAreaOfNeedPage'
import { navigateToSentencePlan } from '../sentencePlanUtils'

test.describe('Accessible Autocomplete Component', () => {
  test('should be accessible', async ({ page, createSession, makeAxeBuilder }) => {
    const { handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
    await navigateToSentencePlan(page, handoverLink)

    const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

    await planOverviewPage.clickCreateGoal()
    const selectAreaOfNeedPage = await SelectAreaOfNeedPage.verifyOnPage(page)
    await selectAreaOfNeedPage.selectAreaAndContinue('accommodation')

    await CreateGoalPage.verifyOnPage(page)

    const accessibilityScanResults = await makeAxeBuilder()
      .include('accessible-autocomplete-wrapper')
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('should autocomplete suggested goals', async ({ page, createSession }) => {
    const { handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
    await navigateToSentencePlan(page, handoverLink)

    const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

    await planOverviewPage.clickCreateGoal()
    const selectAreaOfNeedPage = await SelectAreaOfNeedPage.verifyOnPage(page)
    await selectAreaOfNeedPage.selectAreaAndContinue('accommodation')

    const createGoalPage = await CreateGoalPage.verifyOnPage(page)

    await createGoalPage.enterGoalTitle('Find')
    await expect(createGoalPage.findAccomodationGoal).toBeVisible()
  })
})
