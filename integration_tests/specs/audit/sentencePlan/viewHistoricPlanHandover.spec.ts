import { expect } from '@playwright/test'
import { test } from '../../../support/fixtures'
import { currentGoalsWithCompletedSteps } from '../../../builders/sentencePlanFactories'
import { handlePrivacyScreenIfPresent } from '../../sentencePlan/sentencePlanUtils'
import HistoricPlanPage from '../../../pages/sentencePlan/historicPlanPage'
import { AuditEvent, expectAuditEvent } from './helpers'

test.describe('Views historic Sentence Plan from OASys handover', () => {
  test('audits the historic plan once when handover provides a planVersion', async ({
    page,
    coordinatorBuilder,
    sentencePlanBuilder,
    handoverBuilder,
    auditQueue,
  }) => {
    const coordinator = coordinatorBuilder.create()
    const association = await coordinator.save()

    await sentencePlanBuilder
      .extend(association.sentencePlanId)
      .withGoals(currentGoalsWithCompletedSteps(1))
      .withAgreementStatus('AGREED')
      .save()

    await coordinator.lock(association)
    const signed = await coordinator.sign(association)

    const session = await handoverBuilder
      .forAssociation(association)
      .withPlanVersion(signed.sentencePlanVersion)
      .save()

    const handoverUrl = new URL(session.handoverLink)
    handoverUrl.searchParams.set('clientId', 'sentence-plan')

    await page.goto(handoverUrl.toString())
    await handlePrivacyScreenIfPresent(page)
    await expect(page).toHaveURL(/goalStatusTab=current/)
    await HistoricPlanPage.verifyOnPage(page)

    // The handover redirect lands directly on the tabbed URL, so exactly one event must be sent
    const event = await auditQueue.waitForAuditEvent(association.crn, AuditEvent.VIEW_HISTORIC_PLAN)
    expectAuditEvent(event)
    expect(event.details.planVersionTimestamp).toBeDefined()
  })
})
