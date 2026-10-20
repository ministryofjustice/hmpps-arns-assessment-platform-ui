import { Option } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/offence-analysis/constants/option'
import { Question } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/offence-analysis/constants/question'
import { Step } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/offence-analysis/constants/step'
import { expect, TargetService } from 'support/fixtures'
import OffenceAnalysisPage from 'pages/strengthsAndNeeds/offenceAnalysisPage'
import { CommonOption } from '@server/forms/strengths-and-needs/versions/v1.0/constants/commonOption'
import { test } from '../fixtures'

test.describe('Victim summary change links', () => {
  test.describe('first victim', () => {
    test('change link lands on victim question', async ({ baseURL, page, createSession, strengthsAndNeedsBuilder }) => {
      const { handoverLink, sanAssessmentId } = await createSession({
        targetService: TargetService.STRENGTHS_AND_NEEDS,
      })
      await strengthsAndNeedsBuilder
        .extend(sanAssessmentId)
        .withAnswers([
          { question: Question.offence_analysis_description_of_offence, value: 'Some details' },
          { question: Question.offence_analysis_elements, value: [Option.arson, Option.weapon] },
          { question: Question.offence_weapon_details, value: 'A knife' },
          { question: Question.offence_analysis_reason, value: 'Some details' },
          { question: Question.offence_analysis_motivations, value: [Option.emotional_state] },
          { question: Question.offence_analysis_who_was_the_victim, value: [Option.one_or_more_person] },
        ])
        .withCollectionItems('OFFENCE_ANALYSIS_VICTIM', [
          {
            question: Question.offence_analysis_victim_relationship,
            value: Option.stranger,
          },
          {
            question: Question.offence_analysis_victim_age,
            value: Option.age_5_to_11_years,
          },
          {
            question: Question.offence_analysis_victim_sex,
            value: Option.male,
          },
          {
            question: Question.offence_analysis_victim_race,
            value: Option.white_english_welsh_scottish_northern_irish_or_british,
          },
        ])
        .withUserSubmittedSteps([Step.offence_analysis.code])
        .save()

      await OffenceAnalysisPage.navigateTo(
        page,
        handoverLink,
        baseURL,
        sanAssessmentId,
        'offence-analysis-victim-summary',
      )
      const offenceAnalysisPage = await OffenceAnalysisPage.verifyOnPage(page, 'Add another victim')

      await offenceAnalysisPage.changeVictim.click()

      await expect(page).toHaveURL(
        new RegExp(
          `${Step.offence_analysis_victim_edit.path.replace('%1', '0')}#${Question.offence_analysis_victim_relationship}-question`,
        ),
      )
      await expect(
        page.locator(`#${Question.offence_analysis_victim_relationship}-question`).getByRole('radio').first(),
      ).toBeFocused()
    })
  })

  test.describe('summary', () => {
    test('change link lands on victim question', async ({ baseURL, page, createSession, strengthsAndNeedsBuilder }) => {
      const { handoverLink, sanAssessmentId } = await createSession({
        targetService: TargetService.STRENGTHS_AND_NEEDS,
      })
      await strengthsAndNeedsBuilder
        .extend(sanAssessmentId)
        .withAnswers([
          { question: Question.offence_analysis_description_of_offence, value: 'Some details' },
          { question: Question.offence_analysis_elements, value: [Option.arson, Option.weapon] },
          { question: Question.offence_weapon_details, value: 'A knife' },
          { question: Question.offence_analysis_reason, value: 'Some details' },
          { question: Question.offence_analysis_motivations, value: [Option.emotional_state] },
          { question: Question.offence_analysis_who_was_the_victim, value: [Option.one_or_more_person] },
          {
            question: Question.offence_analysis_leader,
            value: CommonOption.no,
          },
          {
            question: Question.offence_analysis_leader_no_details,
            value: '',
          },
          {
            question: Question.offence_analysis_impact_on_victims,
            value: CommonOption.no,
          },
          {
            question: Question.offence_analysis_impact_on_victims_no_details,
            value: '',
          },
          {
            question: Question.offence_analysis_accept_responsibility,
            value: CommonOption.no,
          },
          {
            question: Question.offence_analysis_accept_responsibility_no_details,
            value: '',
          },
          {
            question: Question.offence_analysis_escalation,
            value: CommonOption.no,
          },
          {
            question: Question.offence_analysis_escalation_no_details,
            value: '',
          },
          {
            question: Question.offence_analysis_perpetrator_of_domestic_abuse,
            value: CommonOption.no,
          },
          {
            question: Question.offence_analysis_victim_of_domestic_abuse,
            value: CommonOption.no,
          },
          {
            question: Question.offence_analysis_patterns_of_offending,
            value: 'test',
          },
          {
            question: Question.offence_analysis_risk,
            value: CommonOption.no,
          },
          {
            question: Question.offence_analysis_risk_no_details,
            value: 'test',
          },
          {
            question: Question.offence_analysis_how_many_involved,
            value: CommonOption.none,
          },
        ])
        .withCollectionItems('OFFENCE_ANALYSIS_VICTIM', [
          {
            question: Question.offence_analysis_victim_relationship,
            value: Option.stranger,
          },
          {
            question: Question.offence_analysis_victim_age,
            value: Option.age_5_to_11_years,
          },
          {
            question: Question.offence_analysis_victim_sex,
            value: Option.male,
          },
          {
            question: Question.offence_analysis_victim_race,
            value: Option.white_english_welsh_scottish_northern_irish_or_british,
          },
        ])
        .withUserSubmittedSteps([
          Step.offence_analysis.code,
          Step.offence_analysis_involved_parties.code,
          Step.offence_analysis_victim_summary.code,
          Step.offence_analysis_impact.code,
          Step.offence_analysis_summary.code,
        ])
        .save()

      await OffenceAnalysisPage.navigateTo(page, handoverLink, baseURL, sanAssessmentId, 'offence-analysis-summary')
      const offenceAnalysisPage = await OffenceAnalysisPage.verifyOnPage(page, 'Summary')

      await offenceAnalysisPage.changeVictim.click()

      await expect(
        page.locator(`#${Question.offence_analysis_victim_relationship}-question`).getByRole('radio').first(),
      ).toBeFocused()
    })
  })
})
