import { expect } from '@playwright/test'
import EmploymentAndEducationPage from 'pages/strengthsAndNeeds/employmentAndEducationPage'
import { test, TargetService } from '../../support/fixtures'
import { buildPageTitle, checkAccessibility, sanPageTitles } from './sanUtils'

test.describe('Employment and education Page', () => {
  test.describe('Questions', () => {
    test('shows current employment status', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
      const { handoverLink } = await createSession({ targetService: TargetService.STRENGTHS_AND_NEEDS })
      await strengthsAndNeedsBuilder.fresh().save()

      await EmploymentAndEducationPage.navigateToEmploymentAndEducation(page, handoverLink, baseURL)

      const employmentAndEducationPage = await EmploymentAndEducationPage.verifyOnPage(
        page,
        'current employment status',
      )

      await expect(page).toHaveTitle(buildPageTitle(sanPageTitles.employmentAndEducation))

      await expect(employmentAndEducationPage.currentEmploymentStatus).toMatchAriaSnapshot(`
          - group /current employment status?/:
            - text: /current employment status?/
            - radio "Employed"
            - text: Employed
            - radio "Self-employed"
            - text: Self-employed
            - radio "Retired"
            - text: Retired
            - radio "Currently unavailable for work"
            - text: Currently unavailable for work
            - radio "Unemployed - actively looking for work"
            - text: Unemployed - actively looking for work
            - radio "Unemployed - not actively looking for work"
            - text: Unemployed - not actively looking for work
          - button "Save and continue"
      `)
    })

    test('shows employed questions', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
      const { handoverLink, sanAssessmentId } = await createSession({
        targetService: TargetService.STRENGTHS_AND_NEEDS,
      })
      await strengthsAndNeedsBuilder
        .extend(sanAssessmentId).withAnswers([
          { question: 'current_employment_status', value: 'EMPLOYED' },
          { question: 'type_of_employment', value: 'FULL_TIME' },
        ]).save()

      await EmploymentAndEducationPage.navigateToEmploymentAndEducation(page, handoverLink, baseURL, 'employed')

      expect(page.url()).toContain(sanPageTitles.employmentAndEducation.toLowerCase())
      const employmentAndEducationPage = await EmploymentAndEducationPage.verifyOnPage(page, 'job sector')

      await expect(employmentAndEducationPage.mainSection).toMatchAriaSnapshot(`
        - text: What job sector does Test work in? (optional)
        - textbox "What job sector does Test work in? (optional)"
        - text: You can enter up to 2000 characters You have 2,000 characters remaining
        - group "What is Test's employment history?":
          - text: What is Test's employment history? Include their current employment.
          - radio "Continuous employment history"
          - text: Continuous employment history They may have had a break in employment due to things like redundancy, illness or caring for a family member.
          - radio "Generally in employment but changes jobs often"
          - text: Generally in employment but changes jobs often
          - radio "Unstable employment history with regular periods of unemployment"
          - text: Unstable employment history with regular periods of unemployment
          - radio "Unknown"
          - text: Unknown
        - group "Does Test have any day-to-day commitments?":
          - text: Does Test have any day-to-day commitments? Select all that apply.
          - checkbox "Caring responsibilities"
          - text: Caring responsibilities
          - checkbox "Child responsibilities"
          - text: Child responsibilities
          - checkbox "Studying"
          - text: Studying
          - checkbox "Volunteering"
          - text: Volunteering
          - checkbox "Other"
          - text: Other
          - checkbox "Unknown"
          - text: Unknown or
          - checkbox "None"
          - text: None
        - group "Select the highest level of academic qualification Test has completed":
          - text: Select the highest level of academic qualification Test has completed
          - radio "Entry level"
          - text: Entry level For example, entry level diploma
          - radio "Level 1"
          - text: Level 1 For example, GCSE grades 3, 2, 1 or grades D, E, F, G
          - radio "Level 2"
          - text: Level 2 For example, GCSE grades 9, 8, 7, 6, 5, 4 or grades A*, A, B, C
          - radio "Level 3"
          - text: Level 3 For example, A level
          - radio "Level 4"
          - text: Level 4 For example, higher apprenticeship
          - radio "Level 5"
          - text: Level 5 For example, foundation degree
          - radio "Level 6"
          - text: Level 6 For example, degree with honours
          - radio "Level 7"
          - text: Level 7 For example, master's degree
          - radio "Level 8"
          - text: Level 8 For example, doctorate or
          - radio "None of these"
          - text: None of these
          - radio "Unknown"
          - text: Unknown
        - group "Does Test have any professional or vocational qualifications?":
          - text: Does Test have any professional or vocational qualifications?
          - radio "Yes"
          - text: "Yes"
          - radio "No"
          - text: No or
          - radio "Unknown"
          - text: Unknown
        - group "Does Test's have any skills that could help them in a job or to get a job?":
          - text: Does Test's have any skills that could help them in a job or to get a job?
          - radio "Yes"
          - text: Yes This includes any completed training, qualifications, work experience or transferable skills.
          - radio "Some skills"
          - text: Some skills This includes partially completed training or qualifications, limited on the job experience or skills that are not directly transferable.
          - radio "No"
          - text: No This includes having no other qualifications, incomplete apprenticeships or no history of working in the same industry.
        - group "Does Test have difficulties with reading, writing or numeracy?":
          - text: Does Test have difficulties with reading, writing or numeracy? Select all that apply.
          - checkbox "Yes, with reading"
          - text: Yes, with reading
          - checkbox "Yes, with writing"
          - text: Yes, with writing
          - checkbox "Yes, with numeracy"
          - text: Yes, with numeracy or
          - checkbox "No difficulties"
          - text: No difficulties
        - group "What is Test's overall experience of employment?":
          - text: What is Test's overall experience of employment?
          - radio "Positive"
          - text: Positive
          - radio "Mostly positive"
          - text: Mostly positive
          - radio "Positive and negative"
          - text: Positive and negative
          - radio "Mostly negative"
          - text: Mostly negative
          - radio "Negative"
          - text: Negative
          - radio "Unknown"
          - text: Unknown
        - group "What is Test's experience of education?":
          - text: What is Test's experience of education?
          - radio "Positive"
          - text: Positive
          - radio "Mostly positive"
          - text: Mostly positive
          - radio "Positive and negative"
          - text: Positive and negative
          - radio "Mostly negative"
          - text: Mostly negative
          - radio "Negative"
          - text: Negative
          - radio "Unknown"
          - text: Unknown
        - group "Does Test want to make changes to their employment and education?":
          - text: Does Test want to make changes to their employment and education?
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

    test('validation employed option', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
      const { handoverLink, sanAssessmentId } = await createSession({
        targetService: TargetService.STRENGTHS_AND_NEEDS,
      })
      await strengthsAndNeedsBuilder
        .extend(sanAssessmentId).withAnswers([{ question: 'current_employment_status', value: 'EMPLOYED' }]).save()

      await EmploymentAndEducationPage.navigateToEmploymentAndEducation(page, handoverLink, baseURL)

      const employmentAndEducationPage = await EmploymentAndEducationPage.verifyOnPage(
        page,
        'current employment status',
      )

      await employmentAndEducationPage.saveAndContinue.click()
      await employmentAndEducationPage.selectTypeOfEmployment.click()

      await expect(employmentAndEducationPage.fullTime).toBeFocused()
    })

    test('shows self-employed questions', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
      const { handoverLink, sanAssessmentId } = await createSession({
        targetService: TargetService.STRENGTHS_AND_NEEDS,
      })
      await strengthsAndNeedsBuilder
        .extend(sanAssessmentId).withAnswers([{ question: 'current_employment_status', value: 'SELF_EMPLOYED' }]).save()

      await EmploymentAndEducationPage.navigateToEmploymentAndEducation(page, handoverLink, baseURL, 'employed')

      expect(page.url()).toContain(sanPageTitles.employmentAndEducation.toLowerCase())
      const employmentAndEducationPage = await EmploymentAndEducationPage.verifyOnPage(page, 'job sector')

      await expect(employmentAndEducationPage.mainSection).toMatchAriaSnapshot(`
        - text: Employment and education
        - strong: Incomplete
        - text: What job sector does Test work in? (optional)
        - textbox "What job sector does Test work in? (optional)"
        - text: You can enter up to 2000 characters You have 2,000 characters remaining
      `)
    })

    test('shows retired questions', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
      const { handoverLink, sanAssessmentId } = await createSession({
        targetService: TargetService.STRENGTHS_AND_NEEDS,
      })
      await strengthsAndNeedsBuilder
        .extend(sanAssessmentId).withAnswers([{ question: 'current_employment_status', value: 'RETIRED' }]).save()

      await EmploymentAndEducationPage.navigateToEmploymentAndEducation(page, handoverLink, baseURL, 'employed')

      expect(page.url()).toContain(sanPageTitles.employmentAndEducation.toLowerCase())
      const employmentAndEducationPage = await EmploymentAndEducationPage.verifyOnPage(page, 'employment history?')

      await expect(employmentAndEducationPage.mainSection).toMatchAriaSnapshot(`
        - /children: equal
        - link "Back"
        - text: Employment and education
        - strong: Incomplete
        - group "What is Test's employment history?"
        - group "Does Test have any day-to-day commitments?"
        - group "Select the highest level of academic qualification Test has completed"
        - group "Does Test have any professional or vocational qualifications?"
        - group "Does Test's have any skills that could help them in a job or to get a job?"
        - group "Does Test have difficulties with reading, writing or numeracy?"
        - group "What is Test's overall experience of employment?"
        - group "What is Test's experience of education?"
        - group "Does Test want to make changes to their employment and education?"
        - button "Save and continue"
      `)
    })

    test('shows currently unavailable for work questions', async ({
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
          { question: 'current_employment_status', value: 'CURRENTLY_UNAVAILABLE_FOR_WORK' },
          { question: 'had_previous_employment_unavailable_for_work', value: 'YES_HAS_BEEN_EMPLOYED_BEFORE' },
        ]).save()

      await EmploymentAndEducationPage.navigateToEmploymentAndEducation(page, handoverLink, baseURL, 'employed')

      expect(page.url()).toContain(sanPageTitles.employmentAndEducation.toLowerCase())
      const employmentAndEducationPage = await EmploymentAndEducationPage.verifyOnPage(page, 'employment history?')

      await expect(employmentAndEducationPage.mainSection).toMatchAriaSnapshot(`
        - /children: equal
        - link "Back"
        - text: Employment and education
        - strong: Incomplete
        - group "What is Test's employment history?"
        - group "Does Test have any day-to-day commitments?"
        - group "Select the highest level of academic qualification Test has completed"
        - group "Does Test have any professional or vocational qualifications?"
        - group "Does Test's have any skills that could help them in a job or to get a job?"
        - group "Does Test have difficulties with reading, writing or numeracy?"
        - group "What is Test's overall experience of employment?"
        - group "What is Test's experience of education?"
        - group "Does Test want to make changes to their employment and education?"
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
          { question: 'current_employment_status', value: 'CURRENTLY_UNAVAILABLE_FOR_WORK' },
          { question: 'had_previous_employment_unavailable_for_work', value: 'NO_HAS_NEVER_BEEN_EMPLOYED' },
        ]).save()

      await EmploymentAndEducationPage.navigateToEmploymentAndEducation(page, handoverLink, baseURL, 'employed')

      expect(page.url()).toContain(sanPageTitles.employmentAndEducation.toLowerCase())
      const employmentAndEducationPage = await EmploymentAndEducationPage.verifyOnPage(page, 'day-to-day commitments')

      await expect(employmentAndEducationPage.mainSection).toMatchAriaSnapshot(`
        - /children: equal
        - link "Back"
        - text: Employment and education
        - strong: Incomplete
        - group "Does Test have any day-to-day commitments?"
        - group "Select the highest level of academic qualification Test has completed"
        - group "Does Test have any professional or vocational qualifications?"
        - group "Does Test's have any skills that could help them in a job or to get a job?"
        - group "Does Test have difficulties with reading, writing or numeracy?"
        - group "What is Test's experience of education?"
        - group "Does Test want to make changes to their employment and education?"
        - button "Save and continue"
      `)
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
        .extend(sanAssessmentId).withAnswers([{ question: 'current_employment_status', value: 'CURRENTLY_UNAVAILABLE_FOR_WORK' }]).save()

      await EmploymentAndEducationPage.navigateToEmploymentAndEducation(page, handoverLink, baseURL)

      const employmentAndEducationPage = await EmploymentAndEducationPage.verifyOnPage(
        page,
        'current employment status',
      )

      await employmentAndEducationPage.saveAndContinue.click()
      await employmentAndEducationPage.selectOneOption.click()

      await expect(employmentAndEducationPage.yesHasBeenEmployedBefore).toBeFocused()
    })

    test('shows unemployed - actively looking for work questions', async ({
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
          { question: 'current_employment_status', value: 'UNEMPLOYED_ACTIVELY_LOOKING' },
          { question: 'had_previous_employment_actively_looking_for_work', value: 'YES_HAS_BEEN_EMPLOYED_BEFORE' },
        ]).save()

      await EmploymentAndEducationPage.navigateToEmploymentAndEducation(page, handoverLink, baseURL, 'employed')

      expect(page.url()).toContain(sanPageTitles.employmentAndEducation.toLowerCase())
      const employmentAndEducationPage = await EmploymentAndEducationPage.verifyOnPage(page, 'employment history?')

      await expect(employmentAndEducationPage.mainSection).toMatchAriaSnapshot(`
        - /children: equal
        - link "Back"
        - text: Employment and education
        - strong: Incomplete
        - group "What is Test's employment history?"
        - group "Does Test have any day-to-day commitments?"
        - group "Select the highest level of academic qualification Test has completed"
        - group "Does Test have any professional or vocational qualifications?"
        - group "Does Test's have any skills that could help them in a job or to get a job?"
        - group "Does Test have difficulties with reading, writing or numeracy?"
        - group "What is Test's overall experience of employment?"
        - group "What is Test's experience of education?"
        - group "Does Test want to make changes to their employment and education?"
        - button "Save and continue"
      `)
    })

    test('shows unemployed - actively looking for work - never been employed questions', async ({
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
          { question: 'current_employment_status', value: 'UNEMPLOYED_ACTIVELY_LOOKING' },
          { question: 'had_previous_employment_actively_looking_for_work', value: 'NO_HAS_NEVER_BEEN_EMPLOYED' },
        ]).save()

      await EmploymentAndEducationPage.navigateToEmploymentAndEducation(page, handoverLink, baseURL, 'employed')

      expect(page.url()).toContain(sanPageTitles.employmentAndEducation.toLowerCase())
      const employmentAndEducationPage = await EmploymentAndEducationPage.verifyOnPage(page, 'day-to-day commitments')

      await expect(employmentAndEducationPage.mainSection).toMatchAriaSnapshot(`
        - /children: equal
        - link "Back"
        - text: Employment and education
        - strong: Incomplete
        - group "Does Test have any day-to-day commitments?"
        - group "Select the highest level of academic qualification Test has completed"
        - group "Does Test have any professional or vocational qualifications?"
        - group "Does Test's have any skills that could help them in a job or to get a job?"
        - group "Does Test have difficulties with reading, writing or numeracy?"
        - group "What is Test's experience of education?"
        - group "Does Test want to make changes to their employment and education?"
        - button "Save and continue"
      `)
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
        .extend(sanAssessmentId).withAnswers([{ question: 'current_employment_status', value: 'UNEMPLOYED_ACTIVELY_LOOKING' }]).save()

      await EmploymentAndEducationPage.navigateToEmploymentAndEducation(page, handoverLink, baseURL)

      const employmentAndEducationPage = await EmploymentAndEducationPage.verifyOnPage(
        page,
        'current employment status',
      )

      await employmentAndEducationPage.saveAndContinue.click()
      await employmentAndEducationPage.selectOneOption.click()

      await expect(employmentAndEducationPage.yesHasBeenEmployedBefore).toBeFocused()
    })

    test('shows unemployed - not actively looking for work questions', async ({
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
          { question: 'current_employment_status', value: 'UNEMPLOYED_NOT_ACTIVELY_LOOKING' },
          { question: 'had_previous_employment_not_looking_for_work', value: 'YES_HAS_BEEN_EMPLOYED_BEFORE' },
        ]).save()

      await EmploymentAndEducationPage.navigateToEmploymentAndEducation(page, handoverLink, baseURL, 'employed')

      expect(page.url()).toContain(sanPageTitles.employmentAndEducation.toLowerCase())
      const employmentAndEducationPage = await EmploymentAndEducationPage.verifyOnPage(page, 'employment history?')

      await expect(employmentAndEducationPage.mainSection).toMatchAriaSnapshot(`
        - /children: equal
        - link "Back"
        - text: Employment and education
        - strong: Incomplete
        - group "What is Test's employment history?"
        - group "Does Test have any day-to-day commitments?"
        - group "Select the highest level of academic qualification Test has completed"
        - group "Does Test have any professional or vocational qualifications?"
        - group "Does Test's have any skills that could help them in a job or to get a job?"
        - group "Does Test have difficulties with reading, writing or numeracy?"
        - group "What is Test's overall experience of employment?"
        - group "What is Test's experience of education?"
        - group "Does Test want to make changes to their employment and education?"
        - button "Save and continue"
      `)
    })

    test('shows unemployed - not actively looking for work - never been employed questions', async ({
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
          { question: 'current_employment_status', value: 'UNEMPLOYED_NOT_ACTIVELY_LOOKING' },
          { question: 'had_previous_employment_not_looking_for_work', value: 'NO_HAS_NEVER_BEEN_EMPLOYED' },
        ]).save()

      await EmploymentAndEducationPage.navigateToEmploymentAndEducation(page, handoverLink, baseURL, 'employed')

      expect(page.url()).toContain(sanPageTitles.employmentAndEducation.toLowerCase())
      const employmentAndEducationPage = await EmploymentAndEducationPage.verifyOnPage(page, 'day-to-day commitments')

      await expect(employmentAndEducationPage.mainSection).toMatchAriaSnapshot(`
        - /children: equal
        - link "Back"
        - text: Employment and education
        - strong: Incomplete
        - group "Does Test have any day-to-day commitments?"
        - group "Select the highest level of academic qualification Test has completed"
        - group "Does Test have any professional or vocational qualifications?"
        - group "Does Test's have any skills that could help them in a job or to get a job?"
        - group "Does Test have difficulties with reading, writing or numeracy?"
        - group "What is Test's experience of education?"
        - group "Does Test want to make changes to their employment and education?"
        - button "Save and continue"
      `)
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
        .extend(sanAssessmentId).withAnswers([{ question: 'current_employment_status', value: 'UNEMPLOYED_NOT_ACTIVELY_LOOKING' }]).save()

      await EmploymentAndEducationPage.navigateToEmploymentAndEducation(page, handoverLink, baseURL)

      const employmentAndEducationPage = await EmploymentAndEducationPage.verifyOnPage(
        page,
        'current employment status',
      )

      await employmentAndEducationPage.saveAndContinue.click()
      await employmentAndEducationPage.selectOneOption.click()

      await expect(employmentAndEducationPage.yesHasBeenEmployedBefore).toBeFocused()
    })
  })

  test.describe('Accessibility', () => {
    test('should be accessible', async ({ page, createSession, baseURL }) => {
      const { handoverLink } = await createSession({ targetService: TargetService.STRENGTHS_AND_NEEDS })

      await EmploymentAndEducationPage.navigateToEmploymentAndEducation(page, handoverLink, baseURL)
      await checkAccessibility(page, {
        // https://github.com/alphagov/govuk-design-system-backlog/issues/59#issuecomment-2854891330
        disableRules: ['aria-allowed-attr'],
      })
    })
  })
})
