import { expect } from '@playwright/test'
import { AuditEvent } from '@server/services/auditService'
import { test, TargetService } from '../../../support/fixtures'
import { currentGoalsWithCompletedSteps } from '../../../builders/sentencePlanFactories'
import AgreePlanPage from '../../../pages/sentencePlan/agreePlanPage'
import { navigateToSentencePlan, sentencePlanV1URLs } from '../../sentencePlan/sentencePlanUtils'
import { expectAuditEvent } from './helpers'

test.describe('Agree Plan', () => {
  test('agreeing plan with yes', async ({ page, createSession, sentencePlanBuilder, auditQueue }) => {
    const { sentencePlanId, crn, handoverLink } = await createSession({
      targetService: TargetService.SENTENCE_PLAN,
    })
    await sentencePlanBuilder.extend(sentencePlanId).withGoals(currentGoalsWithCompletedSteps(1)).save()

    await navigateToSentencePlan(page, handoverLink)
    await page.goto(sentencePlanV1URLs.PLAN_AGREE)

    const agreePlanPage = await AgreePlanPage.verifyOnPage(page)
    await agreePlanPage.selectAgreeYes()
    await agreePlanPage.clickSave()
    await expect(page).toHaveURL(/\/plan\/overview/)

    const event = await auditQueue.waitForAuditEvent(crn, AuditEvent.EDIT_PLAN_AGREEMENT)
    expectAuditEvent(event)
    expect(event.details.agreementStatus).toBe('yes')
  })

  test('agreeing plan with no', async ({ page, createSession, sentencePlanBuilder, auditQueue }) => {
    const { sentencePlanId, crn, handoverLink } = await createSession({
      targetService: TargetService.SENTENCE_PLAN,
    })
    await sentencePlanBuilder.extend(sentencePlanId).withGoals(currentGoalsWithCompletedSteps(1)).save()

    await navigateToSentencePlan(page, handoverLink)
    await page.goto(sentencePlanV1URLs.PLAN_AGREE)

    const agreePlanPage = await AgreePlanPage.verifyOnPage(page)
    await agreePlanPage.selectAgreeNo()
    await agreePlanPage.enterDetailsForNo('Disagrees')
    await agreePlanPage.clickSave()
    await expect(page).toHaveURL(/\/plan\/overview/)

    const event = await auditQueue.waitForAuditEvent(crn, AuditEvent.EDIT_PLAN_AGREEMENT)
    expectAuditEvent(event)
    expect(event.details.agreementStatus).toBe('no')
  })

  test('agreeing plan with could not answer', async ({ page, createSession, sentencePlanBuilder, auditQueue }) => {
    const { sentencePlanId, crn, handoverLink } = await createSession({
      targetService: TargetService.SENTENCE_PLAN,
    })
    await sentencePlanBuilder.extend(sentencePlanId).withGoals(currentGoalsWithCompletedSteps(1)).save()

    await navigateToSentencePlan(page, handoverLink)
    await page.goto(sentencePlanV1URLs.PLAN_AGREE)

    const agreePlanPage = await AgreePlanPage.verifyOnPage(page)
    await agreePlanPage.selectCouldNotAnswer()
    await agreePlanPage.enterDetailsForCouldNotAnswer('Could not answer')
    await agreePlanPage.clickSave()
    await expect(page).toHaveURL(/\/plan\/overview/)

    const event = await auditQueue.waitForAuditEvent(crn, AuditEvent.EDIT_PLAN_AGREEMENT)
    expectAuditEvent(event)
    expect(event.details.agreementStatus).toBe('could_not_answer')
  })
})
