import { expect } from '@playwright/test'
import AlcoholUsePage from 'pages/strengthsAndNeeds/alcoholUsePage'
import { test, TargetService } from '../../../support/fixtures'

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
        { question: 'alcohol_use', value: 'YES_WITHIN_LAST_THREE_MONTHS' },
        { question: 'alcohol_frequency', value: 'MULTIPLE_TIMES_A_MONTH' },
        { question: 'alcohol_units', value: 'UNITS_3_TO_4' },
        { question: 'alcohol_binge_drinking', value: 'YES' },
        { question: 'alcohol_binge_drinking_frequency', value: 'MONTHLY' },
        { question: 'alcohol_evidence_of_excess_drinking', value: 'YES_WITH_SOME_EVIDENCE' },
        { question: 'alcohol_past_issues', value: 'YES' },
        { question: 'alcohol_past_issues_yes_details', value: 'Had issues a few years ago' },
        { question: 'alcohol_reasons_for_use', value: ['SOCIAL', 'ENJOYMENT'] },
        { question: 'alcohol_impact_of_use', value: ['RELATIONSHIPS', 'FINANCES'] },
        { question: 'alcohol_stopped_or_reduced', value: 'YES' },
        { question: 'alcohol_stopped_or_reduced_yes_details', value: 'Cut down last year' },
        { question: 'alcohol_use_changes', value: 'HAS_MADE_CHANGES' },
        { question: 'alcohol_use_changes_made_changes_details', value: 'Stopped drinking spirits' },
      ])
      .save()

    await AlcoholUsePage.navigateToAlcoholUse(page, handoverLink, baseURL, sanAssessmentId, 'alcohol-use-summary')

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
        { question: 'alcohol_use', value: 'YES_WITHIN_LAST_THREE_MONTHS' },
        { question: 'alcohol_frequency', value: 'MULTIPLE_TIMES_A_MONTH' },
        { question: 'alcohol_units', value: 'UNITS_3_TO_4' },
        { question: 'alcohol_binge_drinking', value: 'YES' },
        { question: 'alcohol_binge_drinking_frequency', value: 'MONTHLY' },
        { question: 'alcohol_evidence_of_excess_drinking', value: 'YES_WITH_SOME_EVIDENCE' },
        { question: 'alcohol_past_issues', value: 'YES' },
        { question: 'alcohol_past_issues_yes_details', value: 'Had issues a few years ago' },
        { question: 'alcohol_reasons_for_use', value: ['SOCIAL', 'ENJOYMENT'] },
        { question: 'alcohol_impact_of_use', value: ['RELATIONSHIPS', 'FINANCES'] },
        { question: 'alcohol_stopped_or_reduced', value: 'YES' },
        { question: 'alcohol_stopped_or_reduced_yes_details', value: 'Cut down last year' },
        { question: 'alcohol_use_changes', value: 'HAS_MADE_CHANGES' },
        { question: 'alcohol_use_changes_made_changes_details', value: 'Stopped drinking spirits' },
      ])
      .save()

    await AlcoholUsePage.navigateToAlcoholUse(page, handoverLink, baseURL, sanAssessmentId, 'alcohol-use-summary')
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
        { question: 'alcohol_use', value: 'YES_WITHIN_LAST_THREE_MONTHS' },
        { question: 'alcohol_frequency', value: 'MULTIPLE_TIMES_A_MONTH' },
        { question: 'alcohol_units', value: 'UNITS_3_TO_4' },
        { question: 'alcohol_binge_drinking', value: 'YES' },
        { question: 'alcohol_binge_drinking_frequency', value: 'MONTHLY' },
        { question: 'alcohol_evidence_of_excess_drinking', value: 'YES_WITH_SOME_EVIDENCE' },
        { question: 'alcohol_past_issues', value: 'YES' },
        { question: 'alcohol_past_issues_yes_details', value: 'Had issues a few years ago' },
        { question: 'alcohol_reasons_for_use', value: ['SOCIAL', 'ENJOYMENT'] },
        { question: 'alcohol_impact_of_use', value: ['RELATIONSHIPS', 'FINANCES'] },
        { question: 'alcohol_stopped_or_reduced', value: 'YES' },
        { question: 'alcohol_stopped_or_reduced_yes_details', value: 'Cut down last year' },
        { question: 'alcohol_use_changes', value: 'HAS_MADE_CHANGES' },
        { question: 'alcohol_use_changes_made_changes_details', value: 'Stopped drinking spirits' },
        { question: 'alcohol_use_practitioner_analysis_strengths_or_protective_factors', value: 'NO' },
        { question: 'alcohol_use_practitioner_analysis_strengths_or_protective_factors_no_details', value: '' },
        { question: 'alcohol_use_practitioner_analysis_risk_of_serious_harm', value: 'NO' },
        { question: 'alcohol_use_practitioner_analysis_risk_of_serious_harm_no_details', value: '' },
      ])
      .save()

    await AlcoholUsePage.navigateToAlcoholUse(
      page,
      handoverLink,
      baseURL,
      sanAssessmentId,
      'alcohol-use-summary#practitioner-analysis',
    )

    const alcoholUsePage = await AlcoholUsePage.verifyOnPage(page, 'strengths or protective factors')

    await alcoholUsePage.linkedToRiskOfReoffending.click()
    await alcoholUsePage.markComplete.click()
    await expect(alcoholUsePage.complete).toBeVisible()
    expect(page.url()).toContain('alcohol-use-analysis')
  })
})
