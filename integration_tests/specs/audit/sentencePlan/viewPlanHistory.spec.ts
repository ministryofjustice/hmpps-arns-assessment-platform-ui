import { expect } from '@playwright/test'
import { test, TargetService } from '../../../support/fixtures'
import { currentGoalsWithCompletedSteps } from '../../../builders/sentencePlanFactories'
import { navigateToSentencePlan, sentencePlanV1URLs } from '../../sentencePlan/sentencePlanUtils'
import { AuditEvent, expectAuditEvent } from './helpers'

test.describe('View Plan History Page', () => {
  test('visiting plan history page', async ({ page, createSession, sentencePlanBuilder, auditQueue }) => {
    const { sentencePlanId, crn, handoverLink } = await createSession({
      targetService: TargetService.SENTENCE_PLAN,
    })
    await sentencePlanBuilder
      .extend(sentencePlanId)
      .withGoals(currentGoalsWithCompletedSteps(1))
      .withAgreementStatus('AGREED')
      .save()

    await navigateToSentencePlan(page, handoverLink)
    await page.goto(sentencePlanV1URLs.PLAN_HISTORY)

    const event = await auditQueue.waitForAuditEvent(crn, AuditEvent.VIEW_PLAN_HISTORY)
    expectAuditEvent(event)
  })

  test('does not audit when a draft plan is redirected away', async ({
    page,
    createSession,
    sentencePlanBuilder,
    auditQueue,
  }) => {
    const { sentencePlanId, crn, handoverLink } = await createSession({
      targetService: TargetService.SENTENCE_PLAN,
    })
    await sentencePlanBuilder.extend(sentencePlanId).withGoals(currentGoalsWithCompletedSteps(1)).save()

    await navigateToSentencePlan(page, handoverLink)
    await page.goto(sentencePlanV1URLs.PLAN_HISTORY)
    await expect(page).toHaveURL(/\/plan\/overview/)

    await expect(auditQueue.waitForAuditEvent(crn, AuditEvent.VIEW_PLAN_HISTORY, { timeout: 3_000 })).rejects.toThrow(
      'Timed out',
    )
  })
})
