import { expect, test } from '@playwright/test'
import { loginAndNavigateToPlan, resetStubs } from '../../testUtils'
import ChangeGoalPage from '../../pages/sentencePlan/changeGoalPage'
import aapApi, { createAssessmentWithCurrentGoals } from '../../mockApis/aapApi'

test.describe('Change goal journey', () => {
  test.beforeEach(async () => {
    await aapApi.stubSentencePlanApis(createAssessmentWithCurrentGoals(1))
  })

  test.afterEach(async () => {
    await resetStubs()
  })

  test.describe('when a goal exists', () => {
    test.beforeEach(async ({ page }) => {
      await loginAndNavigateToPlan(page)
      await page.getByRole('link', { name: 'Change goal' }).click()
    })

    test('can access chang goal page directly', async ({ page }) => {
      const changeGoalPage = await ChangeGoalPage.verifyOnPage(page)
      expect(changeGoalPage).toBeTruthy()
    })
  })
})
