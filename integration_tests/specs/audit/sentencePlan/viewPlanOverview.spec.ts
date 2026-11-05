import { expect } from '@playwright/test'
import { test } from '../../../support/fixtures'
import { currentGoals, mixedGoals, removedGoals } from '../../../builders/sentencePlanFactories'
import PlanOverviewPage from '../../../pages/sentencePlan/planOverviewPage'
import { sentencePlanV1URLs } from '../../sentencePlan/sentencePlanUtils'
import { SentencePlanAuditEvent, achievedGoals, expectAuditEvent } from './helpers'

test.describe('View Plan Overview page', () => {
  test('viewing current goals tab', async ({ auditQueue, openSentencePlan }) => {
    const { crn } = await openSentencePlan({
      plan: builder => builder.withGoals(currentGoals(1)),
    })

    // Landing from handover has no tab and redirects to current, so exactly one event must be sent
    const event = await auditQueue.waitForAuditEvent(crn, SentencePlanAuditEvent.VIEW_PLAN_OVERVIEW)
    expectAuditEvent(event)
    expect(event.details.tab).toBe('current')
  })

  test('viewing future goals tab', async ({ page, auditQueue, openSentencePlan }) => {
    const { crn } = await openSentencePlan({
      plan: builder => builder.withGoals(mixedGoals()),
    })

    const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)
    await planOverviewPage.clickFutureGoalsTab()
    await expect(page).toHaveURL(/goalStatusTab=future/)

    const event = await auditQueue.waitForAuditEvent(crn, SentencePlanAuditEvent.VIEW_PLAN_OVERVIEW, {
      additionalFilter: msg => msg.details.tab === 'future',
    })
    expectAuditEvent(event)
  })

  test('viewing achieved goals tab', async ({ page, auditQueue, openSentencePlan }) => {
    const { crn } = await openSentencePlan({
      plan: builder => builder.withGoals(achievedGoals()).withAgreementStatus('AGREED'),
    })

    await page.goto(`${sentencePlanV1URLs.PLAN_OVERVIEW}?goalStatusTab=achieved`)
    await PlanOverviewPage.verifyOnPage(page)

    const event = await auditQueue.waitForAuditEvent(crn, SentencePlanAuditEvent.VIEW_PLAN_OVERVIEW, {
      additionalFilter: msg => msg.details.tab === 'achieved',
    })
    expectAuditEvent(event)
  })

  test('viewing removed goals tab', async ({ page, auditQueue, openSentencePlan }) => {
    const { crn } = await openSentencePlan({
      plan: builder => builder.withGoals(removedGoals(1)).withAgreementStatus('AGREED'),
    })

    await page.goto(`${sentencePlanV1URLs.PLAN_OVERVIEW}?goalStatusTab=removed`)
    await PlanOverviewPage.verifyOnPage(page)

    const event = await auditQueue.waitForAuditEvent(crn, SentencePlanAuditEvent.VIEW_PLAN_OVERVIEW, {
      additionalFilter: msg => msg.details.tab === 'removed',
    })
    expectAuditEvent(event)
  })
})
