import { expect } from '@playwright/test'
import { test, TargetService } from '../../../support/fixtures'
import { removedGoals } from '../../../builders/sentencePlanFactories'
import ConfirmReaddGoalPage from '../../../pages/sentencePlan/confirmReaddGoalPage'
import { navigateToSentencePlan, sentencePlanV1UrlBuilders } from '../../sentencePlan/sentencePlanUtils'
import { AuditEvent, expectAuditEvent } from './helpers'

test.describe('Add a Goal Back to Plan', () => {
  test('confirming goal re-add', async ({ page, createSession, sentencePlanBuilder, auditQueue }) => {
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
    await page.goto(sentencePlanV1UrlBuilders.goalConfirmReAdd(goalUuid))

    const confirmPage = await ConfirmReaddGoalPage.verifyOnPage(page)
    await confirmPage.enterReaddNote('Relevant again')
    await confirmPage.selectCanStartNow(false)
    await confirmPage.clickConfirm()
    await expect(page).toHaveURL(/\/plan\/overview/)

    const event = await auditQueue.waitForAuditEvent(crn, AuditEvent.CREATE_RE_ADD_GOAL)
    expectAuditEvent(event, goalUuid)
  })
})
