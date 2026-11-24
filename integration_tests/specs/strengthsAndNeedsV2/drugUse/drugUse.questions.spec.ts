import { CommonOption } from '@server/forms/strengths-and-needs/versions/v2.0/constants/commonOption'
import { Option } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/drug-use/constants/option'
import { Question } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/drug-use/constants/question'
import { expect } from '@playwright/test'
import DrugUsePage from 'pages/strengthsAndNeedsV2/drugUsePage'
import { Step } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/drug-use/constants/step'
import { test, TargetService } from '../../../support/fixtures'
import { forDrug, buildPageTitle, sanPageTitles } from '../sanUtils'

test.describe('Questions', () => {
  test('shows drug-use-status', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder.extend(sanAssessmentId, 'v2.0').save()

    await DrugUsePage.navigateTo(page, handoverLink, baseURL, sanAssessmentId)

    const drugUsePage = await DrugUsePage.verifyOnPage(page, 'ever misused drugs')

    await expect(page).toHaveTitle(buildPageTitle(sanPageTitles.drugUse))

    await expect(drugUsePage.mainForm).toMatchAriaSnapshot(`
      - group "Has Test ever misused drugs?":
        - text: Has Test ever misused drugs? This includes illegal and prescription drugs.
        - radio "Yes"
        - text: "Yes"
        - radio "No"
        - text: "No"
      - button "Save and continue"
    `)
  })

  test('shows drug-use-types', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId, 'v2.0')
      .withAnswers([{ question: Question.drug_use, value: CommonOption.yes }])
      .withUserSubmittedSteps([Step.drug_use_status.code])
      .save()

    await DrugUsePage.navigateTo(page, handoverLink, baseURL, sanAssessmentId, Step.drug_use_types.path)

    const drugUsePage = await DrugUsePage.verifyOnPage(page, 'Which drugs has')

    await expect(drugUsePage.mainForm).toMatchAriaSnapshot(`
      - group "Which drugs has Test misused?":
        - text: Which drugs has Test misused? Select all that apply.
        - checkbox "Amphetamines (including speed, methamphetamine)"
        - text: Amphetamines (including speed, methamphetamine)
        - checkbox "Benzodiazepines (including diazepam, temazepam)"
        - text: Benzodiazepines (including diazepam, temazepam)
        - checkbox "Cannabis"
        - text: Cannabis
        - checkbox "Cocaine"
        - text: Cocaine
        - checkbox "Crack cocaine"
        - text: Crack cocaine
        - checkbox "Ecstasy (MDMA)"
        - text: Ecstasy (MDMA)
        - checkbox "Hallucinogens"
        - text: Hallucinogens
        - checkbox "Heroin"
        - text: Heroin
        - checkbox "Methadone (not prescribed)"
        - text: Methadone (not prescribed)
        - checkbox "Prescribed drugs"
        - text: Prescribed drugs
        - checkbox "Other opiates"
        - text: Other opiates
        - checkbox "Solvents (including gases and glues)"
        - text: Solvents (including gases and glues)
        - checkbox "Steroids"
        - text: Steroids
        - checkbox "Synthetic cannabinoids (spice)"
        - text: Synthetic cannabinoids (spice)
        - checkbox "Other"
        - text: Other
      - button "Save and continue"
    `)
  })

  test('shows drug-use-last-used', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId, 'v2.0').withAnswers([
        { question: Question.drug_use, value: CommonOption.yes },
        { question: Question.select_misused_drugs, value: [Option.amphetamines, Option.other_drug] },
        { question: Question.other_drug_name, value: 'calpol' },
      ])
      .withUserSubmittedSteps([Step.drug_use_status.code, Step.drug_use_types.code])
      .save()

    await DrugUsePage.navigateTo(page, handoverLink, baseURL, sanAssessmentId, Step.drug_use_last_used.path)

    const drugUsePage = await DrugUsePage.verifyOnPage(page, 'last use these drugs')

    await expect(drugUsePage.mainForm).toMatchAriaSnapshot(`
      - heading "When did Test last use these drugs?" [level=2]
      - heading "Amphetamines (including speed, methamphetamine)" [level=2]
      - group:
        - radio "Used in the last 6 months"
        - text: Used in the last 6 months
        - radio "Used more than 6 months ago"
        - text: Used more than 6 months ago
      - heading "calpol" [level=2]
      - group:
        - radio "Used in the last 6 months"
        - text: Used in the last 6 months
        - radio "Used more than 6 months ago"
        - text: Used more than 6 months ago
      - button "Save and continue"
    `)
  })

  test('shows drug-use-details', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId, 'v2.0').withAnswers([
        { question: Question.drug_use, value: CommonOption.yes },
        { question: Question.select_misused_drugs, value: [Option.amphetamines, Option.other_drug] },
        { question: Question.other_drug_name, value: 'calpol' },
        { question: forDrug(Question.drug_last_used_value, Option.amphetamines), value: Option.last_six },
        { question: forDrug(Question.drug_last_used_value, Option.other_drug), value: Option.last_six },
      ])
      .withUserSubmittedSteps([Step.drug_use_status.code, Step.drug_use_types.code, Step.drug_use_last_used.code])
      .save()

    await DrugUsePage.navigateTo(page, handoverLink, baseURL, sanAssessmentId, Step.drug_use_details.path)

    const drugUsePage = await DrugUsePage.verifyOnPage(page, 'Used in the last 6 months')

    await expect(drugUsePage.mainForm).toMatchAriaSnapshot(`
      - heading "Used in the last 6 months" [level=2]
      - group: How to record frequency
      - heading "Amphetamines (including speed, methamphetamine)" [level=2]
      - group "How often was Test using this drug?":
        - text: How often was Test using this drug?
        - radio "Daily"
        - text: Daily
        - radio "Weekly"
        - text: Weekly
        - radio "Monthly"
        - text: Monthly
        - radio "Occasionally"
        - text: Occasionally
      - text: Give details (optional)
      - textbox "Give details (optional)"
      - text: You can enter up to 2000 characters You have 2,000 characters remaining
      - heading "calpol" [level=2]
      - group "How often was Test using this drug?":
        - text: How often was Test using this drug?
        - radio "Daily"
        - text: Daily
        - radio "Weekly"
        - text: Weekly
        - radio "Monthly"
        - text: Monthly
        - radio "Occasionally"
        - text: Occasionally
      - text: Give details (optional)
      - textbox "Give details (optional)"
      - text: You can enter up to 2000 characters You have 2,000 characters remaining
      - group "Which drugs has Test injected?":
        - text: Which drugs has Test injected? Select all that apply.
        - checkbox "None"
        - text: None or
        - checkbox "Amphetamines (including speed, methamphetamine)"
        - text: Amphetamines (including speed, methamphetamine)
        - checkbox "calpol"
        - text: calpol
      - button "Save and continue"
      `)
  })

  test('shows drug-use-last-injected', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId, 'v2.0').withAnswers([
        { question: Question.drug_use, value: CommonOption.yes },
        { question: Question.select_misused_drugs, value: [Option.amphetamines, Option.other_drug] },
        { question: Question.other_drug_name, value: 'calpol' },
        { question: forDrug(Question.drug_last_used_value, Option.amphetamines), value: Option.last_six },
        { question: forDrug(Question.drug_last_used_value, Option.other_drug), value: Option.last_six },
        { question: forDrug(Question.how_often_used_value, Option.amphetamines), value: Option.daily },
        {
          question: forDrug(Question.how_often_used_details, Option.amphetamines),
          value: 'amphetamines usage details',
        },
        { question: forDrug(Question.how_often_used_value, Option.other_drug), value: Option.daily },
        { question: forDrug(Question.how_often_used_details, Option.other_drug), value: 'other drug usage details' },
        { question: Question.drugs_injected, value: [Option.amphetamines] },
      ])
      .withUserSubmittedSteps([
        Step.drug_use_status.code,
        Step.drug_use_types.code,
        Step.drug_use_last_used.code,
        Step.drug_use_details.code,
      ])
      .save()

    await DrugUsePage.navigateTo(page, handoverLink, baseURL, sanAssessmentId, Step.drug_use_last_injected.path)

    const drugUsePage = await DrugUsePage.verifyOnPage(page, 'injected drugs')

    await expect(drugUsePage.mainForm).toMatchAriaSnapshot(`
      - heading "When has Test injected drugs?" [level=2]
      - heading "Amphetamines (including speed, methamphetamine)" [level=2]
      - group:
        - text: Select one or both.
        - checkbox "In the last 6 months"
        - text: In the last 6 months
        - checkbox "More than 6 months ago"
        - text: More than 6 months ago
      - button "Save and continue"
      `)
  })

  test('shows drug-use-reduce-use, used drugs in last 6 months', async ({
    page,
    createSession,
    strengthsAndNeedsBuilder,
    baseURL,
  }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId, 'v2.0').withAnswers([
        { question: Question.drug_use, value: CommonOption.yes },
        { question: Question.select_misused_drugs, value: [Option.amphetamines, Option.other_drug] },
        { question: Question.other_drug_name, value: 'calpol' },
        { question: forDrug(Question.drug_last_used_value, Option.amphetamines), value: Option.last_six },
        { question: forDrug(Question.drug_last_used_value, Option.other_drug), value: Option.last_six },
        { question: forDrug(Question.how_often_used_value, Option.amphetamines), value: Option.daily },
        {
          question: forDrug(Question.how_often_used_details, Option.amphetamines),
          value: 'amphetamines usage details',
        },
        { question: forDrug(Question.how_often_used_value, Option.other_drug), value: Option.daily },
        { question: forDrug(Question.how_often_used_details, Option.other_drug), value: 'other drug usage details' },
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

    await DrugUsePage.navigateTo(page, handoverLink, baseURL, sanAssessmentId, Step.drug_use_reduce_use.path)

    const drugUsePage = await DrugUsePage.verifyOnPage(page, 'stop or reduce their drug use')

    await expect(drugUsePage.mainForm).toMatchAriaSnapshot(`
      - group "Does anything help Test to stop or reduce their drug use?":
        - text: Does anything help Test to stop or reduce their drug use? Consider any treatment, support networks or lifestyle changes.
        - radio "Yes"
        - text: "Yes"
        - radio "No"
        - text: "No"
      - group "Does Test seem motivated to stop or reduce their drug use?":
        - text: Does Test seem motivated to stop or reduce their drug use?
        - radio "Does not show motivation to stop or reduce"
        - text: Does not show motivation to stop or reduce
        - radio "Shows some motivation to stop or reduce"
        - text: Shows some motivation to stop or reduce
        - radio "Motivated to stop or reduce"
        - text: Motivated to stop or reduce
        - radio "Unknown"
        - text: Unknown
      - button "Save and continue"
      `)
  })

  test('shows drug-use-reduce-use, NOT used drugs in last 6 months', async ({
    page,
    createSession,
    strengthsAndNeedsBuilder,
    baseURL,
  }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId, 'v2.0').withAnswers([
        { question: Question.drug_use, value: CommonOption.yes },
        { question: Question.select_misused_drugs, value: [Option.amphetamines, Option.other_drug] },
        { question: Question.other_drug_name, value: 'calpol' },
        { question: forDrug(Question.drug_last_used_value, Option.amphetamines), value: Option.more_than_six },
        { question: forDrug(Question.drug_last_used_value, Option.other_drug), value: Option.more_than_six },
        { question: forDrug(Question.how_often_used_value, Option.amphetamines), value: Option.daily },
        {
          question: forDrug(Question.how_often_used_details, Option.amphetamines),
          value: 'amphetamines usage details',
        },
        { question: forDrug(Question.how_often_used_value, Option.other_drug), value: Option.daily },
        { question: forDrug(Question.how_often_used_details, Option.other_drug), value: 'other drug usage details' },
        { question: Question.drugs_injected, value: [Option.amphetamines] },
        { question: forDrug(Question.drugs_injected_value, Option.amphetamines), value: [Option.more_than_six] },
      ])
      .withUserSubmittedSteps([
        Step.drug_use_status.code,
        Step.drug_use_types.code,
        Step.drug_use_last_used.code,
        Step.drug_use_details.code,
        Step.drug_use_last_injected.code,
      ])
      .save()

    await DrugUsePage.navigateTo(page, handoverLink, baseURL, sanAssessmentId, Step.drug_use_reduce_use.path)

    const drugUsePage = await DrugUsePage.verifyOnPage(page, 'stop or reduce their drug use')

    await expect(drugUsePage.mainForm).toMatchAriaSnapshot(`
      - group "Did anything help Test to stop or reduce their drug use?":
        - text: Did anything help Test to stop or reduce their drug use? Note any treatment or lifestyle changes that have helped them.
        - radio "Yes"
        - text: "Yes"
        - radio "No"
        - text: "No"
      - button "Save and continue"
      `)
  })

  test('shows drug-use-change-use', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId, 'v2.0').withAnswers([
        { question: Question.drug_use, value: CommonOption.yes },
        { question: Question.select_misused_drugs, value: [Option.amphetamines, Option.other_drug] },
        { question: Question.other_drug_name, value: 'calpol' },
        { question: forDrug(Question.drug_last_used_value, Option.amphetamines), value: Option.last_six },
        { question: forDrug(Question.drug_last_used_value, Option.other_drug), value: Option.last_six },
        { question: forDrug(Question.how_often_used_value, Option.amphetamines), value: Option.daily },
        {
          question: forDrug(Question.how_often_used_details, Option.amphetamines),
          value: 'amphetamines usage details',
        },
        { question: forDrug(Question.how_often_used_value, Option.other_drug), value: Option.daily },
        { question: forDrug(Question.how_often_used_details, Option.other_drug), value: 'other drug usage details' },
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

    await DrugUsePage.navigateTo(page, handoverLink, baseURL, sanAssessmentId, Step.drug_use_change_use.path)

    const drugUsePage = await DrugUsePage.verifyOnPage(page, 'want to make changes to their drug use')

    await expect(drugUsePage.mainForm).toMatchAriaSnapshot(`
      - group "Does Test want to make changes to their drug use?":
        - text: Does Test want to make changes to their drug use? Test must answer this question.
        - radio "I have already made positive changes and want to maintain them"
        - text: I have already made positive changes and want to maintain them
        - radio "I am actively making changes"
        - text: I am actively making changes
        - radio "I want to make changes and know how to"
        - text: I want to make changes and know how to
        - radio "I want to make changes but need help"
        - text: I want to make changes but need help
        - radio "I am thinking about making changes"
        - text: I am thinking about making changes
        - radio "I do not want to make changes"
        - text: I do not want to make changes
        - radio "I do not want to answer"
        - text: I do not want to answer or
        - radio "Test is not present"
        - text: Test is not present
        - radio "Not applicable"
        - text: Not applicable
      - button "Save and continue"
      `)
  })
})
