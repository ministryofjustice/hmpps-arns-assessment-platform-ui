import { expect } from '@playwright/test'
import { test, TargetService } from '../../support/fixtures'
import UpdateGoalAndStepsPage from '../../pages/sentencePlan/updateGoalAndStepsPage'
import { currentGoals, futureGoals } from '../../builders/sentencePlanFactories'
import {
  getDatePlusDaysAsISO,
  navigateToSentencePlan,
  sentencePlanV1URLs,
  buildPageTitle,
  sentencePlanPageTitles,
} from './sentencePlanUtils'

const updateGoalAndStepsPath = '/update-goal-steps'

test.describe('Update goal and steps page', () => {
  test.describe('page content - ACTIVE goal', () => {
    test('displays page heading, target date message and change goal details link correctly', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      const plan = await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals([
          {
            title: 'Test Goal Title',
            areaOfNeed: 'accommodation',
            status: 'ACTIVE',
            targetDate: getDatePlusDaysAsISO(90),
            steps: [{ actor: 'probation_practitioner', description: 'Test step', status: 'NOT_STARTED' }],
          },
        ])
        .withAgreementStatus('AGREED')
        .save()
      const goalUuid = plan.goals[0].uuid

      await navigateToSentencePlan(page, handoverLink)

      await page.goto(`${sentencePlanV1URLs.GOAL_MANAGEMENT_ROOT_PATH}/${goalUuid}${updateGoalAndStepsPath}`)

      const updatePage = await UpdateGoalAndStepsPage.verifyOnPage(page)

      // ensure page title is correct; no validation on this page so no error title to check
      await expect(page).toHaveTitle(buildPageTitle(sentencePlanPageTitles.updateGoalAndSteps))

      // check heading elements
      await expect(updatePage.pageHeading).toContainText('Update goal and steps')
      const areaOfNeedCaption = await updatePage.getAreaOfNeedCaption()
      expect(areaOfNeedCaption).toContain('Accommodation')
      const goalTitle = await updatePage.getGoalTitleText()
      expect(goalTitle).toContain('Test Goal Title')

      // should show target date message
      await expect(updatePage.targetDateMessage).toBeVisible()
      const message = await updatePage.getTargetDateMessage()
      expect(message).toContain('Aim to achieve this by')

      // should NOT show future goal message
      await expect(updatePage.futureGoalMessage).toBeHidden()

      // check change goal details link is visible
      await expect(updatePage.changeGoalDetailsLink).toBeVisible()
    })

    test('displays related areas of need in page heading when goal has related areas', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      const plan = await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals([
          {
            title: 'Test Goal With Related Areas',
            areaOfNeed: 'accommodation',
            relatedAreasOfNeed: ['finances', 'employment-and-education'],
            status: 'ACTIVE',
            targetDate: getDatePlusDaysAsISO(90),
            steps: [{ actor: 'probation_practitioner', description: 'Test step', status: 'NOT_STARTED' }],
          },
        ])
        .withAgreementStatus('AGREED')
        .save()
      const goalUuid = plan.goals[0].uuid

      await navigateToSentencePlan(page, handoverLink)

      await page.goto(`${sentencePlanV1URLs.GOAL_MANAGEMENT_ROOT_PATH}/${goalUuid}${updateGoalAndStepsPath}`)

      const updatePage = await UpdateGoalAndStepsPage.verifyOnPage(page)

      // check heading elements include related areas of need
      const areaOfNeedCaption = await updatePage.getAreaOfNeedCaption()
      expect(areaOfNeedCaption).toContain('Accommodation')
      expect(areaOfNeedCaption).toContain('(and')
      // related areas should be joined with "; " in lowercase
      expect(areaOfNeedCaption).toContain('employment and education; finances')
    })
  })

  test.describe('page content - FUTURE goal', () => {
    test('displays future goal message instead of target date', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      const plan = await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals(futureGoals(1))
        .withAgreementStatus('AGREED')
        .save()
      const goalUuid = plan.goals[0].uuid

      await navigateToSentencePlan(page, handoverLink)

      await page.goto(`${sentencePlanV1URLs.GOAL_MANAGEMENT_ROOT_PATH}/${goalUuid}${updateGoalAndStepsPath}`)

      const updatePage = await UpdateGoalAndStepsPage.verifyOnPage(page)

      // should show future goal message
      await expect(updatePage.futureGoalMessage).toBeVisible()
      const message = await updatePage.getFutureGoalMessage()
      expect(message).toContain('This is a future goal')

      // should NOT show target date message
      await expect(updatePage.targetDateMessage).toBeHidden()
    })
  })

  test.describe('action buttons', () => {
    test('displays "save goal and steps" and "mark as achieved" buttons as well as "remove goal from plan" link', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      const plan = await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals(currentGoals(1))
        .withAgreementStatus('AGREED')
        .save()
      const goalUuid = plan.goals[0].uuid

      await navigateToSentencePlan(page, handoverLink)

      await page.goto(`${sentencePlanV1URLs.GOAL_MANAGEMENT_ROOT_PATH}/${goalUuid}${updateGoalAndStepsPath}`)

      const updatePage = await UpdateGoalAndStepsPage.verifyOnPage(page)

      await expect(updatePage.saveGoalAndStepsButton).toBeVisible()
      await expect(updatePage.markAsAchievedButton).toBeVisible()
      await expect(updatePage.removeGoalLink).toBeVisible()
    })
  })
})
