import { expect } from '@playwright/test'
import { test } from '../../../support/fixtures'
import ConfirmRemoveGoalPage from '../../../pages/sentencePlan/confirmRemoveGoalPage'
import { sentencePlanV1UrlBuilders } from '../../sentencePlan/sentencePlanUtils'
import { SentencePlanAuditEvent, activeGoalWithSteps, expectAuditEvent } from './helpers'

test.describe('Remove a goal', () => {
  test('confirming goal removal', async ({ page, auditQueue, openSentencePlan }) => {
    const { crn, plan } = await openSentencePlan({
      plan: builder =>
        builder.withGoals(activeGoalWithSteps())
          .withAgreementStatus('AGREED'),
    })
    const goalUuid = plan.goals[0].uuid

    await page.goto(sentencePlanV1UrlBuilders.goalConfirmRemoved(goalUuid))

    const confirmPage = await ConfirmRemoveGoalPage.verifyOnPage(page)
    await confirmPage.enterRemovalNote('No longer relevant')
    await confirmPage.clickConfirm()
    await expect(page).toHaveURL(/\/plan\/overview/)

    const event = await auditQueue.waitForAuditEvent(crn, SentencePlanAuditEvent.EDIT_GOAL_REMOVED)
    expectAuditEvent(event, goalUuid)
  })
})
