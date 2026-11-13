import { expect } from '@playwright/test'
import OffenceAnalysisPage from 'pages/strengthsAndNeedsV2/offenceAnalysisPage'
import { Option } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/offence-analysis/constants/option'
import { Step } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/offence-analysis/constants/step'
import { test, TargetService } from '../../../support/fixtures'

test.describe('Add Victim', () => {

  test('add another victim', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {

    // Setup session, initial victim data and navigate to page
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })

    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId).withAnswers([
        {
          question: 'offence_analysis_index_offence_description',
          value: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
        },
        {
          question: 'offence_analysis_description_of_offence',
          value: 'test',
        },
        {
          question: 'offence_analysis_elements',
          value: ['ARSON'],
        },
        {
          question: 'offence_analysis_why_offence_happened',
          value: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
        },
        {
          question: 'offence_analysis_motivations',
          value: ['ADDICTIONS_OR_PERCEIVED_NEEDS'],
        },
        {
          question: 'offence_analysis_commited_against',
          value: ['OTHER'],
        },
        {
          question: 'offence_analysis_reason',
          value: 'test',
        },
        {
          question: 'offence_analysis_who_was_the_victim',
          value: ['ONE_OR_MORE_PERSON'],
        },
      ])
      .withCollectionItems('OFFENCE_ANALYSIS_VICTIM', [
        {
          question: 'offence_analysis_victim_relationship',
          value: Option.stranger,
        },
        {
          question: 'offence_analysis_victim_age',
          value: Option.age_5_to_11_years,
        },
        {
          question: 'offence_analysis_victim_sex',
          value: Option.male,
        },
        {
          question: 'offence_analysis_victim_race',
          value: Option.white_english_welsh_scottish_northern_irish_or_british,
        },
      ])
      .withUserSubmittedSteps([Step.offence_analysis.code, Step.offence_analysis_victim_summary.code])
      .save()

    await OffenceAnalysisPage.navigateTo(
      page,
      handoverLink,
      baseURL,
      sanAssessmentId,
      'offence-analysis-victim-summary',
    )

    let offenceAnalysisPage = await OffenceAnalysisPage.verifyOnPage(page, 'Add another victim')

    // Add second victim details and submit the form
    await offenceAnalysisPage.addAnotherVictim.click()

    offenceAnalysisPage = await OffenceAnalysisPage.verifyOnPage(page, 'Offence analysis')
    const { questions } = offenceAnalysisPage

    // Verify page is populated with empty options
    await expect(questions.offence_analysis_victim_relationship.option(Option.stranger)).not.toBeChecked()

    await questions.offence_analysis_victim_relationship.option(Option.stranger).click()
    await questions.offence_analysis_victim_age.option(Option.age_12_to_15_years).click()
    await questions.offence_analysis_victim_sex.option(Option.female).click()
    await questions.offence_analysis_victim_race
      .selectOption(Option.white_any_other_white_background)
    await offenceAnalysisPage.saveAndContinue.click()

    // Verify page confirmation for second victim
    await OffenceAnalysisPage.verifyOnPage(page, 'Second victim')
  })
})
