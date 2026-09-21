import { CommonOption } from '@server/forms/strengths-and-needs/versions/v1.0/constants/commonOption'
import { Option } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/drug-use/constants/option'
import { Question } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/drug-use/constants/question'
import { forDrug, drugUse } from '../../sanUtils'
import {
  changeLink,
  expectChangeLinksListed,
  expectEachChangeLinkToLandOnItsQuestion,
  practitionerAnalysisTab,
  Scenario,
  summaryTab,
} from '../../changeLinkUtils'
import { test } from '../../fixtures'

/**
 * Drug use change links
 *
 *   1. Questions: for each branch of the section, every question change link followed
 *   2. Practitioner analysis: every practitioner analysis change link followed
 *   3. Summary: what the summary and analysis pages list
 *
 * Branches: Drugs used in the last 6 months, which is what puts the per-drug cards on the
 * summary, and drugs used only before then, which is the only way the "what could
 * help" question appears
 */

const summaryPage = 'drug-use-summary'
const analysisPage = 'drug-use-analysis'

const usedInTheLastSixMonths: Scenario = {
  answers: [
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
  ],
  summaryChangeLinks: [
    changeLink('drug-use', 'drug_use'),
    changeLink('add-drugs', 'select_misused_drugs'),
    changeLink('add-drugs', 'drug_last_used_cannabis'),
    changeLink('drug-details', 'how_often_used_last_six_months_cannabis'),
    changeLink('drug-details', 'how_often_used_last_six_months_cannabis_details'),
    changeLink('add-drugs', 'select_misused_drugs'),
    changeLink('add-drugs', 'drug_last_used_cocaine'),
    changeLink('drug-details', 'how_often_used_last_six_months_cocaine'),
    changeLink('drug-details', 'how_often_used_last_six_months_cocaine_details'),
    changeLink('add-drugs', 'select_misused_drugs'),
    changeLink('add-drugs', 'drug_last_used_heroin'),
    changeLink('drug-details', 'drugs_injected'),
    changeLink('drug-details', 'not_used_in_last_six_months_details'),
    changeLink('drug-details', 'drugs_is_receiving_treatment'),
    changeLink('drug-use-history', 'drugs_reasons_for_use'),
    changeLink('drug-use-history', 'drugs_reasons_for_use_details'),
    changeLink('drug-use-history', 'drugs_affected_their_life'),
    changeLink('drug-use-history', 'drugs_affected_their_life_details'),
    changeLink('drug-use-history', 'drugs_anything_helped_stop_or_reduce_use'),
    changeLink('drug-use-history', 'drug_use_changes'),
  ],
}

const usedMoreThanSixMonthsAgo: Scenario = {
  answers: [
    { question: Question.drug_use, value: CommonOption.yes },
    { question: Question.select_misused_drugs, value: [Option.heroin] },
    { question: forDrug(Question.drug_last_used_value, Option.heroin), value: Option.more_than_six },
    { question: Question.not_used_in_last_six_months_details, value: 'Some details' },
    { question: Question.drugs_injected, value: [Option.heroin] },
    { question: Question.drugs_is_receiving_treatment, value: CommonOption.yes },
    { question: Question.drugs_is_receiving_treatment_yes_details, value: 'Some details' },
    { question: Question.drugs_reasons_for_use, value: [Option.cultural_or_religious] },
    { question: Question.drugs_reasons_for_use_details, value: 'Some details' },
    { question: Question.drugs_affected_their_life, value: [Option.behaviour] },
    { question: Question.drugs_affected_their_life_details, value: 'Some details' },
    { question: Question.drugs_what_could_help_not_use_drugs_in_future, value: 'Some details' },
    { question: Question.drug_use_changes, value: CommonOption.made_changes },
    { question: Question.drug_use_changes_made_changes_details, value: 'Some details' },
    { question: Question.drugs_practitioner_analysis_motivated_to_stop, value: Option.no_motivation },
    { question: Question.drug_use_practitioner_analysis_strengths_or_protective_factors, value: CommonOption.yes },
    {
      question: Question.drug_use_practitioner_analysis_strengths_or_protective_factors_yes_details,
      value: 'Some details',
    },
    { question: Question.drug_use_practitioner_analysis_risk_of_serious_harm, value: CommonOption.yes },
    { question: Question.drug_use_practitioner_analysis_risk_of_serious_harm_yes_details, value: 'Some details' },
    { question: Question.drug_use_practitioner_analysis_risk_of_reoffending, value: CommonOption.yes },
    { question: Question.drug_use_practitioner_analysis_risk_of_reoffending_yes_details, value: 'Some details' },
  ],
  summaryChangeLinks: [
    changeLink('drug-use', 'drug_use'),
    changeLink('add-drugs', 'select_misused_drugs'),
    changeLink('add-drugs', 'drug_last_used_heroin'),
    changeLink('drug-details', 'drugs_injected'),
    changeLink('drug-details', 'not_used_in_last_six_months_details'),
    changeLink('drug-details', 'drugs_is_receiving_treatment'),
    changeLink('drug-use-history', 'drugs_reasons_for_use'),
    changeLink('drug-use-history', 'drugs_reasons_for_use_details'),
    changeLink('drug-use-history', 'drugs_affected_their_life'),
    changeLink('drug-use-history', 'drugs_affected_their_life_details'),
    changeLink('drug-use-history', 'drugs_what_could_help_not_use_drugs_in_future'),
    changeLink('drug-use-history', 'drug_use_changes'),
  ],
}

