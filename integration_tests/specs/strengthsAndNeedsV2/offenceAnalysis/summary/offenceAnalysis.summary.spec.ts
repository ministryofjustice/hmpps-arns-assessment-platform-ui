import { expect } from '@playwright/test'
import { Step } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/offence-analysis/constants/step'
import OffenceAnalysisPage from 'pages/strengthsAndNeedsV2/offenceAnalysisPage'
import { Question } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/offence-analysis/constants/question'
import { Option } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/offence-analysis/constants/option'
import { CommonOption } from '@server/forms/strengths-and-needs/versions/v2.0/constants/commonOption'
import { Section } from '@server/forms/strengths-and-needs/versions/v2.0/constants/section'
import { test, TargetService } from '../../../../support/fixtures'

test.describe('Summary', () => {
  test('shows summary page', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
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

    await OffenceAnalysisPage.navigateTo(page, handoverLink, baseURL, sanAssessmentId, 'offence-analysis-summary')

    const offenceAnalysisPage = await OffenceAnalysisPage.verifyOnPage(page, 'Summary')

    await expect(offenceAnalysisPage.summary).toMatchAriaSnapshot(`
        - tabpanel "Summary":
          - term: Enter a brief description of the current index offence(s)
          - definition:
            - paragraph: test
          - definition:
            - link "Change Enter a brief description of the current index offence(s)":
              - /url: offence-analysis#offence_analysis_description_of_offence-question
          - term: Did the current index offence(s) have any of the following elements?
          - definition:
            - paragraph: Arson
          - definition:
            - link "Change Did the current index offence(s) have any of the following elements?":
              - /url: offence-analysis#offence_analysis_elements-question
          - term: Why did the current index offence(s) happen?
          - definition:
            - paragraph: test
          - definition:
            - link "Change Why did the current index offence(s) happen?":
              - /url: offence-analysis#offence_analysis_reason-question
          - term: Did the current index offence(s) involve any of the following motivations?
          - definition:
            - paragraph: Addictions or perceived needs
          - definition:
            - link "Change Did the current index offence(s) involve any of the following motivations?":
              - /url: offence-analysis#offence_analysis_motivations-question
          - term: Who was the offence committed against?
          - definition:
            - paragraph: One or more people
          - definition:
            - link "Change Who was the offence committed against?":
              - /url: offence-analysis#offence_analysis_who_was_the_victim-question
          - term: How many other people were involved with committing the current index offence(s)?
          - definition:
            - paragraph: None
          - definition:
            - link "Change How many other people were involved with committing the current index offence(s)?":
              - /url: offence-analysis-involved-parties#offence_analysis_how_many_involved-question
          - term: Was Test the leader of the current index offence(s)?
          - definition:
            - paragraph: "No"
          - definition:
            - link "Change Was Test the leader of the current index offence(s)?":
              - /url: offence-analysis-impact#offence_analysis_leader-question
          - term: Does Test recognise the impact on the victims or wider community?
          - definition:
            - paragraph: "No"
          - definition:
            - link "Change Does Test recognise the impact on the victims or wider community?":
              - /url: offence-analysis-impact#offence_analysis_impact_on_victims-question
          - term: Does Test accept responsibility for the current index offence(s)?
          - definition:
            - paragraph: "No"
          - definition:
            - link "Change Does Test accept responsibility for the current index offence(s)?":
              - /url: offence-analysis-impact#offence_analysis_accept_responsibility-question
          - term: Is there an escalation in seriousness from previous offending?
          - definition:
            - paragraph: "No"
          - definition:
            - link "Change Is there an escalation in seriousness from previous offending?":
              - /url: offence-analysis-impact#offence_analysis_escalation-question
          - term: What are the patterns of offending?
          - definition:
            - paragraph: test
          - definition:
            - link "Change What are the patterns of offending?":
              - /url: offence-analysis-impact#offence_analysis_patterns_of_offending-question
          - term: Are the current or previous offences linked to risk of serious harm, risks to the individual or other risks?
          - definition:
            - paragraph: "No"
            - paragraph: test
          - definition:
            - link "Change Are the current or previous offences linked to risk of serious harm, risks to the individual or other risks?":
              - /url: offence-analysis-impact#offence_analysis_risk-question
          - heading "First victim" [level=2]
          - list:
            - listitem:
              - link "Change (First victim)":
                - /url: offence-analysis-victim/edit/0#offence_analysis_victim_relationship-question
            - listitem:
              - link "Delete (First victim)":
                - /url: "#"
          - term: Who is the victim?
          - definition:
            - /children: equal
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
