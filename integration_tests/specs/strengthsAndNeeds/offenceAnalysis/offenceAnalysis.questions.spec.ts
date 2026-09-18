import { expect } from '@playwright/test'
import OffenceAnalysisPage from 'pages/strengthsAndNeeds/offenceAnalysisPage'
import { test, TargetService } from '../../../support/fixtures'
import { buildPageTitle, sanPageTitles } from '../sanUtils'

test.describe('Questions', () => {
  test('shows offence(s) committed', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder.fresh().save()

    await OffenceAnalysisPage.navigateTo(page, handoverLink, baseURL, sanAssessmentId)

    const offenceAnalysisPage = await OffenceAnalysisPage.verifyOnPage(page, 'Enter a brief description of')

    await expect(page).toHaveTitle(buildPageTitle(sanPageTitles.offenceAnalysis))

    await expect(offenceAnalysisPage.mainForm).toMatchAriaSnapshot(`
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
          question: 'offence_analysis_description_of_offence',
          value: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
        },
        {
          question: 'offence_analysis_elements',
          value: ['ARSON'],
        },
        {
          question: 'offence_analysis_reason',
          value: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
        },
        {
          question: 'offence_analysis_motivations',
          value: ['ADDICTIONS_PERCEIVED_NEEDS'],
        },
        {
          question: 'offence_analysis_who_was_the_victim',
          value: ['ONE_OR_MORE_PEOPLE'],
        },
      ]).save()

    await OffenceAnalysisPage.navigateTo(page, handoverLink, baseURL, sanAssessmentId, 'offence-analysis-victim/create')

    const offenceAnalysisPage = await OffenceAnalysisPage.verifyOnPage(page, 'Who is the victim')

    expect(offenceAnalysisPage.mainForm).toMatchAriaSnapshot(`
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

  test('shows other people', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId).withAnswers([
        {
          question: 'offence_analysis_description_of_offence',
          value: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
        },
        {
          question: 'offence_analysis_elements',
          value: ['ARSON'],
        },
        {
          question: 'offence_analysis_reason',
          value: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
        },
        {
          question: 'offence_analysis_motivations',
          value: ['ADDICTIONS_PERCEIVED_NEEDS'],
        },
        {
          question: 'offence_analysis_who_was_the_victim',
          value: ['OTHER'],
        },
        {
          question: 'offence_analysis_who_was_the_victim_other_details',
          value: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
        },
      ]).save()

    await OffenceAnalysisPage.navigateTo(
      page,
      handoverLink,
      baseURL,
      sanAssessmentId,
      'offence-analysis-involved-parties',
    )

    const offenceAnalysisPage = await OffenceAnalysisPage.verifyOnPage(page, 'How many other people')

    expect(offenceAnalysisPage.mainForm).toMatchAriaSnapshot(`
      - group "How many other people were involved with committing the current index offence(s)?":
        - text: How many other people were involved with committing the current index offence(s)?
        - radio "None"
        - text: None
        - radio "1"
        - text: "1"
        - radio "2"
        - text: "2"
        - radio "3"
        - text: "3"
        - radio "4"
        - text: "4"
        - radio "5"
        - text: "5"
        - radio "6 to 10"
        - text: 6 to 10
        - radio "11 to 15"
        - text: 11 to 15
        - radio "More than 15"
        - text: More than 15
      - button "Save and continue"
    `)
  })
})
