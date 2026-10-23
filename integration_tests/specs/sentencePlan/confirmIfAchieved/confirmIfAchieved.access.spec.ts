import { expect } from '@playwright/test'
import { test } from '../../../support/fixtures'
import ConfirmIfAchievedPage from '../../../pages/sentencePlan/confirmIfAchievedPage'
import PlanOverviewPage from '../../../pages/sentencePlan/planOverviewPage'
import { currentGoalsWithCompletedSteps } from '../../../builders/sentencePlanFactories'
import {
  buildPageTitle,
  getDatePlusDaysAsISO,
  sentencePlanPageTitles,
  sentencePlanV1UrlBuilders,
  sentencePlanV1URLs,
} from '../sentencePlanUtils'

const planOverviewPageCurrentGoalsTabPath = `${sentencePlanV1URLs.PLAN_OVERVIEW}?goalStatusTab=current`
const planOverviewPageAchievedGoalsTabPath = `${sentencePlanV1URLs.PLAN_OVERVIEW}?goalStatusTab=achieved`

test.describe('Confirm if achieved page - access control', () => {
  test.describe('access control', () => {
    test('allows access when plan is not agreed (draft)', async ({ page, openSentencePlan }) => {
      const { plan } = await openSentencePlan({
        plan: builder => builder.withGoals(currentGoalsWithCompletedSteps(1)),
      })
      const goalUuid = plan.goals[0].uuid

      await page.goto(sentencePlanV1UrlBuilders.goalConfirmIfAchieved(goalUuid))

      // Draft plans can confirm achievement once every step is completed
      await ConfirmIfAchievedPage.verifyOnPage(page)
      await expect(page).toHaveURL(sentencePlanV1UrlBuilders.goalConfirmIfAchieved(goalUuid))
    })

    test('redirects to plan overview when not all steps are completed', async ({ page, openSentencePlan }) => {
      const { plan } = await openSentencePlan({
        plan: builder =>
          builder
            .withGoals([
              {
                title: 'Goal With Incomplete Steps',
                areaOfNeed: 'accommodation',
                status: 'ACTIVE',
                targetDate: getDatePlusDaysAsISO(90),
                steps: [
                  { actor: 'probation_practitioner', description: 'First step', status: 'COMPLETED' },
                  { actor: 'person_on_probation', description: 'Second step', status: 'IN_PROGRESS' },
                ],
              },
            ])
            .withAgreementStatus('AGREED'),
      })
      const goalUuid = plan.goals[0].uuid

      // Direct access is blocked until every step is completed
      await page.goto(sentencePlanV1UrlBuilders.goalConfirmIfAchieved(goalUuid))

      await expect(page).toHaveURL(planOverviewPageCurrentGoalsTabPath)
    })

    test('redirects to achieved goals when goal has already been achieved', async ({ page, openSentencePlan }) => {
      const { plan } = await openSentencePlan({
        plan: builder =>
          builder.withGoals([
            {
              title: 'Already achieved goal',
              areaOfNeed: 'accommodation',
              status: 'ACHIEVED',
              targetDate: getDatePlusDaysAsISO(90),
              steps: [{ actor: 'probation_practitioner', description: 'Completed step', status: 'COMPLETED' }],
            },
          ]),
      })
      const goalUuid = plan.goals[0].uuid

      await page.goto(sentencePlanV1UrlBuilders.goalConfirmIfAchieved(goalUuid))

      await PlanOverviewPage.verifyOnPage(page)
      await expect(page).toHaveURL(planOverviewPageAchievedGoalsTabPath)
    })

    test('allows access when plan status is AGREED', async ({ page, openSentencePlan }) => {
      const { plan } = await openSentencePlan({
        plan: builder =>
          builder.withGoals(currentGoalsWithCompletedSteps(1))
            .withAgreementStatus('AGREED'),
      })
      const goalUuid = plan.goals[0].uuid

      await page.goto(sentencePlanV1UrlBuilders.goalConfirmIfAchieved(goalUuid))

      // ensure page title is correct
      await expect(page).toHaveTitle(buildPageTitle(sentencePlanPageTitles.confirmIfAchieved))

      // Should be on the confirm-if-achieved page
      await ConfirmIfAchievedPage.verifyOnPage(page)
      await expect(page).toHaveURL(sentencePlanV1UrlBuilders.goalConfirmIfAchieved(goalUuid))
    })

    test('allows access when plan status is COULD_NOT_ANSWER', async ({ page, openSentencePlan }) => {
      const { plan } = await openSentencePlan({
        plan: builder =>
          builder.withGoals(currentGoalsWithCompletedSteps(1))
            .withAgreementStatus('COULD_NOT_ANSWER'),
      })
      const goalUuid = plan.goals[0].uuid

      await page.goto(sentencePlanV1UrlBuilders.goalConfirmIfAchieved(goalUuid))

      // Should be on the confirm-if-achieved page
      await ConfirmIfAchievedPage.verifyOnPage(page)
      await expect(page).toHaveURL(sentencePlanV1UrlBuilders.goalConfirmIfAchieved(goalUuid))
    })

    test('allows access when plan status is DO_NOT_AGREE', async ({ page, openSentencePlan }) => {
      const { plan } = await openSentencePlan({
        plan: builder =>
          builder.withGoals(currentGoalsWithCompletedSteps(1))
            .withAgreementStatus('DO_NOT_AGREE'),
      })
      const goalUuid = plan.goals[0].uuid

      // Try to access confirm-if-achieved page directly
      await page.goto(sentencePlanV1UrlBuilders.goalConfirmIfAchieved(goalUuid))

      // Should be on the confirm-if-achieved page
      await ConfirmIfAchievedPage.verifyOnPage(page)
      await expect(page).toHaveURL(sentencePlanV1UrlBuilders.goalConfirmIfAchieved(goalUuid))
    })
  })
})
