import { expect } from '@playwright/test'
import { test, TargetService } from '../../../support/fixtures'
import { handlePrivacyScreenIfPresent } from '../../strengthsAndNeeds/sanUtils'
import { expectSanAuditEvent, SanAuditEvent } from './helpers'

const CURRENT_ACCOMMODATION = '/strengths-and-needs/v1.0/accommodation/current-accommodation'

const settledAnswers = [
  { question: 'current_accommodation', value: 'SETTLED' },
  { question: 'type_of_settled_accommodation', value: 'HOMEOWNER' },
]

test.describe('User changes an answer', () => {
  test('records which fields changed, not their values', async ({
    page,
    createSession,
    strengthsAndNeedsBuilder,
    auditQueue,
  }) => {
    const { crn, handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder.extend(sanAssessmentId).withAnswers(settledAnswers).save()

    await page.goto(handoverLink)
    await handlePrivacyScreenIfPresent(page)
    await page.goto(CURRENT_ACCOMMODATION)

    await page.getByLabel('Renting privately').check()
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveURL(/accommodation-details/)

    const event = await auditQueue.waitForAuditEvent(crn, SanAuditEvent.EDIT_ANSWERS)
    expectSanAuditEvent(event)
    expect(event.details.changedFields).toContain('type_of_settled_accommodation')
    expect(JSON.stringify(event.details)).not.toContain('RENTING_PRIVATELY')
  })

  test('is not raised when a page is resubmitted unchanged', async ({
    page,
    createSession,
    strengthsAndNeedsBuilder,
    auditQueue,
  }) => {
    const { crn, handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder.extend(sanAssessmentId).withAnswers(settledAnswers).save()

    await page.goto(handoverLink)
    await handlePrivacyScreenIfPresent(page)
    await page.goto(CURRENT_ACCOMMODATION)

    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveURL(/accommodation-details/)

    await auditQueue.waitForAuditEvent(crn, SanAuditEvent.SAVE_QUESTION_PAGE)
    await expect(auditQueue.waitForAuditEvent(crn, SanAuditEvent.EDIT_ANSWERS, { timeout: 2_000 })).rejects.toThrow(
      /Timed out/,
    )
  })
})
