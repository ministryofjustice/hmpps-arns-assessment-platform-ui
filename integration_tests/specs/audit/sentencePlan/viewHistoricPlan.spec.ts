import { expect } from '@playwright/test'
import { test, TargetService } from '../../../support/fixtures'
import { navigateToSentencePlan } from '../../sentencePlan/sentencePlanUtils'
import PreviousVersionsPage from '../../../pages/sentencePlan/previousVersionsPage'
import { AuditEvent, expectAuditEvent } from './helpers'

test.describe('Views previous version of Sentence Plan', () => {
  test('viewing a historic plan version', async ({ page, createSession, sentencePlanBuilder, auditQueue }) => {
    const { sentencePlanId, crn, handoverLink } = await createSession({
      targetService: TargetService.SENTENCE_PLAN,
    })

    // Backdate events to a past date so the version appears in the previous versions table
    // and the version timestamp is safely after the assessment's createdAt
    const versionDate = new Date(2026, 0, 1, 9)
    const versionDateEnd = new Date(2026, 0, 1, 17)

    await sentencePlanBuilder.extend(sentencePlanId).withEventsBackdated(versionDate, versionDateEnd).save()

    await navigateToSentencePlan(page, handoverLink)

    await page.getByRole('link', { name: 'View previous versions' }).click()
    const previousVersionsPage = await PreviousVersionsPage.verifyOnPage(page)

    const [newPage] = await Promise.all([
      page.waitForEvent('popup'),
      previousVersionsPage.clickViewVersionOnDate('1 January 2026'),
    ])
    await newPage.waitForLoadState()

    const event = await auditQueue.waitForAuditEvent(crn, AuditEvent.VIEW_HISTORIC_PLAN)
    expectAuditEvent(event)
    expect(event.details.planVersionTimestamp).toBeDefined()
  })
})