const practitionerAnalysisChangeLinks = [
  changeLink('drug-use-summary', 'drugs_practitioner_analysis_motivated_to_stop'),
  changeLink('drug-use-summary', 'drug_use_practitioner_analysis_strengths_or_protective_factors'),
  changeLink('drug-use-summary', 'drug_use_practitioner_analysis_risk_of_serious_harm'),
  changeLink('drug-use-summary', 'drug_use_practitioner_analysis_risk_of_reoffending'),
]

test.describe('Drug use change links', () => {
  test.describe('Questions', () => {
    test.describe('having used drugs in the last 6 months', () => {
      test('each change link lands on its question', async ({ page, openSection }) => {
        const section = await openSection(drugUse, usedInTheLastSixMonths.answers)

        await expectEachChangeLinkToLandOnItsQuestion(
          page,
          `${section}/${summaryPage}`,
          usedInTheLastSixMonths.summaryChangeLinks,
          summaryTab,
        )
      })
    })

    test.describe('having only used drugs more than 6 months ago', () => {
      test('each change link lands on its question', async ({ page, openSection }) => {
        const section = await openSection(drugUse, usedMoreThanSixMonthsAgo.answers)

        await expectEachChangeLinkToLandOnItsQuestion(
          page,
          `${section}/${summaryPage}`,
          usedMoreThanSixMonthsAgo.summaryChangeLinks,
          summaryTab,
        )
      })
    })
  })

  test.describe('Practitioner analysis', () => {
    test('each change link lands on its question', async ({ page, openSection }) => {
      const section = await openSection(drugUse, usedInTheLastSixMonths.answers)

      await expectEachChangeLinkToLandOnItsQuestion(
        page,
        `${section}/${analysisPage}`,
        practitionerAnalysisChangeLinks,
        practitionerAnalysisTab,
      )
    })
  })

  test.describe('Summary', () => {
    test.describe('having used drugs in the last 6 months', () => {
      test('the summary and analysis pages list every change link', async ({ page, openSection }) => {
        const section = await openSection(drugUse, usedInTheLastSixMonths.answers)

        await expectChangeLinksListed(
          page,
          `${section}/${summaryPage}`,
          usedInTheLastSixMonths.summaryChangeLinks,
          summaryTab,
        )
        await expectChangeLinksListed(
          page,
          `${section}/${analysisPage}`,
          usedInTheLastSixMonths.summaryChangeLinks,
          summaryTab,
        )
        await expectChangeLinksListed(
          page,
          `${section}/${analysisPage}`,
          practitionerAnalysisChangeLinks,
          practitionerAnalysisTab,
        )
      })
    })

    test.describe('having only used drugs more than 6 months ago', () => {
      test('the summary and analysis pages list every change link', async ({ page, openSection }) => {
        const section = await openSection(drugUse, usedMoreThanSixMonthsAgo.answers)

        await expectChangeLinksListed(
          page,
          `${section}/${summaryPage}`,
          usedMoreThanSixMonthsAgo.summaryChangeLinks,
          summaryTab,
        )
        await expectChangeLinksListed(
          page,
          `${section}/${analysisPage}`,
          usedMoreThanSixMonthsAgo.summaryChangeLinks,
          summaryTab,
        )
        await expectChangeLinksListed(
          page,
          `${section}/${analysisPage}`,
          practitionerAnalysisChangeLinks,
          practitionerAnalysisTab,
        )
      })
    })
  })
})
