import { expect } from '@playwright/test'
import { test } from '../../../support/fixtures'
import { removedGoals } from '../../../builders/sentencePlanFactories'
import { sentencePlanV1UrlBuilders } from '../../sentencePlan/sentencePlanUtils'
import { SentencePlanAuditEvent, achievedGoals, expectAuditEvent } from './helpers'

test.describe('View Goal Details', () => {
  test('viewing achieved goal details', async ({ page, auditQueue, openSentencePlan }) => {
    const { crn, plan } = await openSentencePlan({
      plan: builder =>
        builder.withGoals(achievedGoals())
          .withAgreementStatus('AGREED'),
    })
    const goalUuid = plan.goals[0].uuid

    await page.goto(sentencePlanV1UrlBuilders.goalViewInactive(goalUuid))

    const event = await auditQueue.waitForAuditEvent(crn, SentencePlanAuditEvent.VIEW_INACTIVE_GOAL)
    expectAuditEvent(event, goalUuid)
    expect(event.details.goalStatus).toBe('ACHIEVED')
  })

  test('viewing removed goal details', async ({ page, auditQueue, openSentencePlan }) => {
    const { crn, plan } = await openSentencePlan({
      plan: builder =>
        builder.withGoals(removedGoals(1))
          .withAgreementStatus('AGREED'),
    })
    const goalUuid = plan.goals[0].uuid

    await page.goto(sentencePlanV1UrlBuilders.goalViewInactive(goalUuid))

    const event = await auditQueue.waitForAuditEvent(crn, SentencePlanAuditEvent.VIEW_INACTIVE_GOAL)
    expectAuditEvent(event, goalUuid)
    expect(event.details.goalStatus).toBe('REMOVED')
  })
})
