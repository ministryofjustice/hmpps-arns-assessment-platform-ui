import { expect } from '@playwright/test'
import { test } from '../../../support/fixtures'
import { removedGoals } from '../../../builders/sentencePlanFactories'
import ConfirmReaddGoalPage from '../../../pages/sentencePlan/confirmReaddGoalPage'
import { sentencePlanV1UrlBuilders } from '../../sentencePlan/sentencePlanUtils'
import { AuditEvent, expectAuditEvent } from './helpers'

test.describe('Add a Goal Back to Plan', () => {
  test('confirming goal re-add', async ({ page, auditQueue, openSentencePlan }) => {
    const { crn, plan } = await openSentencePlan({
      plan: builder =>
        builder.withGoals(removedGoals(1))
          .withAgreementStatus('AGREED'),
    })
    const goalUuid = plan.goals[0].uuid

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
