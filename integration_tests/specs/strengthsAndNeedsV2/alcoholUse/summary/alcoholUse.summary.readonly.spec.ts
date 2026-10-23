import { Option } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/alcohol-use/constants/option'
import { Question } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/alcohol-use/constants/question'
import { CommonOption } from '@server/forms/strengths-and-needs/versions/v2.0/constants/commonOption'
import { expect } from '@playwright/test'
import AlcoholUsePage from 'pages/strengthsAndNeedsV2/alcoholUsePage'
import { Step } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/alcohol-use/constants/step'
import { test, TargetService } from '../../../../support/fixtures'

test.describe('Summary', () => {
  test('shows read-only summary', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
      accessMode: 'READ_ONLY',
      planAccessMode: 'READ_WRITE',
      subject: { gender: '1' },
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId)
      .withAnswers([
        { question: Question.alcohol_current_issues, value: Option.no_current_problems },
        { question: Question.alcohol_past_issues, value: CommonOption.yes },
        { question: Question.alcohol_past_issues_yes_details, value: 'Had issues a few years ago' },
        { question: Question.alcohol_stopped_or_reduced_past, value: CommonOption.yes },
        { question: Question.alcohol_stopped_or_reduced_past_yes_details, value: 'Cut down last year' },
        { question: Question.alcohol_use_changes, value: CommonOption.made_changes },
        { question: Question.alcohol_use_changes_made_changes_details, value: 'Stopped drinking spirits' },
      ])
      .withUserSubmittedSteps([
        Step.alcohol_use_current_issues.code,
        Step.alcohol_use_excessive_drinking_past_issues.code,
        Step.alcohol_use_stopped_or_reduced.code,
        Step.alcohol_use_changes.code,
        Step.alcohol_use_summary.code,
      ])
      .save()

    await AlcoholUsePage.navigateToView(page, handoverLink, baseURL, sanAssessmentId, 'alcohol-use-analysis')
    const alcoholUsePage = await AlcoholUsePage.verifyOnPage(page, 'Summary')

    await expect(alcoholUsePage.summary).toMatchAriaSnapshot(`
      - tabpanel "Summary":
        - term: Does Test have any current issues with alcohol?
        - definition:
          - paragraph: No current problems
        - term: Does Test have any past issues with alcohol?
        - definition:
          - paragraph: "Yes"
          - paragraph: Had issues a few years ago
        - term: Has anything helped Test to stop or reduce drinking alcohol in the past?
        - definition:
          - paragraph: "Yes"
          - paragraph: Cut down last year
        - term: Does Test want to make changes to their alcohol use?
        - definition:
          - paragraph: I have already made positive changes and want to maintain them
          - paragraph: Stopped drinking spirits
    `)
  })

  test('read-only practitioner analysis', async ({ baseURL, page, createSession, strengthsAndNeedsBuilder }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
      accessMode: 'READ_ONLY',
      planAccessMode: 'READ_WRITE',
      subject: { gender: '1' },
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId)
      .withAnswers([
        { question: Question.alcohol_current_issues, value: Option.significant },
        { question: Question.alcohol_evidence_of_excess_drinking, value: Option.yes_with_some_evidence },
        { question: Question.alcohol_past_issues, value: CommonOption.yes },
        { question: Question.alcohol_past_issues_yes_details, value: 'Had issues a few years ago' },
        { question: Question.alcohol_stopped_or_reduced_past, value: CommonOption.yes },
        { question: Question.alcohol_stopped_or_reduced_past_yes_details, value: 'Cut down last year' },
        { question: Question.alcohol_stopped_or_reduced, value: CommonOption.yes },
        { question: Question.alcohol_stopped_or_reduced_yes_details, value: 'Cut down last year' },
        { question: Question.alcohol_use_changes, value: CommonOption.made_changes },
        { question: Question.alcohol_use_changes_made_changes_details, value: 'Stopped drinking spirits' },
        {
          question: Question.alcohol_use_practitioner_analysis_strengths_or_protective_factors,
          value: CommonOption.no,
        },
        { question: Question.alcohol_use_practitioner_analysis_strengths_or_protective_factors_no_details, value: '' },
        { question: Question.alcohol_use_practitioner_analysis_risk_of_serious_harm, value: CommonOption.no },
        { question: Question.alcohol_use_practitioner_analysis_risk_of_serious_harm_no_details, value: '' },
        { question: Question.alcohol_use_practitioner_analysis_risk_of_reoffending, value: CommonOption.no },
        { question: Question.alcohol_use_practitioner_analysis_risk_of_reoffending_no_details, value: '' },
      ])
      .withUserSubmittedSteps([
        Step.alcohol_use_current_issues.code,
        Step.alcohol_use_excessive_drinking_past_issues.code,
        Step.alcohol_use_stopped_or_reduced.code,
        Step.alcohol_use_changes.code,
        Step.alcohol_use_summary.code,
      ])
      .save()

    await AlcoholUsePage.navigateToView(page, handoverLink, baseURL, sanAssessmentId, 'alcohol-use-analysis')
    const alcoholUsePage = await AlcoholUsePage.verifyOnPage(page, 'Summary')

    await alcoholUsePage.practitionerAnalysisTab.click()
    await expect(alcoholUsePage.practitionerAnalysis).toMatchAriaSnapshot(`
      - tabpanel "Practitioner analysis":
        - term: Are there any strengths or protective factors related to Test's alcohol use?
        - definition:
          - paragraph: "No"
        - term: Is Test's alcohol use linked to risk of serious harm?
        - definition:
          - paragraph: "No"
        - term: Is Test's alcohol use linked to risk of reoffending?
        - definition:
          - paragraph: "No"
    `)
  })
})
