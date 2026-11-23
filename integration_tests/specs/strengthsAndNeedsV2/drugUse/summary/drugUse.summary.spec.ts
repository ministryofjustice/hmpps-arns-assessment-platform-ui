import { Question } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/drug-use/constants/question'
import { Step } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/drug-use/constants/step'
import { CommonOption } from '@server/forms/strengths-and-needs/versions/v2.0/constants/commonOption'
import { expect } from '@playwright/test'
import DrugUsePage from 'pages/strengthsAndNeedsV2/drugUsePage'
import { Option } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/drug-use/constants/option'
import { test, TargetService } from '../../../../support/fixtures'
import { forDrug } from '../../sanUtils'

test.describe('Summary', () => {
  test('shows summary page, never misused drugs', async ({
    page,
    createSession,
    strengthsAndNeedsBuilder,
    baseURL,
  }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId, 'v2.0')
      .withAnswers([{ question: Question.drug_use, value: CommonOption.no }])
      .withUserSubmittedSteps([Step.drug_use_status.code, Step.drug_use_summary.code])
      .save()

    await DrugUsePage.navigateTo(page, handoverLink, baseURL, sanAssessmentId, Step.drug_use_summary.path)

    const drugUsePage = await DrugUsePage.verifyOnPage(page, 'Summary')

    await expect(drugUsePage.summary).toMatchAriaSnapshot(`
      - tabpanel "Summary":
        - term: Has Test ever misused drugs?
        - definition:
          - paragraph: "No"
        - definition:
          - link "Change Has Test ever misused drugs?":
            - /url: drug-use-status#drug_use-question
        - heading [level=2]
        - heading [level=2]
        - button "Go to practitioner analysis"
    `)
  })

  test('shows summary page, has misused drugs', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
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

    const drugUsePage = await DrugUsePage.verifyOnPage(page, 'Summary')

    await expect(drugUsePage.summary).toMatchAriaSnapshot(`
      - tabpanel "Summary":
        - term: Has Test ever misused drugs?
        - definition:
          - paragraph: "Yes"
        - definition:
          - link "Change Has Test ever misused drugs?":
            - /url: drug-use-status#drug_use-question
        - heading [level=2]
        - heading "Used in the last 6 months" [level=1]
        - heading "Amphetamines (including speed, methamphetamine)" [level=2]
        - link "Change Which drugs has Test misused? (Amphetamines (including speed, methamphetamine))":
          - /url: drug-use-types#select_misused_drugs-question
        - term: Last used
        - definition: Used in the last 6 months
        - definition:
          - link "Change Last used (Amphetamines (including speed, methamphetamine))":
            - /url: drug-use-last-used#drug_last_used_amphetamines-question
        - term: How often
        - definition: Daily
        - definition:
          - link "Change How often (Amphetamines (including speed, methamphetamine))":
            - /url: drug-use-details#how_often_used_amphetamines-question
        - term: Give details (optional)
        - definition: amphetamines usage details
        - definition:
          - link "Change Give details (optional) (Amphetamines (including speed, methamphetamine))":
            - /url: drug-use-details#how_often_used_amphetamines_details-question
        - term: Injected
        - definition:
          - paragraph: "Yes"
          - paragraph: In the last 6 months
        - definition:
          - link "Change Injected (Amphetamines (including speed, methamphetamine))":
            - /url: drug-use-details#drugs_injected-question
        - heading "Cannabis" [level=2]
        - link "Change Which drugs has Test misused? (Cannabis)":
          - /url: drug-use-types#select_misused_drugs-question
        - term: Last used
        - definition: Used in the last 6 months
        - definition:
          - link "Change Last used (Cannabis)":
            - /url: drug-use-last-used#drug_last_used_cannabis-question
        - term: How often
        - definition: Daily
        - definition:
          - link "Change How often (Cannabis)":
            - /url: drug-use-details#how_often_used_cannabis-question
        - term: Give details (optional)
        - definition: cannabis usage details
        - definition:
          - link "Change Give details (optional) (Cannabis)":
            - /url: drug-use-details#how_often_used_cannabis_details-question
        - heading [level=2]
        - heading "More information" [level=1]
        - term: Has anything helped Test stop or reduce their drug use?
        - definition:
          - paragraph: "Yes"
          - paragraph: stop or reduce usage details
        - definition:
          - link "Change Has anything helped Test stop or reduce their drug use?":
            - /url: drug-use-reduce-use#drugs_anything_helped_stop_or_reduce_use-question
        - term: Does Test seem motivated to stop or reduce their drug use?
        - definition:
          - paragraph: Does not show motivation to stop or reduce
        - definition:
          - link "Change Does Test seem motivated to stop or reduce their drug use?":
            - /url: drug-use-reduce-use#drugs_motivated_to_stop_or_reduce_use-question
        - term: Does Test want to make changes to their drug use?
        - definition:
          - paragraph: I have already made positive changes and want to maintain them
          - paragraph: Support from family
        - definition:
          - link "Change Does Test want to make changes to their drug use?":
            - /url: drug-use-change-use#drug_use_changes-question
        - button "Go to practitioner analysis"
    `)
  })

  test('practitioner analysis', async ({ baseURL, page, createSession, strengthsAndNeedsBuilder }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId, 'v2.0')
      .withAnswers([{ question: Question.drug_use, value: CommonOption.no }])
      .withUserSubmittedSteps([Step.drug_use_status.code, Step.drug_use_summary.code])
      .save()

    await DrugUsePage.navigateTo(page, handoverLink, baseURL, sanAssessmentId, Step.drug_use_summary.path)

    const drugUsePage = await DrugUsePage.verifyOnPage(page, 'Summary')

    await drugUsePage.goToPractitionerAnalysis.click()
    await expect(page.getByText('Are there any strengths or protective factors')).toBeVisible()
  })

  test('mark complete', async ({ baseURL, page, createSession, strengthsAndNeedsBuilder }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId, 'v2.0').withAnswers([
        { question: Question.drug_use, value: CommonOption.no },
        { question: Question.drug_use_practitioner_analysis_strengths_or_protective_factors, value: CommonOption.no },
        { question: Question.drug_use_practitioner_analysis_strengths_or_protective_factors_no_details, value: '' },
        { question: Question.drug_use_practitioner_analysis_risk_of_serious_harm, value: CommonOption.no },
        { question: Question.drug_use_practitioner_analysis_risk_of_serious_harm_no_details, value: '' },
      ])
      .withUserSubmittedSteps([Step.drug_use_status.code, Step.drug_use_summary.code])
      .save()

    await DrugUsePage.navigateTo(
      page,
      handoverLink,
      baseURL,
      sanAssessmentId,
      `${Step.drug_use_summary.path}#practitioner-analysis`,
    )

    const drugUsePage = await DrugUsePage.verifyOnPage(page, 'strengths or protective factors')

    await drugUsePage.questions.drug_use_practitioner_analysis_risk_of_reoffending.option(CommonOption.no)
      .click()
    await drugUsePage.markComplete.click()
    await expect(drugUsePage.complete).toBeVisible()
    expect(page.url()).toContain('drug-use-analysis')
  })
})
