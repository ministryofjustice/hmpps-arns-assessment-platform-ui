import { expect } from '@playwright/test'
import { AuditEvent } from '@server/services/auditService'
import { test, TargetService } from '../../../support/fixtures'
import ConfirmAchievedGoalPage from '../../../pages/sentencePlan/confirmAchievedGoalPage'
import { navigateToSentencePlan, sentencePlanV1UrlBuilders } from '../../sentencePlan/sentencePlanUtils'
import { activeGoalWithSteps, expectAuditEvent } from './helpers'

test.describe('Mark Goal as achieved', () => {
  test('confirming goal achieved', async ({ page, createSession, sentencePlanBuilder, auditQueue }) => {
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
    await page.goto(sentencePlanV1UrlBuilders.goalConfirmAchieved(goalUuid))

    const confirmPage = await ConfirmAchievedGoalPage.verifyOnPage(page)
    await confirmPage.clickConfirm()
    await expect(page).toHaveURL(/\/plan\/overview/)

    const event = await auditQueue.waitForAuditEvent(crn, AuditEvent.EDIT_GOAL_ACHIEVED)
    expectAuditEvent(event, goalUuid)
  })
})
