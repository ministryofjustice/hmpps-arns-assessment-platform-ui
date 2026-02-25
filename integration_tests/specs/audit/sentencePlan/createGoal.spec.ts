import { expect } from '@playwright/test'
import { test, TargetService } from '../../../support/fixtures'
import CreateGoalPage from '../../../pages/sentencePlan/createGoalPage'
import { navigateToSentencePlan, sentencePlanV1UrlBuilders } from '../../sentencePlan/sentencePlanUtils'
import { AuditEvent, expectAuditEvent } from './helpers'

test.describe('Create a Goal', () => {
  test('saving goal without steps', async ({ page, createSession, auditQueue }) => {
    const { crn, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })

    await navigateToSentencePlan(page, handoverLink)
    await page.goto(sentencePlanV1UrlBuilders.goalCreate('accommodation'))

    const createGoalPage = await CreateGoalPage.verifyOnPage(page)
    await createGoalPage.enterGoalTitle('Audit test goal')
    await createGoalPage.selectIsRelated(false)
    await createGoalPage.selectCanStartNow(false)
    await createGoalPage.clickSaveWithoutSteps()
    await expect(page).toHaveURL(/\/plan\/overview/)

    const event = await auditQueue.waitForAuditEvent(crn, AuditEvent.CREATE_GOAL)
    expectAuditEvent(event)
    expect(event.details.areaOfNeed).toBe('accommodation')
  })
})
