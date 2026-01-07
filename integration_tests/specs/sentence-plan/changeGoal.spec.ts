import { expect, test } from '@playwright/test'
import { loginHandover } from '../../testUtils'
import ChangeGoalPage from '../../pages/sentencePlan/changeGoalPage'
import { createTestGoal, sentencePlanV1URLs } from './sentencePlanUtils'

test.describe('Change goal journey', () => {
  test.beforeEach(async ({ page }) => {
    await loginHandover(page)
    // currently this is required to correctly navigate to plan through OASys path:
    await page.goto(sentencePlanV1URLs.OASYS_ENTRY_POINT)

  })

  test.describe('when a goal exists', () => {
    test.beforeEach(async ({ page }) => {
      await createTestGoal(page)
      await page.getByRole('link', { name: 'Change goal' }).click()
    })

    test('can access chang goal page directly', async ({ page }) => {
      const changeGoalPage = await ChangeGoalPage.verifyOnPage(page)
      expect(changeGoalPage).toBeTruthy()

    })

  })

})
