import { expect } from '@playwright/test'
import { CommonOption } from '@server/forms/strengths-and-needs/versions/v1.0/constants/commonOption'
import { Option } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/drug-use/constants/option'
import { Question } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/drug-use/constants/question'
import { Step } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/drug-use/constants/step'
import DrugUsePage from 'pages/strengthsAndNeeds/drugUsePage'
import { test, TargetService } from '../../../support/fixtures'
import { forDrug, storedAnswers } from '../sanUtils'

test.describe('Stale answers', () => {
  test('drug use types: deselecting a drug removes what was said about it', async ({
    page,
    createSession,
    strengthsAndNeedsBuilder,
    aapClient,
    baseURL,
  }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId)
      .withAnswers([
        { question: Question.drug_use, value: CommonOption.yes },
        { question: Question.select_misused_drugs, value: [Option.amphetamines, Option.cannabis] },
        { question: forDrug(Question.drug_last_used_value, Option.amphetamines), value: Option.last_six },
        { question: forDrug(Question.drug_last_used_value, Option.cannabis), value: Option.last_six },
        { question: forDrug(Question.how_often_used_value, Option.amphetamines), value: Option.daily },
        { question: forDrug(Question.how_often_used_details, Option.amphetamines), value: '' },
        { question: forDrug(Question.how_often_used_value, Option.cannabis), value: Option.daily },
        { question: forDrug(Question.how_often_used_details, Option.cannabis), value: '' },
        { question: Question.drugs_injected, value: [Option.amphetamines] },
        { question: forDrug(Question.drugs_injected_value, Option.amphetamines), value: [Option.last_six] },
        { question: Question.drugs_is_receiving_treatment, value: CommonOption.no },
        { question: Question.drugs_is_receiving_treatment_no_details, value: '' },
        { question: Question.drugs_reasons_for_use, value: [Option.peer_pressure] },
        { question: Question.drugs_reasons_for_use_details, value: '' },
        { question: Question.drugs_affected_their_life, value: [Option.health] },
        { question: Question.drugs_affected_their_life_details, value: '' },
        { question: Question.drugs_anything_helped_stop_or_reduce_use, value: 'Support from family' },
        { question: Question.drug_use_changes, value: CommonOption.not_present },
      ])
      .withUserSubmittedSteps([
        Step.drug_use_status.code,
        Step.drug_use_types.code,
        Step.drug_use_details.code,
        Step.drug_use_history.code,
        Step.drug_use_summary.code,
      ])
      .save()

    await DrugUsePage.navigateTo(page, handoverLink, baseURL, sanAssessmentId, Step.drug_use_summary.path)
    const drugUsePage = new DrugUsePage(page)
    const { questions } = drugUsePage
    const drugUseUrl = page.url().replace(Step.drug_use_summary.path, '')

    await page.goto(`${drugUseUrl}${Step.drug_use_types.path}`)
    await questions.select_misused_drugs.option(Option.amphetamines).uncheck()
    await drugUsePage.saveAndContinue.click()
    await expect(page).toHaveURL(`${drugUseUrl}${Step.drug_use_details.path}`)

    await page.goto(`${drugUseUrl}${Step.drug_use_summary.path}`)
    await expect(page).toHaveURL(`${drugUseUrl}${Step.drug_use_status.path}`)

    await page.goto(`${drugUseUrl}${Step.drug_use_details.path}`)
    await drugUsePage.saveAndContinue.click()
    await expect(page).toHaveURL(`${drugUseUrl}${Step.drug_use_history.path}`)
    await drugUsePage.saveAndContinue.click()
    await expect(page).toHaveURL(`${drugUseUrl}${Step.drug_use_summary.path}`)

    const answers = await storedAnswers(aapClient, sanAssessmentId)
    expect(Object.keys(answers).filter(code => code.includes('amphetamines'))).toEqual([])
    expect(answers).not.toHaveProperty(Question.drugs_injected)
    expect(answers).toHaveProperty(Question.drugs_anything_helped_stop_or_reduce_use)
  })
})
