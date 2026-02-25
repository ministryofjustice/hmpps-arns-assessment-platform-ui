import { expect } from '@playwright/test'
import { AuditEvent } from '@server/services/auditService'
import { test, TargetService } from '../../../support/fixtures'
import { currentGoals } from '../../../builders/sentencePlanFactories'
import ChangeGoalPage from '../../../pages/sentencePlan/changeGoalPage'
import { navigateToSentencePlan, sentencePlanV1UrlBuilders } from '../../sentencePlan/sentencePlanUtils'
import { activeGoalWithSteps, expectAuditEvent } from './helpers'

test.describe('Change a Goal', () => {
  test('changing goal in pre-agree plan', async ({ page, createSession, sentencePlanBuilder, auditQueue }) => {
    const { sentencePlanId, crn, handoverLink } = await createSession({
      targetService: TargetService.SENTENCE_PLAN,
    })
    const plan = await sentencePlanBuilder.extend(sentencePlanId).withGoals(currentGoals(1)).save()
    const goalUuid = plan.goals[0].uuid

    await navigateToSentencePlan(page, handoverLink)
    await page.goto(sentencePlanV1UrlBuilders.goalChange(goalUuid))

    const changeGoalPage = await ChangeGoalPage.verifyOnPage(page)
    await changeGoalPage.setGoalTitle('Updated goal title')
    await changeGoalPage.saveGoal()
    await expect(page).toHaveURL(/\/plan\/overview/)

    const event = await auditQueue.waitForAuditEvent(crn, AuditEvent.EDIT_GOAL)
    expectAuditEvent(event, goalUuid)
    expect(event.details.planStatus).toBe('PRE_AGREE')
  })

  test('changing goal in post-agree plan', async ({ page, createSession, sentencePlanBuilder, auditQueue }) => {
    const { sentencePlanId, crn, handoverLink } = await createSession({
      targetService: TargetService.SENTENCE_PLAN,
    })
    const plan = await sentencePlanBuilder
      .extend(sentencePlanId)
      .withGoals(activeGoalWithSteps())
      .withAgreementStatus('AGREED')
      .save()
    const goalUuid = plan.goals[0].uuid

    await navigateToSentencePlan(page, handoverLink)
    await page.goto(sentencePlanV1UrlBuilders.goalChange(goalUuid))

    const changeGoalPage = await ChangeGoalPage.verifyOnPage(page)
    await changeGoalPage.setGoalTitle('Updated goal title post-agree')
    await changeGoalPage.saveGoal()

    const event = await auditQueue.waitForAuditEvent(crn, AuditEvent.EDIT_GOAL)
    expectAuditEvent(event, goalUuid)
    expect(event.details.planStatus).toBe('POST_AGREE')
  })
})
