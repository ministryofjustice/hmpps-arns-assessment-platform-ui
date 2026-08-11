import { expect } from '@playwright/test'
import ThinkingBehavioursAndAttitudesPage from 'pages/strengthsAndNeeds/thinkingBehavioursAndAttitudesPage'
import { test, TargetService } from '../../support/fixtures'
import { buildPageTitle, checkAccessibility, sanPageTitles } from './sanUtils'

test.describe('Thinking behaviours and attitudes Page', () => {
  test.describe('Questions', () => {
    test('shows thinking behaviours', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
      const { handoverLink } = await createSession({ targetService: TargetService.STRENGTHS_AND_NEEDS })
      await strengthsAndNeedsBuilder.fresh().save()

      await ThinkingBehavioursAndAttitudesPage.navigateToThinkingBehavioursAndAttitudes(page, handoverLink, baseURL)

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

      await ThinkingBehavioursAndAttitudesPage.navigateToThinkingBehavioursAndAttitudes(
        page,
        handoverLink,
        baseURL,
        'thinking-behaviours-risk-of-sexual-harm',
      )

      const personalRelationshipsAndCommunityPage = await ThinkingBehavioursAndAttitudesPage.verifyOnPage(
        page,
        'poses a risk of sexual harm',
      )

      await expect(personalRelationshipsAndCommunityPage.mainForm).toMatchAriaSnapshot(`
        - group "Are there any concerns that Test poses a risk of sexual harm to others?":
          - text: Are there any concerns that Test poses a risk of sexual harm to others?
          - radio "Yes" [checked]
          - text: Yes Information suggests that there is evidence of sexual behaviour that could pose a risk of sexual harm to others.
          - radio "No" [disabled]
          - text: "No"
        - button "Save and continue"
      `)
      await expect(personalRelationshipsAndCommunityPage.no).not.toBeEnabled()
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

      await ThinkingBehavioursAndAttitudesPage.navigateToThinkingBehavioursAndAttitudes(
        page,
        handoverLink,
        baseURL,
        'thinking-behaviours-risk-of-sexual-harm',
      )

      const personalRelationshipsAndCommunityPage = await ThinkingBehavioursAndAttitudesPage.verifyOnPage(
        page,
        'poses a risk of sexual harm',
      )

      await expect(personalRelationshipsAndCommunityPage.mainForm).toMatchAriaSnapshot(`
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
      await expect(personalRelationshipsAndCommunityPage.no).toBeEnabled()
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

      await ThinkingBehavioursAndAttitudesPage.navigateToThinkingBehavioursAndAttitudes(
        page,
        handoverLink,
        baseURL,
        'thinking-behaviours-sexual-harm',
      )

      const personalRelationshipsAndCommunityPage = await ThinkingBehavioursAndAttitudesPage.verifyOnPage(
        page,
        'shows sexual preoccupation',
      )

      await expect(personalRelationshipsAndCommunityPage.mainForm).toMatchAriaSnapshot(`
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

  test.describe('Summary', () => {
    test('shows summary page', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
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
          { question: 'thinking_behaviours_attitudes_emotional_intimacy', value: 'YES' },
          { question: 'thinking_behaviours_attitudes_sexual_preoccupation', value: 'YES' },
          {
            question: 'thinking_behaviours_attitudes_offence_related_sexual_interest',
            value: 'YES_OFFENCE_RELATED_SEXUAL_INTEREST',
          },
        ])
        .save()

      await ThinkingBehavioursAndAttitudesPage.navigateToThinkingBehavioursAndAttitudes(
        page,
        handoverLink,
        baseURL,
        'thinking-behaviours-summary',
      )

      const thinkingBehavioursAndAttitudesPage = await ThinkingBehavioursAndAttitudesPage.verifyOnPage(page, 'Summary')

      await expect(thinkingBehavioursAndAttitudesPage.summary).toMatchAriaSnapshot(`
        - tabpanel "Summary":
          - term: Is Test aware of the consequences of their actions?
          - definition:
            - paragraph: Yes, is aware of the consequences of their actions
          - definition:
            - link "Change":
              - /url: thinking-behaviours#thinking_behaviours_attitudes_consequences
          - term: Does Test show stable behaviour?
          - definition:
            - paragraph: Yes, shows stable behaviour
          - definition:
            - link "Change":
              - /url: thinking-behaviours#thinking_behaviours_attitudes_stable_behaviour
          - term: Does Test engage in activities that could link to offending?
          - definition:
            - paragraph: Engages in pro-social activities and understands the link to offending
          - definition:
            - link "Change":
              - /url: thinking-behaviours#thinking_behaviours_attitudes_offending_activities
          - term: Is Test resilient towards peer pressure or influence by criminal associates?
          - definition:
            - paragraph: Yes, resilient towards peer pressure or influence by criminal associates
          - definition:
            - link "Change":
              - /url: thinking-behaviours#thinking_behaviours_attitudes_peer_pressure
          - term: Is Test able to solve problems in a positive way?
          - definition:
            - paragraph: Yes, is able to solve problems and identify appropriate solutions
          - definition:
            - link "Change":
              - /url: thinking-behaviours#thinking_behaviours_attitudes_problem_solving
          - term: Does Test understand other people’s views?
          - definition:
            - paragraph: Yes, understands other people’s views and is able to distinguish between their own feelings and those of others
          - definition:
            - link "Change":
              - /url: thinking-behaviours#thinking_behaviours_attitudes_peoples_views
          - term: Does Test show manipulative behaviour or a predatory lifestyle?
          - definition:
            - paragraph: Generally gives an honest account of their lives and has no history of showing manipulative behaviour or a predatory lifestyle
          - definition:
            - link "Change":
              - /url: thinking-behaviours#thinking_behaviours_attitudes_manipulative_predatory_behaviour
          - term: Is Test able to manage their temper?
          - definition:
            - paragraph: Yes, is able to manage their temper well
          - definition:
            - link "Change":
              - /url: thinking-behaviours#thinking_behaviours_attitudes_temper_management
          - term: Does Test use violence, aggressive or controlling behaviour to get their own way?
          - definition:
            - paragraph: Does not use violence, aggressive or controlling behaviour to get their own way
          - definition:
            - link "Change":
              - /url: thinking-behaviours#thinking_behaviours_attitudes_violence_controlling_behaviour
          - term: Does Test act on impulse?
          - definition:
            - paragraph: Considers all aspects of a situation before acting on or making a decision
          - definition:
            - link "Change":
              - /url: thinking-behaviours#thinking_behaviours_attitudes_impulsive_behaviour
          - term: Does Test have a positive attitude towards any criminal justice staff they have come into contact with?
          - definition:
            - paragraph: Yes, has a positive attitude
          - definition:
            - link "Change":
              - /url: thinking-behaviours#thinking_behaviours_attitudes_positive_attitude
          - term: Does Test have hostile orientation to others or to general rules?
          - definition:
            - paragraph: They’re able to have constructive conversations when they disagree with others and can forgive past wrongs
          - definition:
            - link "Change":
              - /url: thinking-behaviours#thinking_behaviours_attitudes_hostile_orientation
          - term: Does Test accept supervision and their licence conditions?
          - definition:
            - paragraph: Accepts supervision and has responded well to supervision in the past
          - definition:
            - link "Change":
              - /url: thinking-behaviours#thinking_behaviours_attitudes_supervision
          - term: Does Test support or excuse criminal behaviour?
          - definition:
            - paragraph: Does not support or excuse criminal behaviour
          - definition:
            - link "Change":
              - /url: thinking-behaviours#thinking_behaviours_attitudes_criminal_behaviour
          - term: Does Test want to make changes to their thinking, behaviours and attitudes?
          - definition:
            - paragraph: Test is not present
          - definition:
            - link "Change":
              - /url: thinking-behaviours#thinking_behaviours_attitudes_changes
          - term: Are there any concerns that Test poses a risk of sexual harm to others?
          - definition:
            - paragraph: "Yes"
          - definition:
            - link "Change":
              - /url: thinking-behaviours-risk-of-sexual-harm#thinking_behaviours_attitudes_risk_sexual_harm
          - term: Is there evidence Test shows sexual preoccupation?
          - definition:
            - paragraph: Yes, the amount of time they spend engaging in sexual activity or thinking about sex is unhealthy and is impacting their day-to-day life
          - definition:
            - link "Change":
              - /url: thinking-behaviours-sexual-harm#thinking_behaviours_attitudes_sexual_preoccupation
          - term: Is there evidence Test has offence-related sexual interests?
          - definition:
            - paragraph: Yes, there are recurrent and persistent patterns of a preference for sexual activity that is illegal or harmful and no evidence of healthy sexual interests
          - definition:
            - link "Change":
              - /url: thinking-behaviours-sexual-harm#thinking_behaviours_attitudes_offence_related_sexual_interest
          - term: Is there evidence Test finds it easier to seek emotional intimacy with children over adults?
          - definition:
            - paragraph: Yes, they find it easier to seek emotional intimacy with children and have significant difficulty forming intimate relationships with adults
          - definition:
            - link "Change":
              - /url: thinking-behaviours-sexual-harm#thinking_behaviours_attitudes_emotional_intimacy
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
          { question: 'thinking_behaviours_attitudes_emotional_intimacy', value: 'YES' },
          { question: 'thinking_behaviours_attitudes_sexual_preoccupation', value: 'YES' },
          {
            question: 'thinking_behaviours_attitudes_offence_related_sexual_interest',
            value: 'YES_OFFENCE_RELATED_SEXUAL_INTEREST',
          },
        ])
        .save()

      await ThinkingBehavioursAndAttitudesPage.navigateToThinkingBehavioursAndAttitudes(
        page,
        handoverLink,
        baseURL,
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
          { question: 'thinking_behaviours_attitudes_emotional_intimacy', value: 'YES' },
          { question: 'thinking_behaviours_attitudes_sexual_preoccupation', value: 'YES' },
          {
            question: 'thinking_behaviours_attitudes_offence_related_sexual_interest',
            value: 'YES_OFFENCE_RELATED_SEXUAL_INTEREST',
          },
          { question: 'thinking_behaviours_attitudes_strengths_protective_factors', value: 'NO' },
          { question: 'thinking_behaviours_attitudes_no_strengths_protective_factors_details', value: '' },
          { question: 'thinking_behaviours_attitudes_linked_to_serious_harm', value: 'NO' },
          { question: 'thinking_behaviours_attitudes_no_serious_harm_details', value: '' },
        ]).save()

      await ThinkingBehavioursAndAttitudesPage.navigateToThinkingBehavioursAndAttitudes(
        page,
        handoverLink,
        baseURL,
        'thinking-behaviours-summary#practitioner-analysis',
      )
      const thinkingBehavioursAndAttitudesPage = await ThinkingBehavioursAndAttitudesPage.verifyOnPage(
        page,
        'strengths or protective factors',
      )

      await thinkingBehavioursAndAttitudesPage.linkedToRiskOfReoffending.click()
      await thinkingBehavioursAndAttitudesPage.markComplete.click()
      await expect(thinkingBehavioursAndAttitudesPage.complete).toBeVisible()
      expect(page.url()).toContain('thinking-behaviours-analysis')
    })
  })

  test.describe('Validation', () => {
    test('validation thinking behaviours', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
      const { handoverLink } = await createSession({ targetService: TargetService.STRENGTHS_AND_NEEDS })
      await strengthsAndNeedsBuilder.fresh().save()

      await ThinkingBehavioursAndAttitudesPage.navigateToThinkingBehavioursAndAttitudes(page, handoverLink, baseURL)

      const thinkingBehavioursAndAttitudesPage = await ThinkingBehavioursAndAttitudesPage.verifyOnPage(
        page,
        'consequences of their actions?',
      )
      await thinkingBehavioursAndAttitudesPage.saveAndContinue.click()

      await thinkingBehavioursAndAttitudesPage.errorConsequences.click()
      await expect(thinkingBehavioursAndAttitudesPage.yesAwareOfTheConsequences).toBeFocused()
      await thinkingBehavioursAndAttitudesPage.errorStableBehaviour.click()
      await expect(thinkingBehavioursAndAttitudesPage.yesShowsStableBehaviour).toBeFocused()
      await thinkingBehavioursAndAttitudesPage.errorEngagesInOffendingActivities.click()
      await expect(thinkingBehavioursAndAttitudesPage.yesEngagesInProSocialActivities).toBeFocused()
      await thinkingBehavioursAndAttitudesPage.errorResilientToPeerPressure.click()
      await expect(thinkingBehavioursAndAttitudesPage.yesResilientTowardsPeerPressure).toBeFocused()
      await thinkingBehavioursAndAttitudesPage.errorAbleToSolveProblems.click()
      await expect(thinkingBehavioursAndAttitudesPage.yesAbleToSolveProblems).toBeFocused()
      await thinkingBehavioursAndAttitudesPage.errorUnderstandsPeoplesViews.click()
      await expect(thinkingBehavioursAndAttitudesPage.yesUnderstandsPeoplesViews).toBeFocused()
      await thinkingBehavioursAndAttitudesPage.errorManipulativeOrPredatory.click()
      await expect(thinkingBehavioursAndAttitudesPage.yesHonestAccountNoManipulative).toBeFocused()
      await thinkingBehavioursAndAttitudesPage.errorManagesTemper.click()
      await expect(thinkingBehavioursAndAttitudesPage.yesAbleToManageTemper).toBeFocused()
      await thinkingBehavioursAndAttitudesPage.errorUsesViolenceOrAggression.click()
      await expect(thinkingBehavioursAndAttitudesPage.yesDoesNotUseViolence).toBeFocused()
      await thinkingBehavioursAndAttitudesPage.errorActsOnImpulse.click()
      await expect(thinkingBehavioursAndAttitudesPage.yesConsidersAllAspectsBeforeActing).toBeFocused()
      await thinkingBehavioursAndAttitudesPage.errorPositiveAttitudeCJStaff.click()
      await expect(thinkingBehavioursAndAttitudesPage.yesHasAPositiveAttitude).toBeFocused()
      await thinkingBehavioursAndAttitudesPage.errorHostileOrientation.click()
      await expect(thinkingBehavioursAndAttitudesPage.yesConstructiveConversationsAndForgives).toBeFocused()
      await thinkingBehavioursAndAttitudesPage.errorAcceptsSupervision.click()
      await expect(thinkingBehavioursAndAttitudesPage.yesAcceptsSupervision).toBeFocused()
      await thinkingBehavioursAndAttitudesPage.errorSupportsCriminalBehaviour.click()
      await expect(thinkingBehavioursAndAttitudesPage.yesDoesNotSupportCriminalBehaviour).toBeFocused()
      await thinkingBehavioursAndAttitudesPage.errorWantsToMakeChanges.click()
      await expect(thinkingBehavioursAndAttitudesPage.yesAlreadyMadePositiveChanges).toBeFocused()
    })
  })

  test.describe('Accessibility', () => {
    test('should be accessible', async ({ page, createSession, baseURL }) => {
      const { handoverLink } = await createSession({ targetService: TargetService.STRENGTHS_AND_NEEDS })

      await ThinkingBehavioursAndAttitudesPage.navigateToThinkingBehavioursAndAttitudes(page, handoverLink, baseURL)
      await checkAccessibility(page, {
        // https://github.com/alphagov/govuk-design-system-backlog/issues/59#issuecomment-2854891330
        disableRules: ['aria-allowed-attr'],
      })
    })
  })
})
