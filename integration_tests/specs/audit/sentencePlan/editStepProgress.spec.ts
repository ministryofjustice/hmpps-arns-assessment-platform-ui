import { expect } from '@playwright/test'
import { AuditEvent } from '@server/services/auditService'
import { test, TargetService } from '../../../support/fixtures'
import { currentGoalsWithCompletedSteps } from '../../../builders/sentencePlanFactories'
import UpdateGoalAndStepsPage from '../../../pages/sentencePlan/updateGoalAndStepsPage'
import { navigateToSentencePlan, sentencePlanV1UrlBuilders } from '../../sentencePlan/sentencePlanUtils'
import { activeGoalWithSteps, expectAuditEvent } from './helpers'

test.describe('Update Steps', () => {
  test('save action', async ({ page, createSession, sentencePlanBuilder, auditQueue }) => {
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
    await page.goto(sentencePlanV1UrlBuilders.goalUpdateSteps(goalUuid))

    const updatePage = await UpdateGoalAndStepsPage.verifyOnPage(page)
    await updatePage.setStepStatusByIndex(0, 'IN_PROGRESS')
    await updatePage.clickSaveGoalAndSteps()

    const event = await auditQueue.waitForAuditEvent(crn, AuditEvent.EDIT_STEP_PROGRESS, {
      additionalFilter: msg => msg.details.action === 'save',
    })
    expectAuditEvent(event, goalUuid)
    expect(event.details.goalStatus).toBe('ACTIVE')
  })

  test('mark-achieved action', async ({ page, createSession, sentencePlanBuilder, auditQueue }) => {
    const { sentencePlanId, crn, handoverLink } = await createSession({
      targetService: TargetService.SENTENCE_PLAN,
    })
    const plan = await sentencePlanBuilder
      .extend(sentencePlanId)
      .withGoals(currentGoalsWithCompletedSteps(1))
      .withAgreementStatus('AGREED')
      .save()
    const goalUuid = plan.goals[0].uuid

    await navigateToSentencePlan(page, handoverLink)
    await page.goto(sentencePlanV1UrlBuilders.goalUpdateSteps(goalUuid))

    const updatePage = await UpdateGoalAndStepsPage.verifyOnPage(page)
    await updatePage.clickMarkAsAchieved()

    const event = await auditQueue.waitForAuditEvent(crn, AuditEvent.EDIT_STEP_PROGRESS, {
      additionalFilter: msg => msg.details.action === 'mark-achieved',
    })
    expectAuditEvent(event, goalUuid)
    expect(event.details.goalStatus).toBe('ACTIVE')
  })
})
