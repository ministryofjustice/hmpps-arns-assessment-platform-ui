import { expect } from '@playwright/test'
import { AuditEvent } from '@server/services/auditService'
import { test, TargetService } from '../../../support/fixtures'
import { currentGoals } from '../../../builders/sentencePlanFactories'
import { navigateToSentencePlan, sentencePlanV1UrlBuilders } from '../../sentencePlan/sentencePlanUtils'
import { expectAuditEvent } from './helpers'

test.describe('Delete a Goal', () => {
  test('confirming goal deletion', async ({ page, createSession, sentencePlanBuilder, auditQueue }) => {
    const { sentencePlanId, crn, handoverLink } = await createSession({
      targetService: TargetService.SENTENCE_PLAN,
    })
    const plan = await sentencePlanBuilder.extend(sentencePlanId).withGoals(currentGoals(1)).save()
    const goalUuid = plan.goals[0].uuid

    await navigateToSentencePlan(page, handoverLink)
    await page.goto(sentencePlanV1UrlBuilders.goalConfirmDelete(goalUuid))
    await page.getByRole('button', { name: 'Confirm' }).click()
    await expect(page).toHaveURL(/\/plan\/overview/)

    const event = await auditQueue.waitForAuditEvent(crn, AuditEvent.DELETE_GOAL)
    expectAuditEvent(event, goalUuid)
  })
})
