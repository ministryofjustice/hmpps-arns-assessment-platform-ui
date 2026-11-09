import { expect } from '@playwright/test'
import { Step } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/offence-analysis/constants/step'
import OffenceAnalysisPage from 'pages/strengthsAndNeedsV2/offenceAnalysisPage'
import { Question } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/offence-analysis/constants/question'
import { Section } from '@server/forms/strengths-and-needs/versions/v2.0/constants/section'
import { Option } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/offence-analysis/constants/option'
import { CommonOption } from '@server/forms/strengths-and-needs/versions/v2.0/constants/commonOption'
import { test, TargetService } from '../../../../support/fixtures'

test.describe('Summary', () => {
  test('shows read-only summary', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
      accessMode: 'READ_ONLY',
      planAccessMode: 'READ_WRITE',
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId).withAnswers([
        {
          question: Question.offence_analysis_elements,
          value: [Option.arson],
        },
        {
          question: Question.offence_analysis_motivations,
          value: [Option.addictions_or_perceived_needs],
        },
        {
          question: Question.offence_analysis_reason,
          value: 'test',
        },
        {
          question: Question.offence_analysis_who_was_the_victim,
          value: [Option.one_or_more_person],
        },
        {
          question: Question.offence_analysis_description_of_offence,
          value: 'test',
        },
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
          question: Question.offence_analysis_impact_on_victims_no_details,
          value: CommonOption.no,
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
          question: Section.offence_analysis.statusKey,
          value: CommonOption.yes,
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

    await OffenceAnalysisPage.navigateToView(page, handoverLink, baseURL, sanAssessmentId, 'offence-analysis-summary')
    const offenceAnalysisPage = await OffenceAnalysisPage.verifyOnPage(page, 'Summary')

    await expect(offenceAnalysisPage.summary).toMatchAriaSnapshot(`
      - tabpanel "Summary":
        - term: Enter a brief description of the current index offence(s)
        - definition:
          - paragraph: test
        - term: Did the current index offence(s) have any of the following elements?
        - definition:
          - paragraph: Arson
        - term: Why did the current index offence(s) happen?
        - definition:
          - paragraph: test
        - term: Did the current index offence(s) involve any of the following motivations?
        - definition:
          - paragraph: Addictions or perceived needs
        - term: Who was the offence committed against?
        - definition:
          - paragraph: One or more people
        - term: How many other people were involved with committing the current index offence(s)?
        - definition:
          - paragraph: None
        - term: Was Test the leader of the current index offence(s)?
        - definition:
          - paragraph: "No"
        - term: Does Test recognise the impact on the victims or wider community?
        - definition:
          - paragraph: "No"
        - term: Does Test accept responsibility for the current index offence(s)?
        - definition:
          - paragraph: "No"
        - term: Is there an escalation in seriousness from previous offending?
        - definition:
          - paragraph: "No"
        - term: What are the patterns of offending?
        - definition:
          - paragraph: test
        - term: Are the current or previous offences linked to risk of serious harm, risks to the individual or other risks?
        - definition:
          - paragraph: "No"
          - paragraph: test
        - heading "First victim" [level=2]
        - /children: equal
        - term: Who is the victim?
        - definition:
          - paragraph: A stranger
        - term: What is the victim's approximate age?
        - definition: 5 to 11 years
        - term: What is the victim's sex?
        - definition: Male
        - term: What is the victim's ethnicity?
        - definition: White - English, Welsh, Scottish, Northern Irish or British
    `)
  })
})
