import { expect } from '@playwright/test'
import { AuditEvent } from '@server/services/auditService'
import { test, TargetService } from '../../../support/fixtures'
import { navigateToSentencePlan } from '../../sentencePlan/sentencePlanUtils'
import PreviousVersionsPage from '../../../pages/sentencePlan/previousVersionsPage'
import coordinatorApi from '../../../mockApis/coordinatorApi'
import { expectAuditEvent } from './helpers'

test.describe('Views previous version of Sentence Plan', () => {
  test('viewing a historic plan version', async ({ page, createSession, auditQueue }) => {
    const { sentencePlanId, crn, handoverLink } = await createSession({
      targetService: TargetService.SENTENCE_PLAN,
    })

    // Use yesterday as the date key so it isn't filtered out by loadPreviousVersions (which removes today's entry),
    // but use the current time as the version timestamp so the AssessmentVersionQuery finds data.
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split('T')[0]
    const now = Date.now()

    await coordinatorApi.stubGetEntityVersions(sentencePlanId, {
      allVersions: {
        [yesterdayStr]: {
          description: 'Plan updated',
          assessmentVersion: null,
          planVersion: {
            uuid: crypto.randomUUID(),
            version: now,
            createdAt: yesterday.toISOString(),
            updatedAt: yesterday.toISOString(),
            status: 'UNSIGNED',
            planAgreementStatus: 'AGREED',
            entityType: 'AAP_PLAN',
          },
        },
      },
      countersignedVersions: {},
    })

    await navigateToSentencePlan(page, handoverLink)

    await page.getByRole('link', { name: 'View previous versions' }).click()
    const previousVersionsPage = await PreviousVersionsPage.verifyOnPage(page)

    const [newPage] = await Promise.all([
      page.waitForEvent('popup'),
      previousVersionsPage.table.locator('a').first().click(),
    ])
    await newPage.waitForLoadState()

    const event = await auditQueue.waitForAuditEvent(crn, AuditEvent.VIEW_HISTORIC_PLAN)
    expectAuditEvent(event)
    expect(event.details.planVersionTimestamp).toBeDefined()
  })
})
