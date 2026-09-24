import { Step } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/drug-use/constants/step'
import { CharacterLimit } from '@server/forms/strengths-and-needs/constants/characterLimit'
import { CommonOption } from '@server/forms/strengths-and-needs/versions/v1.0/constants/commonOption'
import { Option } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/drug-use/constants/option'
import { Question } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/drug-use/constants/question'
import DrugUsePage from 'pages/strengthsAndNeeds/drugUsePage'
import { expectTheLimitsOnThePage } from '../../characterCounts'
import { test } from '../../fixtures'
import { changeOptions, drugUse, forDrug } from '../../sanUtils'

/**
 * Some drug use fields have character limits. These tests exercise the page to reveal the character count fields,
 * then check each one holds to its limit: one character over fails validation, exactly the limit passes.
 *
 * The drug name is a plain text input with no character count, so it is named rather than discovered.
 */

const answers = [
  { question: Question.drug_use, value: CommonOption.yes },
  { question: Question.select_misused_drugs, value: [Option.cannabis, Option.cocaine, Option.heroin] },
  { question: forDrug(Question.drug_last_used_value, Option.cannabis), value: Option.last_six },
  { question: forDrug(Question.drug_last_used_value, Option.cocaine), value: Option.last_six },
  { question: forDrug(Question.drug_last_used_value, Option.heroin), value: Option.more_than_six },
  { question: Question.not_used_in_last_six_months_details, value: 'Some details' },
  { question: Question.drugs_injected, value: [Option.heroin] },
  { question: Question.drugs_is_receiving_treatment, value: CommonOption.yes },
  { question: Question.drugs_is_receiving_treatment_yes_details, value: 'Some details' },
  {
    question: Question.drugs_reasons_for_use,
    value: [Option.escapism_or_avoidance, Option.peer_pressure, CommonOption.other],
  },
  { question: Question.drugs_reasons_for_use_details, value: 'Some details' },
  { question: Question.drugs_affected_their_life, value: [Option.finances, Option.health, Option.relationships] },
  { question: Question.drugs_affected_their_life_details, value: 'Some details' },
  { question: Question.drugs_anything_helped_stop_or_reduce_use, value: 'Some details' },
  { question: Question.drug_use_changes, value: CommonOption.making_changes },
  { question: Question.drug_use_changes_making_changes_details, value: 'Some details' },
  { question: Question.drugs_practitioner_analysis_motivated_to_stop, value: Option.partial_motivation },
  { question: Question.drug_use_practitioner_analysis_strengths_or_protective_factors, value: CommonOption.yes },
  {
    question: Question.drug_use_practitioner_analysis_strengths_or_protective_factors_yes_details,
    value: 'Some details',
  },
  { question: Question.drug_use_practitioner_analysis_risk_of_serious_harm, value: CommonOption.yes },
  { question: Question.drug_use_practitioner_analysis_risk_of_serious_harm_yes_details, value: 'Some details' },
  { question: Question.drug_use_practitioner_analysis_risk_of_reoffending, value: CommonOption.yes },
  { question: Question.drug_use_practitioner_analysis_risk_of_reoffending_yes_details, value: 'Some details' },
  { question: forDrug(Question.how_often_used_value, Option.cannabis), value: Option.daily },
  { question: forDrug(Question.how_often_used_details, Option.cannabis), value: 'Some details' },
  { question: forDrug(Question.how_often_used_value, Option.cocaine), value: Option.occasionally },
  { question: forDrug(Question.how_often_used_details, Option.cocaine), value: 'Some details' },
]

const notUsedInTheLastSixMonths = [
  { question: forDrug(Question.drug_last_used_value, Option.cannabis), value: Option.more_than_six },
  { question: forDrug(Question.drug_last_used_value, Option.cocaine), value: Option.more_than_six },
]

test.describe('Drug use character counts', () => {
  test('add-drugs: the name of another drug', async ({ page, openSection }) => {
    const section = await openSection(drugUse, answers)
    const drugUsePage = new DrugUsePage(page)
    const { questions } = drugUsePage
    await page.goto(`${section}/${Step.add_drugs.path}`)

    await questions.select_misused_drugs.option(Option.other_drug).check()

    await expectTheLimitsOnThePage(drugUsePage, {
      plainInputs: [
        {
          code: Question.other_drug_name,
          limit: CharacterLimit.c200,
          message: `Drug name must be ${CharacterLimit.c200} characters or less`,
        },
      ],
    })
  })

  // a test per option, because each one reveals its own details field
  for (const option of [CommonOption.yes, CommonOption.no]) {
    test(`drug-details: how often each drug is used, and receiving treatment ${option}`, async ({
      page,
      openSection,
    }) => {
      const section = await openSection(drugUse, answers)
      const drugUsePage = new DrugUsePage(page)
      const { questions } = drugUsePage
      await page.goto(`${section}/${Step.drug_details.path}`)

      await questions.drugs_is_receiving_treatment.option(option).check()

      await expectTheLimitsOnThePage(drugUsePage)
    })
  }

  // reasons, impact, what has helped and what could help are always shown, so every state has them
  for (const option of changeOptions) {
    test(`drug-use-history: wants to make changes ${option}`, async ({ page, openSection }) => {
      const section = await openSection(drugUse, answers)
      const drugUsePage = new DrugUsePage(page)
      const { questions } = drugUsePage
      await page.goto(`${section}/${Step.drug_use_history.path}`)

      await questions.drug_use_changes.option(option).check()

      await expectTheLimitsOnThePage(drugUsePage)
    })
  }

  test('drug-use-history: when no drugs were used in the last 6 months', async ({ page, openSection }) => {
    // what could help them not use drugs in future replaces what has helped them stop or reduce
    const section = await openSection(drugUse, [...answers, ...notUsedInTheLastSixMonths])
    const drugUsePage = new DrugUsePage(page)
    await page.goto(`${section}/${Step.drug_use_history.path}`)
    await expectTheLimitsOnThePage(drugUsePage)
  })

  for (const answer of [CommonOption.yes, CommonOption.no]) {
    test(`drug-use-summary: practitioner analysis ${answer}`, async ({ page, openSection }) => {
      const section = await openSection(drugUse, answers)
      const drugUsePage = new DrugUsePage(page)
      const { questions } = drugUsePage
      await page.goto(`${section}/${Step.drug_use_summary.path}#practitioner-analysis`)

      await questions.drug_use_practitioner_analysis_strengths_or_protective_factors.option(answer).check()
      await questions.drug_use_practitioner_analysis_risk_of_serious_harm.option(answer).check()
      await questions.drug_use_practitioner_analysis_risk_of_reoffending.option(answer).check()

      await expectTheLimitsOnThePage(drugUsePage, { save: drugUsePage.markComplete })
    })
  }
})
