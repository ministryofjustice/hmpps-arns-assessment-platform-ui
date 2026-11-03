import { Option } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/employment-and-education/constants/option'
import { Question } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/employment-and-education/constants/question'
import { Step } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/employment-and-education/constants/step'
import { CommonOption } from '@server/forms/strengths-and-needs/versions/v2.0/constants/commonOption'
import { expect } from '@playwright/test'
import EmploymentAndEducationPage from '../../../../pages/strengthsAndNeedsV2/employmentAndEducationPage'
import { test, TargetService } from '../../../../support/fixtures'
import { details } from '../../../../testUtils'

test.describe('Summary', () => {
  test('shows summary page', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId).withAnswers([
        { question: Question.community_employment_status, value: Option.employed_or_self_employed },
        { question: Question.employment_history, value: Option.stable },
        { question: Question.employment_history_stable_details, value: details('Stable employment details') },
        {
          question: Question.community_employment_other_responsibilities,
          value: [Option.carer, Option.child, CommonOption.other],
        },
        {
          question: Question.employment_other_responsibilities_carer_details,
          value: details('Carer responsibilities details'),
        },
        {
          question: Question.employment_other_responsibilities_child_details,
          value: details('Child responsibilities details'),
        },
        {
          question: Question.employment_other_responsibilities_other_details,
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
          value: [Option.reading, Option.writing],
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
          question: Question.employment_education_changes,
          value: CommonOption.made_changes,
        },
        {
          question: Question.employment_education_changes_made_changes_details,
          value: details('Made changes details'),
        },
      ])
      .withUserSubmittedSteps([
        Step.employment_status.code,
        Step.employment_education_details.code,
        Step.education_difficulties.code,
        Step.employment_changes.code,
        Step.employment_education_summary.code,
      ])
      .save()

    await EmploymentAndEducationPage.navigateTo(
      page,
      handoverLink,
      baseURL,
      sanAssessmentId,
      Step.employment_education_summary.path,
    )

    const employmentAndEducationPage = await EmploymentAndEducationPage.verifyOnPage(page, 'Summary')

    await expect(employmentAndEducationPage.summary).toMatchAriaSnapshot(`
      - tabpanel "Summary":
        - term: What is Test's current employment status?
        - definition:
          - paragraph: Employed or Self-employed
        - definition:
          - link "Change What is Test's current employment status?":
            - /url: employment-status#community_employment_status-question
        - term: What is Test's employment history?
        - definition:
          - paragraph: Continuous employment history
          - paragraph: Stable employment details — free text answer.
        - definition:
          - link "Change What is Test's employment history?":
            - /url: employment-education-details#employment_history-question
        - term: Does Test have any additional day-to-day commitments?
        - definition:
          - paragraph: Caring responsibilities
          - paragraph: Child responsibilities
          - paragraph: Other
          - paragraph: Carer responsibilities details — free text answer.
          - paragraph: Child responsibilities details — free text answer.
          - paragraph: Other responsibilities details — free text answer.
        - definition:
          - link "Change Does Test have any additional day-to-day commitments?":
            - /url: employment-education-details#community_employment_other_responsibilities-question
        - term: Does Test have any academic, professional or vocational qualifications?
        - definition:
          - paragraph: "Yes"
        - definition:
          - link "Change Does Test have any academic, professional or vocational qualifications?":
            - /url: employment-education-details#education_academic_professional_vocational_qualifications-question
        - term: Does Test have any skills that could help them in a job or to get a job?
        - definition:
          - paragraph: "Yes"
          - paragraph: Transferable skills details — free text answer.
        - definition:
          - link "Change Does Test have any skills that could help them in a job or to get a job?":
            - /url: employment-education-details#education_transferable_skills-question
        - term: Does Test have difficulties with reading, writing or numeracy?
        - definition:
          - paragraph: Yes, with reading
          - paragraph: Yes, with writing
        - definition:
          - link "Change Does Test have difficulties with reading, writing or numeracy?":
            - /url: employment-education-details#education_difficulties-question
        - term: How much support does Test need with reading?
        - definition:
          - paragraph: Significant difficulties
        - definition:
          - link "Change How much support does Test need with reading?":
            - /url: education-difficulties#education_difficulties_reading_severity-question
        - term: How much support does Test need with writing?
        - definition:
          - paragraph: Some difficulties
        - definition:
          - link "Change How much support does Test need with writing?":
            - /url: education-difficulties#education_difficulties_writing_severity-question
        - term: Does Test want to make changes to their employment and education?
        - definition:
          - paragraph: I have already made positive changes and want to maintain them
          - paragraph: Made changes details — free text answer.
        - definition:
          - link "Change Does Test want to make changes to their employment and education?":
            - /url: employment-changes#employment_education_changes-question
        - button "Go to practitioner analysis"
      `)
  })

  test('practitioner analysis', async ({ baseURL, page, createSession, strengthsAndNeedsBuilder }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId).withAnswers([
        { question: Question.community_employment_status, value: Option.employed_or_self_employed },
        { question: Question.employment_history, value: Option.stable },
        { question: Question.employment_history_stable_details, value: details('Stable employment details') },
        {
          question: Question.community_employment_other_responsibilities,
          value: [Option.carer, Option.child, CommonOption.other],
        },
        {
          question: Question.employment_other_responsibilities_carer_details,
          value: details('Carer responsibilities details'),
        },
        {
          question: Question.employment_other_responsibilities_child_details,
          value: details('Child responsibilities details'),
        },
        {
          question: Question.employment_other_responsibilities_other_details,
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
          value: [Option.reading, Option.writing],
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
          question: Question.employment_education_changes,
          value: CommonOption.made_changes,
        },
        {
          question: Question.employment_education_changes_made_changes_details,
          value: details('Made changes details'),
        },
      ])
      .withUserSubmittedSteps([
        Step.employment_status.code,
        Step.employment_education_details.code,
        Step.education_difficulties.code,
        Step.employment_changes.code,
        Step.employment_education_summary.code,
      ])
      .save()

    await EmploymentAndEducationPage.navigateTo(
      page,
      handoverLink,
      baseURL,
      sanAssessmentId,
      Step.employment_education_summary.path,
    )
    const employmentAndEducationPage = await EmploymentAndEducationPage.verifyOnPage(page, 'Summary')

    await employmentAndEducationPage.goToPractitionerAnalysis.click()
    await expect(page.getByText('Are there any strengths or protective factors')).toBeVisible()
  })

  test('mark complete', async ({ baseURL, page, createSession, strengthsAndNeedsBuilder }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId).withAnswers([
        { question: Question.community_employment_status, value: Option.employed_or_self_employed },
        { question: Question.employment_history, value: Option.stable },
        { question: Question.employment_history_stable_details, value: details('Stable employment details') },
        {
          question: Question.community_employment_other_responsibilities,
          value: [Option.carer, Option.child, CommonOption.other],
        },
        {
          question: Question.employment_other_responsibilities_carer_details,
          value: details('Carer responsibilities details'),
        },
        {
          question: Question.employment_other_responsibilities_child_details,
          value: details('Child responsibilities details'),
        },
        {
          question: Question.employment_other_responsibilities_other_details,
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
          value: [Option.reading, Option.writing],
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
          question: Question.employment_education_changes,
          value: CommonOption.made_changes,
        },
        {
          question: Question.employment_education_changes_made_changes_details,
          value: details('Made changes details'),
        },
        {
          question: Question.employment_education_practitioner_analysis_strengths_or_protective_factors,
          value: CommonOption.no,
        },
        {
          question: Question.employment_education_practitioner_analysis_strengths_or_protective_factors_no_details,
          value: details('no education strengths'),
        },
        {
          question: Question.employment_education_practitioner_analysis_risk_of_serious_harm,
          value: CommonOption.yes,
        },
        {
          question: Question.employment_education_practitioner_analysis_risk_of_serious_harm_yes_details,
          value: details('employment serious harm'),
        },
        {
          question: Question.employment_education_practitioner_analysis_risk_of_reoffending,
          value: CommonOption.yes,
        },
        {
          question: Question.employment_education_practitioner_analysis_risk_of_reoffending_yes_details,
          value: details('education reoffending'),
        },
      ])
      .withUserSubmittedSteps([
        Step.employment_status.code,
        Step.employment_education_details.code,
        Step.education_difficulties.code,
        Step.employment_changes.code,
        Step.employment_education_summary.code,
      ])
      .save()

    await EmploymentAndEducationPage.navigateTo(
      page,
      handoverLink,
      baseURL,
      sanAssessmentId,
      `${Step.employment_education_summary.path}#practitioner-analysis`,
    )

    const employmentAndEducationPage = await EmploymentAndEducationPage.verifyOnPage(
      page,
      'strengths or protective factors',
    )

    await employmentAndEducationPage.questions.employment_education_practitioner_analysis_risk_of_reoffending.option(CommonOption.no)
      .click()
    await employmentAndEducationPage.markComplete.click()
    await expect(employmentAndEducationPage.complete).toBeVisible()
    expect(page.url()).toContain('employment-education-analysis')
  })
})
