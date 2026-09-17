import { drugUse } from '../sanUtils'
import {
  changeLink,
  expectChangeLinksListed,
  expectEachChangeLinkToLandOnItsQuestion,
  practitionerAnalysisTab,
  Scenario,
  test,
} from './helpers'

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
    { question: 'drug_use', value: 'YES' },
    { question: 'select_misused_drugs', value: ['CANNABIS', 'COCAINE', 'HEROIN'] },
    { question: 'drug_last_used_cannabis', value: 'LAST_SIX' },
    { question: 'drug_last_used_cocaine', value: 'LAST_SIX' },
    { question: 'drug_last_used_heroin', value: 'MORE_THAN_SIX' },
    { question: 'not_used_in_last_six_months_details', value: 'Some details' },
    { question: 'drugs_injected', value: ['HEROIN'] },
    { question: 'drugs_is_receiving_treatment', value: 'YES' },
    { question: 'drugs_is_receiving_treatment_yes_details', value: 'Some details' },
    { question: 'drugs_reasons_for_use', value: ['ESCAPISM_OR_AVOIDANCE', 'PEER_PRESSURE', 'OTHER'] },
    { question: 'drugs_reasons_for_use_details', value: 'Some details' },
    { question: 'drugs_affected_their_life', value: ['FINANCES', 'HEALTH', 'RELATIONSHIPS'] },
    { question: 'drugs_affected_their_life_details', value: 'Some details' },
    { question: 'drugs_anything_helped_stop_or_reduce_use', value: 'Some details' },
    { question: 'drug_use_changes', value: 'MAKING_CHANGES' },
    { question: 'drug_use_changes_making_changes_details', value: 'Some details' },
    { question: 'drugs_practitioner_analysis_motivated_to_stop', value: 'PARTIAL_MOTIVATION' },
    { question: 'drug_use_practitioner_analysis_strengths_or_protective_factors', value: 'YES' },
    { question: 'drug_use_practitioner_analysis_strengths_or_protective_factors_yes_details', value: 'Some details' },
    { question: 'drug_use_practitioner_analysis_risk_of_serious_harm', value: 'YES' },
    { question: 'drug_use_practitioner_analysis_risk_of_serious_harm_yes_details', value: 'Some details' },
    { question: 'drug_use_practitioner_analysis_risk_of_reoffending', value: 'YES' },
    { question: 'drug_use_practitioner_analysis_risk_of_reoffending_yes_details', value: 'Some details' },
    { question: 'how_often_used_last_six_months_cannabis', value: 'DAILY' },
    { question: 'how_often_used_last_six_months_cannabis_details', value: 'Some details' },
    { question: 'how_often_used_last_six_months_cocaine', value: 'OCCASIONALLY' },
    { question: 'how_often_used_last_six_months_cocaine_details', value: 'Some details' },
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
    { question: 'drug_use', value: 'YES' },
    { question: 'select_misused_drugs', value: ['HEROIN'] },
    { question: 'drug_last_used_heroin', value: 'MORE_THAN_SIX' },
    { question: 'not_used_in_last_six_months_details', value: 'Some details' },
    { question: 'drugs_injected', value: ['HEROIN'] },
    { question: 'drugs_is_receiving_treatment', value: 'YES' },
    { question: 'drugs_is_receiving_treatment_yes_details', value: 'Some details' },
    { question: 'drugs_reasons_for_use', value: ['CULTURAL_OR_RELIGIOUS'] },
    { question: 'drugs_reasons_for_use_details', value: 'Some details' },
    { question: 'drugs_affected_their_life', value: ['BEHAVIOUR'] },
    { question: 'drugs_affected_their_life_details', value: 'Some details' },
    { question: 'drugs_what_could_help_not_use_drugs_in_future', value: 'Some details' },
    { question: 'drug_use_changes', value: 'MADE_CHANGES' },
    { question: 'drug_use_changes_made_changes_details', value: 'Some details' },
    { question: 'drugs_practitioner_analysis_motivated_to_stop', value: 'NO_MOTIVATION' },
    { question: 'drug_use_practitioner_analysis_strengths_or_protective_factors', value: 'YES' },
    { question: 'drug_use_practitioner_analysis_strengths_or_protective_factors_yes_details', value: 'Some details' },
    { question: 'drug_use_practitioner_analysis_risk_of_serious_harm', value: 'YES' },
    { question: 'drug_use_practitioner_analysis_risk_of_serious_harm_yes_details', value: 'Some details' },
    { question: 'drug_use_practitioner_analysis_risk_of_reoffending', value: 'YES' },
    { question: 'drug_use_practitioner_analysis_risk_of_reoffending_yes_details', value: 'Some details' },
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
        {
          tab: practitionerAnalysisTab,
        },
      )
    })
  })

  test.describe('Summary', () => {
    test.describe('having used drugs in the last 6 months', () => {
      test('the summary and analysis pages list every change link', async ({ page, openSection }) => {
        const section = await openSection(drugUse, usedInTheLastSixMonths.answers)

        await expectChangeLinksListed(page, `${section}/${summaryPage}`, usedInTheLastSixMonths.summaryChangeLinks)
        await expectChangeLinksListed(page, `${section}/${analysisPage}`, usedInTheLastSixMonths.summaryChangeLinks)
        await expectChangeLinksListed(page, `${section}/${analysisPage}`, practitionerAnalysisChangeLinks, {
          tab: practitionerAnalysisTab,
        })
      })
    })

    test.describe('having only used drugs more than 6 months ago', () => {
      test('the summary and analysis pages list every change link', async ({ page, openSection }) => {
        const section = await openSection(drugUse, usedMoreThanSixMonthsAgo.answers)

        await expectChangeLinksListed(page, `${section}/${summaryPage}`, usedMoreThanSixMonthsAgo.summaryChangeLinks)
        await expectChangeLinksListed(page, `${section}/${analysisPage}`, usedMoreThanSixMonthsAgo.summaryChangeLinks)
        await expectChangeLinksListed(page, `${section}/${analysisPage}`, practitionerAnalysisChangeLinks, {
          tab: practitionerAnalysisTab,
        })
      })
    })
  })
})
