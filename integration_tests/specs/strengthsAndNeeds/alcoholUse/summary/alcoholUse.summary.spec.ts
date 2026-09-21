import { Option } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/alcohol-use/constants/option'
import { Question } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/alcohol-use/constants/question'
import { CommonOption } from '@server/forms/strengths-and-needs/versions/v1.0/constants/commonOption'
import { expect } from '@playwright/test'
import AlcoholUsePage from 'pages/strengthsAndNeeds/alcoholUsePage'
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
      .save()

    await AlcoholUsePage.navigateTo(page, handoverLink, baseURL, sanAssessmentId, 'alcohol-use-summary')

    const summary = page.getByRole('tabpanel', { name: 'Summary' })

    // Recency rows (only shown for the "in the last 3 months" branch).
    await expect(summary.getByText('2 to 4 times a month')).toBeVisible()
    await expect(summary.getByText('3 to 4 units')).toBeVisible()

    // The multi-select answers render each selected option.
    await expect(summary.getByText('Socially')).toBeVisible()
    await expect(summary.getByText('Enjoyment')).toBeVisible()
    await expect(summary.getByText('Relationships')).toBeVisible()
    await expect(summary.getByText('Finances')).toBeVisible()

    // Free text detail answers are shown under their questions.
    await expect(summary.getByText('Had issues a few years ago')).toBeVisible()
    await expect(summary.getByText('Cut down last year')).toBeVisible()
    await expect(summary.getByText('Stopped drinking spirits')).toBeVisible()
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
      ])
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
  })
})
