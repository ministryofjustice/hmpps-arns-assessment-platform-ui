import { expect } from '@playwright/test'
import { test, TargetService } from '../../support/fixtures'
import CreateGoalPage from '../../pages/sentencePlan/createGoalPage'
import { navigateToSentencePlan } from './sentencePlanUtils'
import coordinatorApi, { SanAssessmentData } from '../../mockApis/coordinatorApi'

test.describe('Assessment Info Details - Incomplete Section', () => {
  test('displays warning when section is incomplete but all data is present', async ({ page, createSession }) => {
    const { handoverLink, sentencePlanId } = await createSession({
      targetService: TargetService.SENTENCE_PLAN,
      criminogenicNeedsData: {
        drugMisuse: {
          drugLinkedToHarm: 'NO',
          drugLinkedToReoffending: 'YES',
          drugStrengths: 'NO',
          drugOtherWeightedScore: '6',
        },
      },
    })

    const incompleteDrugUseData: SanAssessmentData = {
      drug_use_section_complete: { value: 'NO' },
      drug_use_practitioner_analysis_risk_of_reoffending_yes_details: {
        value: 'Cannabis use linked to peer group.',
      },
      drug_use_changes: { value: 'NEEDS_HELP_TO_MAKE_CHANGES' },
    }

    await coordinatorApi.stubGetEntityAssessment(sentencePlanId, {
      sanAssessmentData: incompleteDrugUseData,
    })

    await navigateToSentencePlan(page, handoverLink)
    await page.goto('/sentence-plan/v1.0/goal/new/add-goal/drug-use')
    const createGoalPage = await CreateGoalPage.verifyOnPage(page)

    await expect(createGoalPage.assessmentInfoDetails).toBeVisible()
    expect(await createGoalPage.isAssessmentInfoCollapsed()).toBe(true)

    await createGoalPage.expandAssessmentInfo()
    await expect(createGoalPage.assessmentInfoContent).toMatchAriaSnapshot(`
      - strong: /Warning.*This area has not been marked as complete/
      - paragraph:
        - strong: /This area is not linked to RoSH/
      - paragraph:
        - strong: /This area is linked to risk of reoffending/
      - paragraph: /Cannabis use linked to peer group/
      - paragraph:
        - strong: /Motivation to make changes/
      - paragraph: /wants to make changes but needs help/
      - paragraph:
        - strong: /There are no strengths or protective factors/
    `)
  })

  test('displays all missing items when section is incomplete with only motivation entered', async ({
    page,
    createSession,
  }) => {
    // Scenario: Section has motivation answer but nothing else
    // This tests the "incomplete with missing items" state
    const { handoverLink, sentencePlanId } = await createSession({
      targetService: TargetService.SENTENCE_PLAN,
      criminogenicNeedsData: {
        accommodation: {
          accLinkedToHarm: 'NULL',
          accLinkedToReoffending: 'NULL',
          accStrengths: 'NULL',
          // No score
        },
      },
    })

    const incompleteAccommodationData: SanAssessmentData = {
      accommodation_section_complete: { value: 'NO' },
      // Only motivation is answered - triggers "incomplete with data" state
      accommodation_changes: { value: 'WANT_TO_MAKE_CHANGES' },
    }

    await coordinatorApi.stubGetEntityAssessment(sentencePlanId, {
      sanAssessmentData: incompleteAccommodationData,
    })

    await navigateToSentencePlan(page, handoverLink)
    await page.goto('/sentence-plan/v1.0/goal/new/add-goal/accommodation')
    const createGoalPage = await CreateGoalPage.verifyOnPage(page)

    await expect(createGoalPage.assessmentInfoDetails).toBeVisible()
    expect(await createGoalPage.isAssessmentInfoCollapsed()).toBe(true)

    await createGoalPage.expandAssessmentInfo()
    await expect(createGoalPage.assessmentInfoContent).toMatchAriaSnapshot(`
      - strong: /Warning.*This area has not been marked as complete/
      - paragraph:
        - strong: /Motivation to make changes/
      - paragraph: /wants to make changes and knows how to/
      - paragraph:
        - strong: /Missing information/
      - list:
        - listitem: /whether this area is linked to RoSH/
        - listitem: /whether this area is linked to risk of reoffending/
        - listitem: /strengths and protective factors/
    `)
  })

  test('displays warning and missing items list when section has partial data', async ({ page, createSession }) => {
    const { handoverLink, sentencePlanId } = await createSession({
      targetService: TargetService.SENTENCE_PLAN,
      criminogenicNeedsData: {
        thinkingBehaviourAndAttitudes: {
          thinkLinkedToHarm: 'YES',
          thinkLinkedToReoffending: 'YES',
          // Strengths missing (NULL) - will show in missing items
          thinkOtherWeightedScore: '8',
        },
      },
    })

    const incompleteThinkingData: SanAssessmentData = {
      thinking_behaviours_attitudes_section_complete: { value: 'NO' },
      thinking_behaviours_attitudes_practitioner_analysis_risk_of_serious_harm_yes_details: {
        value: 'Impulsive decision-making and poor anger management.',
      },
      thinking_behaviours_attitudes_practitioner_analysis_risk_of_reoffending_yes_details: {
        value: 'Pattern of acting impulsively.',
      },
      thinking_behaviours_attitudes_changes: { value: 'THINKING_ABOUT_MAKING_CHANGES' },
    }

    await coordinatorApi.stubGetEntityAssessment(sentencePlanId, {
      sanAssessmentData: incompleteThinkingData,
    })

    await navigateToSentencePlan(page, handoverLink)
    await page.goto('/sentence-plan/v1.0/goal/new/add-goal/thinking-behaviours-and-attitudes')
    const createGoalPage = await CreateGoalPage.verifyOnPage(page)

    await expect(createGoalPage.assessmentInfoDetails).toBeVisible()
    expect(await createGoalPage.isAssessmentInfoCollapsed()).toBe(true)

    await createGoalPage.expandAssessmentInfo()
    await expect(createGoalPage.assessmentInfoContent).toMatchAriaSnapshot(`
      - strong: /Warning.*This area has not been marked as complete/
      - paragraph:
        - strong: /This area is linked to RoSH/
      - paragraph: /Impulsive decision-making and poor anger management/
      - paragraph:
        - strong: /This area is linked to risk of reoffending/
      - paragraph: /Pattern of acting impulsively/
      - paragraph:
        - strong: /Motivation to make changes/
      - paragraph: /is thinking about making changes/
      - paragraph:
        - strong: /Missing information/
      - list:
        - listitem: /strengths and protective factors/
    `)
  })

  test('displays multiple missing items when section has minimal data', async ({ page, createSession }) => {
    const { handoverLink, sentencePlanId } = await createSession({
      targetService: TargetService.SENTENCE_PLAN,
      criminogenicNeedsData: {
        finance: {
          // Harm missing (NULL) - will show in missing items
          financeLinkedToReoffending: 'NO',
          financeStrengths: 'YES',
        },
      },
    })

    const incompleteFinanceData: SanAssessmentData = {
      finance_section_complete: { value: 'NO' },
      finance_practitioner_analysis_strengths_or_protective_factors_yes_details: {
        value: 'Has managed finances responsibly.',
      },
    }

    await coordinatorApi.stubGetEntityAssessment(sentencePlanId, {
      sanAssessmentData: incompleteFinanceData,
    })

    await navigateToSentencePlan(page, handoverLink)
    await page.goto('/sentence-plan/v1.0/goal/new/add-goal/finances')
    const createGoalPage = await CreateGoalPage.verifyOnPage(page)

    expect(await createGoalPage.isAssessmentInfoCollapsed()).toBe(true)

    await createGoalPage.expandAssessmentInfo()
    // Note: When section is incomplete and motivation is null, it shows in missing items
    // (bypass message only shows when section IS complete)
    await expect(createGoalPage.assessmentInfoContent).toMatchAriaSnapshot(`
      - strong: /Warning.*This area has not been marked as complete/
      - paragraph:
        - strong: /This area is not linked to risk of reoffending/
      - paragraph:
        - strong: /There are strengths or protective factors/
      - paragraph: /Has managed finances responsibly/
      - paragraph:
        - strong: /Missing information/
      - list:
        - listitem: /whether this area is linked to RoSH/
        - listitem: /motivation to make changes/
    `)
  })
})
