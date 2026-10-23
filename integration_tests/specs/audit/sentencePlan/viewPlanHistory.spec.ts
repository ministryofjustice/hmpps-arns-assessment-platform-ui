import { expect } from '@playwright/test'
import { test } from '../../../support/fixtures'
import { currentGoalsWithCompletedSteps } from '../../../builders/sentencePlanFactories'
import { sentencePlanV1URLs } from '../../sentencePlan/sentencePlanUtils'
import { SentencePlanAuditEvent, expectAuditEvent } from './helpers'

test.describe('View Plan History Page', () => {
  test('visiting plan history page', async ({ page, auditQueue, openSentencePlan }) => {
    const { crn } = await openSentencePlan({
      plan: builder =>
        builder.withGoals(currentGoalsWithCompletedSteps(1))
          .withAgreementStatus('AGREED'),
    })

    await page.goto(sentencePlanV1URLs.PLAN_HISTORY)

    const event = await auditQueue.waitForAuditEvent(crn, SentencePlanAuditEvent.VIEW_PLAN_HISTORY)
    expectAuditEvent(event)
  })

  test('does not audit when a draft plan is redirected away', async ({ page, auditQueue, openSentencePlan }) => {
    const { crn } = await openSentencePlan({
      plan: builder => builder.withGoals(currentGoalsWithCompletedSteps(1)),
    })

    await page.goto(sentencePlanV1URLs.PLAN_HISTORY)
    await expect(page).toHaveURL(/\/plan\/overview/)

    await expect(
      auditQueue.waitForAuditEvent(crn, SentencePlanAuditEvent.VIEW_PLAN_HISTORY, { timeout: 3_000 }),
    ).rejects.toThrow('Timed out')
  })
})
