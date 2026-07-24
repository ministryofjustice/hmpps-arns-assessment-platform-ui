import { expect } from '@playwright/test'
import DrugUsePage from 'pages/strengthsAndNeeds/drugUsePage'
import { test, TargetService } from '../../support/fixtures'
import { buildPageTitle, checkAccessibility, sanPageTitles } from './sanUtils'

test.describe('Drug use Page', () => {
  test.describe('Questions', () => {
    test('shows ever misused drugs', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
      const { handoverLink } = await createSession({ targetService: TargetService.STRENGTHS_AND_NEEDS })
      await strengthsAndNeedsBuilder.fresh().save()

      await DrugUsePage.navigateToDrugUse(page, handoverLink, baseURL)

      const drugUsePage = await DrugUsePage.verifyOnPage(page, 'ever misused drugs')

      await expect(page).toHaveTitle(buildPageTitle(sanPageTitles.drugUse))

      await expect(drugUsePage.mainSection).toMatchAriaSnapshot(`
          - group "Has Test ever misused drugs?":
            - text: Has Test ever misused drugs? This includes illegal and prescription drugs.
            - radio "Yes"
            - text: "Yes"
            - radio "No"
            - text: "No"
          - button "Save and continue"
      `)
    })

    test('validation ever misused drugs', async ({ page, createSession, baseURL }) => {
      const { handoverLink } = await createSession({
        targetService: TargetService.STRENGTHS_AND_NEEDS,
      })

      await DrugUsePage.navigateToDrugUse(page, handoverLink, baseURL)

      const drugUsePage = await DrugUsePage.verifyOnPage(page, 'ever misused drugs')

      await drugUsePage.saveAndContinue.click()
      await drugUsePage.selectIfEverMisusedDrugs.click()

      await expect(drugUsePage.yes).toBeFocused()
    })

    test('shows misused drugs questions', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
      const { handoverLink, sanAssessmentId } = await createSession({
        targetService: TargetService.STRENGTHS_AND_NEEDS,
      })
      await strengthsAndNeedsBuilder
        .extend(sanAssessmentId).withAnswers([
          { question: 'drug_use', value: 'YES' },
          { question: 'drugs_section_status', value: 'INCOMPLETE' },
        ]).save()

      await DrugUsePage.navigateToDrugUse(page, handoverLink, baseURL, 'add-drugs')

      const drugUsePage = await DrugUsePage.verifyOnPage(page, 'Which drugs has')

      await expect(drugUsePage.mainSection).toMatchAriaSnapshot(`
        - group "Which drugs has Test misused?":
          - text: Which drugs has Test misused? Select all that apply.
          - checkbox "Amphetamines (including speed, methamphetamine)"
          - text: Amphetamines (including speed, methamphetamine)
          - checkbox "Benzodiazepines (including diazepam, temazepam)"
          - text: Benzodiazepines (including diazepam, temazepam)
          - checkbox "Cannabis"
          - text: Cannabis
          - checkbox "Cocaine"
          - text: Cocaine
          - checkbox "Crack cocaine"
          - text: Crack cocaine
          - checkbox "Ecstasy (MDMA)"
          - text: Ecstasy (MDMA)
          - checkbox "Hallucinogens"
          - text: Hallucinogens
          - checkbox "Heroin"
          - text: Heroin
          - checkbox "Methadone (not prescribed)"
          - text: Methadone (not prescribed)
          - checkbox "Prescribed drugs"
          - text: Prescribed drugs
          - checkbox "Other opiates"
          - text: Other opiates
          - checkbox "Solvents (including gases and glues)"
          - text: Solvents (including gases and glues)
          - checkbox "Steroids"
          - text: Steroids
          - checkbox "Synthetic cannabinoids (spice)"
          - text: Synthetic cannabinoids (spice)
          - checkbox "Other"
          - text: Other
        - button "Save and continue"
      `)
    })

    test('shows summary page, never misused drugs', async ({
      page,
      createSession,
      strengthsAndNeedsBuilder,
      baseURL,
    }) => {
      const { handoverLink, sanAssessmentId } = await createSession({
        targetService: TargetService.STRENGTHS_AND_NEEDS,
      })
      await strengthsAndNeedsBuilder
        .extend(sanAssessmentId).withAnswers([
          { question: 'drug_use', value: 'NO' },
          { question: 'drugs_section_status', value: 'INCOMPLETE' },
        ]).save()

      await DrugUsePage.navigateToDrugUse(page, handoverLink, baseURL, 'drug-use-summary')

      const drugUsePage = await DrugUsePage.verifyOnPage(page, 'Summary')

      await expect(drugUsePage.summary).toMatchAriaSnapshot(`
        - tabpanel "Summary":
          - term: Has Test ever misused drugs?
          - definition:
            - paragraph: "No"
          - definition:
            - link "Change":
              - /url: drug-use
          - heading [level=2]
          - heading [level=2]
          - button "Go to practitioner analysis"
      `)
    })

    test('validation misused drugs', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
      const { handoverLink, sanAssessmentId } = await createSession({
        targetService: TargetService.STRENGTHS_AND_NEEDS,
      })

      await strengthsAndNeedsBuilder
        .extend(sanAssessmentId).withAnswers([
          { question: 'drug_use', value: 'YES' },
          { question: 'drugs_section_status', value: 'INCOMPLETE' },
        ]).save()

      await DrugUsePage.navigateToDrugUse(page, handoverLink, baseURL, 'add-drugs')

      const drugUsePage = await DrugUsePage.verifyOnPage(page, 'Which drugs has')

      await drugUsePage.saveAndContinue.click()
      await expect(drugUsePage.selectWhichDrugs).toBeVisible()
    })

    test('shows multi misused drugs questions', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
      const { handoverLink, sanAssessmentId } = await createSession({
        targetService: TargetService.STRENGTHS_AND_NEEDS,
      })
      await strengthsAndNeedsBuilder
        .extend(sanAssessmentId).withAnswers([
          { question: 'drug_use', value: 'YES' },
          { question: 'drugs_section_status', value: 'INCOMPLETE' },
          { question: 'select_misused_drugs', value: ['AMPHETAMINES', 'BENZODIAZEPINES'] },
          { question: 'drug_last_used_amphetamines', value: 'LAST_SIX' },
          { question: 'drug_last_used_benzodiazepines', value: 'MORE_THAN_SIX' },
        ]).save()

      await DrugUsePage.navigateToDrugUse(page, handoverLink, baseURL, 'drug-details')

      const drugUsePage = await DrugUsePage.verifyOnPage(page, 'Not used in the last 6 months')

      await expect(drugUsePage.mainSection).toMatchAriaSnapshot(`
        - heading "Used in the last 6 months" [level=2]
        - group: How to record frequency
        - heading "Amphetamines (including speed, methamphetamine)" [level=2]
        - group "How often is Test using this drug?":
          - text: How often is Test using this drug?
          - radio "Daily"
          - text: Daily
          - radio "Weekly"
          - text: Weekly
          - radio "Monthly"
          - text: Monthly
          - radio "Occasionally"
          - text: Occasionally
        - text: Give details (optional)
        - textbox "Give details (optional)"
        - text: You can enter up to 2000 characters You have 2,000 characters remaining
        - separator
        - heading "Not used in the last 6 months" [level=2]
        - text: Test used benzodiazepines (including diazepam, temazepam) more than 6 months ago. Give details about Test's use of these drugs For example, how often they used these drugs, when they stopped using, and if their use was an issue.
        - textbox "Give details about Test's use of these drugs"
        - text: You can enter up to 2000 characters You have 2,000 characters remaining
        - group "Which drugs has Test injected?":
          - text: Which drugs has Test injected? Select all that apply.
          - checkbox "None"
          - text: None or
          - checkbox "Amphetamines (including speed, methamphetamine)"
          - text: Amphetamines (including speed, methamphetamine)
          - checkbox "Benzodiazepines (including diazepam, temazepam)"
          - text: Benzodiazepines (including diazepam, temazepam)
        - group "Is Test receiving treatment for their drug use?":
          - text: Is Test receiving treatment for their drug use?
          - radio "Yes"
          - text: "Yes"
          - radio "No"
          - text: "No"
        - button "Save and continue"
      `)
    })

    test('shows drug use history questions', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
      const { handoverLink, sanAssessmentId } = await createSession({
        targetService: TargetService.STRENGTHS_AND_NEEDS,
      })
      await strengthsAndNeedsBuilder
        .extend(sanAssessmentId).withAnswers([
          { question: 'drug_use', value: 'YES' },
          { question: 'drugs_section_status', value: 'INCOMPLETE' },
          { question: 'select_misused_drugs', value: ['AMPHETAMINES', 'BENZODIAZEPINES'] },
          { question: 'drug_last_used_amphetamines', value: 'LAST_SIX' },
          { question: 'drug_last_used_benzodiazepines', value: 'MORE_THAN_SIX' },
          { question: 'drugs_injected', value: ['NONE'] },
          { question: 'receiving_treatment', value: 'YES' },
          { question: 'how_often_used_amphetamines', value: 'DAILY' },
          { question: 'receiving_treatment_no_details', value: '' },
          { question: 'how_often_used_amphetamines_details', value: 'test' },
          { question: 'drug_use_more_than_six_months_details', value: 'test' },
          { question: 'receiving_treatment_yes_details', value: 'test' },
        ]).save()

      await DrugUsePage.navigateToDrugUse(page, handoverLink, baseURL, 'drug-use-history')

      const drugUsePage = await DrugUsePage.verifyOnPage(page, 'use drugs?')

      await expect(drugUsePage.mainSection).toMatchAriaSnapshot(`
        - group "Why does Test use drugs?":
          - text: Why does Test use drugs? Consider why they started using, their history, and any triggers. Select all that apply.
          - checkbox "Cultural or religious practice"
          - text: Cultural or religious practice
          - checkbox "Curiosity or experimentation"
          - text: Curiosity or experimentation
          - checkbox "Enhance performance"
          - text: Enhance performance
          - checkbox "Escapism or avoidance"
          - text: Escapism or avoidance
          - checkbox "Manage stress or emotional issues"
          - text: Manage stress or emotional issues
          - checkbox "Peer pressure or social influence"
          - text: Peer pressure or social influence
          - checkbox "Recreation or pleasure"
          - text: Recreation or pleasure
          - checkbox "Self-medication"
          - text: Self-medication
          - checkbox "Other"
          - text: Other
        - text: Give details (optional)
        - textbox "Give details (optional)"
        - text: You can enter up to 2000 characters You have 2,000 characters remaining
        - group "How has Test's drug use affected their life?":
          - text: How has Test's drug use affected their life? Select all that apply.
          - checkbox "Behaviour"
          - text: Behaviour Includes unemployment, disruption on education or lack of productivity.
          - checkbox "Community"
          - text: Community Includes limited opportunities or judgement from others.
          - checkbox "Finances"
          - text: Finances Includes having no money.
          - checkbox "Links to offending"
          - text: Links to offending
          - checkbox "Physical or mental health"
          - text: Physical or mental health Includes overdose.
          - checkbox "Relationships"
          - text: Relationships Includes isolation or neglecting responsibilities.
          - checkbox "Other"
          - text: Other
        - text: Give details (optional)
        - textbox "Give details (optional)"
        - text: You can enter up to 2000 characters You have 2,000 characters remaining Has anything helped Test stop or reduce their drug use? (optional) Note any treatment or lifestyle changes that have helped them.
        - textbox "Has anything helped Test stop or reduce their drug use? (optional)"
        - text: You can enter up to 2000 characters You have 2,000 characters remaining
        - group "Does Test want to make changes to their drug use?":
          - text: Does Test want to make changes to their drug use?
          - radio "I have already made positive changes and want to maintain them"
          - text: I have already made positive changes and want to maintain them
          - radio "I am actively making changes"
          - text: I am actively making changes
          - radio "I want to make changes and know how to"
          - text: I want to make changes and know how to
          - radio "I want to make changes but need help"
          - text: I want to make changes but need help
          - radio "I am thinking about making changes"
          - text: I am thinking about making changes
          - radio "I do not want to make changes"
          - text: I do not want to make changes
          - radio "I do not want to answer"
          - text: I do not want to answer or
          - radio "Not applicable"
          - text: Not applicable
        - button "Save and continue"
      `)
    })
  })

  test.describe('Summary', () => {
    test('shows summary page, never misused drugs', async ({
      page,
      createSession,
      strengthsAndNeedsBuilder,
      baseURL,
    }) => {
      const { handoverLink, sanAssessmentId } = await createSession({
        targetService: TargetService.STRENGTHS_AND_NEEDS,
      })
      await strengthsAndNeedsBuilder
        .extend(sanAssessmentId).withAnswers([
          { question: 'drug_use', value: 'NO' },
          { question: 'drugs_section_status', value: 'INCOMPLETE' },
        ]).save()

      await DrugUsePage.navigateToDrugUse(page, handoverLink, baseURL, 'drug-use-summary')

      const drugUsePage = await DrugUsePage.verifyOnPage(page, 'Summary')

      await expect(drugUsePage.summary).toMatchAriaSnapshot(`
        - tabpanel "Summary":
          - term: Has Test ever misused drugs?
          - definition:
            - paragraph: "No"
          - definition:
            - link "Change":
              - /url: drug-use
          - heading [level=2]
          - heading [level=2]
          - button "Go to practitioner analysis"
      `)
    })
  })

  test.describe('Accessibility', () => {
    test('should be accessible', async ({ page, createSession, baseURL }) => {
      const { handoverLink } = await createSession({ targetService: TargetService.STRENGTHS_AND_NEEDS })

      await DrugUsePage.navigateToDrugUse(page, handoverLink, baseURL)
      await checkAccessibility(page, {
        // https://github.com/alphagov/govuk-design-system-backlog/issues/59#issuecomment-2854891330
        disableRules: ['aria-allowed-attr'],
      })
    })
  })
})
