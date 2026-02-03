import { expect } from '@playwright/test'
import { test, TargetService } from '../../support/fixtures'
import CreateGoalPage from '../../pages/sentencePlan/createGoalPage'
import { navigateToSentencePlan } from './sentencePlanUtils'
import coordinatorApi, { OasysEquivalent } from '../../mockApis/coordinatorApi'

test.describe('Assessment Info Details - Complete Section', () => {
  test('displays assessment info collapsed when section is complete with all data', async ({ page, createSession }) => {
    const { handoverLink, sentencePlanId } = await createSession({ targetService: TargetService.SENTENCE_PLAN })

    const completeAccommodationData: OasysEquivalent = {
      accommodation_section_complete: 'YES',
      accommodation_practitioner_analysis_risk_of_serious_harm: 'YES',
      accommodation_practitioner_analysis_risk_of_serious_harm_yes_details:
        'Risk of serious harm related to accommodation instability.',
      accommodation_practitioner_analysis_risk_of_reoffending: 'YES',
      accommodation_practitioner_analysis_risk_of_reoffending_yes_details:
        'Accommodation instability is linked to reoffending.',
      accommodation_practitioner_analysis_strengths_or_protective_factors: 'YES',
      accommodation_practitioner_analysis_strengths_or_protective_factors_yes_details:
        'Has maintained tenancy previously for 2 years.',
      accommodation_practitioner_analysis_motivation_to_make_changes: 'WANT_TO_MAKE_CHANGES',
    }

    await coordinatorApi.stubGetEntityAssessment(sentencePlanId, {
      sanOasysEquivalent: completeAccommodationData,
    })

    await navigateToSentencePlan(page, handoverLink)
    await page.goto('/sentence-plan/v1.0/goal/new/add-goal/accommodation')
    const createGoalPage = await CreateGoalPage.verifyOnPage(page)

    await expect(createGoalPage.assessmentInfoDetails).toBeVisible()
    expect(await createGoalPage.isAssessmentInfoCollapsed()).toBe(true)

    await createGoalPage.expandAssessmentInfo()
    await expect(createGoalPage.assessmentInfoContent).toMatchAriaSnapshot(`
      - paragraph:
        - strong: /This area is linked to RoSH/
      - paragraph: /Risk of serious harm related to accommodation/
      - paragraph:
        - strong: /This area is linked to risk of reoffending/
      - paragraph: /Accommodation instability is linked to reoffending/
      - paragraph:
        - strong: /Motivation to make changes/
      - paragraph: /wants to make changes and knows how to/
      - paragraph:
        - strong: /There are strengths or protective factors/
      - paragraph: /Has maintained tenancy previously/
    `)
  })

  test('displays section with motivation not required when question was not applicable (e.g., no drug use)', async ({
    page,
    createSession,
  }) => {
    const { handoverLink, sentencePlanId } = await createSession({
      targetService: TargetService.SENTENCE_PLAN,
      criminogenicNeedsData: {
        drugMisuse: {
          drugLinkedToHarm: 'NO',
          drugLinkedToReoffending: 'NO',
          drugStrengths: 'NO',
          drugOtherWeightedScore: '0',
        },
      },
    })

    const customOasysEquivalent: OasysEquivalent = {
      drug_use_section_complete: 'YES',
      // No motivation - person didn't have to answer
    }

    await coordinatorApi.stubGetEntityAssessment(sentencePlanId, {
      sanOasysEquivalent: customOasysEquivalent,
    })

    await navigateToSentencePlan(page, handoverLink)
    await page.goto('/sentence-plan/v1.0/goal/new/add-goal/drug-use')
    const createGoalPage = await CreateGoalPage.verifyOnPage(page)

    expect(await createGoalPage.isAssessmentInfoCollapsed()).toBe(true)

    await createGoalPage.expandAssessmentInfo()
    await expect(createGoalPage.assessmentInfoContent).toMatchAriaSnapshot(`
      - paragraph:
        - strong: /This area is not linked to RoSH/
      - paragraph:
        - strong: /This area is not linked to risk of reoffending/
      - paragraph:
        - strong: /Motivation to make changes/
      - paragraph: /did not have to answer this question/
      - paragraph:
        - strong: /There are no strengths or protective factors/
    `)
  })

  test.describe('Collapsed State Verification', () => {
    const areasToTest = ['accommodation', 'drug-use', 'finances', 'employment-and-education']

    for (const area of areasToTest) {
      test(`assessment info is collapsed by default for ${area}`, async ({ page, createSession }) => {
        const { handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
        await navigateToSentencePlan(page, handoverLink)

        await page.goto(`/sentence-plan/v1.0/goal/new/add-goal/${area}`)
        const createGoalPage = await CreateGoalPage.verifyOnPage(page)

        await expect(createGoalPage.assessmentInfoDetails).toBeVisible()
        expect(await createGoalPage.isAssessmentInfoCollapsed()).toBe(true)
      })
    }
  })
})
