import { expect } from '@playwright/test'
import { test } from '../../../support/fixtures'
import { currentGoalsWithCompletedSteps } from '../../../builders/sentencePlanFactories'
import AgreePlanPage from '../../../pages/sentencePlan/agreePlanPage'
import { sentencePlanV1URLs } from '../../sentencePlan/sentencePlanUtils'
import { AuditEvent, expectAuditEvent } from './helpers'

test.describe('Agree Plan', () => {
  test('agreeing plan with yes', async ({ page, auditQueue, openSentencePlan }) => {
    const { crn } = await openSentencePlan({
      plan: builder => builder.withGoals(currentGoalsWithCompletedSteps(1)),
    })

    await page.goto(sentencePlanV1URLs.PLAN_AGREE)

    const agreePlanPage = await AgreePlanPage.verifyOnPage(page)
    await agreePlanPage.selectAgreeYes()
    await agreePlanPage.clickSave()
    await expect(page).toHaveURL(/\/plan\/overview/)

    const event = await auditQueue.waitForAuditEvent(crn, AuditEvent.EDIT_PLAN_AGREEMENT)
    expectAuditEvent(event)
    expect(event.details.agreementStatus).toBe('yes')
  })

  test('agreeing plan with no', async ({ page, auditQueue, openSentencePlan }) => {
    const { crn } = await openSentencePlan({
      plan: builder => builder.withGoals(currentGoalsWithCompletedSteps(1)),
    })

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

  test('agreeing plan with could not answer', async ({ page, auditQueue, openSentencePlan }) => {
    const { crn } = await openSentencePlan({
      plan: builder => builder.withGoals(currentGoalsWithCompletedSteps(1)),
    })

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
