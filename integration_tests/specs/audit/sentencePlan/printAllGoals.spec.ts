import { test } from '../../../support/fixtures'
import { currentGoals } from '../../../builders/sentencePlanFactories'
import PlanOverviewPage from '../../../pages/sentencePlan/planOverviewPage'
import PrintPreviewPage from '../../../pages/sentencePlan/printPreviewPage'
import {} from '../../sentencePlan/sentencePlanUtils'
import { AuditEvent, expectAuditEvent } from './helpers'

test.describe('Print all goals', () => {
  test('accessing print preview from Print all goals sends an audit event', async ({
    page,
    auditQueue,
    openSentencePlan,
  }) => {
    const { crn } = await openSentencePlan({
      plan: builder => builder.withGoals(currentGoals(1)),
    })

    const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

    const [newPage] = await Promise.all([page.waitForEvent('popup'), planOverviewPage.printAllGoalsButton.click()])
    await PrintPreviewPage.verifyOnPage(newPage)

    const event = await auditQueue.waitForAuditEvent(crn, AuditEvent.PRINT_ALL_GOALS)
    expectAuditEvent(event)
  })
})
