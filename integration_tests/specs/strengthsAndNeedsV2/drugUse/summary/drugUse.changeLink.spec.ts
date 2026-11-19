import { CommonOption } from '@server/forms/strengths-and-needs/versions/v2.0/constants/commonOption'
import { Option } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/drug-use/constants/option'
import { Question } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/drug-use/constants/question'
import { Step } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/drug-use/constants/step'
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
 */

const summaryPage = 'drug-use-summary'
const analysisPage = 'drug-use-analysis'

const drugsUsedAndInjected: Scenario = {
  answers: [
    {question: Question.drug_use, value: CommonOption.yes},
    {question: Question.select_misused_drugs, value: [Option.cannabis, Option.cocaine, Option.heroin]},
    {question: forDrug(Question.drug_last_used_value, Option.cannabis), value: Option.last_six},
    {question: forDrug(Question.how_often_used_value, Option.cannabis), value: Option.daily},
    {question: forDrug(Question.how_often_used_details, Option.cannabis), value: 'cannabis usage details'},
    {question: forDrug(Question.drug_last_used_value, Option.cocaine), value: Option.last_six},
    {question: forDrug(Question.how_often_used_value, Option.cocaine), value: Option.weekly},
    {question: forDrug(Question.how_often_used_details, Option.cocaine), value: 'cocaine usage details'},
    {question: forDrug(Question.drug_last_used_value, Option.heroin), value: Option.more_than_six},
    {question: forDrug(Question.how_often_used_value, Option.heroin), value: Option.monthly},
    {question: forDrug(Question.how_often_used_details, Option.heroin), value: 'heroin usage details'},
    {question: Question.drugs_injected, value: [Option.cocaine]},
    {question: forDrug(Question.drugs_injected_value, Option.cocaine), value: [Option.last_six]},
    {question: Question.drugs_anything_helped_stop_or_reduce_use, value: CommonOption.yes},
    {question: Question.drugs_anything_helped_stop_or_reduce_use_details, value: 'stop or reduce usage details'},
    {question: Question.drugs_motivated_to_stop_or_reduce_use, value: Option.no_motivation},
    {question: Question.drug_use_changes, value: CommonOption.made_changes},
    {question: Question.drug_use_changes_made_changes_details, value: 'Support from family'},
    {question: Question.drug_use_practitioner_analysis_strengths_or_protective_factors, value: CommonOption.yes},
    {
      question: Question.drug_use_practitioner_analysis_strengths_or_protective_factors_yes_details,
      value: 'Some details',
    },
    {question: Question.drug_use_practitioner_analysis_risk_of_serious_harm, value: CommonOption.yes},
    {question: Question.drug_use_practitioner_analysis_risk_of_serious_harm_yes_details, value: 'Some details'},
    {question: Question.drug_use_practitioner_analysis_risk_of_reoffending, value: CommonOption.yes},
    {question: Question.drug_use_practitioner_analysis_risk_of_reoffending_yes_details, value: 'Some details'},
  ],
  summaryChangeLinks: [
    changeLink('drug-use-status', 'drug_use'),
    changeLink('drug-use-types', 'select_misused_drugs'),
    changeLink('drug-use-last-used', 'drug_last_used_cannabis'),
    changeLink('drug-use-details', 'how_often_used_cannabis'),
    changeLink('drug-use-details', 'how_often_used_cannabis_details'),
    changeLink('drug-use-types', 'select_misused_drugs'),
    changeLink('drug-use-last-used', 'drug_last_used_cocaine'),
    changeLink('drug-use-details', 'how_often_used_cocaine'),
    changeLink('drug-use-details', 'how_often_used_cocaine_details'),
    changeLink('drug-use-details', 'drugs_injected'),
    changeLink('drug-use-types', 'select_misused_drugs'),
    changeLink('drug-use-last-used', 'drug_last_used_heroin'),
    changeLink('drug-use-details', 'how_often_used_heroin'),
    changeLink('drug-use-details', 'how_often_used_heroin_details'),
    changeLink('drug-use-reduce-use', 'drugs_anything_helped_stop_or_reduce_use'),
    changeLink('drug-use-reduce-use', 'drugs_motivated_to_stop_or_reduce_use'),
    changeLink('drug-use-change-use', 'drug_use_changes'),
  ],
  userSubmittedSteps: [
    Step.drug_use_status.code,
    Step.drug_use_types.code,
    Step.drug_use_last_used.code,
    Step.drug_use_details.code,
    Step.drug_use_last_injected.code,
    Step.drug_use_reduce_use.code,
    Step.drug_use_change_use.code,
    Step.drug_use_summary.code,
  ],
}

const practitionerAnalysisChangeLinks = [
  changeLink('drug-use-summary', 'drug_use_practitioner_analysis_strengths_or_protective_factors'),
  changeLink('drug-use-summary', 'drug_use_practitioner_analysis_risk_of_serious_harm'),
  changeLink('drug-use-summary', 'drug_use_practitioner_analysis_risk_of_reoffending'),
]

test.describe('Drug use change links', () => {
  test.describe('Questions', () => {
    test.describe('having used drugs & injected', () => {
      test('each change link lands on its question', async ({ page, openSection }) => {
        const section = await openSection(
          drugUse,
          drugsUsedAndInjected.answers,
          drugsUsedAndInjected.userSubmittedSteps,
        )

        await expectEachChangeLinkToLandOnItsQuestion(
          page,
          `${section}/${summaryPage}`,
          drugsUsedAndInjected.summaryChangeLinks,
          summaryTab,
        )
      })
    })
  })

  test.describe('Practitioner analysis', () => {
    test('each change link lands on its question', async ({ page, openSection }) => {
      const section = await openSection(
        drugUse,
        drugsUsedAndInjected.answers,
        drugsUsedAndInjected.userSubmittedSteps,
      )

      await expectEachChangeLinkToLandOnItsQuestion(
        page,
        `${section}/${analysisPage}`,
        practitionerAnalysisChangeLinks,
        practitionerAnalysisTab,
      )
    })
  })

  test.describe('Summary', () => {
    test.describe('having used drugs and injected', () => {
      test('the summary and analysis pages list every change link', async ({ page, openSection }) => {
        const section = await openSection(
          drugUse,
          drugsUsedAndInjected.answers,
          drugsUsedAndInjected.userSubmittedSteps,
        )

        await expectChangeLinksListed(
          page,
          `${section}/${summaryPage}`,
          drugsUsedAndInjected.summaryChangeLinks,
          summaryTab,
        )
        await expectChangeLinksListed(
          page,
          `${section}/${analysisPage}`,
          drugsUsedAndInjected.summaryChangeLinks,
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
