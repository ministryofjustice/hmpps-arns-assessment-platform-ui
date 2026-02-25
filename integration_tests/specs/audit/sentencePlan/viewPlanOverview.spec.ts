import { expect } from '@playwright/test'
import { AuditEvent } from '@server/services/auditService'
import { test, TargetService } from '../../../support/fixtures'
import { currentGoals, mixedGoals, removedGoals } from '../../../builders/sentencePlanFactories'
import PlanOverviewPage from '../../../pages/sentencePlan/planOverviewPage'
import { navigateToSentencePlan, sentencePlanV1URLs } from '../../sentencePlan/sentencePlanUtils'
import { achievedGoals, expectAuditEvent } from './helpers'

test.describe('View Plan Overview page', () => {
  test('viewing current goals tab', async ({ page, createSession, sentencePlanBuilder, auditQueue }) => {
    const { sentencePlanId, crn, handoverLink } = await createSession({
      targetService: TargetService.SENTENCE_PLAN,
    })
    await sentencePlanBuilder.extend(sentencePlanId).withGoals(currentGoals(1)).save()

    await navigateToSentencePlan(page, handoverLink)
    await PlanOverviewPage.verifyOnPage(page)

    const event = await auditQueue.waitForAuditEvent(crn, AuditEvent.VIEW_PLAN_OVERVIEW, {
      additionalFilter: msg => msg.details.tab === 'current',
    })
    expectAuditEvent(event)
  })

  test('viewing future goals tab', async ({ page, createSession, sentencePlanBuilder, auditQueue }) => {
    const { sentencePlanId, crn, handoverLink } = await createSession({
      targetService: TargetService.SENTENCE_PLAN,
    })
    await sentencePlanBuilder.extend(sentencePlanId).withGoals(mixedGoals()).save()

    await navigateToSentencePlan(page, handoverLink)
    const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)
    await planOverviewPage.clickFutureGoalsTab()
    await expect(page).toHaveURL(/type=future/)

    const event = await auditQueue.waitForAuditEvent(crn, AuditEvent.VIEW_PLAN_OVERVIEW, {
      additionalFilter: msg => msg.details.tab === 'future',
    })
    expectAuditEvent(event)
  })

  test('viewing achieved goals tab', async ({ page, createSession, sentencePlanBuilder, auditQueue }) => {
    const { sentencePlanId, crn, handoverLink } = await createSession({
      targetService: TargetService.SENTENCE_PLAN,
    })
    await sentencePlanBuilder.extend(sentencePlanId).withGoals(achievedGoals()).withAgreementStatus('AGREED').save()

    await navigateToSentencePlan(page, handoverLink)
    await page.goto(`${sentencePlanV1URLs.PLAN_OVERVIEW}?type=achieved`)
    await PlanOverviewPage.verifyOnPage(page)

    const event = await auditQueue.waitForAuditEvent(crn, AuditEvent.VIEW_PLAN_OVERVIEW, {
      additionalFilter: msg => msg.details.tab === 'achieved',
    })
    expectAuditEvent(event)
  })

  test('viewing removed goals tab', async ({ page, createSession, sentencePlanBuilder, auditQueue }) => {
    const { sentencePlanId, crn, handoverLink } = await createSession({
      targetService: TargetService.SENTENCE_PLAN,
    })
    await sentencePlanBuilder.extend(sentencePlanId).withGoals(removedGoals(1)).withAgreementStatus('AGREED').save()

    await navigateToSentencePlan(page, handoverLink)
    await page.goto(`${sentencePlanV1URLs.PLAN_OVERVIEW}?type=removed`)
    await PlanOverviewPage.verifyOnPage(page)

    const event = await auditQueue.waitForAuditEvent(crn, AuditEvent.VIEW_PLAN_OVERVIEW, {
      additionalFilter: msg => msg.details.tab === 'removed',
    })
    expectAuditEvent(event)
  })
})
