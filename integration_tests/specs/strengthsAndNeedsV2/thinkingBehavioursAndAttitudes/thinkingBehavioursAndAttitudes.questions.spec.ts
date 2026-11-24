import { Option } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/thinking-behaviours-and-attitudes/constants/option'
import { Question } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/thinking-behaviours-and-attitudes/constants/question'
import { CommonOption } from '@server/forms/strengths-and-needs/versions/v2.0/constants/commonOption'
import { expect } from '@playwright/test'
import ThinkingBehavioursAndAttitudesPage from 'pages/strengthsAndNeedsV2/thinkingBehavioursAndAttitudesPage'
import { Step } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/thinking-behaviours-and-attitudes/constants/step'
import { test, TargetService } from '../../../support/fixtures'
import { buildPageTitle, sanPageTitles } from '../sanUtils'

test.describe('Questions', () => {
  test('shows thinking behaviours', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder.fresh().save()

    await ThinkingBehavioursAndAttitudesPage.navigateTo(page, handoverLink, baseURL, sanAssessmentId)

    const thinkingBehavioursAndAttitudesPage = await ThinkingBehavioursAndAttitudesPage.verifyOnPage(
      page,
      'consequences of their actions?',
    )

    await expect(page).toHaveTitle(buildPageTitle(sanPageTitles.thinking))

    await expect(thinkingBehavioursAndAttitudesPage.mainForm).toMatchAriaSnapshot(`
      - group "Is Test aware of the consequences of their actions?":
        - text: Is Test aware of the consequences of their actions? This includes towards themselves and to others.
        - radio "Yes, is aware of the consequences of their actions"
        - text: Yes, is aware of the consequences of their actions
        - radio "Sometimes is aware of the consequences of their actions"
        - text: Sometimes is aware of the consequences of their actions
        - radio "No, is not aware of the consequences of their actions"
        - text: No, is not aware of the consequences of their actions
      - group "Does Test show stable behaviour?":
        - text: Does Test show stable behaviour? Consider their ability to manage boredom and routine tasks, and their level of thrill-seeking or risky behaviour.
        - radio "Yes, shows stable behaviour"
        - text: Yes, shows stable behaviour
        - radio "Sometimes shows stable behaviour but can show reckless or risk taking behaviours"
        - text: Sometimes shows stable behaviour but can show reckless or risk taking behaviours
        - radio "No, shows reckless or risk taking behaviours"
        - text: No, shows reckless or risk taking behaviours
      - group "Does Test engage in activities that could link to offending?":
        - text: Does Test engage in activities that could link to offending?
        - radio "No, does not engage in these activities"
        - text: No, does not engage in these activities Engages in positive activities and relationships and avoids situations that may create opportunities to offend.
        - radio "Yes, sometimes"
        - text: Yes, sometimes Sometimes spends time in activities, situations or relationships linked to offending but recognises the risks.
        - radio "Yes, regularly"
        - text: Yes, regularly Regularly spending time in activities, situations or relationships that encourage offending and does not recognise, or choose not to act on, the risks.
      - group "Is Test influenced by others in relation to their offending?":
        - text: Is Test influenced by others in relation to their offending?
        - radio "No, not influenced by others"
        - text: No, not influenced by others Has not been influenced by other in relation to offending, or taken clear steps to avoid negative influences.
        - radio "Yes, sometimes"
        - text: Yes, sometimes Has been influenced by others in relation to offending but recognises the influence and is trying to reduce it.
        - radio "Yes, regularly"
        - text: Yes, regularly Is regularly influenced by others in relation to offending and remains vulnerable to peer pressure, manipulation or criminal associates.
      - group "Is Test able to solve problems in a positive way?":
        - text: Is Test able to solve problems in a positive way?
        - radio "Yes, is able to solve problems and identify appropriate solutions"
        - text: Yes, is able to solve problems and identify appropriate solutions
        - radio "Has limited problem solving skills"
        - text: Has limited problem solving skills
        - radio "No, has poor problem solving skills and is unable to identify what steps to take to solve a problem"
        - text: No, has poor problem solving skills and is unable to identify what steps to take to solve a problem
      - group "Does Test understand other people’s views?":
        - text: Does Test understand other people’s views?
        - radio "Yes, understands other people’s views and is able to distinguish between their own feelings and those of others"
        - text: Yes, understands other people’s views and is able to distinguish between their own feelings and those of others
        - radio "Assumes all views are the same as theirs at first but does consider other people’s views to an extent"
        - text: Assumes all views are the same as theirs at first but does consider other people’s views to an extent
        - radio "No, unable to understand other people’s views and distinguish between their own feelings and those of others"
        - text: No, unable to understand other people’s views and distinguish between their own feelings and those of others
      - group "Are there any indications that Test manipulates or exploits other people for personal gain?":
        - text: Are there any indications that Test manipulates or exploits other people for personal gain? Consider any current or past history of using deception, abusing trust or taking advantage of other people for personal gain.
        - radio "No indications"
        - text: No indications No history of manipulating, exploiting or taking advantage of others for personal gain.
        - radio "Some indications"
        - text: Some indications History of manipulative or exploitative behaviour in certain situations or relationships.
        - radio "Significant indications"
        - text: Significant indications Clear and recurring pattern of manipulating, exploiting or taking advantage of others for personal gain.
      - group "Is Test able to manage their temper?":
        - text: Is Test able to manage their temper?
        - radio "Yes, manages it well"
        - text: Yes, manages it well Recognises situations that make them angry or frustrated and deals with them effectively. Remains calm and does not lose control.
        - radio "Yes, sometimes able to manage it"
        - text: Yes, sometimes able to manage it Occasionally loses control when angry or frustrated, or has difficulty dealing with conflict in some situations.
        - radio "No, is not able to manage it"
        - text: No, is not able to manage it Regularly loses control when angry or frustrated and finds it difficult to remain calm or deal with conflict effectively.
      - group "Does Test use violence, aggressive or controlling behaviour to get their own way?":
        - text: Does Test use violence, aggressive or controlling behaviour to get their own way?
        - radio "Does not use violence, aggressive or controlling behaviour to get their own way"
        - text: Does not use violence, aggressive or controlling behaviour to get their own way
        - radio "Some evidence of using violence, aggressive or controlling behaviour to get their own way"
        - text: Some evidence of using violence, aggressive or controlling behaviour to get their own way
        - radio "Patterns of using violence, aggressive or controlling behaviour to get their own way"
        - text: Patterns of using violence, aggressive or controlling behaviour to get their own way
      - group "Does Test act on impulse?":
        - text: Does Test act on impulse?
        - radio "Considers all aspects of a situation before acting on or making a decision"
        - text: Considers all aspects of a situation before acting on or making a decision
        - radio "Sometimes acts on impulse which causes problems"
        - text: Sometimes acts on impulse which causes problems
        - radio "Acts on impulse which causes significant problems"
        - text: Acts on impulse which causes significant problems
      - group "Does Test show hostility towards other people, rules or authority?":
        - text: Does Test show hostility towards other people, rules or authority?
        - radio "No, does not show hostility"
        - text: No, does not show hostility Can consider other people’s views, discuss disagreements constructively and move past previous conflicts.
        - radio "Yes, sometimes"
        - text: Yes, sometimes Sometimes shows suspicious, angry or vengeful thinking, or struggles to accept other people’s views.
        - radio "Yes, regularly"
        - text: Yes, regularly Regularly shows suspicious, angry or vengeful thinking and behaviour, holds grudges, shows little regard for other people’s views or wellbeing, or views other people, rules or authority with hostility.
      - group "Are there indications Test is willing to engage positively with their sentence?":
        - text: Are there indications Test is willing to engage positively with their sentence?
        - radio "Significant indications"
        - text: Significant indications Willing to engage positively and cooperate.
        - radio "Some indications"
        - text: Some indications Has mixed views about their sentence or engages only to meet minimum requirements.
        - radio "No indications"
        - text: No indications Is unlikely to engage positively with their sentence.
      - group "Does Test support or excuse criminal behaviour?":
        - text: Does Test support or excuse criminal behaviour?
        - radio "Does not support or excuse criminal behaviour"
        - text: Does not support or excuse criminal behaviour
        - radio "Sometimes supports or excuses criminal behaviour"
        - text: Sometimes supports or excuses criminal behaviour
        - radio "Supports or excuses criminal behaviour or their pattern of behaviour and other evidence indicates this is an issue"
        - text: Supports or excuses criminal behaviour or their pattern of behaviour and other evidence indicates this is an issue
      - button "Save and continue"
    `)
  })

  test('shows changes question', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
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
      ])
      .withUserSubmittedSteps([
        Step.thinking_behaviours_attitudes.code,
        Step.thinking_behaviours_attitudes_risk_of_sexual_harm.code,
      ])
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

    await expect(thinkingBehavioursAndAttitudesPage.mainForm).toMatchAriaSnapshot(`
      - group "Does Test want to make changes to their thinking, behaviours and attitudes?":
        - text: Does Test want to make changes to their thinking, behaviours and attitudes? Test must answer this question.
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

  test('shows risk of sexual harm', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
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
      Step.thinking_behaviours_attitudes_risk_of_sexual_harm.path,
    )

    const thinkingBehavioursAndAttitudesPage = await ThinkingBehavioursAndAttitudesPage.verifyOnPage(
      page,
      'poses a risk of sexual harm',
    )

    await expect(thinkingBehavioursAndAttitudesPage.mainForm).toMatchAriaSnapshot(`
      - group "Are there any concerns that Test poses a risk of sexual harm to others?":
        - text: Are there any concerns that Test poses a risk of sexual harm to others?
        - radio "Yes" [checked]
        - text: Yes Information suggests that there is evidence of sexual behaviour that could pose a risk of sexual harm to others.
        - radio "No" [disabled]
        - text: "No"
      - button "Save and continue"
    `)
    await expect(
      thinkingBehavioursAndAttitudesPage.questions.thinking_behaviours_attitudes_risk_sexual_harm.option(
        CommonOption.no,
      ),
    ).not.toBeEnabled()
  })

  test('shows no risk of sexual harm', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
      sexuallyMotivatedOffenceHistory: 'NO',
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
      Step.thinking_behaviours_attitudes_risk_of_sexual_harm.path,
    )

    const thinkingBehavioursAndAttitudesPage = await ThinkingBehavioursAndAttitudesPage.verifyOnPage(
      page,
      'poses a risk of sexual harm',
    )

    await expect(thinkingBehavioursAndAttitudesPage.mainForm).toMatchAriaSnapshot(`
      - group "Are there any concerns that Test poses a risk of sexual harm to others?":
        - /children: equal
        - text: Are there any concerns that Test poses a risk of sexual harm to others?
        - strong: Warning Test does not have any current or previous sexual or sexually motivated offences
        - radio "Yes"
        - text: Yes Information suggests that there is evidence of sexual behaviour that could pose a risk of sexual harm to others.
        - radio "No"
        - text: "No"
      - button "Save and continue"
    `)
    await expect(
      thinkingBehavioursAndAttitudesPage.questions.thinking_behaviours_attitudes_risk_sexual_harm.option(
        CommonOption.no,
      ),
    ).toBeEnabled()
  })

  test('shows risk of sexual harm follow up', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
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
      'shows sexual preoccupation',
    )

    await expect(thinkingBehavioursAndAttitudesPage.mainForm).toMatchAriaSnapshot(`
      - group "Is there evidence Test shows sexual preoccupation?":
        - text: Is there evidence Test shows sexual preoccupation? Sexual preoccupation is when sexual thoughts or behaviours take up a significant amount of time and affect day-to-day life, relationships, responsibilities or other important activities.
        - radio "No evidence"
        - text: No evidence Sexual thoughts or behaviours do not appear to affect their daily functioning.
        - radio "Some evidence"
        - text: Some evidence Sexual thoughts or behaviours take up a significant amount of time, but there is evidence of other interests or attempts to reduce the behaviour.
        - radio "Significant evidence"
        - text: Significant evidence Sexual thoughts or behaviours take up a significant amount of time and have a substantial impact on their daily functioning.
        - radio "Unknown"
        - text: Unknown
      - group "Is there evidence Test has offence-related sexual interests?":
        - text: Is there evidence Test has offence-related sexual interests?
        - radio "No evidence"
        - text: No evidence Healthy sexual interests. While offending may have involved illegal sexual activity, their usual way of meeting sexual needs is legal and consensual.
        - radio "Yes, some evidence"
        - text: Yes, some evidence Some evidence of healthy, consensual sexual activity, but also recurring interest in or behaviour involving illegal or harmful sexual activity.
        - radio "Yes, significant evidence"
        - text: Yes, significant evidence A persistent preference for illegal or harmful sexual activity, with little or no evidence of healthy, consensual sexual interests.
        - radio "Unknown"
        - text: Unknown
      - group "Is there evidence Test finds it easier to seek emotional intimacy with children over adults?":
        - text: Is there evidence Test finds it easier to seek emotional intimacy with children over adults? This means looking to children to meet emotional needs that would usually be met through relationships with other adults.
        - radio "No evidence"
        - text: No evidence They have or have had an intimate relationship with an adult that they value or have the skills, ability and desire to form stable relationships.
        - radio "Yes, some evidence"
        - text: Yes, some evidence Shows some evidence of having or wanting stable adult relationships but finds it easier to seek emotional intimacy with children over adults.
        - radio "Yes, significant evidence"
        - text: Yes, significant evidence They find it easier to seek emotional intimacy with children and have significant difficulty forming intimate relationships with adults.
        - radio "Unknown"
        - text: Unknown
      - button "Save and continue"
    `)
  })
})
