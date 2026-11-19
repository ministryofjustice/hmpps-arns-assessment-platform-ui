import { Step } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/drug-use/constants/step'
import { CharacterLimit } from '@server/forms/strengths-and-needs/constants/characterLimit'
import { CommonOption } from '@server/forms/strengths-and-needs/versions/v2.0/constants/commonOption'
import { Option } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/drug-use/constants/option'
import { Question } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/drug-use/constants/question'
import DrugUsePage from 'pages/strengthsAndNeedsV2/drugUsePage'
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
  { question: forDrug(Question.how_often_used_value, Option.cannabis), value: Option.daily },
  { question: forDrug(Question.how_often_used_details, Option.cannabis), value: 'cannabis usage details' },
  { question: forDrug(Question.how_often_used_value, Option.cocaine), value: Option.daily },
  { question: forDrug(Question.how_often_used_details, Option.cocaine), value: 'cocaine usage details' },
  { question: forDrug(Question.how_often_used_value, Option.heroin), value: Option.daily },
  { question: forDrug(Question.how_often_used_details, Option.heroin), value: 'heroin usage details' },
  { question: Question.drugs_injected, value: [Option.heroin] },
  { question: forDrug(Question.drugs_injected_value, Option.heroin), value: [Option.last_six] },
  { question: Question.drugs_anything_helped_stop_or_reduce_use, value: CommonOption.yes },
  { question: Question.drugs_anything_helped_stop_or_reduce_use_details, value: 'stop or reduce usage details' },
  { question: Question.drugs_motivated_to_stop_or_reduce_use, value: Option.no_motivation },
  { question: Question.drug_use_changes, value: CommonOption.made_changes },
  { question: Question.drug_use_changes_made_changes_details, value: 'Support from family' },
  {question: Question.drug_use_practitioner_analysis_strengths_or_protective_factors, value: CommonOption.yes},
  {
    question: Question.drug_use_practitioner_analysis_strengths_or_protective_factors_yes_details,
    value: 'Some details',
  },
  {question: Question.drug_use_practitioner_analysis_risk_of_serious_harm, value: CommonOption.yes},
  {question: Question.drug_use_practitioner_analysis_risk_of_serious_harm_yes_details, value: 'Some details'},
  {question: Question.drug_use_practitioner_analysis_risk_of_reoffending, value: CommonOption.yes},
  {question: Question.drug_use_practitioner_analysis_risk_of_reoffending_yes_details, value: 'Some details'},
]

const userSubmittedSteps = [
  Step.drug_use_status.code,
  Step.drug_use_types.code,
  Step.drug_use_last_used.code,
  Step.drug_use_details.code,
  Step.drug_use_last_injected.code,
  Step.drug_use_reduce_use.code,
  Step.drug_use_change_use.code,
  Step.drug_use_summary.code,
]

test.describe('Drug use character counts', () => {
  test('drug-use-types: the name of other drug', async ({ page, openSection }) => {
    const section = await openSection(drugUse, answers, userSubmittedSteps)
    const drugUsePage = new DrugUsePage(page)
    const { questions } = drugUsePage
    await page.goto(`${section}/${Step.drug_use_types.path}`)

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

  test(`drug-use-details: how often each drug is used`, async ({
    page,
    openSection,
  }) => {
    const section = await openSection(drugUse, answers, userSubmittedSteps)
    const drugUsePage = new DrugUsePage(page)
    await page.goto(`${section}/${Step.drug_use_details.path}`)

    await expectTheLimitsOnThePage(drugUsePage)
  })

  test(`drug-use-reduce-use: anything helped stop or reduce their use`, async ({
    page,
    openSection,
  }) => {
    const section = await openSection(drugUse, answers, userSubmittedSteps)
    const drugUsePage = new DrugUsePage(page)
    const { questions } = drugUsePage
    await page.goto(`${section}/${Step.drug_use_reduce_use.path}`)

    await questions.drugs_anything_helped_stop_or_reduce_use.option(CommonOption.yes).check()
    await expectTheLimitsOnThePage(drugUsePage)
  })

  // reasons, impact, what has helped and what could help are always shown, so every state has them
  for (const option of changeOptions) {
    test(`drug-use-change-use: wants to make changes ${option}`, async ({ page, openSection }) => {
      const section = await openSection(drugUse, answers, userSubmittedSteps)
      const drugUsePage = new DrugUsePage(page)
      const { questions } = drugUsePage
      await page.goto(`${section}/${Step.drug_use_change_use.path}`)

      await questions.drug_use_changes.option(option).check()

      await expectTheLimitsOnThePage(drugUsePage)
    })
  }

  for (const answer of [CommonOption.yes, CommonOption.no]) {
    test(`drug-use-summary: practitioner analysis ${answer}`, async ({ page, openSection }) => {
      const section = await openSection(drugUse, answers, userSubmittedSteps)
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
