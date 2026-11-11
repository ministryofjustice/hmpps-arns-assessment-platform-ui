import { Question } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/employment-and-education/constants/question'
import { expect } from '@playwright/test'
import EmploymentAndEducationPage from 'pages/strengthsAndNeedsV2/employmentAndEducationPage'
import { Option } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/employment-and-education/constants/option'
import { Step } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/employment-and-education/constants/step'
import { CommonOption } from '@server/forms/strengths-and-needs/versions/v2.0/constants/commonOption'
import { test, TargetService } from '../../../../support/fixtures'
import { details } from '../../../../testUtils'

test.describe('Validation', () => {
  test('validation employed option', async ({ page, createSession, baseURL }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })

    await EmploymentAndEducationPage.navigateTo(page, handoverLink, baseURL, sanAssessmentId)

    const employmentAndEducationPage = await EmploymentAndEducationPage.verifyOnPage(page, 'current employment status')

    const { questions } = employmentAndEducationPage

    await employmentAndEducationPage.saveAndContinue.click()

    await expect(employmentAndEducationPage.alert).toMatchAriaSnapshot(`
      - alert:
        - heading "There is a problem" [level=2]
        - list:
          - listitem:
            - link "Select their employment status":
              - /url: "#community_employment_status"
    `)

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
      .extend(sanAssessmentId).withAnswers([{ question: Question.community_employment_status, value: Option.currently_unavailable_for_work }])
      .withUserSubmittedSteps([Step.employment_status.code, Step.employment_education_details.code])
      .save()

    await EmploymentAndEducationPage.navigateTo(
      page,
      handoverLink,
      baseURL,
      sanAssessmentId,
      Step.community_ever_had_a_job.path,
    )

    const employmentAndEducationPage = await EmploymentAndEducationPage.verifyOnPage(page, 'ever had a job?')
    const { questions } = employmentAndEducationPage

    await employmentAndEducationPage.saveAndContinue.click()
    await expect(employmentAndEducationPage.alert).toMatchAriaSnapshot(`
      - alert:
        - heading "There is a problem" [level=2]
        - list:
          - listitem:
            - link "Select if they have ever had a job":
              - /url: "#community_ever_had_a_job"
    `)

    await questions.community_ever_had_a_job.errorLink.click()
    await expect(questions.community_ever_had_a_job.input).toBeFocused()
  })

  test('validation employed questions', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId).withAnswers([{ question: Question.community_employment_status, value: Option.employed_or_self_employed }])
      .withUserSubmittedSteps([Step.employment_status.code])
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
              - /url: "#community_employment_history"
          - listitem:
            - link "Select if they have any additional day-to-day commitments, or select 'No additional day-to-day commitments'":
              - /url: "#community_employment_other_responsibilities"
          - listitem:
            - link "Select if they have any completed academic, professional or vocational qualifications":
              - /url: "#education_academic_professional_vocational_qualifications"
          - listitem:
            - link "Select how you would describe their skills for work":
              - /url: "#education_transferable_skills"
          - listitem:
            - link "Select if they need support with reading, writing or numeracy, or select 'No support needed with reading, writing or numeracy'":
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

  test('validation retired questions', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId).withAnswers([{ question: Question.community_employment_status, value: Option.retired }])
      .withUserSubmittedSteps([Step.employment_status.code, Step.employment_education_details.code])
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
              - /url: "#community_employment_history"
          - listitem:
            - link "Select if they have any additional day-to-day commitments, or select 'No additional day-to-day commitments'":
              - /url: "#community_employment_other_responsibilities"
          - listitem:
            - link "Select if they have any completed academic, professional or vocational qualifications":
              - /url: "#education_academic_professional_vocational_qualifications"
          - listitem:
            - link "Select if they need support with reading, writing or numeracy, or select 'No support needed with reading, writing or numeracy'":
              - /url: "#education_difficulties"
    `)

    await questions.community_employment_history.errorLink.click()
    await expect(questions.community_employment_history.input).toBeFocused()
    await questions.community_employment_other_responsibilities.errorLink.click()
    await expect(questions.community_employment_other_responsibilities.input).toBeFocused()
    await questions.education_academic_professional_vocational_qualifications.errorLink.click()
    await expect(questions.education_academic_professional_vocational_qualifications.input).toBeFocused()
    await questions.education_difficulties.errorLink.click()
    await expect(questions.education_difficulties.input).toBeFocused()
  })

  test('validation unemployed and never employed questions', async ({
    page,
    createSession,
    strengthsAndNeedsBuilder,
    baseURL,
  }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId).withAnswers([
        { question: Question.community_employment_status, value: Option.unemployed },
        { question: Question.community_ever_had_a_job, value: CommonOption.no },
      ])
      .withUserSubmittedSteps([Step.employment_status.code, Step.community_ever_had_a_job.code])
      .save()

    await EmploymentAndEducationPage.navigateTo(
      page,
      handoverLink,
      baseURL,
      sanAssessmentId,
      Step.employment_education_details.path,
    )

    const employmentAndEducationPage = await EmploymentAndEducationPage.verifyOnPage(
      page,
      'any additional day-to-day commitments',
    )

    const { questions } = employmentAndEducationPage

    await employmentAndEducationPage.saveAndContinue.click()
    await expect(employmentAndEducationPage.alert).toMatchAriaSnapshot(`
      - alert:
        - heading "There is a problem" [level=2]
        - list:
          - listitem:
            - link "Select if they have any additional day-to-day commitments, or select 'No additional day-to-day commitments'":
              - /url: "#community_employment_other_responsibilities"
          - listitem:
            - link "Select if they have any completed academic, professional or vocational qualifications":
              - /url: "#education_academic_professional_vocational_qualifications"
          - listitem:
            - link "Select how you would describe their skills for work":
              - /url: "#education_transferable_skills"
          - listitem:
            - link "Select if they need support with reading, writing or numeracy, or select 'No support needed with reading, writing or numeracy'":
              - /url: "#education_difficulties"
    `)

    await questions.community_employment_other_responsibilities.errorLink.click()
    await expect(questions.community_employment_other_responsibilities.input).toBeFocused()
    await questions.education_academic_professional_vocational_qualifications.errorLink.click()
    await expect(questions.education_academic_professional_vocational_qualifications.input).toBeFocused()
    await questions.education_transferable_skills.errorLink.click()
    await expect(questions.education_transferable_skills.input).toBeFocused()
    await questions.education_difficulties.errorLink.click()
    await expect(questions.education_difficulties.input).toBeFocused()
  })

  test('validation education difficulties questions', async ({
    page,
    createSession,
    strengthsAndNeedsBuilder,
    baseURL,
  }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId).withAnswers([
        { question: Question.community_employment_status, value: Option.employed_or_self_employed },
        { question: Question.community_employment_history, value: Option.stable },
        { question: Question.community_employment_history_stable_details, value: details('Stable employment details') },
        {
          question: Question.community_employment_other_responsibilities,
          value: [Option.carer, Option.child, CommonOption.other],
        },
        {
          question: Question.community_employment_other_responsibilities_carer_details,
          value: details('Carer responsibilities details'),
        },
        {
          question: Question.community_employment_other_responsibilities_child_details,
          value: details('Child responsibilities details'),
        },
        {
          question: Question.community_employment_other_responsibilities_other_details,
          value: details('Other responsibilities details'),
        },
        { question: Question.education_academic_professional_vocational_qualifications, value: CommonOption.yes },
        { question: Question.education_transferable_skills, value: CommonOption.yes },
        {
          question: Question.education_transferable_skills_yes_details,
          value: details('Transferable skills details'),
        },
        {
          question: Question.education_difficulties,
          value: [Option.reading, Option.writing, Option.numeracy],
        },
      ])
      .withUserSubmittedSteps([Step.employment_status.code, Step.employment_education_details.code])
      .save()

    await EmploymentAndEducationPage.navigateTo(
      page,
      handoverLink,
      baseURL,
      sanAssessmentId,
      Step.education_difficulties.path,
    )

    const employmentAndEducationPage = await EmploymentAndEducationPage.verifyOnPage(page, 'How much support does')

    const { questions } = employmentAndEducationPage

    await employmentAndEducationPage.saveAndContinue.click()

    await expect(employmentAndEducationPage.alert).toMatchAriaSnapshot(`
      - alert:
        - heading "There is a problem" [level=2]
        - list:
          - listitem:
            - link "Select level of support needed":
              - /url: "#education_difficulties_reading_severity"
          - listitem:
            - link "Select level of support needed":
              - /url: "#education_difficulties_writing_severity"
          - listitem:
            - link "Select level of support needed":
              - /url: "#education_difficulties_numeracy_severity"
    `)

    await questions.education_difficulties_reading_severity.errorLink.click()
    await expect(questions.education_difficulties_reading_severity.input).toBeFocused()
    await questions.education_difficulties_writing_severity.errorLink.click()
    await expect(questions.education_difficulties_writing_severity.input).toBeFocused()
    await questions.education_difficulties_numeracy_severity.errorLink.click()
    await expect(questions.education_difficulties_numeracy_severity.input).toBeFocused()
  })

  test('validation changes questions', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId).withAnswers([
        { question: Question.community_employment_status, value: Option.employed_or_self_employed },
        { question: Question.community_employment_history, value: Option.stable },
        { question: Question.community_employment_history_stable_details, value: details('Stable employment details') },
        {
          question: Question.community_employment_other_responsibilities,
          value: [Option.carer, Option.child, CommonOption.other],
        },
        {
          question: Question.community_employment_other_responsibilities_carer_details,
          value: details('Carer responsibilities details'),
        },
        {
          question: Question.community_employment_other_responsibilities_child_details,
          value: details('Child responsibilities details'),
        },
        {
          question: Question.community_employment_other_responsibilities_other_details,
          value: details('Other responsibilities details'),
        },
        { question: Question.education_academic_professional_vocational_qualifications, value: CommonOption.yes },
        { question: Question.education_transferable_skills, value: CommonOption.yes },
        {
          question: Question.education_transferable_skills_yes_details,
          value: details('Transferable skills details'),
        },
        {
          question: Question.education_difficulties,
          value: [CommonOption.none],
        },
      ])
      .withUserSubmittedSteps([Step.employment_status.code, Step.employment_education_details.code])
      .save()

    await EmploymentAndEducationPage.navigateTo(
      page,
      handoverLink,
      baseURL,
      sanAssessmentId,
      Step.employment_changes.path,
    )

    const employmentAndEducationPage = await EmploymentAndEducationPage.verifyOnPage(
      page,
      'their employment and education?',
    )

    const { questions } = employmentAndEducationPage

    await employmentAndEducationPage.saveAndContinue.click()
    await expect(employmentAndEducationPage.alert).toMatchAriaSnapshot(`
      - alert:
        - heading "There is a problem" [level=2]
        - list:
          - listitem:
            - link "Select if they want to make changes to their employment and education":
              - /url: "#employment_education_changes"
    `)

    await questions.employment_education_changes.errorLink.click()
    await expect(questions.employment_education_changes.input).toBeFocused()
  })
})
