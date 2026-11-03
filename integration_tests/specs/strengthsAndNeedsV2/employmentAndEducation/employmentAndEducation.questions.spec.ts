import { CommonOption } from '@server/forms/strengths-and-needs/versions/v2.0/constants/commonOption'
import { Question } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/employment-and-education/constants/question'
import { expect } from '@playwright/test'

import { Option } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/employment-and-education/constants/option'
import { Step } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/employment-and-education/constants/step'
import { test, TargetService } from '../../../support/fixtures'
import { buildPageTitle, sanPageTitles } from '../sanUtils'
import EmploymentAndEducationPage from '../../../pages/strengthsAndNeedsV2/employmentAndEducationPage'

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
        - group /current employment status?/
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
      .extend(sanAssessmentId).withAnswers([
        { question: Question.community_employment_status, value: Option.employed_or_self_employed },
      ])
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

  test('shows retired questions', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
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

    await employmentAndEducationPage.saveAndContinue.click()

    await EmploymentAndEducationPage.verifyOnPage(page, 'employment history?')

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
        { question: Question.community_ever_had_a_job, value: CommonOption.yes },
      ])
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

    await employmentAndEducationPage.saveAndContinue.click()

    await EmploymentAndEducationPage.verifyOnPage(page, 'employment history?')

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

    await employmentAndEducationPage.saveAndContinue.click()

    await EmploymentAndEducationPage.verifyOnPage(page, 'employment history?')

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
        { question: Question.community_ever_had_a_job, value: CommonOption.yes },
      ])
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

    await employmentAndEducationPage.saveAndContinue.click()

    await EmploymentAndEducationPage.verifyOnPage(page, 'employment history?')

    await expect(employmentAndEducationPage.mainForm).toMatchAriaSnapshot(`
      - group "Does Test have any additional day-to-day commitments?"
      - group "Does Test have any academic, professional or vocational qualifications?"
      - group "Does Test have any skills that could help them in a job or to get a job?"
      - group "Does Test have difficulties with reading, writing or numeracy?"
      - button "Save and continue"
    `)
  })
})
