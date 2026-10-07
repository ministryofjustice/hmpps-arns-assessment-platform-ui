import { expect } from '@playwright/test'
import { test } from '../../../support/fixtures'
import { currentGoalsWithCompletedSteps } from '../../../builders/sentencePlanFactories'
import UpdateAgreePlanPage from '../../../pages/sentencePlan/updateAgreePlanPage'
import { sentencePlanV1URLs } from '../../sentencePlan/sentencePlanUtils'
import { AuditEvent, expectAuditEvent } from './helpers'

test.describe('Update Agreement', () => {
  test('updating agreement with yes', async ({ page, auditQueue, openSentencePlan }) => {
    const { crn } = await openSentencePlan({
      plan: builder =>
        builder.withGoals(currentGoalsWithCompletedSteps(1))
          .withAgreementStatus('COULD_NOT_ANSWER'),
    })

    await page.goto(sentencePlanV1URLs.PLAN_UPDATE_AGREE)

    const updatePage = await UpdateAgreePlanPage.verifyOnPage(page)
    await updatePage.selectAgreeYes()
    await updatePage.clickSave()
    await expect(page).toHaveURL(/\/plan\/overview/)

    const event = await auditQueue.waitForAuditEvent(crn, AuditEvent.EDIT_PLAN_AGREEMENT_UPDATE)
    expectAuditEvent(event)
    expect(event.details.agreementStatus).toBe('yes')
  })

  test('updating agreement with no', async ({ page, auditQueue, openSentencePlan }) => {
    const { crn } = await openSentencePlan({
      plan: builder =>
        builder.withGoals(currentGoalsWithCompletedSteps(1))
          .withAgreementStatus('COULD_NOT_ANSWER'),
    })

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
