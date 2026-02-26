import { expect } from '@playwright/test'
import { test, TargetService } from '../../../support/fixtures'
import { removedGoals } from '../../../builders/sentencePlanFactories'
import { navigateToSentencePlan, sentencePlanV1UrlBuilders } from '../../sentencePlan/sentencePlanUtils'
import { AuditEvent, achievedGoals, expectAuditEvent } from './helpers'

test.describe('View Goal Details', () => {
  test('viewing achieved goal details', async ({ page, createSession, sentencePlanBuilder, auditQueue }) => {
    const { sentencePlanId, crn, handoverLink } = await createSession({
      targetService: TargetService.SENTENCE_PLAN,
    })
    const plan = await sentencePlanBuilder
      .extend(sentencePlanId)
      .withGoals(achievedGoals())
      .withAgreementStatus('AGREED')
      .save()
    const goalUuid = plan.goals[0].uuid

    await navigateToSentencePlan(page, handoverLink)
    await page.goto(sentencePlanV1UrlBuilders.goalViewInactive(goalUuid))

    const event = await auditQueue.waitForAuditEvent(crn, AuditEvent.VIEW_INACTIVE_GOAL)
    expectAuditEvent(event, goalUuid)
    expect(event.details.goalStatus).toBe('ACHIEVED')
  })

  test('viewing removed goal details', async ({ page, createSession, sentencePlanBuilder, auditQueue }) => {
    const { sentencePlanId, crn, handoverLink } = await createSession({
      targetService: TargetService.SENTENCE_PLAN,
    })
    const plan = await sentencePlanBuilder
      .extend(sentencePlanId)
      .withGoals(removedGoals(1))
      .withAgreementStatus('AGREED')
      .save()
    const goalUuid = plan.goals[0].uuid

    await navigateToSentencePlan(page, handoverLink)
    await page.goto(sentencePlanV1UrlBuilders.goalViewInactive(goalUuid))

    const event = await auditQueue.waitForAuditEvent(crn, AuditEvent.VIEW_INACTIVE_GOAL)
    expectAuditEvent(event, goalUuid)
    expect(event.details.goalStatus).toBe('REMOVED')
  })
})
