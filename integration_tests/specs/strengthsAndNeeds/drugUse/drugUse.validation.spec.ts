import { expect } from '@playwright/test'
import DrugUsePage from 'pages/strengthsAndNeeds/drugUsePage'
import { test, TargetService } from '../../../support/fixtures'

test.describe('Validation', () => {
  test('validation ever misused drugs', async ({ page, createSession, baseURL }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })

    await DrugUsePage.navigateToDrugUse(page, handoverLink, baseURL, sanAssessmentId)

    const drugUsePage = await DrugUsePage.verifyOnPage(page, 'ever misused drugs')

    await drugUsePage.saveAndContinue.click()
    await drugUsePage.selectIfEverMisusedDrugs.click()

    await expect(drugUsePage.yes).toBeFocused()
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

    await DrugUsePage.navigateToDrugUse(page, handoverLink, baseURL, sanAssessmentId, 'add-drugs')

    const drugUsePage = await DrugUsePage.verifyOnPage(page, 'Which drugs has')

    await drugUsePage.saveAndContinue.click()
    await expect(drugUsePage.selectWhichDrugs).toBeVisible()
  })

  test('validation drug use history questions', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
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
        { question: 'drugs_is_receiving_treatment', value: 'YES' },
        { question: 'how_often_used_last_six_months_amphetamines', value: 'DAILY' },
        { question: 'drugs_is_receiving_treatment_no_details', value: '' },
        { question: 'how_often_used_last_six_months_amphetamines_details', value: 'test' },
        { question: 'not_used_in_last_six_months_details', value: 'test' },
        { question: 'drugs_is_receiving_treatment_yes_details', value: 'test' },
      ]).save()

    await DrugUsePage.navigateToDrugUse(page, handoverLink, baseURL, sanAssessmentId, 'drug-use-history')

    const drugUsePage = await DrugUsePage.verifyOnPage(page, 'use drugs?')

    await drugUsePage.saveAndContinue.click()
    await expect(drugUsePage.alert).toMatchAriaSnapshot(`
      - alert:
        - heading "There is a problem" [level=2]
        - list:
          - /children: equal
          - listitem:
            - link "Select why they use drugs":
              - /url: "#drugs_reasons_for_use"
          - listitem:
            - link "Select how their drug use has affected their life":
              - /url: "#drugs_affected_their_life"
          - listitem:
            - link "Select if they want to make changes to their drug use":
              - /url: "#drug_use_changes"
    `)

    await drugUsePage.selectWhyTheyUseDrugs.click()
    await expect(drugUsePage.culturalOrReligiousPractice).toBeFocused()
    await drugUsePage.selectHowTheirDrugUse.click()
    await expect(drugUsePage.behaviour).toBeFocused()
    await drugUsePage.errorWantsToMakeChanges.click()
    await expect(drugUsePage.yesAlreadyMadePositiveChanges).toBeFocused()
  })
})
