import { expect } from '@playwright/test'
import OffenceAnalysisPage from 'pages/strengthsAndNeeds/offenceAnalysisPage'
import { test, TargetService } from '../../../support/fixtures'

test.describe('Summary', () => {
  test('shows summary page', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
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
        {
          question: 'offence_analysis_description_of_offence',
          value: 'test',
        },
        {
          question: 'offence_analysis_leader',
          value: 'NO',
        },
        {
          question: 'offence_analysis_leader_no_details',
          value: '',
        },
        {
          question: 'offence_analysis_impact_on_victims',
          value: 'NO',
        },
        {
          question: 'offence_analysis_impact_on_victims_no_details',
          value: '',
        },
        {
          question: 'offence_analysis_accept_responsibility',
          value: 'NO',
        },
        {
          question: 'offence_analysis_accept_responsibility_no_details',
          value: '',
        },
        {
          question: 'offence_analysis_escalation',
          value: 'NO',
        },
        {
          question: 'offence_analysis_escalation_no_details',
          value: '',
        },
        {
          question: 'offence_analysis_perpetrator_of_domestic_abuse',
          value: 'NO',
        },
        {
          question: 'offence_analysis_victim_of_domestic_abuse',
          value: 'NO',
        },
        {
          question: 'offence_analysis_patterns_of_offending',
          value: 'test',
        },
        {
          question: 'offence_analysis_risk',
          value: 'NO',
        },
        {
          question: 'offence_analysis_risk_no_details',
          value: 'test',
        },
        {
          question: 'offence_analysis_section_complete',
          value: 'YES',
        },
        {
          question: 'offence_analysis_how_many_involved',
          value: 'NONE',
        },
      ])
      .withCollectionItems('OFFENCE_ANALYSIS_VICTIM', [
        {
          question: 'offence_analysis_victim_relationship',
          value: 'STRANGER',
        },
        {
          question: 'offence_analysis_victim_age',
          value: 'AGE_5_TO_11_YEARS',
        },
        {
          question: 'offence_analysis_victim_sex',
          value: 'MALE',
        },
        {
          question: 'offence_analysis_victim_race',
          value: 'WHITE_ENGLISH_WELSH_SCOTTISH_NORTHERN_IRISH_OR_BRITISH',
        },
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
            - link "Change":
              - /url: offence-analysis#offence_analysis_description_of_offence
          - term: Did the current index offence(s) have any of the following elements?
          - definition:
            - paragraph: Arson
          - definition:
            - link "Change":
              - /url: offence-analysis#offence_analysis_elements
          - term: Why did the current index offence(s) happen?
          - definition:
            - paragraph: test
          - definition:
            - link "Change":
              - /url: offence-analysis#offence_analysis_reason
          - term: Did the current index offence(s) involve any of the following motivations?
          - definition:
            - paragraph: Addictions or perceived needs
          - definition:
            - link "Change":
              - /url: offence-analysis#offence_analysis_motivations
          - term: Who was the offence committed against?
          - definition:
            - paragraph: One or more people
          - definition:
            - link "Change":
              - /url: offence-analysis#offence_analysis_who_was_the_victim
          - term: How many other people were involved with committing the current index offence(s)?
          - definition:
            - paragraph: None
          - definition:
            - link "Change":
              - /url: offence-analysis-involved-parties#offence_analysis_how_many_involved
          - term: Was Test the leader of the current index offence(s)?
          - definition:
            - paragraph: "No"
          - definition:
            - link "Change":
              - /url: offence-analysis-impact#offence_analysis_leader
          - term: Does Test recognise the impact on the victims or wider community?
          - definition:
            - paragraph: "No"
          - definition:
            - link "Change":
              - /url: offence-analysis-impact#offence_analysis_impact_on_victims
          - term: Does Test accept responsibility for the current index offence(s)?
          - definition:
            - paragraph: "No"
          - definition:
            - link "Change":
              - /url: offence-analysis-impact#offence_analysis_accept_responsibility
          - term: Is there an escalation in seriousness from previous offending?
          - definition:
            - paragraph: "No"
          - definition:
            - link "Change":
              - /url: offence-analysis-impact#offence_analysis_escalation
          - term: Is there evidence that Test has ever been a perpetrator of domestic abuse?
          - definition:
            - paragraph: "No"
          - definition:
            - link "Change":
              - /url: offence-analysis-impact#offence_analysis_perpetrator_of_domestic_abuse
          - term: Is there evidence that Test has ever been a victim of domestic abuse?
          - definition:
            - paragraph: "No"
          - definition:
            - link "Change":
              - /url: offence-analysis-impact#offence_analysis_victim_of_domestic_abuse
          - term: What are the patterns of offending?
          - definition:
            - paragraph: test
          - definition:
            - link "Change":
              - /url: offence-analysis-impact#offence_analysis_patterns_of_offending
          - term: Are the current or previous offences linked to risk of serious harm, risks to the individual or other risks?
          - definition:
            - paragraph: "No"
            - paragraph: test
          - definition:
            - link "Change":
              - /url: offence-analysis-impact#offence_analysis_risk
          - heading "First victim" [level=2]
          - list:
            - listitem:
              - link "Change (First victim)":
                - /url: offence-analysis-victim/edit/0
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
