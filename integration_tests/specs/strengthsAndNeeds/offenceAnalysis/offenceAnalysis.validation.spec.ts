import { expect } from '@playwright/test'
import OffenceAnalysisPage from 'pages/strengthsAndNeeds/offenceAnalysisPage'
import { test, TargetService } from '../../../support/fixtures'

test.describe('Validation', () => {
  test('validation give details option', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId).withAnswers([
        {
          question: 'offence_analysis_description_of_offence',
          value: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                  Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
                  when an unknown printer took a galley of type and scrambled it to make a type specimen book. 
                  It has survived not only five centuries, but also the leap into electronic typesetting, 
                  remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset 
                  sheets containing Lorem Ipsum passages, and more recently with desktop publishing software 
                  like Aldus PageMaker including versions of Lorem Ipsum. Lorem Ipsum is simply dummy text of 
                  the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy 
                  text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to 
                  make a type specimen book. It has survived not only five centuries, but also the leap into 
                  electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with 
                  the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop 
                  publishing software like Aldus PageMaker including versions of Lorem Ipsum. Lorem Ipsum is simply 
                  dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard 
                  dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to 
                  make a type specimen book. It has survived not only five centuries, but also the leap into electronic 
                  typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset 
                  sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus 
                  PageMaker including versions of Lorem Ipsum. Lorem Ipsum is simply dummy text of the printing and 
                  typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
                  when an unknown printer took a galley of type and scrambled it to make a type specimen book. 
                  It has survived not only five. Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                  Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
                  when an unknown printer took a galley of type and scrambled it to make a type specimen book. 
                  It has survived not only five centuries, but also the leap into electronic typesetting, 
                  remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets 
                  containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker 
                  including versions of Lorem Ipsum. Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                  Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
                  when an unknown printer took a galley of type and scrambled it to make a type specimen book. 
                  It has survived not only five centuries, but also the leap into electronic typesetting, 
                  remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets 
                  containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker 
                  including versions of Lorem Ipsum. Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                  Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
                  when an unknown printer took a galley of type and scrambled it to make a type specimen book. 
                  It has survived not only five centuries, but also the leap into electronic typesetting, 
                  remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets 
                  containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker 
                  including versions of Lorem Ipsum. Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                  Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
                  when an unknown printer took a galley of type and scrambled it to make a type specimen book. 
                  It has survived not only fi.`,
        },
      ]).save()

    await OffenceAnalysisPage.navigateToOffenceAnalysis(page, handoverLink, baseURL, sanAssessmentId)
  })

  test('validation other options', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId).withAnswers([
        {
          question: 'offence_analysis_commited_against',
          value: ['OTHER'],
        },
        {
          question: 'offence_analysis_motivations',
          value: ['OTHER'],
        },
      ]).save()

    await OffenceAnalysisPage.navigateToOffenceAnalysis(page, handoverLink, baseURL, sanAssessmentId)

    const offenceAnalysisPage = await OffenceAnalysisPage.verifyOnPage(page, 'Enter a brief description of')

    await expect(offenceAnalysisPage.mainSection).toMatchAriaSnapshot(`
      - group "Did the current index offence(s) involve any of the following motivations?":
        - text: Did the current index offence(s) involve any of the following motivations? Select all that apply.
        - checkbox "Addictions or perceived needs"
        - text: Addictions or perceived needs
        - checkbox "Being pressurised or led into offending by others"
        - text: Being pressurised or led into offending by others
        - checkbox "Emotional state of Test"
        - text: Emotional state of Test
        - checkbox "Financial motivation"
        - text: Financial motivation
        - checkbox "Hatred of identifiable groups"
        - text: Hatred of identifiable groups
        - checkbox "Seeking or exerting power"
        - text: Seeking or exerting power
        - checkbox "Sexual motivation"
        - text: Sexual motivation
        - checkbox "Thrill seeking"
        - text: Thrill seeking
        - checkbox "Other" [checked] [expanded]
        - text: Other Give details
        - textbox "Give details"
        - text: You can enter up to 200 characters You have 200 characters remaining
      - group "Who was the offence committed against?":
        - text: Who was the offence committed against? Select all that apply.
        - checkbox "One or more people"
        - text: One or more people
        - checkbox "Other"
        - text: Other For example, a business or the wider community.
    `)
  })

  test('validation offence(s) committed', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder.fresh().save()

    await OffenceAnalysisPage.navigateToOffenceAnalysis(page, handoverLink, baseURL, sanAssessmentId)

    const offenceAnalysisPage = await OffenceAnalysisPage.verifyOnPage(page, 'Enter a brief description of')
    await offenceAnalysisPage.saveAndContinue.click()

    await expect(offenceAnalysisPage.alert).toMatchAriaSnapshot(`
      - alert:
        - heading "There is a problem" [level=2]
        - list:
          - /children: equal
          - listitem:
            - link "Enter details":
              - /url: "#offence_analysis_description_of_offence"
          - listitem:
            - link "Select if the offence(s) had any of the elements":
              - /url: "#offence_analysis_elements"
          - listitem:
            - link "Enter details":
              - /url: "#offence_analysis_reason"
          - listitem:
            - link "Select if the offence(s) involved any of the following motivations":
              - /url: "#offence_analysis_motivations"
          - listitem:
            - link "Select who the offence was committed against":
              - /url: "#offence_analysis_who_was_the_victim"
    `)

    await offenceAnalysisPage.enterDetailsError.click()
    await expect(offenceAnalysisPage.enterDescription).toBeFocused()
    await offenceAnalysisPage.enterDetailsWhy.click()
    await expect(offenceAnalysisPage.enterWhy).toBeFocused()
    await offenceAnalysisPage.selectIfTheOffence.click()
    await expect(offenceAnalysisPage.arson).toBeFocused()
    await offenceAnalysisPage.selectIfTheOffenceInvolved.click()
    await expect(offenceAnalysisPage.addictions).toBeFocused()
    await offenceAnalysisPage.selectWhoOffenceWas.click()
    await expect(offenceAnalysisPage.oneOrMore).toBeFocused()
  })

  test('validation victim', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
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
          question: 'offence_analysis_offence_elements',
          value: ['ARSON'],
        },
        {
          question: 'offence_analysis_why_offence_happened',
          value: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
        },
        {
          question: 'offence_analysis_motivations',
          value: ['ADDICTIONS_PERCEIVED_NEEDS'],
        },
        {
          question: 'offence_analysis_commited_against',
          value: ['ONE_OR_MORE_PEOPLE'],
        },
      ]).save()

    await OffenceAnalysisPage.navigateToOffenceAnalysis(
      page,
      handoverLink,
      baseURL,
      sanAssessmentId,
      'offence-analysis-victim/create',
    )

    const offenceAnalysisPage = await OffenceAnalysisPage.verifyOnPage(page, 'Who is the victim')

    await offenceAnalysisPage.saveAndContinue.click()

    await expect(offenceAnalysisPage.alert).toMatchAriaSnapshot(`
      - alert:
        - heading "There is a problem" [level=2]
        - list:
          - /children: equal
          - listitem:
            - link "Select who the victim is":
              - /url: "#offence_analysis_victim_relationship"
          - listitem:
            - link "Select approximate age":
              - /url: "#offence_analysis_victim_age"
          - listitem:
            - link "Select sex":
              - /url: "#offence_analysis_victim_sex"
          - listitem:
            - link "Select the victim's ethnicity":
              - /url: "#offence_analysis_victim_race"
    `)

    await offenceAnalysisPage.selectWhoTheVictim.click()
    await expect(offenceAnalysisPage.stranger).toBeFocused()
    await offenceAnalysisPage.selectSex.click()
    await expect(offenceAnalysisPage.male).toBeFocused()
    await offenceAnalysisPage.selectAge.click()
    await expect(offenceAnalysisPage.zeroToFour).toBeFocused()
    await offenceAnalysisPage.selectEthnicity.click()
    await expect(offenceAnalysisPage.victimsEthnicity).toBeFocused()
  })
})
