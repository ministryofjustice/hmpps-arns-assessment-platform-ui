import { expect } from '@playwright/test'
import { test } from '../../support/fixtures'
import PlanOverviewPage from '../../pages/sentencePlan/planOverviewPage'
import { sentencePlanV1UrlBuilders, sentencePlanV1URLs } from './sentencePlanUtils'

const planOverviewPageCurrentGoalsTabPath = `${sentencePlanV1URLs.PLAN_OVERVIEW}?goalStatusTab=current`

const goalEditPages = [
  { name: 'change-goal', url: sentencePlanV1UrlBuilders.goalChange },
  { name: 'change-area-of-need', url: sentencePlanV1UrlBuilders.goalChangeArea },
  { name: 'add-steps', url: sentencePlanV1UrlBuilders.goalAddSteps },
  { name: 'update-goal-steps', url: sentencePlanV1UrlBuilders.goalUpdateSteps },
  { name: 'confirm-remove-goal', url: sentencePlanV1UrlBuilders.goalConfirmRemoved },
  { name: 'confirm-achieved-goal', url: sentencePlanV1UrlBuilders.goalConfirmAchieved },
]

test.describe('Goal pages for achieved and removed goals', () => {
  ;(['ACHIEVED', 'REMOVED'] as const).forEach(status => {
    goalEditPages.forEach(({ name, url }) => {
      test(`redirects ${name} to the plan overview when the goal is ${status}`, async ({ page, openSentencePlan }) => {
        const { plan } = await openSentencePlan({
          plan: builder =>
            builder
              .withGoals([
                {
                  title: 'Inactive goal',
                  areaOfNeed: 'accommodation',
                  status,
                  steps: [{ actor: 'probation_practitioner', description: 'A step', status: 'COMPLETED' }],
                },
              ])
              .withAgreementStatus('AGREED'),
        })

        await page.goto(url(plan.goals[0].uuid))

        await PlanOverviewPage.verifyOnPage(page)
        await expect(page).toHaveURL(planOverviewPageCurrentGoalsTabPath)
      })
    })
  })
})
