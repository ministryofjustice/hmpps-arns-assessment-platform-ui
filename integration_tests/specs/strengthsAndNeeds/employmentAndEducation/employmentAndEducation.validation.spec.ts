import { expect } from '@playwright/test'
import EmploymentAndEducationPage from 'pages/strengthsAndNeeds/employmentAndEducationPage'
import { test, TargetService } from '../../../support/fixtures'

test.describe('Validation', () => {
  test('validation employed option', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId).withAnswers([{ question: 'employment_status', value: 'EMPLOYED' }]).save()

    await EmploymentAndEducationPage.navigateToEmploymentAndEducation(page, handoverLink, baseURL, sanAssessmentId)

    const employmentAndEducationPage = await EmploymentAndEducationPage.verifyOnPage(page, 'current employment status')

    await employmentAndEducationPage.saveAndContinue.click()
    await employmentAndEducationPage.selectTypeOfEmployment.click()

    await expect(employmentAndEducationPage.fullTime).toBeFocused()
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
      .extend(sanAssessmentId).withAnswers([{ question: 'employment_status', value: 'CURRENTLY_UNAVAILABLE_FOR_WORK' }]).save()

    await EmploymentAndEducationPage.navigateToEmploymentAndEducation(page, handoverLink, baseURL, sanAssessmentId)

    const employmentAndEducationPage = await EmploymentAndEducationPage.verifyOnPage(page, 'current employment status')

    await employmentAndEducationPage.saveAndContinue.click()
    await employmentAndEducationPage.selectOneOption.click()

    await expect(employmentAndEducationPage.yesHasBeenEmployedBefore).toBeFocused()
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
      .extend(sanAssessmentId).withAnswers([{ question: 'employment_status', value: 'UNEMPLOYED_LOOKING_FOR_WORK' }]).save()

    await EmploymentAndEducationPage.navigateToEmploymentAndEducation(page, handoverLink, baseURL, sanAssessmentId)

    const employmentAndEducationPage = await EmploymentAndEducationPage.verifyOnPage(page, 'current employment status')

    await employmentAndEducationPage.saveAndContinue.click()
    await employmentAndEducationPage.selectOneOption.click()

    await expect(employmentAndEducationPage.yesHasBeenEmployedBefore).toBeFocused()
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
      .extend(sanAssessmentId).withAnswers([{ question: 'employment_status', value: 'UNEMPLOYED_NOT_LOOKING_FOR_WORK' }]).save()

    await EmploymentAndEducationPage.navigateToEmploymentAndEducation(page, handoverLink, baseURL, sanAssessmentId)

    const employmentAndEducationPage = await EmploymentAndEducationPage.verifyOnPage(page, 'current employment status')

    await employmentAndEducationPage.saveAndContinue.click()
    await employmentAndEducationPage.selectOneOption.click()

    await expect(employmentAndEducationPage.yesHasBeenEmployedBefore).toBeFocused()
  })

  test('validation employed questions', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId).withAnswers([
        { question: 'employment_status', value: 'EMPLOYED' },
        { question: 'employment_type', value: 'FULL_TIME' },
      ]).save()

    await EmploymentAndEducationPage.navigateToEmploymentAndEducation(
      page,
      handoverLink,
      baseURL,
      sanAssessmentId,
      'employed',
    )

    const employmentAndEducationPage = await EmploymentAndEducationPage.verifyOnPage(page, 'job sector')

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

    await employmentAndEducationPage.selectTheirEmploymentHistory.click()
    await expect(employmentAndEducationPage.continuousEmploymentHistory).toBeFocused()
    await employmentAndEducationPage.selectAdditionalDayToDay.click()
    await expect(employmentAndEducationPage.caringResponsibilities).toBeFocused()
    await employmentAndEducationPage.selectTheHighestLevel.click()
    await expect(employmentAndEducationPage.entryLevel).toBeFocused()
    await employmentAndEducationPage.selectIfTheyHaveAnyProfessional.click()
    await expect(employmentAndEducationPage.haveAnyProfessional).toBeFocused()
    await employmentAndEducationPage.selectIfTheyHaveAnySkills.click()
    await expect(employmentAndEducationPage.yesHasSkills).toBeFocused()
    await employmentAndEducationPage.selectIfTheyHaveDifficulties.click()
    await expect(employmentAndEducationPage.yesWithReading).toBeFocused()
    await employmentAndEducationPage.selectTheirOverall.click()
    await expect(employmentAndEducationPage.positiveOverall).toBeFocused()
    await employmentAndEducationPage.selectTheirExperienceOf.click()
    await expect(employmentAndEducationPage.positiveExperienceOf).toBeFocused()
    await employmentAndEducationPage.errorWantsToMakeChanges.click()
    await expect(employmentAndEducationPage.yesAlreadyMadePositiveChanges).toBeFocused()
  })
})
