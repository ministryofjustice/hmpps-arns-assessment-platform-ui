import { expect } from '@playwright/test'
import ThinkingBehavioursAndAttitudesPage from 'pages/strengthsAndNeeds/thinkingBehavioursAndAttitudesPage'
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
        - radio "Engages in pro-social activities and understands the link to offending"
        - text: Engages in pro-social activities and understands the link to offending
        - radio "Sometimes engages in activities linked to offending but recognises the link"
        - text: Sometimes engages in activities linked to offending but recognises the link
        - radio "Regularly engages in activities which encourage offending and is not aware or does not care about the link to offending"
        - text: Regularly engages in activities which encourage offending and is not aware or does not care about the link to offending
      - group "Is Test resilient towards peer pressure or influence by criminal associates?":
        - text: Is Test resilient towards peer pressure or influence by criminal associates?
        - radio "Yes, resilient towards peer pressure or influence by criminal associates"
        - text: Yes, resilient towards peer pressure or influence by criminal associates
        - radio "Has been peer pressured or influenced by criminal associates in the past but recognises the link to their offending"
        - text: Has been peer pressured or influenced by criminal associates in the past but recognises the link to their offending
        - radio "No, constantly peer pressured or influenced by criminal associates which is linked to their offending"
        - text: No, constantly peer pressured or influenced by criminal associates which is linked to their offending
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
      - group "Does Test show manipulative behaviour or a predatory lifestyle?":
        - text: Does Test show manipulative behaviour or a predatory lifestyle?
        - radio "Generally gives an honest account of their lives and has no history of showing manipulative behaviour or a predatory lifestyle"
        - text: Generally gives an honest account of their lives and has no history of showing manipulative behaviour or a predatory lifestyle
        - radio "Some evidence that they show manipulative behaviour or act in a predatory way towards certain individuals"
        - text: Some evidence that they show manipulative behaviour or act in a predatory way towards certain individuals
        - radio "Shows a pattern of manipulative behaviour or a predatory lifestyle"
        - text: Shows a pattern of manipulative behaviour or a predatory lifestyle
      - group "Is Test able to manage their temper?":
        - text: Is Test able to manage their temper?
        - radio "Yes, is able to manage their temper well"
        - text: Yes, is able to manage their temper well
        - radio "Sometimes has outbreaks of uncontrolled anger"
        - text: Sometimes has outbreaks of uncontrolled anger
        - radio "No, easily loses their temper"
        - text: No, easily loses their temper This may result in a loss of control or inability to stay calm until they have expressed their anger.
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
      - group "Does Test have a positive attitude towards any criminal justice staff they have come into contact with?":
        - text: Does Test have a positive attitude towards any criminal justice staff they have come into contact with?
        - radio "Yes, has a positive attitude"
        - text: Yes, has a positive attitude
        - radio "Has a negative attitude or does not fully engage but there are no safety concerns"
        - text: Has a negative attitude or does not fully engage but there are no safety concerns
        - radio "No, has a negative attitude and there are safety concerns"
        - text: No, has a negative attitude and there are safety concerns
      - group "Does Test have hostile orientation to others or to general rules?":
        - text: Does Test have hostile orientation to others or to general rules?
        - radio "They’re able to have constructive conversations when they disagree with others and can forgive past wrongs"
        - text: They’re able to have constructive conversations when they disagree with others and can forgive past wrongs
        - radio "Some evidence of suspicious, angry or vengeful thinking and behaviour"
        - text: Some evidence of suspicious, angry or vengeful thinking and behaviour
        - radio "There is evidence of suspicious, angry and vengeful thinking and behaviour"
        - text: There is evidence of suspicious, angry
        - strong: and
        - text: vengeful thinking and behaviour
      - group "Does Test accept supervision and their licence conditions?":
        - text: Does Test accept supervision and their licence conditions?
        - radio "Accepts supervision and has responded well to supervision in the past"
        - text: Accepts supervision and has responded well to supervision in the past
        - radio "Unsure about supervision and has put minimum effort into supervision in the past"
        - text: Unsure about supervision and has put minimum effort into supervision in the past
        - radio "Not prepared to accept supervision and has failed to follow supervision in the past"
        - text: Not prepared to accept supervision and has failed to follow supervision in the past
      - group "Does Test support or excuse criminal behaviour?":
        - text: Does Test support or excuse criminal behaviour?
        - radio "Does not support or excuse criminal behaviour"
        - text: Does not support or excuse criminal behaviour
        - radio "Sometimes supports or excuses criminal behaviour"
        - text: Sometimes supports or excuses criminal behaviour
        - radio "Supports or excuses criminal behaviour or their pattern of behaviour and other evidence indicates this is an issue"
        - text: Supports or excuses criminal behaviour or their pattern of behaviour and other evidence indicates this is an issue
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
        { question: 'thinking_behaviours_attitudes_changes', value: 'NOT_PRESENT' },
        { question: 'thinking_behaviours_attitudes_supervision', value: 'YES_SUPERVISION' },
        { question: 'thinking_behaviours_attitudes_consequences', value: 'YES' },
        { question: 'thinking_behaviours_attitudes_peer_pressure', value: 'YES' },
        { question: 'thinking_behaviours_attitudes_peoples_views', value: 'YES' },
        { question: 'thinking_behaviours_attitudes_problem_solving', value: 'YES' },
        { question: 'thinking_behaviours_attitudes_stable_behaviour', value: 'YES' },
        { question: 'thinking_behaviours_attitudes_positive_attitude', value: 'YES_POSITIVE' },
        { question: 'thinking_behaviours_attitudes_temper_management', value: 'YES' },
        { question: 'thinking_behaviours_attitudes_criminal_behaviour', value: 'NO' },
        { question: 'thinking_behaviours_attitudes_hostile_orientation', value: 'NO' },
        { question: 'thinking_behaviours_attitudes_impulsive_behaviour', value: 'NO' },
        { question: 'thinking_behaviours_attitudes_offending_activities', value: 'NO_OFFENDING_ACTIVITIES' },
        { question: 'thinking_behaviours_attitudes_peer_pressure_yes_details', value: '' },
        { question: 'thinking_behaviours_attitudes_violence_controlling_behaviour', value: 'NO_VIOLENCE' },
        { question: 'thinking_behaviours_attitudes_manipulative_predatory_behaviour', value: 'NO' },
      ])
      .save()

    await ThinkingBehavioursAndAttitudesPage.navigateTo(
      page,
      handoverLink,
      baseURL,
      sanAssessmentId,
      'thinking-behaviours-risk-of-sexual-harm',
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
      thinkingBehavioursAndAttitudesPage.questions.thinking_behaviours_attitudes_risk_sexual_harm.option('No'),
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
        { question: 'thinking_behaviours_attitudes_changes', value: 'NOT_PRESENT' },
        { question: 'thinking_behaviours_attitudes_supervision', value: 'YES_SUPERVISION' },
        { question: 'thinking_behaviours_attitudes_consequences', value: 'YES' },
        { question: 'thinking_behaviours_attitudes_peer_pressure', value: 'YES' },
        { question: 'thinking_behaviours_attitudes_peoples_views', value: 'YES' },
        { question: 'thinking_behaviours_attitudes_problem_solving', value: 'YES' },
        { question: 'thinking_behaviours_attitudes_stable_behaviour', value: 'YES' },
        { question: 'thinking_behaviours_attitudes_positive_attitude', value: 'YES_POSITIVE' },
        { question: 'thinking_behaviours_attitudes_temper_management', value: 'YES' },
        { question: 'thinking_behaviours_attitudes_criminal_behaviour', value: 'NO' },
        { question: 'thinking_behaviours_attitudes_hostile_orientation', value: 'NO' },
        { question: 'thinking_behaviours_attitudes_impulsive_behaviour', value: 'NO' },
        { question: 'thinking_behaviours_attitudes_offending_activities', value: 'NO_OFFENDING_ACTIVITIES' },
        { question: 'thinking_behaviours_attitudes_peer_pressure_yes_details', value: '' },
        { question: 'thinking_behaviours_attitudes_violence_controlling_behaviour', value: 'NO_VIOLENCE' },
        { question: 'thinking_behaviours_attitudes_manipulative_predatory_behaviour', value: 'NO' },
      ])
      .save()

    await ThinkingBehavioursAndAttitudesPage.navigateTo(
      page,
      handoverLink,
      baseURL,
      sanAssessmentId,
      'thinking-behaviours-risk-of-sexual-harm',
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
      thinkingBehavioursAndAttitudesPage.questions.thinking_behaviours_attitudes_risk_sexual_harm.option('No'),
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
        { question: 'thinking_behaviours_attitudes_changes', value: 'NOT_PRESENT' },
        { question: 'thinking_behaviours_attitudes_supervision', value: 'YES_SUPERVISION' },
        { question: 'thinking_behaviours_attitudes_consequences', value: 'YES' },
        { question: 'thinking_behaviours_attitudes_peer_pressure', value: 'YES' },
        { question: 'thinking_behaviours_attitudes_peoples_views', value: 'YES' },
        { question: 'thinking_behaviours_attitudes_problem_solving', value: 'YES' },
        { question: 'thinking_behaviours_attitudes_stable_behaviour', value: 'YES' },
        { question: 'thinking_behaviours_attitudes_positive_attitude', value: 'YES_POSITIVE' },
        { question: 'thinking_behaviours_attitudes_temper_management', value: 'YES' },
        { question: 'thinking_behaviours_attitudes_criminal_behaviour', value: 'NO' },
        { question: 'thinking_behaviours_attitudes_hostile_orientation', value: 'NO' },
        { question: 'thinking_behaviours_attitudes_impulsive_behaviour', value: 'NO' },
        { question: 'thinking_behaviours_attitudes_offending_activities', value: 'NO_OFFENDING_ACTIVITIES' },
        { question: 'thinking_behaviours_attitudes_peer_pressure_yes_details', value: '' },
        { question: 'thinking_behaviours_attitudes_violence_controlling_behaviour', value: 'NO_VIOLENCE' },
        { question: 'thinking_behaviours_attitudes_manipulative_predatory_behaviour', value: 'NO' },
        { question: 'thinking_behaviours_attitudes_risk_sexual_harm', value: 'YES' },
      ])
      .save()

    await ThinkingBehavioursAndAttitudesPage.navigateTo(
      page,
      handoverLink,
      baseURL,
      sanAssessmentId,
      'thinking-behaviours-sexual-harm',
    )

    const thinkingBehavioursAndAttitudesPage = await ThinkingBehavioursAndAttitudesPage.verifyOnPage(
      page,
      'shows sexual preoccupation',
    )

    await expect(thinkingBehavioursAndAttitudesPage.mainForm).toMatchAriaSnapshot(`
      - group "Is there evidence Test shows sexual preoccupation?":
        - text: Is there evidence Test shows sexual preoccupation?
        - radio "Yes, the amount of time they spend engaging in sexual activity or thinking about sex is unhealthy and is impacting their day-to-day life"
        - text: Yes, the amount of time they spend engaging in sexual activity or thinking about sex is unhealthy and is impacting their day-to-day life
        - radio "Shows some evidence of improving their day-to-day life but still spends a significant amount of time preoccupied with sex"
        - text: Shows some evidence of improving their day-to-day life but still spends a significant amount of time preoccupied with sex
        - radio "No, the amount of time they spend engaging in sexual activity or thinking about sex is healthy and is balanced alongside all other important areas of their life"
        - text: No, the amount of time they spend engaging in sexual activity or thinking about sex is healthy and is balanced alongside all other important areas of their life This includes behaviours like masturbating regularly, having casual sex or using pornography to meet their needs in a healthy way.
        - radio "Unknown"
        - text: Unknown
      - group "Is there evidence Test has offence-related sexual interests?":
        - text: Is there evidence Test has offence-related sexual interests?
        - radio "Yes, there are recurrent and persistent patterns of a preference for sexual activity that is illegal or harmful and no evidence of healthy sexual interests"
        - text: Yes, there are recurrent and persistent patterns of a preference for sexual activity that is illegal or harmful and no evidence of healthy sexual interests They are strongly aroused by illegal harmful sexual acts with little or no interest in consensual sex.
        - radio "Shows some evidence of healthy sexual activity including consensual sex but shows behaviour that is recurrent and persistent or an interest in sexual activity that is illegal or harmful"
        - text: Shows some evidence of healthy sexual activity including consensual sex but shows behaviour that is recurrent and persistent or an interest in sexual activity that is illegal or harmful
        - radio "No, they have healthy sexual interests rather than a preference for sexual activity that is illegal or harmful"
        - text: No, they have healthy sexual interests rather than a preference for sexual activity that is illegal or harmful While offending, they may have engaged in sexual activity that is illegal but their preferred route to meeting their sexual needs is both legal and consensual.
        - radio "Unknown"
        - text: Unknown
      - group "Is there evidence Test finds it easier to seek emotional intimacy with children over adults?":
        - text: Is there evidence Test finds it easier to seek emotional intimacy with children over adults?
        - radio "Yes, they find it easier to seek emotional intimacy with children and have significant difficulty forming intimate relationships with adults"
        - text: Yes, they find it easier to seek emotional intimacy with children and have significant difficulty forming intimate relationships with adults
        - radio "Shows some evidence of having or wanting stable adult relationships but finds it easier to seek emotional intimacy with children over adults"
        - text: Shows some evidence of having or wanting stable adult relationships but finds it easier to seek emotional intimacy with children over adults
        - radio "No, they have or have had a intimate relationship with an adult that they value or have the skills, ability and desire to form stable relationships"
        - text: No, they have or have had a intimate relationship with an adult that they value or have the skills, ability and desire to form stable relationships
        - radio "Unknown"
        - text: Unknown
      - button "Save and continue"
    `)
  })
})
