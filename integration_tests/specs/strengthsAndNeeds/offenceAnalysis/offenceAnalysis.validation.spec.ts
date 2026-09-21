import { CommonOption } from '@server/forms/strengths-and-needs/versions/v1.0/constants/commonOption'
import { Option } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/offence-analysis/constants/option'
import { Question } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/offence-analysis/constants/question'
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
          question: Question.offence_analysis_description_of_offence,
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

    await OffenceAnalysisPage.navigateTo(page, handoverLink, baseURL, sanAssessmentId)
  })

  test('validation other options', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId).withAnswers([
        {
          question: Question.offence_analysis_who_was_the_victim,
          value: [CommonOption.other],
        },
        {
          question: Question.offence_analysis_motivations,
          value: [CommonOption.other],
        },
      ]).save()

    await OffenceAnalysisPage.navigateTo(page, handoverLink, baseURL, sanAssessmentId)

    const offenceAnalysisPage = await OffenceAnalysisPage.verifyOnPage(page, 'Enter a brief description of')

    await expect(offenceAnalysisPage.mainForm).toMatchAriaSnapshot(`
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
        - checkbox "Other" [checked] [expanded]
        - text: Other For example, a business or the wider community. Give details
        - textbox "Give details"
        - text: You can enter up to 2000 characters You have 2,000 characters remaining
    `)
  })

  test('validation offence(s) committed', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder.fresh().save()

    await OffenceAnalysisPage.navigateTo(page, handoverLink, baseURL, sanAssessmentId)

    const offenceAnalysisPage = await OffenceAnalysisPage.verifyOnPage(page, 'Enter a brief description of')

    const { questions } = offenceAnalysisPage

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

    // Two error links both read "Enter details", so each is found by the field it links to
    await questions.offence_analysis_description_of_offence.errorLink.click()
    await expect(questions.offence_analysis_description_of_offence.input).toBeFocused()
    await questions.offence_analysis_reason.errorLink.click()
    await expect(questions.offence_analysis_reason.input).toBeFocused()
    await questions.offence_analysis_elements.errorLink.click()
    await expect(questions.offence_analysis_elements.input).toBeFocused()
    await questions.offence_analysis_motivations.errorLink.click()
    await expect(questions.offence_analysis_motivations.input).toBeFocused()
    await questions.offence_analysis_who_was_the_victim.errorLink.click()
    await expect(questions.offence_analysis_who_was_the_victim.input).toBeFocused()
  })

  test('validation victim', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId).withAnswers([
        {
          question: Question.offence_analysis_description_of_offence,
          value: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
        },
        {
          question: Question.offence_analysis_elements,
          value: [Option.arson],
        },
        {
          question: Question.offence_analysis_reason,
          value: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
        },
        {
          question: Question.offence_analysis_motivations,
          value: [Option.addictions_or_perceived_needs],
        },
        {
          question: Question.offence_analysis_who_was_the_victim,
          value: [Option.one_or_more_person],
        },
      ]).save()

    await OffenceAnalysisPage.navigateTo(page, handoverLink, baseURL, sanAssessmentId, 'offence-analysis-victim/create')

    const offenceAnalysisPage = await OffenceAnalysisPage.verifyOnPage(page, 'Who is the victim')

    const { questions } = offenceAnalysisPage

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

    await questions.offence_analysis_victim_relationship.errorLink.click()
    await expect(questions.offence_analysis_victim_relationship.input).toBeFocused()
    await questions.offence_analysis_victim_sex.errorLink.click()
    await expect(questions.offence_analysis_victim_sex.input).toBeFocused()
    await questions.offence_analysis_victim_age.errorLink.click()
    await expect(questions.offence_analysis_victim_age.input).toBeFocused()
    await questions.offence_analysis_victim_race.errorLink.click()
    await expect(questions.offence_analysis_victim_race.input).toBeFocused()
  })
})
