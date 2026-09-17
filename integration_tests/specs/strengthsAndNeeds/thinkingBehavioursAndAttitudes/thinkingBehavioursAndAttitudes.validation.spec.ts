import { expect } from '@playwright/test'
import ThinkingBehavioursAndAttitudesPage from 'pages/strengthsAndNeeds/thinkingBehavioursAndAttitudesPage'
import { test, TargetService } from '../../../support/fixtures'

test.describe('Validation', () => {
  test('validation thinking behaviours', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder.fresh().save()

    await ThinkingBehavioursAndAttitudesPage.navigateToThinkingBehavioursAndAttitudes(
      page,
      handoverLink,
      baseURL,
      sanAssessmentId,
    )

    const thinkingBehavioursAndAttitudesPage = await ThinkingBehavioursAndAttitudesPage.verifyOnPage(
      page,
      'consequences of their actions?',
    )
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
            - link "Select if they’re resilient towards peer pressure or influence by criminal associates":
              - /url: "#thinking_behaviours_attitudes_peer_pressure"
          - listitem:
            - link "Select if they are able to solve problems in a positive way":
              - /url: "#thinking_behaviours_attitudes_problem_solving"
          - listitem:
            - link "Select if they understand other people’s views":
              - /url: "#thinking_behaviours_attitudes_peoples_views"
          - listitem:
            - link "Select if they show manipulative behaviour or a predatory lifestyle":
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
            - link "Select if they have a positive attitude towards any criminal justice staff they have come into contact with":
              - /url: "#thinking_behaviours_attitudes_positive_attitude"
          - listitem:
            - link "Select if they have hostile orientation to others or to general rules":
              - /url: "#thinking_behaviours_attitudes_hostile_orientation"
          - listitem:
            - link "Select if they accept supervision and their licence conditions":
              - /url: "#thinking_behaviours_attitudes_supervision"
          - listitem:
            - link "Select if they support or excuse criminal behaviour":
              - /url: "#thinking_behaviours_attitudes_criminal_behaviour"
          - listitem:
            - link "Select if they want to make changes to their thinking, behaviours and attitudes":
              - /url: "#thinking_behaviours_attitudes_changes"
    `)

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
