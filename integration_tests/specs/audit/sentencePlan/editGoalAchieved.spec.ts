import { expect } from '@playwright/test'
import { test } from '../../../support/fixtures'
import ConfirmAchievedGoalPage from '../../../pages/sentencePlan/confirmAchievedGoalPage'
import { sentencePlanV1UrlBuilders } from '../../sentencePlan/sentencePlanUtils'
import { SentencePlanAuditEvent, activeGoalWithSteps, expectAuditEvent } from './helpers'

test.describe('Mark Goal as achieved', () => {
  test('confirming goal achieved', async ({ page, auditQueue, openSentencePlan }) => {
    const { crn, plan } = await openSentencePlan({
      plan: builder =>
        builder.withGoals(activeGoalWithSteps())
          .withAgreementStatus('AGREED'),
    })
    const goalUuid = plan.goals[0].uuid

    await page.goto(sentencePlanV1UrlBuilders.goalConfirmAchieved(goalUuid))

    const confirmPage = await ConfirmAchievedGoalPage.verifyOnPage(page)
    await confirmPage.clickConfirm()
    await expect(page).toHaveURL(/\/plan\/overview/)

    const event = await auditQueue.waitForAuditEvent(crn, SentencePlanAuditEvent.EDIT_GOAL_ACHIEVED)
    expectAuditEvent(event, goalUuid)
  })
})
