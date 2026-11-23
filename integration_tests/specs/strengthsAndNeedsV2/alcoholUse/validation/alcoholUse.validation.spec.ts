import { Step } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/alcohol-use/constants/step'
import { CommonOption } from '@server/forms/strengths-and-needs/versions/v2.0/constants/commonOption'
import { Option } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/alcohol-use/constants/option'
import { Question } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/alcohol-use/constants/question'
import AlcoholUsePage from 'pages/strengthsAndNeedsV2/alcoholUsePage'
import { expect } from '@playwright/test'
import { test } from '../../fixtures'
import { TargetService } from '../../../../support/fixtures'

/**
 * Some alcohol use fields have character limits. These tests exercise the page to reveal the character count fields,
 * then check each one holds to its limit: one character over fails validation, exactly the limit passes.
 */

test.describe('Validation', () => {

  test('validation current issues question', async ({ page, createSession, baseURL }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })

    await AlcoholUsePage.navigateTo(page, handoverLink, baseURL, sanAssessmentId)

    const alcoholUsePage = await AlcoholUsePage.verifyOnPage(
      page,
      'Is there evidence that Test has had any issues with alcohol in the last 6 months?',
    )

    const { questions } = alcoholUsePage

    await alcoholUsePage.saveAndContinue.click()

    await expect(alcoholUsePage.alert).toMatchAriaSnapshot(`
      - alert:
        - heading "There is a problem" [level=2]
        - list:
          - listitem:
            - link "Select if there is evidence that they have had any issues with alcohol in the last 6 months":
              - /url: "#alcohol_current_issues"
    `)

    await questions.alcohol_current_issues.errorLink.click()
    await expect(questions.alcohol_current_issues.input).toBeFocused()
  })

  test('validation excessive drinking and past issues question', async ({
    page,
    createSession,
    strengthsAndNeedsBuilder,
    baseURL,
  }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })

    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId)
      .withAnswers([{ question: Question.alcohol_current_issues, value: Option.significant }])
      .withUserSubmittedSteps([Step.alcohol_use_current_issues.code])
      .save()

    await AlcoholUsePage.navigateTo(
      page,
      handoverLink,
      baseURL,
      sanAssessmentId,
      Step.alcohol_use_excessive_drinking_past_issues.path,
    )

    const alcoholUsePage = await AlcoholUsePage.verifyOnPage(
      page,
      'Has Test shown evidence of binge drinking or excessive alcohol use in the last 6 months?',
    )

    const { questions } = alcoholUsePage

    await alcoholUsePage.saveAndContinue.click()

    await expect(alcoholUsePage.alert).toMatchAriaSnapshot(`
      - alert:
        - heading "There is a problem" [level=2]
        - list:
          - listitem:
            - link "Select if there's evidence of binge drinking or excessive alcohol use in the last 6 months":
              - /url: "#alcohol_evidence_of_excess_drinking"
          - listitem:
            - link "Select if they have any past issues with alcohol":
              - /url: "#alcohol_past_issues"
    `)

    await questions.alcohol_evidence_of_excess_drinking.errorLink.click()
    await expect(questions.alcohol_evidence_of_excess_drinking.input).toBeFocused()
    await questions.alcohol_past_issues.errorLink.click()
    await expect(questions.alcohol_past_issues.input).toBeFocused()
  })

  test('validation past issues only question', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })

    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId)
      .withAnswers([{ question: Question.alcohol_current_issues, value: Option.no_current_problems }])
      .withUserSubmittedSteps([Step.alcohol_use_current_issues.code])
      .save()

    await AlcoholUsePage.navigateTo(
      page,
      handoverLink,
      baseURL,
      sanAssessmentId,
      Step.alcohol_use_excessive_drinking_past_issues.path,
    )

    const alcoholUsePage = await AlcoholUsePage.verifyOnPage(page, 'Does Test have any past issues with alcohol?')

    const { questions } = alcoholUsePage

    await alcoholUsePage.saveAndContinue.click()

    await expect(alcoholUsePage.alert).toMatchAriaSnapshot(`
      - alert:
        - heading "There is a problem" [level=2]
        - list:
          - listitem:
            - link "Select if they have any past issues with alcohol":
              - /url: "#alcohol_past_issues"
    `)

    await questions.alcohol_past_issues.errorLink.click()
    await expect(questions.alcohol_past_issues.input).toBeFocused()
  })

  test('validation stop or reduce question', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })

    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId)
      .withAnswers([
        { question: Question.alcohol_current_issues, value: Option.significant },
        { question: Question.alcohol_evidence_of_excess_drinking, value: Option.yes_with_evidence },
        { question: Question.alcohol_past_issues, value: CommonOption.yes },
        { question: Question.alcohol_past_issues_yes_details, value: 'Some details' },
      ])
      .withUserSubmittedSteps([
        Step.alcohol_use_current_issues.code,
        Step.alcohol_use_excessive_drinking_past_issues.code,
      ])
      .save()

    await AlcoholUsePage.navigateTo(
      page,
      handoverLink,
      baseURL,
      sanAssessmentId,
      Step.alcohol_use_stopped_or_reduced.path,
    )

    const alcoholUsePage = await AlcoholUsePage.verifyOnPage(
      page,
      'Does anything help Test to stop or reduce drinking alcohol?',
    )

    const { questions } = alcoholUsePage

    await alcoholUsePage.saveAndContinue.click()

    await expect(alcoholUsePage.alert).toMatchAriaSnapshot(`
      - alert:
        - heading "There is a problem" [level=2]
        - list:
          - listitem:
            - link "Select if anything helps them to stop or reduce drinking alcohol":
              - /url: "#alcohol_stopped_or_reduced"
    `)

    await questions.alcohol_stopped_or_reduced.errorLink.click()
    await expect(questions.alcohol_stopped_or_reduced.input).toBeFocused()
  })

  test('validation stop or reduce in past question', async ({
    page,
    createSession,
    strengthsAndNeedsBuilder,
    baseURL,
  }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })

    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId)
      .withAnswers([
        { question: Question.alcohol_current_issues, value: Option.no_current_problems },
        { question: Question.alcohol_past_issues, value: CommonOption.yes },
        { question: Question.alcohol_past_issues_yes_details, value: 'Some details' },
      ])
      .withUserSubmittedSteps([
        Step.alcohol_use_current_issues.code,
        Step.alcohol_use_excessive_drinking_past_issues.code,
      ])
      .save()

    await AlcoholUsePage.navigateTo(
      page,
      handoverLink,
      baseURL,
      sanAssessmentId,
      Step.alcohol_use_stopped_or_reduced.path,
    )

    const alcoholUsePage = await AlcoholUsePage.verifyOnPage(
      page,
      'Has anything helped Test to stop or reduce drinking alcohol in the past?',
    )

    const { questions } = alcoholUsePage

    await alcoholUsePage.saveAndContinue.click()

    await expect(alcoholUsePage.alert).toMatchAriaSnapshot(`
      - alert:
        - heading "There is a problem" [level=2]
        - list:
          - listitem:
            - link "Select if anything has helped them to stop or reduce drinking alcohol in the past":
              - /url: "#alcohol_stopped_or_reduced_past"
    `)

    await questions.alcohol_stopped_or_reduced_past.errorLink.click()
    await expect(questions.alcohol_stopped_or_reduced_past.input).toBeFocused()
  })

  test('shows changes question', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })

    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId)
      .withAnswers([
        { question: Question.alcohol_current_issues, value: Option.significant },
        { question: Question.alcohol_evidence_of_excess_drinking, value: Option.yes_with_evidence },
        { question: Question.alcohol_past_issues, value: CommonOption.yes },
        { question: Question.alcohol_past_issues_yes_details, value: 'Some details' },
        { question: Question.alcohol_stopped_or_reduced, value: CommonOption.yes },
        { question: Question.alcohol_stopped_or_reduced_yes_details, value: 'Some details' },
      ])
      .withUserSubmittedSteps([
        Step.alcohol_use_current_issues.code,
        Step.alcohol_use_excessive_drinking_past_issues.code,
        Step.alcohol_use_stopped_or_reduced.code,
      ])
      .save()

    await AlcoholUsePage.navigateTo(page, handoverLink, baseURL, sanAssessmentId, Step.alcohol_use_changes.path)

    const alcoholUsePage = await AlcoholUsePage.verifyOnPage(
      page,
      'Does Test want to make changes to their alcohol use?',
    )

    const { questions } = alcoholUsePage

    await alcoholUsePage.saveAndContinue.click()

    await expect(alcoholUsePage.alert).toMatchAriaSnapshot(`
      - alert:
        - heading "There is a problem" [level=2]
        - list:
          - listitem:
            - link "Select if they want to make changes to their alcohol use":
              - /url: "#alcohol_use_changes"
    `)

    await questions.alcohol_use_changes.errorLink.click()
    await expect(questions.alcohol_use_changes.input).toBeFocused()
  })
})
