import { expect } from '@playwright/test'
import OffenceAnalysisPage from 'pages/strengthsAndNeeds/offenceAnalysisPage'
import { test, TargetService } from '../../support/fixtures'
import { buildPageTitle, checkAccessibility, sanPageTitles } from './sanUtils'

test.describe('Offence Analysis Page', () => {
  test.describe('Questions', () => {
    test('shows offence(s) committed', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
      const { handoverLink } = await createSession({ targetService: TargetService.STRENGTHS_AND_NEEDS })
      await strengthsAndNeedsBuilder.fresh().save()

      await OffenceAnalysisPage.navigateToOffenceAnalysis(page, handoverLink, baseURL)

      const offenceAnalysisPage = await OffenceAnalysisPage.verifyOnPage(page, 'Enter a brief description of')

      await expect(page).toHaveTitle(buildPageTitle(sanPageTitles.offenceAnalysis))

      await expect(offenceAnalysisPage.mainSection).toMatchAriaSnapshot(`
        - text: Enter a brief description of the current index offence(s)
        - textbox "Enter a brief description of the current index offence(s)"
        - text: You can enter up to 4000 characters You have 4,000 characters remaining
        - group "Did the current index offence(s) have any of the following elements?":
          - text: Did the current index offence(s) have any of the following elements? Select all that apply.
          - checkbox "Arson"
          - text: Arson
          - checkbox "Domestic abuse"
          - text: Domestic abuse
          - checkbox "Excessive violence or sadistic violence"
          - text: Excessive violence or sadistic violence
          - checkbox "Hatred of identifiable groups"
          - text: Hatred of identifiable groups
          - checkbox "Physical damage to property"
          - text: Physical damage to property
          - checkbox "Sexual element"
          - text: Sexual element
          - checkbox "Victim targeted"
          - text: Victim targeted
          - checkbox "Violence, or threat of violence or coercion"
          - text: Violence, or threat of violence or coercion
          - checkbox "Weapon"
          - text: Weapon or
          - checkbox "None"
          - text: None
        - text: Why did the current index offence(s) happen?
        - textbox "Why did the current index offence(s) happen?"
        - text: You can enter up to 4000 characters You have 4,000 characters remaining
        - group "Did the current index offence(s) involve any of the following motivations?":
          - text: Did the current index offence(s) involve any of the following motivations? Select all that apply.
          - checkbox "Addictions or perceived needs"
          - text: Addictions or perceived needs
          - checkbox "Being pressurised or led into offending by others"
          - text: Being pressurised or led into offending by others
          - checkbox "Emotional state of Christy"
          - text: Emotional state of Christy
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
          - checkbox "Other"
          - text: Other
        - group "Who was the offence committed against?":
          - text: Who was the offence committed against? Select all that apply.
          - checkbox "One or more people"
          - text: One or more people
          - checkbox "Other"
          - text: Other For example, a business or the wider community.
        - button "Save and continue"
      `)
    })

    test('shows victim', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
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

      await OffenceAnalysisPage.navigateToOffenceAnalysis(page, handoverLink, baseURL, 'offence-analysis-victim/create')

      const offenceAnalysisPage = await OffenceAnalysisPage.verifyOnPage(page, 'Who is the victim')

      expect(offenceAnalysisPage.mainSection).toMatchAriaSnapshot(`
        - group "Who is the victim?":
          - text: Who is the victim?
          - radio "A stranger"
          - text: A stranger
          - radio "Criminal justice staff"
          - text: Criminal justice staff
          - radio "Test's parent or step-parent"
          - text: Test's parent or step-parent
          - radio "Test's partner"
          - text: Test's partner
          - radio "Test's ex-partner"
          - text: Test's ex-partner
          - radio "Test's child or step-child"
          - text: Test's child or step-child
          - radio "Other family member"
          - text: Other family member
          - radio "Other"
          - text: Other
        - group "What is the victim's approximate age?":
          - text: What is the victim's approximate age?
          - radio "0 to 4 years"
          - text: 0 to 4 years
          - radio "5 to 11 years"
          - text: 5 to 11 years
          - radio "12 to 15 years"
          - text: 12 to 15 years
          - radio "16 to 17 years"
          - text: 16 to 17 years
          - radio "18 to 20 years"
          - text: 18 to 20 years
          - radio "21 to 25 years"
          - text: 21 to 25 years
          - radio "26 to 49 years"
          - text: 26 to 49 years
          - radio "50 to 64 years"
          - text: 50 to 64 years
          - radio "65 years and over"
          - text: 65 years and over
          - radio "Unknown"
          - text: Unknown
        - group "What is the victim's sex?":
          - text: What is the victim's sex?
          - radio "Male"
          - text: Male
          - radio "Female"
          - text: Female
          - radio "Intersex"
          - text: Intersex
          - radio "Unknown"
          - text: Unknown
        - text: What is the victim's ethnicity?
        - combobox "What is the victim's ethnicity?":
          - option "Select the victim's ethnicity" [disabled] [selected]
          - option "Select the victim’s ethnicity"
          - option "White - English, Welsh, Scottish, Northern Irish or British"
          - option "White - Irish"
          - option "White - Gypsy or Irish Traveller"
          - option "White - Roma"
          - option "White - Any other white background"
          - option "Mixed - White and Black Caribbean"
          - option "Mixed - White and Black African"
          - option "Mixed - White and Asian"
          - option "Mixed - Any other mixed or multiple ethnic background"
          - option "Asian or Asian British - Indian"
          - option "Asian or Asian British - Pakistani"
          - option "Asian or Asian British - Bangladeshi"
          - option "Asian or Asian British - Chinese"
          - option "Asian or Asian British - Any other Asian background"
          - option "Black or Black British - Caribbean"
          - option "Black or Black British - African"
          - option "Black or Black British - Any other Black background"
          - option "Arab"
          - option "Any other ethnic group"
          - option "Unknown"
        - button "Save and continue"
      `)
    })
  })

  test.describe('Validation', () => {
    test('validation give details option', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
      const { handoverLink, sanAssessmentId } = await createSession({
        targetService: TargetService.STRENGTHS_AND_NEEDS,
      })
      await strengthsAndNeedsBuilder
        .extend(sanAssessmentId).withAnswers([
          {
            question: 'offence_analysis_index_offence_description',
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

      await OffenceAnalysisPage.navigateToOffenceAnalysis(page, handoverLink, baseURL)

      const offenceAnalysisPage = await OffenceAnalysisPage.verifyOnPage(page, 'Enter a brief description of')

      expect(await offenceAnalysisPage.giveDetailsCharacterError('883')).toBeVisible()
    })

    test('validation offence(s) committed', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
      const { handoverLink } = await createSession({
        targetService: TargetService.STRENGTHS_AND_NEEDS,
      })
      await strengthsAndNeedsBuilder.fresh().save()

      await OffenceAnalysisPage.navigateToOffenceAnalysis(page, handoverLink, baseURL)

      const offenceAnalysisPage = await OffenceAnalysisPage.verifyOnPage(page, 'Enter a brief description of')
      await offenceAnalysisPage.saveAndContinue.click()

      await expect(offenceAnalysisPage.alert).toMatchAriaSnapshot(`
        - alert:
          - heading "There is a problem" [level=2]
          - list:
            - /children: equal
            - listitem:
              - link "Enter details":
                - /url: "#offence_analysis_index_offence_description"
            - listitem:
              - link "Select if the offence(s) had any of the elements":
                - /url: "#offence_analysis_offence_elements"
            - listitem:
              - link "Enter details":
                - /url: "#offence_analysis_why_offence_happened"
            - listitem:
              - link "Select if the offence(s) involved any of the following motivations":
                - /url: "#offence_analysis_motivations"
            - listitem:
              - link "Select who the offence was committed against":
                - /url: "#offence_analysis_commited_against"
      `)

      await offenceAnalysisPage.enterDetails.click()
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

      await OffenceAnalysisPage.navigateToOffenceAnalysis(page, handoverLink, baseURL, 'offence-analysis-victim/create')

      const offenceAnalysisPage = await OffenceAnalysisPage.verifyOnPage(page, 'Who is the victim')

      await offenceAnalysisPage.saveAndContinue.click()

      await expect(offenceAnalysisPage.alert).toMatchAriaSnapshot(`
        - alert:
          - heading "There is a problem" [level=2]
          - list:
            - /children: equal
            - listitem:
              - link "Select who the victim is":
                - /url: "#offence_analysis_victim_type"
            - listitem:
              - link "Select approximate age":
                - /url: "#offence_analysis_victim_age"
            - listitem:
              - link "Select sex":
                - /url: "#offence_analysis_victim_sex"
            - listitem:
              - link "Select the victim's ethnicity":
                - /url: "#offence_analysis_victim_ethnicity"
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

  test.describe('Accessibility', () => {
    test('should be accessible', async ({ page, createSession, baseURL }) => {
      const { handoverLink } = await createSession({ targetService: TargetService.STRENGTHS_AND_NEEDS })

      await OffenceAnalysisPage.navigateToOffenceAnalysis(page, handoverLink, baseURL)
      await checkAccessibility(page, {
        // https://github.com/alphagov/govuk-design-system-backlog/issues/59#issuecomment-2854891330
        disableRules: ['aria-allowed-attr'],
      })
    })
  })
})
