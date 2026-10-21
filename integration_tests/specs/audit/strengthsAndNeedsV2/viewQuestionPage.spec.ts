import { Step } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/accommodation/constants/step'
import { TargetService, test } from '../../../support/fixtures'
import { navigateToStrengthsAndNeeds } from '../../strengthsAndNeedsV2/sanUtils'
import { expectSanAuditEvent, onPage, SanAuditEvent } from './helpers'

test.describe('Views Question pages for each Criminogenic Needs section', () => {
  test('visiting a question page', async ({ page, createSession, strengthsAndNeedsBuilder, auditQueue }) => {
    const { crn, handoverLink } = await createSession({ targetService: TargetService.STRENGTHS_AND_NEEDS })
    await strengthsAndNeedsBuilder.fresh().save()
    await navigateToStrengthsAndNeeds(page, handoverLink)
    const event = await auditQueue.waitForAuditEvent(crn, SanAuditEvent.VIEW_QUESTION_PAGE, {
      additionalFilter: onPage('accommodation', Step.accommodation_community_current_accommodation.code),
    })
    expectSanAuditEvent(event)
  })
  // TODO Uncomment it during ACT-752 Finance framework
  // test('records the section and page of each question page separately', async ({
  //   page,
  //   createSession,
  //   strengthsAndNeedsBuilder,
  //   auditQueue,
  // }) => {
  //   const { crn, handoverLink, sanAssessmentId } = await createSession({
  //     targetService: TargetService.STRENGTHS_AND_NEEDS,
  //   })
  //   await strengthsAndNeedsBuilder.fresh().save()
  //   await navigateToStrengthsAndNeeds(page, handoverLink)
  //   await page.goto(`/strengths-and-needs/v2.0/edit/${sanAssessmentId}/finances/finance`)
  //   const event = await auditQueue.waitForAuditEvent(crn, SanAuditEvent.VIEW_QUESTION_PAGE, {
  //     additionalFilter: onPage('finance', 'finance'),
  //   })
  //   expectSanAuditEvent(event)
  // })
})
