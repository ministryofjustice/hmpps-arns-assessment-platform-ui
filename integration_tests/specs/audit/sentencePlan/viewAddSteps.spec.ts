import { expect } from '@playwright/test'
import { test } from '../../../support/fixtures'
import { currentGoals } from '../../../builders/sentencePlanFactories'
import AddStepsPage from '../../../pages/sentencePlan/addStepsPage'
import { sentencePlanV1UrlBuilders } from '../../sentencePlan/sentencePlanUtils'
import { AuditEvent, expectAuditEvent } from './helpers'

test.describe('View Add or Change Steps', () => {
  test('visiting add steps page', async ({ page, auditQueue, openSentencePlan }) => {
    const { crn, plan } = await openSentencePlan({
      plan: builder => builder.withGoals(currentGoals(1)),
    })
    const goalUuid = plan.goals[0].uuid

    await page.goto(sentencePlanV1UrlBuilders.goalAddSteps(goalUuid))
    await AddStepsPage.verifyOnPage(page)

    const event = await auditQueue.waitForAuditEvent(crn, AuditEvent.VIEW_ADD_STEPS)
    expectAuditEvent(event, goalUuid)
  })

  test('adding, removing and saving steps does not send further view events', async ({
    page,
    auditQueue,
    openSentencePlan,
  }) => {
    const { crn, plan } = await openSentencePlan({
      plan: builder => builder.withGoals(currentGoals(1)),
    })
    const goalUuid = plan.goals[0].uuid

    await page.goto(sentencePlanV1UrlBuilders.goalAddSteps(goalUuid))
    const addStepsPage = await AddStepsPage.verifyOnPage(page)
    const stepRows = page.locator('[data-qa="step-row"]')
    await addStepsPage.enterStep(0, 'probation_practitioner', 'test')
    await addStepsPage.clickAddStep()
    await expect(stepRows).toHaveCount(2)
    await addStepsPage.clickRemoveStep(1)
    await expect(stepRows).toHaveCount(1)
    await addStepsPage.clickSaveAndContinue()
    await expect(page).toHaveURL(/\/plan\/overview/)

    // The save event is sent last, so every view event has arrived by the time it is seen.
    await auditQueue.waitForAuditEvent(crn, AuditEvent.EDIT_STEPS)
    // waitForAuditEvent fails when it finds more than one matching event.
    const event = await auditQueue.waitForAuditEvent(crn, AuditEvent.VIEW_ADD_STEPS)
    expectAuditEvent(event, goalUuid)
  })
})
