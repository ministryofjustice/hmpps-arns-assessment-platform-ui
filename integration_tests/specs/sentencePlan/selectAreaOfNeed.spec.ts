import { expect } from '@playwright/test'
import { areasOfNeed } from '@server/forms/sentence-plan/versions/v1.0/constants'
import { test, TargetService } from '../../support/fixtures'
import SelectAreaOfNeedPage from '../../pages/sentencePlan/selectAreaOfNeedPage'
import CreateGoalPage from '../../pages/sentencePlan/createGoalPage'
import PlanOverviewPage from '../../pages/sentencePlan/planOverviewPage'
import {
  buildErrorPageTitle,
  buildPageTitle,
  checkAccessibility,
  navigateToSentencePlan,
  sentencePlanPageTitles,
} from './sentencePlanUtils'

test.describe('Select Area of Need', () => {
  test.describe('Navigation', () => {
    test('create goal button navigates to the select area of need page', async ({ page, createSession }) => {
      const { handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await navigateToSentencePlan(page, handoverLink)

      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)
      await planOverviewPage.clickCreateGoal()

      const selectAreaOfNeedPage = await SelectAreaOfNeedPage.verifyOnPage(page)

      await expect(page).toHaveURL(/\/goal\/new\/select-area-of-need/)
      await expect(page).toHaveTitle(buildPageTitle(sentencePlanPageTitles.selectAreaOfNeed))
      await expect(selectAreaOfNeedPage.pageHeading).toContainText(/create a goal with/i)

      await checkAccessibility(page)
    })

    test('create a goal link on a blank plan navigates to the select area of need page', async ({
      page,
      createSession,
    }) => {
      const { handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await navigateToSentencePlan(page, handoverLink)

      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)
      await planOverviewPage.createGoalLink.click()

      await SelectAreaOfNeedPage.verifyOnPage(page)
      await expect(page).toHaveURL(/\/goal\/new\/select-area-of-need/)
    })

    test('back link returns to the plan overview', async ({ page, createSession }) => {
      const { handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await navigateToSentencePlan(page, handoverLink)

      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)
      await planOverviewPage.clickCreateGoal()

      const selectAreaOfNeedPage = await SelectAreaOfNeedPage.verifyOnPage(page)
      await selectAreaOfNeedPage.backLink.click()

      await PlanOverviewPage.verifyOnPage(page)
      await expect(page).toHaveURL(/\/plan\/overview/)
    })

    test('preserves the originating tab when backing out from the future goals tab', async ({
      page,
      createSession,
    }) => {
      const { handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await navigateToSentencePlan(page, handoverLink)

      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)
      await planOverviewPage.clickFutureGoalsTab()
      await expect(page).toHaveURL(/goalStatusTab=future/)

      await planOverviewPage.clickCreateGoal()

      const selectAreaOfNeedPage = await SelectAreaOfNeedPage.verifyOnPage(page)
      await expect(page).toHaveURL(/\/select-area-of-need\?goalStatusTab=future/)

      await selectAreaOfNeedPage.selectAreaAndContinue('drug-use')
      await CreateGoalPage.verifyOnPage(page)
      await expect(page).toHaveURL(/\/add-goal\/drug-use\?goalStatusTab=future/)

      // Back to area selection: area pre-selected and tab still carried.
      const createGoalPage = await CreateGoalPage.verifyOnPage(page)
      await createGoalPage.backLink.click()

      const returnedToSelectArea = await SelectAreaOfNeedPage.verifyOnPage(page)
      await expect(page).toHaveURL(/\/select-area-of-need\?area=drug-use&goalStatusTab=future/)
      await expect(returnedToSelectArea.areaRadio('drug-use')).toBeChecked()

      // Back again returns to the future goals tab.
      await returnedToSelectArea.backLink.click()
      await PlanOverviewPage.verifyOnPage(page)
      await expect(page).toHaveURL(/goalStatusTab=future/)
    })
  })

  test.describe('Area of need options', () => {
    test('displays all areas of need in alphabetical order with none pre-selected', async ({ page, createSession }) => {
      const { handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await navigateToSentencePlan(page, handoverLink)

      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)
      await planOverviewPage.clickCreateGoal()

      const selectAreaOfNeedPage = await SelectAreaOfNeedPage.verifyOnPage(page)

      const radioLabels = await selectAreaOfNeedPage.areaOfNeedRadios.evaluateAll(radios =>
        radios.map(radio => {
          const label = document.querySelector(`label[for="${radio.id}"]`)
          return label?.textContent?.trim() ?? ''
        }),
      )

      const expectedLabels = areasOfNeed.map(area => area.text).sort((a, b) => a.localeCompare(b))
      expect(radioLabels).toEqual(expectedLabels)

      await expect(page.locator('[name="area_of_need"]:checked')).toHaveCount(0)
    })

    test('does not pre-select an area when creating a second goal in the same session', async ({
      page,
      createSession,
    }) => {
      const { handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await navigateToSentencePlan(page, handoverLink)

      // Create and save a first goal (selecting an area along the way).
      let planOverviewPage = await PlanOverviewPage.verifyOnPage(page)
      await planOverviewPage.clickCreateGoal()
      let selectAreaOfNeedPage = await SelectAreaOfNeedPage.verifyOnPage(page)
      await selectAreaOfNeedPage.selectAreaAndContinue('drug-use')

      const createGoalPage = await CreateGoalPage.verifyOnPage(page)
      await createGoalPage.enterGoalTitle('First goal')
      await createGoalPage.selectIsRelated(false)
      await createGoalPage.selectCanStartNow(false)
      await createGoalPage.clickSaveWithoutSteps()

      // Start a second goal: the previous area must not be pre-selected.
      planOverviewPage = await PlanOverviewPage.verifyOnPage(page)
      await planOverviewPage.clickCreateGoal()
      selectAreaOfNeedPage = await SelectAreaOfNeedPage.verifyOnPage(page)

      await expect(page.locator('[name="area_of_need"]:checked')).toHaveCount(0)
    })
  })

  test.describe('Validation', () => {
    test('shows error when no area of need is selected', async ({ page, createSession }) => {
      const { handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await navigateToSentencePlan(page, handoverLink)

      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)
      await planOverviewPage.clickCreateGoal()

      const selectAreaOfNeedPage = await SelectAreaOfNeedPage.verifyOnPage(page)
      await selectAreaOfNeedPage.clickContinue()

      // ensure error page title is correct:
      await expect(page).toHaveTitle(buildErrorPageTitle(sentencePlanPageTitles.selectAreaOfNeed))

      await expect(selectAreaOfNeedPage.errorSummary).toBeVisible()
      await expect(selectAreaOfNeedPage.errorSummary).toContainText('Select an area of need')
      await expect(selectAreaOfNeedPage.fieldError).toContainText('Select an area of need')

      await selectAreaOfNeedPage.errorSummary.getByRole('link').first().click()
      await expect(selectAreaOfNeedPage.areaOfNeedRadios.first()).toBeFocused()

      await checkAccessibility(page)
    })
  })

  test.describe('Progression', () => {
    test('continues to the create goal page for the selected area', async ({ page, createSession }) => {
      const { handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await navigateToSentencePlan(page, handoverLink)

      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)
      await planOverviewPage.clickCreateGoal()

      const selectAreaOfNeedPage = await SelectAreaOfNeedPage.verifyOnPage(page)
      await selectAreaOfNeedPage.selectAreaAndContinue('drug-use')

      await CreateGoalPage.verifyOnPage(page)
      await expect(page).toHaveURL(/\/goal\/new\/add-goal\/drug-use/)
    })

    test('back from create goal returns to area selection with the chosen area pre-selected', async ({
      page,
      createSession,
    }) => {
      const { handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await navigateToSentencePlan(page, handoverLink)

      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)
      await planOverviewPage.clickCreateGoal()

      const selectAreaOfNeedPage = await SelectAreaOfNeedPage.verifyOnPage(page)
      await selectAreaOfNeedPage.selectAreaAndContinue('drug-use')

      const createGoalPage = await CreateGoalPage.verifyOnPage(page)
      await createGoalPage.backLink.click()

      const returnedPage = await SelectAreaOfNeedPage.verifyOnPage(page)
      await expect(page).toHaveURL(/\/goal\/new\/select-area-of-need/)
      await expect(returnedPage.areaRadio('drug-use')).toBeChecked()
    })
  })
})
