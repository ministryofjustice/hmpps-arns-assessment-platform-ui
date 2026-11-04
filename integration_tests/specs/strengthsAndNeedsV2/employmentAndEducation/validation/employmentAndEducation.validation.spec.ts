import { Question } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/employment-and-education/constants/question'
import { expect } from '@playwright/test'
import EmploymentAndEducationPage from 'pages/strengthsAndNeedsV2/employmentAndEducationPage'
import { Option } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/employment-and-education/constants/option'
import { Step } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/employment-and-education/constants/step'
import { test, TargetService } from '../../../../support/fixtures'

test.describe('Validation', () => {
  test('validation employed option', async ({ page, createSession, baseURL }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })

    await EmploymentAndEducationPage.navigateTo(page, handoverLink, baseURL, sanAssessmentId)

    const employmentAndEducationPage = await EmploymentAndEducationPage.verifyOnPage(page, 'current employment status')

    const { questions } = employmentAndEducationPage

    await employmentAndEducationPage.saveAndContinue.click()
    await questions.community_employment_status.errorLink.click()
    await expect(questions.community_employment_status.input).toBeFocused()
  })

  test('validation has ever been employed option', async ({
    page,
    createSession,
    strengthsAndNeedsBuilder,
    baseURL,
  }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId).withAnswers([{ question: Question.community_employment_status, value: Option.currently_unavailable_for_work }]).save()

    await EmploymentAndEducationPage.navigateTo(page, handoverLink, baseURL, sanAssessmentId)

    const employmentAndEducationPage = await EmploymentAndEducationPage.verifyOnPage(page, 'current employment status')

    const { questions } = employmentAndEducationPage

    await employmentAndEducationPage.saveAndContinue.click()
    await EmploymentAndEducationPage.verifyOnPage(page, 'ever had a job?')
    await employmentAndEducationPage.saveAndContinue.click()

    await questions.community_ever_had_a_job.errorLink.click()
    await expect(questions.community_ever_had_a_job.input).toBeFocused()
  })

  test('validation employed questions', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId).withAnswers([{ question: Question.community_employment_status, value: Option.employed_or_self_employed }])
      .withUserSubmittedSteps([
        Step.employment_status.code,
        Step.employment_education_details.code,
        Step.employment_education_summary.code,
      ])
      .save()

    await EmploymentAndEducationPage.navigateTo(
      page,
      handoverLink,
      baseURL,
      sanAssessmentId,
      Step.employment_education_details.path,
    )

    const employmentAndEducationPage = await EmploymentAndEducationPage.verifyOnPage(page, 'employment history?')

    const { questions } = employmentAndEducationPage

    await employmentAndEducationPage.saveAndContinue.click()
    await expect(employmentAndEducationPage.alert).toMatchAriaSnapshot(`
      - alert:
        - heading "There is a problem" [level=2]
        - list:
          - listitem:
            - link "Select their employment history":
              - /url: "#employment_history"
          - listitem:
            - link "Select if they have any additional day-to-day commitments, or select 'None'":
              - /url: "#community_employment_other_responsibilities"
          - listitem:
            - link "Select if they have have any academic, professional or vocational qualifications":
              - /url: "#education_academic_professional_vocational_qualifications"
          - listitem:
            - link "Select if they have any skills that could help them in a job or to get a job":
              - /url: "#education_transferable_skills"
          - listitem:
            - link "Select if they have difficulties with reading, writing or numeracy, or select 'No difficulties'":
              - /url: "#education_difficulties"
    `)

    await questions.community_employment_history.errorLink.click()
    await expect(questions.community_employment_history.input).toBeFocused()
    await questions.community_employment_other_responsibilities.errorLink.click()
    await expect(questions.community_employment_other_responsibilities.input).toBeFocused()
    await questions.education_academic_professional_vocational_qualifications.errorLink.click()
    await expect(questions.education_academic_professional_vocational_qualifications.input).toBeFocused()
    await questions.education_transferable_skills.errorLink.click()
    await expect(questions.education_transferable_skills.input).toBeFocused()
    await questions.education_difficulties.errorLink.click()
    await expect(questions.education_difficulties.input).toBeFocused()
  })
})
