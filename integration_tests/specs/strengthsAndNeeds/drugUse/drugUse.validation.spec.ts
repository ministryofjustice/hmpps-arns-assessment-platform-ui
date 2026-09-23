import { CommonOption } from '@server/forms/strengths-and-needs/versions/v1.0/constants/commonOption'
import { Option } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/drug-use/constants/option'
import { Question } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/drug-use/constants/question'
import { expect } from '@playwright/test'
import DrugUsePage from 'pages/strengthsAndNeeds/drugUsePage'
import { forDrug } from '../sanUtils'
import { test, TargetService } from '../../../support/fixtures'

test.describe('Validation', () => {
  test('validation ever misused drugs', async ({ page, createSession, baseURL }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })

    await DrugUsePage.navigateTo(page, handoverLink, baseURL, sanAssessmentId)

    const drugUsePage = await DrugUsePage.verifyOnPage(page, 'ever misused drugs')

    const { questions } = drugUsePage

    await drugUsePage.saveAndContinue.click()
    await questions.drug_use.errorLink.click()
    await expect(questions.drug_use.input).toBeFocused()
  })

  test('validation misused drugs', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })

    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId).withAnswers([{ question: Question.drug_use, value: CommonOption.yes }]).save()

    await DrugUsePage.navigateTo(page, handoverLink, baseURL, sanAssessmentId, 'add-drugs')

    const drugUsePage = await DrugUsePage.verifyOnPage(page, 'Which drugs has')

    await drugUsePage.saveAndContinue.click()
    await expect(drugUsePage.alert.getByRole('link', { name: 'Select which drugs they’ve misused' })).toBeVisible()
  })

  test('validation drug use history questions', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId).withAnswers([
        { question: Question.drug_use, value: CommonOption.yes },
        { question: Question.select_misused_drugs, value: [Option.amphetamines, Option.benzodiazepines] },
        { question: forDrug(Question.drug_last_used_value, Option.amphetamines), value: Option.last_six },
        { question: forDrug(Question.drug_last_used_value, Option.benzodiazepines), value: Option.more_than_six },
        { question: Question.drugs_injected, value: [CommonOption.none] },
        { question: Question.drugs_is_receiving_treatment, value: CommonOption.yes },
        { question: forDrug(Question.how_often_used_value, Option.amphetamines), value: Option.daily },
        { question: Question.drugs_is_receiving_treatment_no_details, value: '' },
        { question: forDrug(Question.how_often_used_details, Option.amphetamines), value: 'test' },
        { question: Question.not_used_in_last_six_months_details, value: 'test' },
        { question: Question.drugs_is_receiving_treatment_yes_details, value: 'test' },
      ]).save()

    await DrugUsePage.navigateTo(page, handoverLink, baseURL, sanAssessmentId, 'drug-use-history')

    const drugUsePage = await DrugUsePage.verifyOnPage(page, 'use drugs?')

    const { questions } = drugUsePage

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

    await questions.drugs_reasons_for_use.errorLink.click()
    await expect(questions.drugs_reasons_for_use.input).toBeFocused()
    await questions.drugs_affected_their_life.errorLink.click()
    await expect(questions.drugs_affected_their_life.input).toBeFocused()
    await questions.drug_use_changes.errorLink.click()
    await expect(questions.drug_use_changes.input).toBeFocused()
  })
})
