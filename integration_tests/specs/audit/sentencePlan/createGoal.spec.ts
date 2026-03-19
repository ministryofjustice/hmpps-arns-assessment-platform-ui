import { expect } from '@playwright/test'
import { test, TargetService } from '../../../support/fixtures'
import CreateGoalPage from '../../../pages/sentencePlan/createGoalPage'
import AddStepsPage from '../../../pages/sentencePlan/addStepsPage'
import { navigateToSentencePlan, sentencePlanV1UrlBuilders } from '../../sentencePlan/sentencePlanUtils'
import { AuditEvent, expectAuditEvent } from './helpers'

test.describe('Create a Goal', () => {
  let HandoverLink: string
  let CRN: string
  test.beforeAll(async ({ createSession }) => {
    const { crn, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
    HandoverLink = handoverLink
    CRN = crn
  })

  test('saving goal without steps', async ({ page, auditQueue }) => {
    await navigateToSentencePlan(page, HandoverLink)
    await page.goto(sentencePlanV1UrlBuilders.goalCreate('accommodation'))

    const createGoalPage = await CreateGoalPage.verifyOnPage(page)
    await createGoalPage.enterGoalTitle('Audit test goal')
    await createGoalPage.selectIsRelated(false)
    await createGoalPage.selectCanStartNow(false)
    await createGoalPage.clickSaveWithoutSteps()
    await expect(page).toHaveURL(/\/plan\/overview/)

    const event = await auditQueue.waitForAuditEvent(CRN, AuditEvent.CREATE_GOAL)
    expectAuditEvent(event)
    expect(event.details.areaOfNeed).toBe('accommodation')
  })

  test('saving goal with steps', async ({ page, auditQueue }) => {
    await navigateToSentencePlan(page, HandoverLink)
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

    const event = await auditQueue.waitForAuditEvent(CRN, AuditEvent.CREATE_GOAL)
    expectAuditEvent(event)
    expect(event.details.areaOfNeed).toBe('accommodation')
  })
})
