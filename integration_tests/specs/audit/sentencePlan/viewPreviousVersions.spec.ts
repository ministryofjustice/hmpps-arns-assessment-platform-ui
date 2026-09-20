import { test, TargetService } from '../../../support/fixtures'
import { currentGoalsWithCompletedSteps } from '../../../builders/sentencePlanFactories'
import { navigateToSentencePlan } from '../../sentencePlan/sentencePlanUtils'
import coordinatorApi from '../../../mockApis/coordinatorApi'
import { AuditEvent, expectAuditEvent } from './helpers'

test.describe('View Previous Versions List Page', () => {
  test('visiting previous versions page', async ({ page, createSession, sentencePlanBuilder, auditQueue }) => {
    const { sentencePlanId, crn, handoverLink } = await createSession({
      targetService: TargetService.SENTENCE_PLAN,
    })
    await sentencePlanBuilder
      .extend(sentencePlanId)
      .withGoals(currentGoalsWithCompletedSteps(1))
      .withAgreementStatus('AGREED')
      .save()

    await coordinatorApi.stubGetEntityVersions(sentencePlanId, {
      allVersions: {},
      countersignedVersions: {},
    })

    await navigateToSentencePlan(page, handoverLink)
    await page.getByRole('link', { name: 'View previous versions' }).click()

    const event = await auditQueue.waitForAuditEvent(crn, AuditEvent.VIEW_PREVIOUS_VERSIONS)
    expectAuditEvent(event)
  })
})
