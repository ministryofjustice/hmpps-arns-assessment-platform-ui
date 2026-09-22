import { Option } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/accommodation/constants/option'
import { Question } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/accommodation/constants/question'
import { expect } from '@playwright/test'
import { test, TargetService } from '../../../support/fixtures'
import { handlePrivacyScreenIfPresent } from '../../strengthsAndNeeds/sanUtils'
import { expectSanAuditEvent, SanAuditEvent } from './helpers'

const buildCurrentAccommodationUrl = (sanAssessmentId: string) =>
  `/strengths-and-needs/v1.0/edit/${sanAssessmentId}/accommodation/current-accommodation`

const settledAnswers = [
  { question: Question.current_accommodation, value: Option.settled },
  { question: Question.type_of_settled_accommodation, value: Option.homeowner },
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
    await page.goto(buildCurrentAccommodationUrl(sanAssessmentId))

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
    await page.goto(buildCurrentAccommodationUrl(sanAssessmentId))

    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveURL(/accommodation-details/)

    await auditQueue.waitForAuditEvent(crn, SanAuditEvent.SAVE_QUESTION_PAGE)
    await expect(auditQueue.waitForAuditEvent(crn, SanAuditEvent.EDIT_ANSWERS, { timeout: 2_000 })).rejects.toThrow(
      /Timed out/,
    )
  })
})
