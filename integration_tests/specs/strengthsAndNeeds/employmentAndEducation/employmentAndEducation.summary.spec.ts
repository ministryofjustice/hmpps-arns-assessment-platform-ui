import { expect } from '@playwright/test'
import EmploymentAndEducationPage from 'pages/strengthsAndNeeds/employmentAndEducationPage'
import { test, TargetService } from '../../../support/fixtures'

test.describe('Summary', () => {
  test('shows summary page', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId).withAnswers([
        { question: 'employment_status', value: 'UNEMPLOYED_NOT_LOOKING_FOR_WORK' },
        { question: 'has_been_employed', value: 'NO' },
        { question: 'employment_other_responsibilities', value: ['NONE'] },
        { question: 'education_highest_level_completed', value: 'NONE_OF_THESE' },
        { question: 'education_professional_or_vocational_qualifications', value: 'NO' },
        { question: 'education_transferable_skills', value: 'NO' },
        { question: 'education_difficulties', value: ['NONE'] },
        { question: 'education_experience', value: 'UNKNOWN' },
        { question: 'employment_education_changes', value: 'NOT_PRESENT' },
      ]).save()

    await EmploymentAndEducationPage.navigateToEmploymentAndEducation(
      page,
      handoverLink,
      baseURL,
      sanAssessmentId,
      'employment-education-summary',
    )

    const employmentAndEducationPage = await EmploymentAndEducationPage.verifyOnPage(page, 'Summary')

    await expect(employmentAndEducationPage.summary).toMatchAriaSnapshot(`
      - tabpanel "Summary":
        - term: What is Test's current employment status?
        - definition:
          - paragraph: Unemployed - not actively looking for work
        - definition:
          - link "Change What is Test's current employment status?":
            - /url: current-employment#employment_status-question
        - term: Does Test have any additional day-to-day commitments?
        - definition:
          - paragraph: None
        - definition:
          - link "Change Does Test have any additional day-to-day commitments?":
            - /url: employed#employment_other_responsibilities-question
        - term: Select the highest level of academic qualification Test has completed
        - definition:
          - paragraph: None of these
        - definition:
          - link "Change Select the highest level of academic qualification Test has completed":
            - /url: employed#education_highest_level_completed-question
        - term: Does Test have any professional or vocational qualifications?
        - definition:
          - paragraph: "No"
        - definition:
          - link "Change Does Test have any professional or vocational qualifications?":
            - /url: employed#education_professional_or_vocational_qualifications-question
        - term: Does Test have any skills that could help them in a job or to get a job?
        - definition:
          - paragraph: "No"
        - definition:
          - link "Change Does Test have any skills that could help them in a job or to get a job?":
            - /url: employed#education_transferable_skills-question
        - term: Does Test have difficulties with reading, writing or numeracy?
        - definition:
          - paragraph: No difficulties
        - definition:
          - link "Change Does Test have difficulties with reading, writing or numeracy?":
            - /url: employed#education_difficulties-question
        - term: What is Test's experience of education?
        - definition:
          - paragraph: Unknown
        - definition:
          - link "Change What is Test's experience of education?":
            - /url: employed#education_experience-question
        - term: Does Test want to make changes to their employment and education?
        - definition:
          - paragraph: Test is not present
        - definition:
          - link "Change Does Test want to make changes to their employment and education?":
            - /url: employed#employment_education_changes-question
        - button "Go to practitioner analysis"
    `)
  })

  test('practitioner analysis', async ({ baseURL, page, createSession, strengthsAndNeedsBuilder }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId).withAnswers([
        { question: 'employment_status', value: 'UNEMPLOYED_NOT_ACTIVELY_LOOKING' },
        { question: 'has_been_employed', value: 'NO_HAS_NEVER_BEEN_EMPLOYED' },
        { question: 'employment_other_responsibilities', value: ['NONE'] },
        { question: 'education_highest_level_completed', value: 'NON_OF_THESE' },
        { question: 'education_professional_or_vocational_qualifications', value: 'NO' },
        { question: 'education_transferable_skills', value: 'NO' },
        { question: 'education_difficulties', value: ['NO_DIFFICULTIES'] },
        { question: 'education_experience', value: 'UNKNOWN' },
        { question: 'employment_education_changes', value: 'NOT_PRESENT' },
      ]).save()

    await EmploymentAndEducationPage.navigateToEmploymentAndEducation(
      page,
      handoverLink,
      baseURL,
      sanAssessmentId,
      'employment-education-summary',
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
        { question: 'employment_status', value: 'UNEMPLOYED_NOT_ACTIVELY_LOOKING' },
        { question: 'employment_history', value: 'NO_HAS_NEVER_BEEN_EMPLOYED' },
        { question: 'employment_other_responsibilities', value: ['NONE'] },
        { question: 'education_highest_level_completed', value: 'NON_OF_THESE' },
        { question: 'education_professional_or_vocational_qualifications', value: 'NO' },
        { question: 'education_transferable_skills', value: 'NO' },
        { question: 'education_difficulties', value: ['NO_DIFFICULTIES'] },
        { question: 'education_experience', value: 'UNKNOWN' },
        { question: 'employment_education_changes', value: 'NOT_PRESENT' },
        { question: 'employment_education_practitioner_analysis_strengths_or_protective_factors', value: 'NO' },
        {
          question: 'employment_education_practitioner_analysis_strengths_or_protective_factors_no_details',
          value: '',
        },
        { question: 'employment_education_practitioner_analysis_risk_of_serious_harm', value: 'NO' },
        { question: 'employment_education_practitioner_analysis_risk_of_serious_harm_no_details', value: '' },
      ]).save()

    await EmploymentAndEducationPage.navigateToEmploymentAndEducation(
      page,
      handoverLink,
      baseURL,
      sanAssessmentId,
      'employment-education-summary#practitioner-analysis',
    )

    const employmentAndEducationPage = await EmploymentAndEducationPage.verifyOnPage(
      page,
      'strengths or protective factors',
    )

    await employmentAndEducationPage.linkedToRiskOfReoffending.click()
    await employmentAndEducationPage.markComplete.click()
    await expect(employmentAndEducationPage.complete).toBeVisible()
    expect(page.url()).toContain('employment-education-analysis')
  })
})
