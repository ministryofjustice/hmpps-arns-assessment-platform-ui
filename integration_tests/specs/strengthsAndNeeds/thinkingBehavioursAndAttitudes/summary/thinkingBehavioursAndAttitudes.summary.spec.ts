import { Option } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/thinking-behaviours-and-attitudes/constants/option'
import { Question } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/thinking-behaviours-and-attitudes/constants/question'
import { CommonOption } from '@server/forms/strengths-and-needs/versions/v1.0/constants/commonOption'
import { expect } from '@playwright/test'
import ThinkingBehavioursAndAttitudesPage from 'pages/strengthsAndNeeds/thinkingBehavioursAndAttitudesPage'
import { test, TargetService } from '../../../../support/fixtures'

test.describe('Summary', () => {
  test('shows summary page', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
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
        { question: Question.thinking_behaviours_attitudes_positive_attitude, value: Option.yes_positive },
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
      .save()

    await ThinkingBehavioursAndAttitudesPage.navigateTo(
      page,
      handoverLink,
      baseURL,
      sanAssessmentId,
      'thinking-behaviours-summary',
    )

    const thinkingBehavioursAndAttitudesPage = await ThinkingBehavioursAndAttitudesPage.verifyOnPage(page, 'Summary')

    await expect(thinkingBehavioursAndAttitudesPage.summary).toMatchAriaSnapshot(`
      - tabpanel "Summary":
        - term: Is Test aware of the consequences of their actions?
        - definition:
          - paragraph: Yes, is aware of the consequences of their actions
        - definition:
          - link "Change Is Test aware of the consequences of their actions?":
            - /url: thinking-behaviours#thinking_behaviours_attitudes_consequences-question
        - term: Does Test show stable behaviour?
        - definition:
          - paragraph: Yes, shows stable behaviour
        - definition:
          - link "Change Does Test show stable behaviour?":
            - /url: thinking-behaviours#thinking_behaviours_attitudes_stable_behaviour-question
        - term: Does Test engage in activities that could link to offending?
        - definition:
          - paragraph: Engages in pro-social activities and understands the link to offending
        - definition:
          - link "Change Does Test engage in activities that could link to offending?":
            - /url: thinking-behaviours#thinking_behaviours_attitudes_offending_activities-question
        - term: Is Test resilient towards peer pressure or influence by criminal associates?
        - definition:
          - paragraph: Yes, resilient towards peer pressure or influence by criminal associates
        - definition:
          - link "Change Is Test resilient towards peer pressure or influence by criminal associates?":
            - /url: thinking-behaviours#thinking_behaviours_attitudes_peer_pressure-question
        - term: Is Test able to solve problems in a positive way?
        - definition:
          - paragraph: Yes, is able to solve problems and identify appropriate solutions
        - definition:
          - link "Change Is Test able to solve problems in a positive way?":
            - /url: thinking-behaviours#thinking_behaviours_attitudes_problem_solving-question
        - term: Does Test understand other people’s views?
        - definition:
          - paragraph: Yes, understands other people’s views and is able to distinguish between their own feelings and those of others
        - definition:
          - link "Change Does Test understand other people’s views?":
            - /url: thinking-behaviours#thinking_behaviours_attitudes_peoples_views-question
        - term: Does Test show manipulative behaviour or a predatory lifestyle?
        - definition:
          - paragraph: Generally gives an honest account of their lives and has no history of showing manipulative behaviour or a predatory lifestyle
        - definition:
          - link "Change Does Test show manipulative behaviour or a predatory lifestyle?":
            - /url: thinking-behaviours#thinking_behaviours_attitudes_manipulative_predatory_behaviour-question
        - term: Is Test able to manage their temper?
        - definition:
          - paragraph: Yes, is able to manage their temper well
        - definition:
          - link "Change Is Test able to manage their temper?":
            - /url: thinking-behaviours#thinking_behaviours_attitudes_temper_management-question
        - term: Does Test use violence, aggressive or controlling behaviour to get their own way?
        - definition:
          - paragraph: Does not use violence, aggressive or controlling behaviour to get their own way
        - definition:
          - link "Change Does Test use violence, aggressive or controlling behaviour to get their own way?":
            - /url: thinking-behaviours#thinking_behaviours_attitudes_violence_controlling_behaviour-question
        - term: Does Test act on impulse?
        - definition:
          - paragraph: Considers all aspects of a situation before acting on or making a decision
        - definition:
          - link "Change Does Test act on impulse?":
            - /url: thinking-behaviours#thinking_behaviours_attitudes_impulsive_behaviour-question
        - term: Does Test have a positive attitude towards any criminal justice staff they have come into contact with?
        - definition:
          - paragraph: Yes, has a positive attitude
        - definition:
          - link "Change Does Test have a positive attitude towards any criminal justice staff they have come into contact with?":
            - /url: thinking-behaviours#thinking_behaviours_attitudes_positive_attitude-question
        - term: Does Test have hostile orientation to others or to general rules?
        - definition:
          - paragraph: They’re able to have constructive conversations when they disagree with others and can forgive past wrongs
        - definition:
          - link "Change Does Test have hostile orientation to others or to general rules?":
            - /url: thinking-behaviours#thinking_behaviours_attitudes_hostile_orientation-question
        - term: Does Test accept supervision and their licence conditions?
        - definition:
          - paragraph: Accepts supervision and has responded well to supervision in the past
        - definition:
          - link "Change Does Test accept supervision and their licence conditions?":
            - /url: thinking-behaviours#thinking_behaviours_attitudes_supervision-question
        - term: Does Test support or excuse criminal behaviour?
        - definition:
          - paragraph: Does not support or excuse criminal behaviour
        - definition:
          - link "Change Does Test support or excuse criminal behaviour?":
            - /url: thinking-behaviours#thinking_behaviours_attitudes_criminal_behaviour-question
        - term: Does Test want to make changes to their thinking, behaviours and attitudes?
        - definition:
          - paragraph: Test is not present
        - definition:
          - link "Change Does Test want to make changes to their thinking, behaviours and attitudes?":
            - /url: thinking-behaviours#thinking_behaviours_attitudes_changes-question
        - term: Are there any concerns that Test poses a risk of sexual harm to others?
        - definition:
          - paragraph: "Yes"
        - definition:
          - link "Change Are there any concerns that Test poses a risk of sexual harm to others?":
            - /url: thinking-behaviours-risk-of-sexual-harm#thinking_behaviours_attitudes_risk_sexual_harm-question
        - term: Is there evidence Test shows sexual preoccupation?
        - definition:
          - paragraph: Yes, the amount of time they spend engaging in sexual activity or thinking about sex is unhealthy and is impacting their day-to-day life
        - definition:
          - link "Change Is there evidence Test shows sexual preoccupation?":
            - /url: thinking-behaviours-sexual-harm#thinking_behaviours_attitudes_sexual_preoccupation-question
        - term: Is there evidence Test has offence-related sexual interests?
        - definition:
          - paragraph: Yes, there are recurrent and persistent patterns of a preference for sexual activity that is illegal or harmful and no evidence of healthy sexual interests
        - definition:
          - link "Change Is there evidence Test has offence-related sexual interests?":
            - /url: thinking-behaviours-sexual-harm#thinking_behaviours_attitudes_offence_related_sexual_interest-question
        - term: Is there evidence Test finds it easier to seek emotional intimacy with children over adults?
        - definition:
          - paragraph: Yes, they find it easier to seek emotional intimacy with children and have significant difficulty forming intimate relationships with adults
        - definition:
          - link "Change Is there evidence Test finds it easier to seek emotional intimacy with children over adults?":
            - /url: thinking-behaviours-sexual-harm#thinking_behaviours_attitudes_emotional_intimacy-question
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
        { question: Question.thinking_behaviours_attitudes_positive_attitude, value: Option.yes_positive },
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
      .save()

    await ThinkingBehavioursAndAttitudesPage.navigateTo(
      page,
      handoverLink,
      baseURL,
      sanAssessmentId,
      'thinking-behaviours-summary',
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
        { question: Question.thinking_behaviours_attitudes_positive_attitude, value: Option.yes_positive },
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
      ]).save()

    await ThinkingBehavioursAndAttitudesPage.navigateTo(
      page,
      handoverLink,
      baseURL,
      sanAssessmentId,
      'thinking-behaviours-summary#practitioner-analysis',
    )
    const thinkingBehavioursAndAttitudesPage = await ThinkingBehavioursAndAttitudesPage.verifyOnPage(
      page,
      'strengths or protective factors',
    )

    await thinkingBehavioursAndAttitudesPage.questions.thinking_behaviours_attitudes_practitioner_analysis_risk_of_reoffending.option(CommonOption.no)
      .click()
    await thinkingBehavioursAndAttitudesPage.markComplete.click()
    await expect(thinkingBehavioursAndAttitudesPage.complete).toBeVisible()
    expect(page.url()).toContain('thinking-behaviours-analysis')
  })
})
