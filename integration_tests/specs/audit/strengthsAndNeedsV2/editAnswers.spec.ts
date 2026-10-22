import { Option } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/accommodation/constants/option'
import { Question } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/accommodation/constants/question'
import { expect } from '@playwright/test'
import { Step } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/accommodation/constants/step'
import { basePath } from '@server/forms/strengths-and-needs/versions/v2.0/constants/formVersion'
import { TargetService, test } from '../../../support/fixtures'
import { handlePrivacyScreenIfPresent } from '../../strengthsAndNeedsV2/sanUtils'
import { expectSanAuditEvent, SanAuditEvent } from './helpers'

const buildCurrentAccommodationUrl = (sanAssessmentId: string) =>
  `${basePath}/edit/${sanAssessmentId}/accommodation/${Step.community_current_accommodation.path}`

const settledAnswers = [{ question: Question.community_current_accommodation, value: Option.settled }]

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
    await page.getByLabel('Temporary').check()
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveURL(/accommodation-community-current-accommodation-settled/)

    const event = await auditQueue.waitForAuditEvent(crn, SanAuditEvent.EDIT_ANSWERS)
    expectSanAuditEvent(event)
    expect(event.details.changedFields).toContain('community_current_accommodation')
    expect(JSON.stringify(event.details)).not.toContain('TEMPORARY')
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
    await expect(page).toHaveURL(/accommodation-community-current-accommodation-settled/)
    await auditQueue.waitForAuditEvent(crn, SanAuditEvent.SAVE_QUESTION_PAGE)
    await expect(auditQueue.waitForAuditEvent(crn, SanAuditEvent.EDIT_ANSWERS, { timeout: 2_000 })).rejects.toThrow(
      /Timed out/,
    )
  })
})
