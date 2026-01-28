import { expect } from '@playwright/test'
import { test, TargetService } from '../../../support/fixtures'
import CreateGoalPage from '../../../pages/sentencePlan/createGoalPage'
import PlanOverviewPage from '../../../pages/sentencePlan/planOverviewPage'
import { navigateToSentencePlan } from '../sentencePlanUtils'

test.describe('Accessible Autocomplete Component', () => {
    test('should autocomplete suggested goals', async ({ page, createSession }) => {
      const { handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await navigateToSentencePlan(page, handoverLink)

      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

      await planOverviewPage.clickCreateGoal()
      const createGoalPage = await CreateGoalPage.verifyOnPage(page)

      await createGoalPage.enterGoalTitle("Find")
      await expect(createGoalPage.findAccomodationGoal).toBeVisible()
    })
})
