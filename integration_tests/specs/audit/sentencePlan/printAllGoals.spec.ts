import { test, TargetService } from '../../../support/fixtures'
import PlanOverviewPage from '../../../pages/sentencePlan/planOverviewPage'
import PrintPreviewPage from '../../../pages/sentencePlan/printPreviewPage'
import { navigateToSentencePlan } from '../../sentencePlan/sentencePlanUtils'
import { AuditEvent, expectAuditEvent } from './helpers'

test.describe('Print all goals', () => {
  test('accessing print preview from Print all goals sends an audit event', async ({
    page,
    createSession,
    auditQueue,
  }) => {
    const { crn, handoverLink } = await createSession({
      targetService: TargetService.SENTENCE_PLAN,
    })

    await navigateToSentencePlan(page, handoverLink)
    const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

    const [newPage] = await Promise.all([page.waitForEvent('popup'), planOverviewPage.printAllGoalsButton.click()])
    await PrintPreviewPage.verifyOnPage(newPage)

    const event = await auditQueue.waitForAuditEvent(crn, AuditEvent.PRINT_ALL_GOALS)
    expectAuditEvent(event)
  })
})
