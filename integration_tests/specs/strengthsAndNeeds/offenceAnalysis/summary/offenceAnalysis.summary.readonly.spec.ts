import { expect } from '@playwright/test'
import OffenceAnalysisPage from 'pages/strengthsAndNeeds/offenceAnalysisPage'
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

    await OffenceAnalysisPage.navigateToView(page, handoverLink, baseURL, sanAssessmentId, 'offence-analysis-analysis')
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
        - term: Is there evidence that Test has ever been a perpetrator of domestic abuse?
        - definition:
          - paragraph: "No"
        - term: Is there evidence that Test has ever been a victim of domestic abuse?
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
