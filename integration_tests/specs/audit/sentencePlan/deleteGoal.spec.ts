import { expect } from '@playwright/test'
import { test } from '../../../support/fixtures'
import { currentGoals } from '../../../builders/sentencePlanFactories'
import { sentencePlanV1UrlBuilders } from '../../sentencePlan/sentencePlanUtils'
import { SentencePlanAuditEvent, expectAuditEvent } from './helpers'

test.describe('Delete a Goal', () => {
  test('confirming goal deletion', async ({ page, auditQueue, openSentencePlan }) => {
    const { crn, plan } = await openSentencePlan({
      plan: builder => builder.withGoals(currentGoals(1)),
    })
    const goalUuid = plan.goals[0].uuid

    await page.goto(sentencePlanV1UrlBuilders.goalConfirmDelete(goalUuid))
    await page.getByRole('button', { name: 'Confirm' }).click()
    await expect(page).toHaveURL(/\/plan\/overview/)

    const event = await auditQueue.waitForAuditEvent(crn, SentencePlanAuditEvent.DELETE_GOAL)
    expectAuditEvent(event, goalUuid)
  })
})
