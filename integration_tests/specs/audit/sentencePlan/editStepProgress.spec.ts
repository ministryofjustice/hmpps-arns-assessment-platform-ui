import { expect } from '@playwright/test'
import { test } from '../../../support/fixtures'
import { currentGoalsWithCompletedSteps } from '../../../builders/sentencePlanFactories'
import UpdateGoalAndStepsPage from '../../../pages/sentencePlan/updateGoalAndStepsPage'
import { sentencePlanV1UrlBuilders } from '../../sentencePlan/sentencePlanUtils'
import { SentencePlanAuditEvent, activeGoalWithSteps, expectAuditEvent } from './helpers'

test.describe('Update Steps', () => {
  test('save action', async ({ page, auditQueue, openSentencePlan }) => {
    const { crn, plan } = await openSentencePlan({
      plan: builder =>
        builder.withGoals(activeGoalWithSteps())
          .withAgreementStatus('AGREED'),
    })
    const goalUuid = plan.goals[0].uuid

    await page.goto(sentencePlanV1UrlBuilders.goalUpdateSteps(goalUuid))

    const updatePage = await UpdateGoalAndStepsPage.verifyOnPage(page)
    await updatePage.setStepStatusByIndex(0, 'IN_PROGRESS')
    await updatePage.clickSaveGoalAndSteps()

    const event = await auditQueue.waitForAuditEvent(crn, SentencePlanAuditEvent.EDIT_STEP_PROGRESS, {
      additionalFilter: msg => msg.details.action === 'save',
    })
    expectAuditEvent(event, goalUuid)
    expect(event.details.goalStatus).toBe('ACTIVE')
  })

  test('mark-achieved action', async ({ page, auditQueue, openSentencePlan }) => {
    const { crn, plan } = await openSentencePlan({
      plan: builder =>
        builder.withGoals(currentGoalsWithCompletedSteps(1))
          .withAgreementStatus('AGREED'),
    })
    const goalUuid = plan.goals[0].uuid

    await page.goto(sentencePlanV1UrlBuilders.goalUpdateSteps(goalUuid))

    const updatePage = await UpdateGoalAndStepsPage.verifyOnPage(page)
    await updatePage.clickMarkAsAchieved()

    const event = await auditQueue.waitForAuditEvent(crn, SentencePlanAuditEvent.EDIT_STEP_PROGRESS, {
      additionalFilter: msg => msg.details.action === 'mark-achieved',
    })
    expectAuditEvent(event, goalUuid)
    expect(event.details.goalStatus).toBe('ACTIVE')
  })
})
