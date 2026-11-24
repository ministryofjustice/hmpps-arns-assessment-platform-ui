import { expect } from '@playwright/test'
import { CommonOption } from '@server/forms/strengths-and-needs/versions/v2.0/constants/commonOption'
import { Option } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/drug-use/constants/option'
import { Question } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/drug-use/constants/question'
import { Step } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/drug-use/constants/step'
import DrugUsePage from 'pages/strengthsAndNeedsV2/drugUsePage'
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
      .extend(sanAssessmentId, 'v2.0')
      .withAnswers([
        { question: Question.drug_use, value: CommonOption.yes },
        { question: Question.select_misused_drugs, value: [Option.amphetamines, Option.cannabis] },
        { question: forDrug(Question.drug_last_used_value, Option.amphetamines), value: Option.last_six },
        { question: forDrug(Question.drug_last_used_value, Option.cannabis), value: Option.last_six },
        { question: forDrug(Question.how_often_used_value, Option.amphetamines), value: Option.daily },
        {
          question: forDrug(Question.how_often_used_details, Option.amphetamines),
          value: 'amphetamines usage details',
        },
        { question: forDrug(Question.how_often_used_value, Option.cannabis), value: Option.daily },
        { question: forDrug(Question.how_often_used_details, Option.cannabis), value: 'cannabis usage details' },
        { question: Question.drugs_injected, value: [Option.amphetamines] },
        { question: forDrug(Question.drugs_injected_value, Option.amphetamines), value: [Option.last_six] },
        { question: Question.drugs_anything_helped_stop_or_reduce_use, value: CommonOption.yes },
        { question: Question.drugs_anything_helped_stop_or_reduce_use_details, value: 'stop or reduce usage details' },
        { question: Question.drugs_motivated_to_stop_or_reduce_use, value: Option.no_motivation },
        { question: Question.drug_use_changes, value: CommonOption.made_changes },
        { question: Question.drug_use_changes_made_changes_details, value: 'Support from family' },
      ])
      .withUserSubmittedSteps([
        Step.drug_use_status.code,
        Step.drug_use_types.code,
        Step.drug_use_last_used.code,
        Step.drug_use_details.code,
        Step.drug_use_last_injected.code,
        Step.drug_use_reduce_use.code,
        Step.drug_use_change_use.code,
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
    await expect(page).toHaveURL(`${drugUseUrl}${Step.drug_use_last_used.path}`)

    const afterTypesSave = await storedAnswers(aapClient, sanAssessmentId)
    expect(Object.keys(afterTypesSave).filter(code => code.includes('amphetamines'))).toEqual([])
    expect(afterTypesSave).not.toHaveProperty(Question.drugs_injected)

    await page.goto(`${drugUseUrl}${Step.drug_use_summary.path}`)
    await expect(page).toHaveURL(`${drugUseUrl}${Step.drug_use_status.path}`)
    await drugUsePage.saveAndContinue.click()
    await expect(page).toHaveURL(`${drugUseUrl}${Step.drug_use_types.path}`)
    await drugUsePage.saveAndContinue.click()
    await expect(page).toHaveURL(`${drugUseUrl}${Step.drug_use_last_used.path}`)
    await drugUsePage.saveAndContinue.click()
    await expect(page).toHaveURL(`${drugUseUrl}${Step.drug_use_details.path}`)
    await expect(drugUsePage.questions.drugs_injected.option(Option.amphetamines)).toBeHidden()
    await drugUsePage.questions.drugs_injected.option(CommonOption.none).check()
    await drugUsePage.saveAndContinue.click()
    await expect(page).toHaveURL(`${drugUseUrl}${Step.drug_use_reduce_use.path}`)
    await drugUsePage.saveAndContinue.click()
    await expect(page).toHaveURL(`${drugUseUrl}${Step.drug_use_change_use.path}`)
    await drugUsePage.saveAndContinue.click()
    await expect(page).toHaveURL(`${drugUseUrl}${Step.drug_use_summary.path}`)

    await page.goto(`${drugUseUrl}${Step.drug_use_summary.path}`)
    await expect(page).toHaveURL(`${drugUseUrl}${Step.drug_use_summary.path}`)

    const answers = await storedAnswers(aapClient, sanAssessmentId)
    expect(Object.keys(answers).filter(code => code.includes('amphetamines'))).toEqual([])
    expect(answers).toHaveProperty(Question.drugs_injected, {
      type: 'Multi',
      values: [CommonOption.none],
    })
    expect(answers).toHaveProperty(Question.drugs_anything_helped_stop_or_reduce_use)
  })
})
