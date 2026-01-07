import { expect, test } from '@playwright/test'
import {loginAndNavigateToPlan, resetStubs} from '../../testUtils'
import ChangeGoalPage from '../../pages/sentencePlan/changeGoalPage'
import aapApi, {createAssessmentWithCurrentGoals, createAssessmentWithGoals} from "../../mockApis/aapApi";

test.describe('Change goal journey', () => {

  test.afterEach(async () => {
    await resetStubs()
  })

  test.describe('when a goal exists', () => {
    test.beforeEach(async () => {
      await aapApi.stubSentencePlanApis(createAssessmentWithCurrentGoals(1))

    })

    test('can access chang goal page directly', async ({ page }) => {
      await loginAndNavigateToPlan(page)
      await page.getByRole('link', { name: 'Change goal' }).click()

      const changeGoalPage = await ChangeGoalPage.verifyOnPage(page)
      expect(changeGoalPage).toBeTruthy()

    })

  })

})
