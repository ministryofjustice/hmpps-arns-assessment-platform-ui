import { expect } from '@playwright/test'
import { test, TargetService } from '../../../support/fixtures'
import { currentGoals } from '../../../builders/sentencePlanFactories'
import AddStepsPage from '../../../pages/sentencePlan/addStepsPage'
import CreateGoalPage from '../../../pages/sentencePlan/createGoalPage'
import { navigateToSentencePlan, sentencePlanV1UrlBuilders } from '../../sentencePlan/sentencePlanUtils'
import { AuditEvent, expectAuditEvent } from './helpers'

test.describe('Add or Change Steps', () => {
  test('saving steps on an existing goal sends EDIT_STEPS audit event', async ({
    page,
    createSession,
    sentencePlanBuilder,
    auditQueue,
  }) => {
    const { sentencePlanId, crn, handoverLink } = await createSession({
      targetService: TargetService.SENTENCE_PLAN,
    })
    const plan = await sentencePlanBuilder.extend(sentencePlanId).withGoals(currentGoals(1)).save()
    const goalUuid = plan.goals[0].uuid

    await navigateToSentencePlan(page, handoverLink)
    await page.goto(sentencePlanV1UrlBuilders.goalAddSteps(goalUuid))

    const addStepsPage = await AddStepsPage.verifyOnPage(page)
    await addStepsPage.enterStep(0, 'probation_practitioner', 'test')
    await addStepsPage.clickSaveAndContinue()
    await expect(page).toHaveURL(/\/plan\/overview/)

    const event = await auditQueue.waitForAuditEvent(crn, AuditEvent.EDIT_STEPS)
    expectAuditEvent(event, goalUuid)
  })

  test('adding steps to a new goal sends ADD_STEPS audit event', async ({ page, createSession, auditQueue }) => {
    const { crn, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })

    await navigateToSentencePlan(page, handoverLink)
    await page.goto(sentencePlanV1UrlBuilders.goalCreate('accommodation'))

    const createGoalPage = await CreateGoalPage.verifyOnPage(page)
    await createGoalPage.enterGoalTitle('Audit test goal with steps')
    await createGoalPage.selectIsRelated(false)
    await createGoalPage.selectCanStartNow(false)
    await createGoalPage.clickAddSteps()

    const addStepsPage = await AddStepsPage.verifyOnPage(page)
    await addStepsPage.enterStep(0, 'probation_practitioner', 'Test step')
    await addStepsPage.clickSaveAndContinue()
    await expect(page).toHaveURL(/\/plan\/overview/)

    const event = await auditQueue.waitForAuditEvent(crn, AuditEvent.ADD_STEPS)
    expectAuditEvent(event)
  })
})
