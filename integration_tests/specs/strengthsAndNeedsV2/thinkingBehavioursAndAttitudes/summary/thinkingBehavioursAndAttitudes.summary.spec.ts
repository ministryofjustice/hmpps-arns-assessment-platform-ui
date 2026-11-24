import { Option } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/thinking-behaviours-and-attitudes/constants/option'
import { Question } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/thinking-behaviours-and-attitudes/constants/question'
import { Step } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/thinking-behaviours-and-attitudes/constants/step'
import { CommonOption } from '@server/forms/strengths-and-needs/versions/v2.0/constants/commonOption'
import { expect } from '@playwright/test'
import ThinkingBehavioursAndAttitudesPage from 'pages/strengthsAndNeedsV2/thinkingBehavioursAndAttitudesPage'
import { test, TargetService } from '../../../../support/fixtures'

test.describe('Summary', () => {
  test('shows summary complete page', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
      sexuallyMotivatedOffenceHistory: 'YES',
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId)
      .withAnswers([
        { question: Question.thinking_behaviours_attitudes_changes, value: CommonOption.not_present },
        { question: Question.thinking_behaviours_attitudes_supervision, value: Option.yes_supervision },
        { question: Question.thinking_behaviours_attitudes_consequences, value: CommonOption.yes },
        { question: Question.thinking_behaviours_attitudes_peer_pressure, value: CommonOption.yes },
        { question: Question.thinking_behaviours_attitudes_peoples_views, value: CommonOption.yes },
        { question: Question.thinking_behaviours_attitudes_problem_solving, value: CommonOption.yes },
        { question: Question.thinking_behaviours_attitudes_stable_behaviour, value: CommonOption.yes },
        { question: Question.thinking_behaviours_attitudes_temper_management, value: CommonOption.yes },
        { question: Question.thinking_behaviours_attitudes_criminal_behaviour, value: CommonOption.no },
        { question: Question.thinking_behaviours_attitudes_hostile_orientation, value: CommonOption.no },
        { question: Question.thinking_behaviours_attitudes_impulsive_behaviour, value: CommonOption.no },
        {
          question: Question.thinking_behaviours_attitudes_offending_activities,
          value: Option.no_offending_activities,
        },
        { question: Question.thinking_behaviours_attitudes_peer_pressure_yes_details, value: '' },
        { question: Question.thinking_behaviours_attitudes_violence_controlling_behaviour, value: Option.no_violence },
        { question: Question.thinking_behaviours_attitudes_manipulative_predatory_behaviour, value: CommonOption.no },
        { question: Question.thinking_behaviours_attitudes_risk_sexual_harm, value: CommonOption.yes },
        { question: Question.thinking_behaviours_attitudes_emotional_intimacy, value: CommonOption.yes },
        { question: Question.thinking_behaviours_attitudes_sexual_preoccupation, value: CommonOption.yes },
        {
          question: Question.thinking_behaviours_attitudes_offence_related_sexual_interest,
          value: Option.yes_offence_related_sexual_interest,
        },
      ])
      .withUserSubmittedSteps([
        Step.thinking_behaviours_attitudes.code,
        Step.thinking_behaviours_attitudes_changes.code,
        Step.thinking_behaviours_attitudes_risk_of_sexual_harm.code,
        Step.thinking_behaviours_attitudes_risk_of_sexual_harm_details.code,
        Step.thinking_behaviours_attitudes_summary.code,
      ])
      .save()

    await ThinkingBehavioursAndAttitudesPage.navigateTo(
      page,
      handoverLink,
      baseURL,
      sanAssessmentId,
      'thinking-behaviours-attitudes-summary',
    )

    const thinkingBehavioursAndAttitudesPage = await ThinkingBehavioursAndAttitudesPage.verifyOnPage(page, 'Summary')

    await expect(thinkingBehavioursAndAttitudesPage.summary).toMatchAriaSnapshot(`
      - tabpanel "Summary":
        - term: Is Test aware of the consequences of their actions?
        - definition:
          - paragraph: Yes, is aware of the consequences of their actions
        - definition:
          - link "Change Is Test aware of the consequences of their actions?":
            - /url: thinking-behaviours-attitudes#thinking_behaviours_attitudes_consequences-question
        - term: Does Test show stable behaviour?
        - definition:
          - paragraph: Yes, shows stable behaviour
        - definition:
          - link "Change Does Test show stable behaviour?":
            - /url: thinking-behaviours-attitudes#thinking_behaviours_attitudes_stable_behaviour-question
        - term: Does Test engage in activities that could link to offending?
        - definition:
          - paragraph: No, does not engage in these activities
        - definition:
          - link "Change Does Test engage in activities that could link to offending?":
            - /url: thinking-behaviours-attitudes#thinking_behaviours_attitudes_offending_activities-question
        - term: Is Test influenced by others in relation to their offending?
        - definition:
          - paragraph: No, not influenced by others
        - definition:
          - link "Change Is Test influenced by others in relation to their offending?":
            - /url: thinking-behaviours-attitudes#thinking_behaviours_attitudes_peer_pressure-question
        - term: Is Test able to solve problems in a positive way?
        - definition:
          - paragraph: Yes, is able to solve problems and identify appropriate solutions
        - definition:
          - link "Change Is Test able to solve problems in a positive way?":
            - /url: thinking-behaviours-attitudes#thinking_behaviours_attitudes_problem_solving-question
        - term: Does Test understand other people’s views?
        - definition:
          - paragraph: Yes, understands other people’s views and is able to distinguish between their own feelings and those of others
        - definition:
          - link "Change Does Test understand other people’s views?":
            - /url: thinking-behaviours-attitudes#thinking_behaviours_attitudes_peoples_views-question
        - term: Are there any indications that Test manipulates or exploits other people for personal gain?
        - definition:
          - paragraph: No indications
        - definition:
          - link "Change Are there any indications that Test manipulates or exploits other people for personal gain?":
            - /url: thinking-behaviours-attitudes#thinking_behaviours_attitudes_manipulative_predatory_behaviour-question
        - term: Is Test able to manage their temper?
        - definition:
          - paragraph: Yes, manages it well
        - definition:
          - link "Change Is Test able to manage their temper?":
            - /url: thinking-behaviours-attitudes#thinking_behaviours_attitudes_temper_management-question
        - term: Does Test use violence, aggressive or controlling behaviour to get their own way?
        - definition:
          - paragraph: Does not use violence, aggressive or controlling behaviour to get their own way
        - definition:
          - link "Change Does Test use violence, aggressive or controlling behaviour to get their own way?":
            - /url: thinking-behaviours-attitudes#thinking_behaviours_attitudes_violence_controlling_behaviour-question
        - term: Does Test act on impulse?
        - definition:
          - paragraph: Considers all aspects of a situation before acting on or making a decision
        - definition:
          - link "Change Does Test act on impulse?":
            - /url: thinking-behaviours-attitudes#thinking_behaviours_attitudes_impulsive_behaviour-question
        - term: Does Test show hostility towards other people, rules or authority?
        - definition:
          - paragraph: No, does not show hostility
        - definition:
          - link "Change Does Test show hostility towards other people, rules or authority?":
            - /url: thinking-behaviours-attitudes#thinking_behaviours_attitudes_hostile_orientation-question
        - term: Are there indications Test is willing to engage positively with their sentence?
        - definition:
          - paragraph: Significant indications
        - definition:
          - link "Change Are there indications Test is willing to engage positively with their sentence?":
            - /url: thinking-behaviours-attitudes#thinking_behaviours_attitudes_supervision-question
        - term: Does Test support or excuse criminal behaviour?
        - definition:
          - paragraph: Does not support or excuse criminal behaviour
        - definition:
          - link "Change Does Test support or excuse criminal behaviour?":
            - /url: thinking-behaviours-attitudes#thinking_behaviours_attitudes_criminal_behaviour-question
        - term: Does Test want to make changes to their thinking, behaviours and attitudes?
        - definition:
          - paragraph: Test is not present
        - definition:
          - link "Change Does Test want to make changes to their thinking, behaviours and attitudes?":
            - /url: thinking-behaviours-attitudes-changes#thinking_behaviours_attitudes_changes-question
        - term: Are there any concerns that Test poses a risk of sexual harm to others?
        - definition:
          - paragraph: "Yes"
        - definition:
          - link "Change Are there any concerns that Test poses a risk of sexual harm to others?":
            - /url: thinking-behaviours-attitudes-risk-of-sexual-harm#thinking_behaviours_attitudes_risk_sexual_harm-question
        - term: Is there evidence Test shows sexual preoccupation?
        - definition:
          - paragraph: Significant evidence
        - definition:
          - link "Change Is there evidence Test shows sexual preoccupation?":
            - /url: thinking-behaviours-attitudes-risk-of-sexual-harm-details#thinking_behaviours_attitudes_sexual_preoccupation-question
        - term: Is there evidence Test has offence-related sexual interests?
        - definition:
          - paragraph: Yes, significant evidence
        - definition:
          - link "Change Is there evidence Test has offence-related sexual interests?":
            - /url: thinking-behaviours-attitudes-risk-of-sexual-harm-details#thinking_behaviours_attitudes_offence_related_sexual_interest-question
        - term: Is there evidence Test finds it easier to seek emotional intimacy with children over adults?
        - definition:
          - paragraph: Yes, significant evidence
        - definition:
          - link "Change Is there evidence Test finds it easier to seek emotional intimacy with children over adults?":
            - /url: thinking-behaviours-attitudes-risk-of-sexual-harm-details#thinking_behaviours_attitudes_emotional_intimacy-question
        - button "Go to practitioner analysis"
    `)
  })

  test('practitioner analysis', async ({ baseURL, page, createSession, strengthsAndNeedsBuilder }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
      sexuallyMotivatedOffenceHistory: 'YES',
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId)
      .withAnswers([
        { question: Question.thinking_behaviours_attitudes_changes, value: CommonOption.not_present },
        { question: Question.thinking_behaviours_attitudes_supervision, value: Option.yes_supervision },
        { question: Question.thinking_behaviours_attitudes_consequences, value: CommonOption.yes },
        { question: Question.thinking_behaviours_attitudes_peer_pressure, value: CommonOption.yes },
        { question: Question.thinking_behaviours_attitudes_peoples_views, value: CommonOption.yes },
        { question: Question.thinking_behaviours_attitudes_problem_solving, value: CommonOption.yes },
        { question: Question.thinking_behaviours_attitudes_stable_behaviour, value: CommonOption.yes },
        { question: Question.thinking_behaviours_attitudes_temper_management, value: CommonOption.yes },
        { question: Question.thinking_behaviours_attitudes_criminal_behaviour, value: CommonOption.no },
        { question: Question.thinking_behaviours_attitudes_hostile_orientation, value: CommonOption.no },
        { question: Question.thinking_behaviours_attitudes_impulsive_behaviour, value: CommonOption.no },
        {
          question: Question.thinking_behaviours_attitudes_offending_activities,
          value: Option.no_offending_activities,
        },
        { question: Question.thinking_behaviours_attitudes_peer_pressure_yes_details, value: '' },
        { question: Question.thinking_behaviours_attitudes_violence_controlling_behaviour, value: Option.no_violence },
        { question: Question.thinking_behaviours_attitudes_manipulative_predatory_behaviour, value: CommonOption.no },
        { question: Question.thinking_behaviours_attitudes_risk_sexual_harm, value: CommonOption.yes },
        { question: Question.thinking_behaviours_attitudes_emotional_intimacy, value: CommonOption.yes },
        { question: Question.thinking_behaviours_attitudes_sexual_preoccupation, value: CommonOption.yes },
        {
          question: Question.thinking_behaviours_attitudes_offence_related_sexual_interest,
          value: Option.yes_offence_related_sexual_interest,
        },
      ])
      .withUserSubmittedSteps([
        Step.thinking_behaviours_attitudes.code,
        Step.thinking_behaviours_attitudes_changes.code,
        Step.thinking_behaviours_attitudes_risk_of_sexual_harm.code,
        Step.thinking_behaviours_attitudes_risk_of_sexual_harm_details.code,
        Step.thinking_behaviours_attitudes_summary.code,
      ])
      .save()

    await ThinkingBehavioursAndAttitudesPage.navigateTo(
      page,
      handoverLink,
      baseURL,
      sanAssessmentId,
      'thinking-behaviours-attitudes-summary',
    )

    const thinkingBehavioursAndAttitudesPage = await ThinkingBehavioursAndAttitudesPage.verifyOnPage(page, 'Summary')

    await thinkingBehavioursAndAttitudesPage.goToPractitionerAnalysis.click()
    await expect(page.getByText('Are there any strengths or protective factors')).toBeVisible()
  })

  test('mark complete', async ({ baseURL, page, createSession, strengthsAndNeedsBuilder }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId)
      .withAnswers([
        { question: Question.thinking_behaviours_attitudes_changes, value: CommonOption.not_present },
        { question: Question.thinking_behaviours_attitudes_supervision, value: Option.yes_supervision },
        { question: Question.thinking_behaviours_attitudes_consequences, value: CommonOption.yes },
        { question: Question.thinking_behaviours_attitudes_peer_pressure, value: CommonOption.yes },
        { question: Question.thinking_behaviours_attitudes_peoples_views, value: CommonOption.yes },
        { question: Question.thinking_behaviours_attitudes_problem_solving, value: CommonOption.yes },
        { question: Question.thinking_behaviours_attitudes_stable_behaviour, value: CommonOption.yes },
        { question: Question.thinking_behaviours_attitudes_temper_management, value: CommonOption.yes },
        { question: Question.thinking_behaviours_attitudes_criminal_behaviour, value: CommonOption.no },
        { question: Question.thinking_behaviours_attitudes_hostile_orientation, value: CommonOption.no },
        { question: Question.thinking_behaviours_attitudes_impulsive_behaviour, value: CommonOption.no },
        {
          question: Question.thinking_behaviours_attitudes_offending_activities,
          value: Option.no_offending_activities,
        },
        { question: Question.thinking_behaviours_attitudes_peer_pressure_yes_details, value: '' },
        { question: Question.thinking_behaviours_attitudes_violence_controlling_behaviour, value: Option.no_violence },
        { question: Question.thinking_behaviours_attitudes_manipulative_predatory_behaviour, value: CommonOption.no },
        { question: Question.thinking_behaviours_attitudes_risk_sexual_harm, value: CommonOption.yes },
        { question: Question.thinking_behaviours_attitudes_emotional_intimacy, value: CommonOption.yes },
        { question: Question.thinking_behaviours_attitudes_sexual_preoccupation, value: CommonOption.yes },
        {
          question: Question.thinking_behaviours_attitudes_offence_related_sexual_interest,
          value: Option.yes_offence_related_sexual_interest,
        },
        {
          question: Question.thinking_behaviours_attitudes_practitioner_analysis_strengths_or_protective_factors,
          value: CommonOption.no,
        },
        {
          question:
            Question.thinking_behaviours_attitudes_practitioner_analysis_strengths_or_protective_factors_no_details,
          value: '',
        },
        {
          question: Question.thinking_behaviours_attitudes_practitioner_analysis_risk_of_serious_harm,
          value: CommonOption.no,
        },
        {
          question: Question.thinking_behaviours_attitudes_practitioner_analysis_risk_of_serious_harm_no_details,
          value: '',
        },
      ])
      .withUserSubmittedSteps([
        Step.thinking_behaviours_attitudes.code,
        Step.thinking_behaviours_attitudes_changes.code,
        Step.thinking_behaviours_attitudes_risk_of_sexual_harm.code,
        Step.thinking_behaviours_attitudes_risk_of_sexual_harm_details.code,
        Step.thinking_behaviours_attitudes_summary.code,
      ])
      .save()

    await ThinkingBehavioursAndAttitudesPage.navigateTo(
      page,
      handoverLink,
      baseURL,
      sanAssessmentId,
      'thinking-behaviours-attitudes-summary#practitioner-analysis',
    )
    const thinkingBehavioursAndAttitudesPage = await ThinkingBehavioursAndAttitudesPage.verifyOnPage(
      page,
      'strengths or protective factors',
    )

    await thinkingBehavioursAndAttitudesPage.questions.thinking_behaviours_attitudes_practitioner_analysis_risk_of_reoffending.option(CommonOption.no)
      .click()
    await thinkingBehavioursAndAttitudesPage.markComplete.click()
    await expect(thinkingBehavioursAndAttitudesPage.complete).toBeVisible()
    expect(page.url()).toContain('thinking-behaviours-attitudes-analysis')
  })
})
