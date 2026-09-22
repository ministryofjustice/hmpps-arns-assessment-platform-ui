import { Question } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/employment-and-education/constants/question'
import { expect } from '@playwright/test'
import EmploymentAndEducationPage from 'pages/strengthsAndNeeds/employmentAndEducationPage'
import { Option } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/employment-and-education/constants/option'
import { test, TargetService } from '../../../support/fixtures'

test.describe('Validation', () => {
  test('validation employed option', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId).withAnswers([{ question: Question.employment_status, value: Option.employed }]).save()

    await EmploymentAndEducationPage.navigateTo(page, handoverLink, baseURL, sanAssessmentId)

    const employmentAndEducationPage = await EmploymentAndEducationPage.verifyOnPage(page, 'current employment status')

    const { questions } = employmentAndEducationPage

    await employmentAndEducationPage.saveAndContinue.click()
    await questions.employment_type.errorLink.click()
    await expect(questions.employment_type.input).toBeFocused()
  })

  test('validation currently unavailable option', async ({
    page,
    createSession,
    strengthsAndNeedsBuilder,
    baseURL,
  }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId).withAnswers([{ question: Question.employment_status, value: Option.currently_unavailable_for_work }]).save()

    await EmploymentAndEducationPage.navigateTo(page, handoverLink, baseURL, sanAssessmentId)

    const employmentAndEducationPage = await EmploymentAndEducationPage.verifyOnPage(page, 'current employment status')

    await employmentAndEducationPage.saveAndContinue.click()
    await employmentAndEducationPage.hasBeenEmployed(Option.currently_unavailable_for_work).errorLink.click()
    await expect(employmentAndEducationPage.hasBeenEmployed(Option.currently_unavailable_for_work).input).toBeFocused()
  })

  test('validation unemployed - actively looking option', async ({
    page,
    createSession,
    strengthsAndNeedsBuilder,
    baseURL,
  }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId).withAnswers([{ question: Question.employment_status, value: Option.unemployed_looking_for_work }]).save()

    await EmploymentAndEducationPage.navigateTo(page, handoverLink, baseURL, sanAssessmentId)

    const employmentAndEducationPage = await EmploymentAndEducationPage.verifyOnPage(page, 'current employment status')

    await employmentAndEducationPage.saveAndContinue.click()
    await employmentAndEducationPage.hasBeenEmployed(Option.unemployed_looking_for_work).errorLink.click()
    await expect(employmentAndEducationPage.hasBeenEmployed(Option.unemployed_looking_for_work).input).toBeFocused()
  })

  test('validation unemployed - not actively looking option', async ({
    page,
    createSession,
    strengthsAndNeedsBuilder,
    baseURL,
  }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId).withAnswers([{ question: Question.employment_status, value: Option.unemployed_not_looking_for_work }]).save()

    await EmploymentAndEducationPage.navigateTo(page, handoverLink, baseURL, sanAssessmentId)

    const employmentAndEducationPage = await EmploymentAndEducationPage.verifyOnPage(page, 'current employment status')

    await employmentAndEducationPage.saveAndContinue.click()
    await employmentAndEducationPage.hasBeenEmployed(Option.unemployed_not_looking_for_work).errorLink.click()
    await expect(employmentAndEducationPage.hasBeenEmployed(Option.unemployed_not_looking_for_work).input).toBeFocused()
  })

  test('validation employed questions', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId).withAnswers([
        { question: Question.employment_status, value: Option.employed },
        { question: Question.employment_type, value: Option.full_time },
      ]).save()

    await EmploymentAndEducationPage.navigateTo(page, handoverLink, baseURL, sanAssessmentId, 'employed')

    const employmentAndEducationPage = await EmploymentAndEducationPage.verifyOnPage(page, 'job sector')

    const { questions } = employmentAndEducationPage

    await employmentAndEducationPage.saveAndContinue.click()
    await expect(employmentAndEducationPage.alert).toMatchAriaSnapshot(`
      - alert:
        - heading "There is a problem" [level=2]
        - list:
          - /children: equal
          - listitem:
            - link "Select their employment history":
              - /url: "#employment_history"
          - listitem:
            - link "Select if they have any additional day-to-day commitments, or select 'None'":
              - /url: "#employment_other_responsibilities"
          - listitem:
            - link "Select the highest level of academic qualification completed":
              - /url: "#education_highest_level_completed"
          - listitem:
            - link "Select if they have any professional or vocational qualifications":
              - /url: "#education_professional_or_vocational_qualifications"
          - listitem:
            - link "Select if they have any skills that could help them in a job or to get a job":
              - /url: "#education_transferable_skills"
          - listitem:
            - link "Select if they have difficulties with reading, writing or numeracy, or select 'No difficulties'":
              - /url: "#education_difficulties"
          - listitem:
            - link "Select their overall experience of employment":
              - /url: "#employment_experience"
          - listitem:
            - link "Select their experience of education":
              - /url: "#education_experience"
          - listitem:
            - link "Select if they want to make changes to their employment and education":
              - /url: "#employment_education_changes"
    `)

    await questions.employment_history.errorLink.click()
    await expect(questions.employment_history.input).toBeFocused()
    await questions.employment_other_responsibilities.errorLink.click()
    await expect(questions.employment_other_responsibilities.input).toBeFocused()
    await questions.education_highest_level_completed.errorLink.click()
    await expect(questions.education_highest_level_completed.input).toBeFocused()
    await questions.education_professional_or_vocational_qualifications.errorLink.click()
    await expect(questions.education_professional_or_vocational_qualifications.input).toBeFocused()
    await questions.education_transferable_skills.errorLink.click()
    await expect(questions.education_transferable_skills.input).toBeFocused()
    await questions.education_difficulties.errorLink.click()
    await expect(questions.education_difficulties.input).toBeFocused()
    await questions.employment_experience.errorLink.click()
    await expect(questions.employment_experience.input).toBeFocused()
    await questions.education_experience.errorLink.click()
    await expect(questions.education_experience.input).toBeFocused()
    await questions.employment_education_changes.errorLink.click()
    await expect(questions.employment_education_changes.input).toBeFocused()
  })
})
