import { CommonOption } from '@server/forms/strengths-and-needs/versions/v2.0/constants/commonOption'
import { Question } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/employment-and-education/constants/question'
import { expect } from '@playwright/test'

import { Option } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/employment-and-education/constants/option'
import { Step } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/employment-and-education/constants/step'
import { test, TargetService } from '../../../support/fixtures'
import { buildPageTitle, sanPageTitles } from '../sanUtils'
import EmploymentAndEducationPage from '../../../pages/strengthsAndNeedsV2/employmentAndEducationPage'
import { details } from '../../../testUtils'

test.describe('Questions', () => {
  test('shows current employment status', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder.fresh().save()

    await EmploymentAndEducationPage.navigateTo(page, handoverLink, baseURL, sanAssessmentId)

    const employmentAndEducationPage = await EmploymentAndEducationPage.verifyOnPage(page, 'current employment status')

    await expect(page).toHaveTitle(buildPageTitle(sanPageTitles.employmentAndEducation))

    await expect(employmentAndEducationPage.mainForm).toMatchAriaSnapshot(`
        - group "What is Test's current employment status?":
          - text: What is Test's current employment status?
          - radio "Employed or Self-employed"
          - text: Employed or Self-employed
          - radio "Retired"
          - text: Retired
          - radio "Currently unavailable for work"
          - text: Currently unavailable for work
          - radio "Unemployed"
          - text: Unemployed
        - button "Save and continue"
    `)
  })

  test('shows employed or self employed questions', async ({
    page,
    createSession,
    strengthsAndNeedsBuilder,
    baseURL,
  }) => {
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

    await expect(employmentAndEducationPage.mainForm).toMatchAriaSnapshot(`
      - group "What is Test's employment history?"
      - group "Does Test have any additional day-to-day commitments?"
      - group "Does Test have any academic, professional or vocational qualifications?"
      - group "Does Test have any skills that could help them in a job or to get a job?"
      - group "Does Test have difficulties with reading, writing or numeracy?"
      - button "Save and continue"
    `)
  })

  test('shows retired questions, no skills question', async ({
    page,
    createSession,
    strengthsAndNeedsBuilder,
    baseURL,
  }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId)
      .withAnswers([{ question: Question.community_employment_status, value: Option.retired }])
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

    await expect(employmentAndEducationPage.mainForm).toMatchAriaSnapshot(`
      - group "What is Test's employment history?"
      - group "Does Test have any additional day-to-day commitments?"
      - group "Does Test have any academic, professional or vocational qualifications?"
      - group "Does Test have difficulties with reading, writing or numeracy?"
      - button "Save and continue"
    `)
  })

  test('shows has ever had a job question', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId)
      .withAnswers([{ question: Question.community_employment_status, value: Option.currently_unavailable_for_work }])
      .withUserSubmittedSteps([Step.employment_status.code])
      .save()

    await EmploymentAndEducationPage.navigateTo(
      page,
      handoverLink,
      baseURL,
      sanAssessmentId,
      Step.community_ever_had_a_job.path,
    )

    const employmentAndEducationPage = await EmploymentAndEducationPage.verifyOnPage(page, 'ever had a job?')

    await expect(page).toHaveTitle(buildPageTitle(sanPageTitles.employmentAndEducation))

    await expect(employmentAndEducationPage.mainForm).toMatchAriaSnapshot(`
        - group "Has Test ever had a job?":
          - text: Has Test ever had a job?
          - radio "Yes"
          - text: "Yes"
          - radio "No"
          - text: "No"
        - button "Save and continue"
    `)
  })

  test('shows currently unavailable for work - has been employed questions', async ({
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
        { question: Question.community_employment_status, value: Option.currently_unavailable_for_work },
        { question: Question.community_ever_had_a_job, value: CommonOption.yes },
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

    const employmentAndEducationPage = await EmploymentAndEducationPage.verifyOnPage(page, 'employment history?')

    await expect(employmentAndEducationPage.mainForm).toMatchAriaSnapshot(`
      - group "What is Test's employment history?"
      - group "Does Test have any additional day-to-day commitments?"
      - group "Does Test have any academic, professional or vocational qualifications?"
      - group "Does Test have any skills that could help them in a job or to get a job?"
      - group "Does Test have difficulties with reading, writing or numeracy?"
      - button "Save and continue"
    `)
  })

  test('shows currently unavailable for work - never been employed questions', async ({
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
        { question: Question.community_employment_status, value: Option.currently_unavailable_for_work },
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

    const employmentAndEducationPage = await EmploymentAndEducationPage.verifyOnPage(page, 'day-to-day commitments')

    await expect(employmentAndEducationPage.mainForm).toMatchAriaSnapshot(`
      - group "Does Test have any additional day-to-day commitments?"
      - group "Does Test have any academic, professional or vocational qualifications?"
      - group "Does Test have any skills that could help them in a job or to get a job?"
      - group "Does Test have difficulties with reading, writing or numeracy?"
      - button "Save and continue"
    `)
  })

  test('shows currently unemployed - has been employed questions', async ({
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
        { question: Question.community_ever_had_a_job, value: CommonOption.yes },
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

    const employmentAndEducationPage = await EmploymentAndEducationPage.verifyOnPage(page, 'employment history?')

    await expect(employmentAndEducationPage.mainForm).toMatchAriaSnapshot(`
      - group "What is Test's employment history?"
      - group "Does Test have any additional day-to-day commitments?"
      - group "Does Test have any academic, professional or vocational qualifications?"
      - group "Does Test have any skills that could help them in a job or to get a job?"
      - group "Does Test have difficulties with reading, writing or numeracy?"
      - button "Save and continue"
    `)
  })

  test('shows currently unemployed - never been employed questions', async ({
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

    const employmentAndEducationPage = await EmploymentAndEducationPage.verifyOnPage(page, 'day-to-day commitments')

    await expect(employmentAndEducationPage.mainForm).toMatchAriaSnapshot(`
      - group "Does Test have any additional day-to-day commitments?"
      - group "Does Test have any academic, professional or vocational qualifications?"
      - group "Does Test have any skills that could help them in a job or to get a job?"
      - group "Does Test have difficulties with reading, writing or numeracy?"
      - button "Save and continue"
    `)
  })

  test('shows education difficulties questions', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
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
        {
          question: Question.education_difficulties_reading_severity,
          value: Option.significant_difficulties,
        },
        {
          question: Question.education_difficulties_writing_severity,
          value: Option.some_difficulties,
        },
        {
          question: Question.education_difficulties_numeracy_severity,
          value: Option.some_difficulties,
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

    await expect(employmentAndEducationPage.mainForm).toMatchAriaSnapshot(`
      - group "How much support does Test need with reading?":
        - text: How much support does Test need with reading?
        - radio "Significant difficulties" [checked]
        - text: Significant difficulties
        - radio "Some difficulties"
        - text: Some difficulties
      - group "How much support does Test need with writing?":
        - text: How much support does Test need with writing?
        - radio "Significant difficulties"
        - text: Significant difficulties
        - radio "Some difficulties" [checked]
        - text: Some difficulties
      - group "How much support does Test need with numeracy?":
        - text: How much support does Test need with numeracy?
        - radio "Significant difficulties"
        - text: Significant difficulties
        - radio "Some difficulties" [checked]
        - text: Some difficulties
      - button "Save and continue"
    `)
  })

  test('shows changes questions', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
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

    await expect(employmentAndEducationPage.mainForm).toMatchAriaSnapshot(`
      - group "Does Test want to make changes to their employment and education?":
        - text: Does Test want to make changes to their employment and education? Test must answer this question.
        - radio "I have already made positive changes and want to maintain them"
        - text: I have already made positive changes and want to maintain them
        - radio "I am actively making changes"
        - text: I am actively making changes
        - radio "I want to make changes and know how to"
        - text: I want to make changes and know how to
        - radio "I want to make changes but need help"
        - text: I want to make changes but need help
        - radio "I am thinking about making changes"
        - text: I am thinking about making changes
        - radio "I do not want to make changes"
        - text: I do not want to make changes
        - radio "I do not want to answer"
        - text: I do not want to answer or
        - radio "Test is not present"
        - text: Test is not present
        - radio "Not applicable"
        - text: Not applicable
      - button "Save and continue"
    `)
  })
})
