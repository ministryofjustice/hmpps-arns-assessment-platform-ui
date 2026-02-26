import { expect } from '@playwright/test'
import { test, TargetService } from '../../../support/fixtures'
import ConfirmRemoveGoalPage from '../../../pages/sentencePlan/confirmRemoveGoalPage'
import { navigateToSentencePlan, sentencePlanV1UrlBuilders } from '../../sentencePlan/sentencePlanUtils'
import { AuditEvent, activeGoalWithSteps, expectAuditEvent } from './helpers'

test.describe('Remove a goal', () => {
  test('confirming goal removal', async ({ page, createSession, sentencePlanBuilder, auditQueue }) => {
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
    await page.goto(sentencePlanV1UrlBuilders.goalConfirmRemoved(goalUuid))

    const confirmPage = await ConfirmRemoveGoalPage.verifyOnPage(page)
    await confirmPage.enterRemovalNote('No longer relevant')
    await confirmPage.clickConfirm()
    await expect(page).toHaveURL(/\/plan\/overview/)

    const event = await auditQueue.waitForAuditEvent(crn, AuditEvent.EDIT_GOAL_REMOVED)
    expectAuditEvent(event, goalUuid)
  })
})
