import { CommonOption } from '@server/forms/strengths-and-needs/versions/v2.0/constants/commonOption'
import { Option } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/drug-use/constants/option'
import { Question } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/drug-use/constants/question'
import { expect } from '@playwright/test'
import DrugUsePage from 'pages/strengthsAndNeedsV2/drugUsePage'
import { Step } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/drug-use/constants/step'
import { forDrug } from '../../sanUtils'
import { test, TargetService } from '../../../../support/fixtures'

test.describe('Validation', () => {
  test('validation ever misused drugs', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
    const { handoverLink, sanAssessmentId } = await createSession({ targetService: TargetService.STRENGTHS_AND_NEEDS })
    await strengthsAndNeedsBuilder.extend(sanAssessmentId, 'v2.0').save()

    await DrugUsePage.navigateTo(page, handoverLink, baseURL, sanAssessmentId)

    const drugUsePage = await DrugUsePage.verifyOnPage(page, 'ever misused drugs')

    const { questions } = drugUsePage

    await drugUsePage.saveAndContinue.click()
    await questions.drug_use.errorLink.click()
    await expect(questions.drug_use.input).toBeFocused()
  })

  test('validation misused drug types', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })

    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId, 'v2.0')
      .withAnswers([{ question: Question.drug_use, value: CommonOption.yes }])
      .withUserSubmittedSteps([Step.drug_use_status.code])
      .save()

    await DrugUsePage.navigateTo(page, handoverLink, baseURL, sanAssessmentId, 'drug-use-types')

    const drugUsePage = await DrugUsePage.verifyOnPage(page, 'Which drugs has')

    await drugUsePage.saveAndContinue.click()
    await expect(drugUsePage.alert.getByRole('link', { name: 'Select which drugs they’ve misused' })).toBeVisible()
  })

  test('validation last use these drugs', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })

    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId, 'v2.0')
      .withAnswers([
        { question: Question.drug_use, value: CommonOption.yes },
        { question: Question.select_misused_drugs, value: [Option.cannabis] },
      ])
      .withUserSubmittedSteps([Step.drug_use_status.code, Step.drug_use_types.code])
      .save()

    await DrugUsePage.navigateTo(page, handoverLink, baseURL, sanAssessmentId, 'drug-use-last-used')

    const drugUsePage = await DrugUsePage.verifyOnPage(page, 'last use these drugs')

    await drugUsePage.saveAndContinue.click()
    await expect(drugUsePage.alert.getByRole('link', { name: 'Select when they last used this drug' })).toBeVisible()
  })

  test('validation drug use details', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })

    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId, 'v2.0')
      .withAnswers([
        { question: Question.drug_use, value: CommonOption.yes },
        { question: Question.select_misused_drugs, value: [Option.amphetamines] },
        { question: forDrug(Question.drug_last_used_value, Option.amphetamines), value: Option.last_six },
      ])
      .withUserSubmittedSteps([Step.drug_use_status.code, Step.drug_use_types.code, Step.drug_use_last_used.code])
      .save()

    await DrugUsePage.navigateTo(page, handoverLink, baseURL, sanAssessmentId, 'drug-use-details')

    const drugUsePage = await DrugUsePage.verifyOnPage(page, 'Used in the last 6 months')
    const { questions } = drugUsePage

    await drugUsePage.saveAndContinue.click()
    await expect(drugUsePage.alert).toMatchAriaSnapshot(`
    - alert:
      - heading "There is a problem" [level=2]
      - list:
        - listitem:
          - link "Select which drugs they’ve injected, or select 'None'":
            - /url: "#drugs_injected"
        - listitem:
          - link "Select how often they’re using this drug":
            - /url: "#how_often_used_amphetamines"
    `)

    await questions.drugs_injected.errorLink.click()
    await expect(questions.drugs_injected.input).toBeFocused()
    const howOftenUsed = drugUsePage.question(forDrug(Question.how_often_used_value, Option.amphetamines))
    await howOftenUsed.errorLink.click()
    await expect(howOftenUsed.input).toBeFocused()
  })

  test('validation last injected drugs', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })

    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId, 'v2.0')
      .withAnswers([
        { question: Question.drug_use, value: CommonOption.yes },
        { question: Question.select_misused_drugs, value: [Option.amphetamines] },
        { question: forDrug(Question.drug_last_used_value, Option.amphetamines), value: Option.last_six },
        { question: forDrug(Question.how_often_used_value, Option.amphetamines), value: Option.daily },
        { question: forDrug(Question.how_often_used_details, Option.amphetamines), value: 'amphetamines usage details' },
        { question: Question.drugs_injected, value: [Option.amphetamines] },
      ])
      .withUserSubmittedSteps([
        Step.drug_use_status.code,
        Step.drug_use_types.code,
        Step.drug_use_last_used.code,
        Step.drug_use_details.code,
      ])
      .save()

    await DrugUsePage.navigateTo(page, handoverLink, baseURL, sanAssessmentId, 'drug-use-last-injected')

    const drugUsePage = await DrugUsePage.verifyOnPage(page, 'injected drugs')

    await drugUsePage.saveAndContinue.click()
    await expect(drugUsePage.alert.getByRole('link', { name: 'Select when they injected this drug' })).toBeVisible()
  })

  test('validation stop or reduce drug use', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })

    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId, 'v2.0')
      .withAnswers([
        { question: Question.drug_use, value: CommonOption.yes },
        { question: Question.select_misused_drugs, value: [Option.amphetamines] },
        { question: forDrug(Question.drug_last_used_value, Option.amphetamines), value: Option.last_six },
        { question: forDrug(Question.how_often_used_value, Option.amphetamines), value: Option.daily },
        { question: forDrug(Question.how_often_used_details, Option.amphetamines), value: 'amphetamines usage details' },
        { question: Question.drugs_injected, value: [Option.amphetamines] },
        { question: forDrug(Question.drugs_injected_value, Option.amphetamines), value: [Option.last_six] },
      ])
      .withUserSubmittedSteps([
        Step.drug_use_status.code,
        Step.drug_use_types.code,
        Step.drug_use_last_used.code,
        Step.drug_use_details.code,
        Step.drug_use_last_injected.code,
      ])
      .save()

    await DrugUsePage.navigateTo(page, handoverLink, baseURL, sanAssessmentId, 'drug-use-reduce-use')

    const drugUsePage = await DrugUsePage.verifyOnPage(page, 'stop or reduce their drug use')
    const { questions } = drugUsePage

    await drugUsePage.saveAndContinue.click()
    await expect(drugUsePage.alert).toMatchAriaSnapshot(`
    - alert:
      - heading "There is a problem" [level=2]
      - list:
        - listitem:
          - link "Select if anything has helped them stop or reduce their drug use":
            - /url: "#drugs_anything_helped_stop_or_reduce_use"
        - listitem:
          - link "Select if they seem motivated to stop or reduce their drug use":
            - /url: "#drugs_motivated_to_stop_or_reduce_use"
    `)

    await questions.drugs_anything_helped_stop_or_reduce_use.errorLink.click()
    await expect(questions.drugs_anything_helped_stop_or_reduce_use.input).toBeFocused()
    await questions.drugs_motivated_to_stop_or_reduce_use.errorLink.click()
    await expect(questions.drugs_motivated_to_stop_or_reduce_use.input).toBeFocused()

    await questions.drugs_anything_helped_stop_or_reduce_use.option(CommonOption.yes).check()
    await drugUsePage.saveAndContinue.click()
    await expect(drugUsePage.alert).toMatchAriaSnapshot(`
    - alert:
      - heading "There is a problem" [level=2]
      - list:
        - listitem:
          - link "Enter details on what has helped stop or reduce their drug use":
            - /url: "#drugs_anything_helped_stop_or_reduce_use_details"
        - listitem:
          - link "Select if they seem motivated to stop or reduce their drug use":
            - /url: "#drugs_motivated_to_stop_or_reduce_use"
    `)
    await questions.drugs_anything_helped_stop_or_reduce_use_details.errorLink.click()
    await expect(questions.drugs_anything_helped_stop_or_reduce_use_details.input).toBeFocused()
  })

  test('validation change drug use', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })

    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId, 'v2.0')
      .withAnswers([
        { question: Question.drug_use, value: CommonOption.yes },
        { question: Question.select_misused_drugs, value: [Option.amphetamines] },
        { question: forDrug(Question.drug_last_used_value, Option.amphetamines), value: Option.last_six },
        { question: forDrug(Question.how_often_used_value, Option.amphetamines), value: Option.daily },
        { question: forDrug(Question.how_often_used_details, Option.amphetamines), value: 'amphetamines usage details' },
        { question: Question.drugs_injected, value: [Option.amphetamines] },
        { question: forDrug(Question.drugs_injected_value, Option.amphetamines), value: [Option.last_six] },
        { question: Question.drugs_anything_helped_stop_or_reduce_use, value: CommonOption.yes },
        { question: Question.drugs_anything_helped_stop_or_reduce_use_details, value: 'stop or reduce usage details' },
        { question: Question.drugs_motivated_to_stop_or_reduce_use, value: Option.no_motivation },
      ])
      .withUserSubmittedSteps([
        Step.drug_use_status.code,
        Step.drug_use_types.code,
        Step.drug_use_last_used.code,
        Step.drug_use_details.code,
        Step.drug_use_last_injected.code,
        Step.drug_use_reduce_use.code,
      ])
      .save()

    await DrugUsePage.navigateTo(page, handoverLink, baseURL, sanAssessmentId, 'drug-use-change-use')

    const drugUsePage = await DrugUsePage.verifyOnPage(page, 'want to make changes to their drug use')

    await drugUsePage.saveAndContinue.click()
    await expect(drugUsePage.alert.getByRole('link', { name: 'Select if they want to make changes to their drug use' })).toBeVisible()
  })
})
