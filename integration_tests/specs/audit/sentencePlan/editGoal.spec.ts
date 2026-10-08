import { expect } from '@playwright/test'
import { test } from '../../../support/fixtures'
import { currentGoals } from '../../../builders/sentencePlanFactories'
import ChangeGoalPage from '../../../pages/sentencePlan/changeGoalPage'
import { sentencePlanV1UrlBuilders } from '../../sentencePlan/sentencePlanUtils'
import { SentencePlanAuditEvent, activeGoalWithSteps, expectAuditEvent } from './helpers'

test.describe('Change a Goal', () => {
  test('changing goal in pre-agree plan', async ({ page, auditQueue, openSentencePlan }) => {
    const { crn, plan } = await openSentencePlan({
      plan: builder => builder.withGoals(currentGoals(1)),
    })
    const goalUuid = plan.goals[0].uuid

    await page.goto(sentencePlanV1UrlBuilders.goalChange(goalUuid))

    const changeGoalPage = await ChangeGoalPage.verifyOnPage(page)
    await changeGoalPage.setGoalTitle('Updated goal title')
    await changeGoalPage.saveGoal()
    await expect(page).toHaveURL(/\/plan\/overview/)

    const event = await auditQueue.waitForAuditEvent(crn, SentencePlanAuditEvent.EDIT_GOAL)
    expectAuditEvent(event, goalUuid)
    expect(event.details.planStatus).toBe('PRE_AGREE')
  })

  test('changing goal in post-agree plan', async ({ page, auditQueue, openSentencePlan }) => {
    const { crn, plan } = await openSentencePlan({
      plan: builder =>
        builder.withGoals(activeGoalWithSteps())
          .withAgreementStatus('AGREED'),
    })
    const goalUuid = plan.goals[0].uuid

    await page.goto(sentencePlanV1UrlBuilders.goalChange(goalUuid))

    const changeGoalPage = await ChangeGoalPage.verifyOnPage(page)
    await changeGoalPage.setGoalTitle('Updated goal title post-agree')
    await changeGoalPage.saveGoal()

    const event = await auditQueue.waitForAuditEvent(crn, SentencePlanAuditEvent.EDIT_GOAL)
    expectAuditEvent(event, goalUuid)
    expect(event.details.planStatus).toBe('POST_AGREE')
  })
})
