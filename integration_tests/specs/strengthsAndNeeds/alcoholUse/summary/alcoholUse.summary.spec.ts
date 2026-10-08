import { Option } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/alcohol-use/constants/option'
import { Question } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/alcohol-use/constants/question'
import { CommonOption } from '@server/forms/strengths-and-needs/versions/v1.0/constants/commonOption'
import { expect } from '@playwright/test'
import AlcoholUsePage from 'pages/strengthsAndNeeds/alcoholUsePage'
import { Step } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/alcohol-use/constants/step'
import { test, TargetService } from '../../../../support/fixtures'

test.describe('Summary', () => {
  test('shows a fully-answered summary including the multi-select reasons and impact questions', async ({
    page,
    createSession,
    strengthsAndNeedsBuilder,
    baseURL,
  }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
      subject: { gender: '1' },
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId)
      .withAnswers([
        { question: Question.alcohol_use, value: Option.yes_within_last_three_months },
        { question: Question.alcohol_frequency, value: Option.multiple_times_a_month },
        { question: Question.alcohol_units, value: Option.units_3_to_4 },
        { question: Question.alcohol_binge_drinking, value: CommonOption.yes },
        { question: Question.alcohol_binge_drinking_frequency, value: Option.monthly },
        { question: Question.alcohol_evidence_of_excess_drinking, value: Option.yes_with_some_evidence },
        { question: Question.alcohol_past_issues, value: CommonOption.yes },
        { question: Question.alcohol_past_issues_yes_details, value: 'Had issues a few years ago' },
        { question: Question.alcohol_reasons_for_use, value: [Option.social, Option.enjoyment] },
        { question: Question.alcohol_impact_of_use, value: [Option.relationships, Option.finances] },
        { question: Question.alcohol_stopped_or_reduced, value: CommonOption.yes },
        { question: Question.alcohol_stopped_or_reduced_yes_details, value: 'Cut down last year' },
        { question: Question.alcohol_use_changes, value: CommonOption.made_changes },
        { question: Question.alcohol_use_changes_made_changes_details, value: 'Stopped drinking spirits' },
      ])
      .withUserSubmittedSteps([Step.alcohol_use_status.code, Step.alcohol_use_details.code, Step.alcohol_use_summary.code])
      .save()

    await AlcoholUsePage.navigateTo(page, handoverLink, baseURL, sanAssessmentId, 'alcohol-use-summary')
    const alcoholUsePage = await AlcoholUsePage.verifyOnPage(page, 'Summary')

    await expect(alcoholUsePage.summary).toMatchAriaSnapshot(`
      - tabpanel "Summary":
        - term: Has Test ever drunk alcohol?
        - definition:
          - paragraph: Yes, including the last 3 months
        - definition:
          - link "Change Has Test ever drunk alcohol?":
            - /url: alcohol-use-status#alcohol_use-question
        - term: How often has Test drunk alcohol in the last 3 months?
        - definition:
          - paragraph: 2 to 4 times a month
        - definition:
          - link "Change How often has Test drunk alcohol in the last 3 months?":
            - /url: alcohol-use-details#alcohol_frequency-question
        - term: How many units of alcohol does Test have on a typical day of drinking?
        - definition:
          - paragraph: 3 to 4 units
        - definition:
          - link "Change How many units of alcohol does Test have on a typical day of drinking?":
            - /url: alcohol-use-details#alcohol_units-question
        - term: Has Test had 8 or more units within a single day of drinking in the last 3 months?
        - definition:
          - paragraph: "Yes"
          - paragraph: Monthly
        - definition:
          - link "Change Has Test had 8 or more units within a single day of drinking in the last 3 months?":
            - /url: alcohol-use-details#alcohol_binge_drinking-question
        - term: Has Test shown evidence of binge drinking or excessive alcohol use in the last 6 months?
        - definition:
          - paragraph: Some evidence of binge drinking or excessive alcohol use
        - definition:
          - link "Change Has Test shown evidence of binge drinking or excessive alcohol use in the last 6 months?":
            - /url: alcohol-use-details#alcohol_evidence_of_excess_drinking-question
        - term: Does Test have any past issues with alcohol?
        - definition:
          - paragraph: "Yes"
          - paragraph: Had issues a few years ago
        - definition:
          - link "Change Does Test have any past issues with alcohol?":
            - /url: alcohol-use-details#alcohol_past_issues-question
        - term: Why does Test drink alcohol?
        - definition:
          - paragraph: Enjoyment
          - paragraph: Socially
        - definition:
          - link "Change Why does Test drink alcohol?":
            - /url: alcohol-use-details#alcohol_reasons_for_use-question
        - term: What's the impact of Test drinking alcohol?
        - definition:
          - paragraph: Finances
          - paragraph: Relationships
        - definition:
          - link "Change What's the impact of Test drinking alcohol?":
            - /url: alcohol-use-details#alcohol_impact_of_use-question
        - term: Has anything helped Test to stop or reduce drinking alcohol in the past?
        - definition:
          - paragraph: "Yes"
          - paragraph: Cut down last year
        - definition:
          - link "Change Has anything helped Test to stop or reduce drinking alcohol in the past?":
            - /url: alcohol-use-details#alcohol_stopped_or_reduced-question
        - term: Does Test want to make changes to their alcohol use?
        - definition:
          - paragraph: I have already made positive changes and want to maintain them
          - paragraph: Stopped drinking spirits
        - definition:
          - link "Change Does Test want to make changes to their alcohol use?":
            - /url: alcohol-use-details#alcohol_use_changes-question
        - button "Go to practitioner analysis"
    `)
  })

  test('practitioner analysis', async ({ baseURL, page, createSession, strengthsAndNeedsBuilder }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
      subject: { gender: '1' },
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId)
      .withAnswers([
        { question: Question.alcohol_use, value: Option.yes_within_last_three_months },
        { question: Question.alcohol_frequency, value: Option.multiple_times_a_month },
        { question: Question.alcohol_units, value: Option.units_3_to_4 },
        { question: Question.alcohol_binge_drinking, value: CommonOption.yes },
        { question: Question.alcohol_binge_drinking_frequency, value: Option.monthly },
        { question: Question.alcohol_evidence_of_excess_drinking, value: Option.yes_with_some_evidence },
        { question: Question.alcohol_past_issues, value: CommonOption.yes },
        { question: Question.alcohol_past_issues_yes_details, value: 'Had issues a few years ago' },
        { question: Question.alcohol_reasons_for_use, value: [Option.social, Option.enjoyment] },
        { question: Question.alcohol_impact_of_use, value: [Option.relationships, Option.finances] },
        { question: Question.alcohol_stopped_or_reduced, value: CommonOption.yes },
        { question: Question.alcohol_stopped_or_reduced_yes_details, value: 'Cut down last year' },
        { question: Question.alcohol_use_changes, value: CommonOption.made_changes },
        { question: Question.alcohol_use_changes_made_changes_details, value: 'Stopped drinking spirits' },
      ])
      .withUserSubmittedSteps([Step.alcohol_use_status.code, Step.alcohol_use_details.code, Step.alcohol_use_summary.code])
      .save()

    await AlcoholUsePage.navigateTo(page, handoverLink, baseURL, sanAssessmentId, 'alcohol-use-summary')
    const alcoholUsePage = await AlcoholUsePage.verifyOnPage(page, 'Summary')

    await alcoholUsePage.goToPractitionerAnalysis.click()
    await expect(page.getByText('Are there any strengths or protective factors')).toBeVisible()
  })

  test('mark complete', async ({ baseURL, page, createSession, strengthsAndNeedsBuilder }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId)
      .withAnswers([
        { question: Question.alcohol_use, value: Option.yes_within_last_three_months },
        { question: Question.alcohol_frequency, value: Option.multiple_times_a_month },
        { question: Question.alcohol_units, value: Option.units_3_to_4 },
        { question: Question.alcohol_binge_drinking, value: CommonOption.yes },
        { question: Question.alcohol_binge_drinking_frequency, value: Option.monthly },
        { question: Question.alcohol_evidence_of_excess_drinking, value: Option.yes_with_some_evidence },
        { question: Question.alcohol_past_issues, value: CommonOption.yes },
        { question: Question.alcohol_past_issues_yes_details, value: 'Had issues a few years ago' },
        { question: Question.alcohol_reasons_for_use, value: [Option.social, Option.enjoyment] },
        { question: Question.alcohol_impact_of_use, value: [Option.relationships, Option.finances] },
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
      .withUserSubmittedSteps([Step.alcohol_use_status.code, Step.alcohol_use_details.code, Step.alcohol_use_summary.code])
      .save()

    await AlcoholUsePage.navigateTo(
      page,
      handoverLink,
      baseURL,
      sanAssessmentId,
      'alcohol-use-summary#practitioner-analysis',
    )

    const alcoholUsePage = await AlcoholUsePage.verifyOnPage(page, 'strengths or protective factors')

    await alcoholUsePage.questions.alcohol_use_practitioner_analysis_risk_of_reoffending.option(CommonOption.no)
      .click()
    await alcoholUsePage.markComplete.click()
    await expect(alcoholUsePage.complete).toBeVisible()
    expect(page.url()).toContain('alcohol-use-analysis')

    await expect(alcoholUsePage.practitionerAnalysis).toMatchAriaSnapshot(`
      - tabpanel "Practitioner analysis":
        - term: Are there any strengths or protective factors related to Test's alcohol use?
        - definition:
          - paragraph: "No"
        - definition:
          - link "Change Are there any strengths or protective factors related to Test's alcohol use?":
            - /url: alcohol-use-summary#alcohol_use_practitioner_analysis_strengths_or_protective_factors-question
        - term: Is Test's alcohol use linked to risk of serious harm?
        - definition:
          - paragraph: "No"
        - definition:
          - link "Change Is Test's alcohol use linked to risk of serious harm?":
            - /url: alcohol-use-summary#alcohol_use_practitioner_analysis_risk_of_serious_harm-question
        - term: Is Test's alcohol use linked to risk of reoffending?
        - definition:
          - paragraph: "No"
        - definition:
          - link "Change Is Test's alcohol use linked to risk of reoffending?":
            - /url: alcohol-use-summary#alcohol_use_practitioner_analysis_risk_of_reoffending-question
    `)
  })
})
