import { expect } from '@playwright/test'
import { AuditEvent } from '@server/services/auditService'
import { test, TargetService } from '../../../support/fixtures'
import { currentGoalsWithCompletedSteps } from '../../../builders/sentencePlanFactories'
import UpdateAgreePlanPage from '../../../pages/sentencePlan/updateAgreePlanPage'
import { navigateToSentencePlan, sentencePlanV1URLs } from '../../sentencePlan/sentencePlanUtils'
import { expectAuditEvent } from './helpers'

test.describe('Update Agreement', () => {
  test('updating agreement with yes', async ({ page, createSession, sentencePlanBuilder, auditQueue }) => {
    const { sentencePlanId, crn, handoverLink } = await createSession({
      targetService: TargetService.SENTENCE_PLAN,
    })
    await sentencePlanBuilder
      .extend(sentencePlanId)
      .withGoals(currentGoalsWithCompletedSteps(1))
      .withAgreementStatus('COULD_NOT_ANSWER')
      .save()

    await navigateToSentencePlan(page, handoverLink)
    await page.goto(sentencePlanV1URLs.PLAN_UPDATE_AGREE)

    const updatePage = await UpdateAgreePlanPage.verifyOnPage(page)
    await updatePage.selectAgreeYes()
    await updatePage.clickSave()
    await expect(page).toHaveURL(/\/plan\/overview/)

    const event = await auditQueue.waitForAuditEvent(crn, AuditEvent.EDIT_PLAN_AGREEMENT_UPDATE)
    expectAuditEvent(event)
    expect(event.details.agreementStatus).toBe('yes')
  })

  test('updating agreement with no', async ({ page, createSession, sentencePlanBuilder, auditQueue }) => {
    const { sentencePlanId, crn, handoverLink } = await createSession({
      targetService: TargetService.SENTENCE_PLAN,
    })
    await sentencePlanBuilder
      .extend(sentencePlanId)
      .withGoals(currentGoalsWithCompletedSteps(1))
      .withAgreementStatus('COULD_NOT_ANSWER')
      .save()

    await navigateToSentencePlan(page, handoverLink)
    await page.goto(sentencePlanV1URLs.PLAN_UPDATE_AGREE)

    const updatePage = await UpdateAgreePlanPage.verifyOnPage(page)
    await updatePage.selectAgreeNo()
    await updatePage.enterDetailsForNo('They do not agree')
    await updatePage.clickSave()
    await expect(page).toHaveURL(/\/plan\/overview/)

    const event = await auditQueue.waitForAuditEvent(crn, AuditEvent.EDIT_PLAN_AGREEMENT_UPDATE)
    expectAuditEvent(event)
    expect(event.details.agreementStatus).toBe('no')
  })
})
