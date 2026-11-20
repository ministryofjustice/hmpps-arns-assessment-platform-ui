import { expect } from '@playwright/test'
import ThinkingBehavioursAndAttitudesPage from 'pages/strengthsAndNeedsV2/thinkingBehavioursAndAttitudesPage'
import { Question } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/thinking-behaviours-and-attitudes/constants/question'
import { CommonOption } from '@server/forms/strengths-and-needs/versions/v2.0/constants/commonOption'
import { Option } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/thinking-behaviours-and-attitudes/constants/option'
import { Step } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/thinking-behaviours-and-attitudes/constants/step'
import { test, TargetService } from '../../../../support/fixtures'

test.describe('Validation', () => {
  test('validation thinking behaviours', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder.fresh().save()

    await ThinkingBehavioursAndAttitudesPage.navigateTo(page, handoverLink, baseURL, sanAssessmentId)

    const thinkingBehavioursAndAttitudesPage = await ThinkingBehavioursAndAttitudesPage.verifyOnPage(
      page,
      'consequences of their actions?',
    )

    const { questions } = thinkingBehavioursAndAttitudesPage

    await thinkingBehavioursAndAttitudesPage.saveAndContinue.click()
    await expect(thinkingBehavioursAndAttitudesPage.alert).toMatchAriaSnapshot(`
      - alert:
        - heading "There is a problem" [level=2]
        - list:
          - /children: equal
          - listitem:
            - link "Select if they are aware of the consequences of their actions":
              - /url: "#thinking_behaviours_attitudes_consequences"
          - listitem:
            - link "Select if they show stable behaviour":
              - /url: "#thinking_behaviours_attitudes_stable_behaviour"
          - listitem:
            - link "Select if they engage in activities that could link to offending":
              - /url: "#thinking_behaviours_attitudes_offending_activities"
          - listitem:
            - link "Select if they’re influenced by others in relation to their offending":
              - /url: "#thinking_behaviours_attitudes_peer_pressure"
          - listitem:
            - link "Select if they are able to solve problems in a positive way":
              - /url: "#thinking_behaviours_attitudes_problem_solving"
          - listitem:
            - link "Select if they understand other people’s views":
              - /url: "#thinking_behaviours_attitudes_peoples_views"
          - listitem:
            - link "Select if there are indications they manipulate or exploit other people for personal gain?":
              - /url: "#thinking_behaviours_attitudes_manipulative_predatory_behaviour"
          - listitem:
            - link "Select if they are able to manage their temper":
              - /url: "#thinking_behaviours_attitudes_temper_management"
          - listitem:
            - link "Select if they use violence, aggressive or controlling behaviour to get their own way":
              - /url: "#thinking_behaviours_attitudes_violence_controlling_behaviour"
          - listitem:
            - link "Select if they act on impulse":
              - /url: "#thinking_behaviours_attitudes_impulsive_behaviour"
          - listitem:
            - link "Select if they show hostility towards other people, rules or authority":
              - /url: "#thinking_behaviours_attitudes_hostile_orientation"
          - listitem:
            - link "Select if there are indications they are willing to engage positively with their sentence":
              - /url: "#thinking_behaviours_attitudes_supervision"
          - listitem:
            - link "Select if they support or excuse criminal behaviour":
              - /url: "#thinking_behaviours_attitudes_criminal_behaviour"
    `)

    await questions.thinking_behaviours_attitudes_consequences.errorLink.click()
    await expect(questions.thinking_behaviours_attitudes_consequences.input).toBeFocused()
    await questions.thinking_behaviours_attitudes_stable_behaviour.errorLink.click()
    await expect(questions.thinking_behaviours_attitudes_stable_behaviour.input).toBeFocused()
    await questions.thinking_behaviours_attitudes_offending_activities.errorLink.click()
    await expect(questions.thinking_behaviours_attitudes_offending_activities.input).toBeFocused()
    await questions.thinking_behaviours_attitudes_peer_pressure.errorLink.click()
    await expect(questions.thinking_behaviours_attitudes_peer_pressure.input).toBeFocused()
    await questions.thinking_behaviours_attitudes_problem_solving.errorLink.click()
    await expect(questions.thinking_behaviours_attitudes_problem_solving.input).toBeFocused()
    await questions.thinking_behaviours_attitudes_peoples_views.errorLink.click()
    await expect(questions.thinking_behaviours_attitudes_peoples_views.input).toBeFocused()
    await questions.thinking_behaviours_attitudes_manipulative_predatory_behaviour.errorLink.click()
    await expect(questions.thinking_behaviours_attitudes_manipulative_predatory_behaviour.input).toBeFocused()
    await questions.thinking_behaviours_attitudes_temper_management.errorLink.click()
    await expect(questions.thinking_behaviours_attitudes_temper_management.input).toBeFocused()
    await questions.thinking_behaviours_attitudes_violence_controlling_behaviour.errorLink.click()
    await expect(questions.thinking_behaviours_attitudes_violence_controlling_behaviour.input).toBeFocused()
    await questions.thinking_behaviours_attitudes_impulsive_behaviour.errorLink.click()
    await expect(questions.thinking_behaviours_attitudes_impulsive_behaviour.input).toBeFocused()
    await questions.thinking_behaviours_attitudes_hostile_orientation.errorLink.click()
    await expect(questions.thinking_behaviours_attitudes_hostile_orientation.input).toBeFocused()
    await questions.thinking_behaviours_attitudes_supervision.errorLink.click()
    await expect(questions.thinking_behaviours_attitudes_supervision.input).toBeFocused()
    await questions.thinking_behaviours_attitudes_criminal_behaviour.errorLink.click()
    await expect(questions.thinking_behaviours_attitudes_criminal_behaviour.input).toBeFocused()
  })

  test('validation changes', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
      sexuallyMotivatedOffenceHistory: 'YES',
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId)
      .withAnswers([
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
      ])
      .withUserSubmittedSteps([Step.thinking_behaviours_attitudes.code])
      .save()

    await ThinkingBehavioursAndAttitudesPage.navigateTo(
      page,
      handoverLink,
      baseURL,
      sanAssessmentId,
      Step.thinking_behaviours_attitudes_changes.path,
    )

    const thinkingBehavioursAndAttitudesPage = await ThinkingBehavioursAndAttitudesPage.verifyOnPage(
      page,
      'want to make changes',
    )

    const { questions } = thinkingBehavioursAndAttitudesPage

    await thinkingBehavioursAndAttitudesPage.saveAndContinue.click()

    await expect(thinkingBehavioursAndAttitudesPage.alert).toMatchAriaSnapshot(`
      - alert:
        - heading "There is a problem" [level=2]
        - list:
          - listitem:
            - link "Select if they want to make changes to their thinking, behaviours and attitudes":
              - /url: "#thinking_behaviours_attitudes_changes"
    `)

    await questions.thinking_behaviours_attitudes_changes.errorLink.click()
    await expect(questions.thinking_behaviours_attitudes_changes.input).toBeFocused()
  })

  test('validation risk of sexual harm to others', async ({
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
        { question: Question.thinking_behaviours_attitudes_changes, value: CommonOption.not_present },
      ])
      .withUserSubmittedSteps([
        Step.thinking_behaviours_attitudes.code,
        Step.thinking_behaviours_attitudes_changes.code,
      ])
      .save()

    await ThinkingBehavioursAndAttitudesPage.navigateTo(
      page,
      handoverLink,
      baseURL,
      sanAssessmentId,
      Step.thinking_behaviours_attitudes_risk_of_sexual_harm.path,
    )

    const thinkingBehavioursAndAttitudesPage = await ThinkingBehavioursAndAttitudesPage.verifyOnPage(
      page,
      'Are there any concerns that Test poses a risk of sexual harm to others?',
    )

    const { questions } = thinkingBehavioursAndAttitudesPage

    await thinkingBehavioursAndAttitudesPage.saveAndContinue.click()

    await expect(thinkingBehavioursAndAttitudesPage.alert).toMatchAriaSnapshot(`
      - alert:
        - heading "There is a problem" [level=2]
        - list:
          - listitem:
            - link "Select if there are any concerns they are a risk of sexual harm":
              - /url: "#thinking_behaviours_attitudes_risk_sexual_harm"
    `)

    await questions.thinking_behaviours_attitudes_risk_sexual_harm.errorLink.click()
    await expect(questions.thinking_behaviours_attitudes_risk_sexual_harm.input).toBeFocused()
  })

  test('validation risk of sexual harm to others follow up questions', async ({
    page,
    createSession,
    strengthsAndNeedsBuilder,
    baseURL,
  }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
      sexuallyMotivatedOffenceHistory: 'YES',
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId)
      .withAnswers([
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
        { question: Question.thinking_behaviours_attitudes_changes, value: CommonOption.not_present },
        { question: Question.thinking_behaviours_attitudes_risk_sexual_harm, value: CommonOption.yes },
      ])
      .withUserSubmittedSteps([
        Step.thinking_behaviours_attitudes.code,
        Step.thinking_behaviours_attitudes_changes.code,
        Step.thinking_behaviours_attitudes_risk_of_sexual_harm.code,
      ])
      .save()

    await ThinkingBehavioursAndAttitudesPage.navigateTo(
      page,
      handoverLink,
      baseURL,
      sanAssessmentId,
      Step.thinking_behaviours_attitudes_risk_of_sexual_harm_details.path,
    )

    const thinkingBehavioursAndAttitudesPage = await ThinkingBehavioursAndAttitudesPage.verifyOnPage(
      page,
      'Is there evidence Test shows sexual preoccupation?',
    )

    const { questions } = thinkingBehavioursAndAttitudesPage

    await thinkingBehavioursAndAttitudesPage.saveAndContinue.click()

    await expect(thinkingBehavioursAndAttitudesPage.alert).toMatchAriaSnapshot(`
      - alert:
        - heading "There is a problem" [level=2]
        - list:
          - listitem:
            - link "Select if there’s evidence of sexual preoccupation":
              - /url: "#thinking_behaviours_attitudes_sexual_preoccupation"
          - listitem:
            - link "Select if they show evidence of offence-related sexual interests":
              - /url: "#thinking_behaviours_attitudes_offence_related_sexual_interest"
          - listitem:
            - link "Select if they show evidence that they find it easier to seek emotional intimacy with children over adults":
              - /url: "#thinking_behaviours_attitudes_emotional_intimacy"
    `)

    await questions.thinking_behaviours_attitudes_sexual_preoccupation.errorLink.click()
    await expect(questions.thinking_behaviours_attitudes_sexual_preoccupation.input).toBeFocused()
    await questions.thinking_behaviours_attitudes_offence_related_sexual_interest.errorLink.click()
    await expect(questions.thinking_behaviours_attitudes_offence_related_sexual_interest.input).toBeFocused()
    await questions.thinking_behaviours_attitudes_emotional_intimacy.errorLink.click()
    await expect(questions.thinking_behaviours_attitudes_emotional_intimacy.input).toBeFocused()
  })
})
