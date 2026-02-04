import { expect } from '@playwright/test'
import { test, TargetService } from '../../support/fixtures'
import CreateGoalPage from '../../pages/sentencePlan/createGoalPage'
import { navigateToSentencePlan } from './sentencePlanUtils'
import coordinatorApi, { OasysEquivalent } from '../../mockApis/coordinatorApi'

test.describe('Assessment Info Details - Warnings', () => {
  test.describe('No Information Available', () => {
    test('displays not started warning when assessment has no data for area', async ({ page, createSession }) => {
      // Pass criminogenic needs with NULL values for employment area to test "not started" scenario
      const { handoverLink, sentencePlanId } = await createSession({
        targetService: TargetService.SENTENCE_PLAN,
        criminogenicNeedsData: {
          // Accommodation has data (used in coordinator stub)
          accommodation: {
            accLinkedToHarm: 'YES',
            accLinkedToReoffending: 'YES',
            accStrengths: 'YES',
            accOtherWeightedScore: '6',
          },
          // Employment has no data - all NULL
          educationTrainingEmployability: {
            eteLinkedToHarm: 'NULL',
            eteLinkedToReoffending: 'NULL',
            eteStrengths: 'NULL',
            // No score
          },
        },
      })

      const oasysEquivalentNoEmploymentData: OasysEquivalent = {
        accommodation_section_complete: 'YES',
        accommodation_practitioner_analysis_risk_of_serious_harm: 'YES',
        accommodation_practitioner_analysis_risk_of_serious_harm_yes_details: 'Test details',
        accommodation_practitioner_analysis_risk_of_reoffending: 'YES',
        accommodation_practitioner_analysis_risk_of_reoffending_yes_details: 'Test details',
        accommodation_practitioner_analysis_strengths_or_protective_factors: 'YES',
        accommodation_practitioner_analysis_strengths_or_protective_factors_yes_details: 'Test details',
        accommodation_practitioner_analysis_motivation_to_make_changes: 'WANT_TO_MAKE_CHANGES',
      }

      await coordinatorApi.stubGetEntityAssessment(sentencePlanId, {
        sanOasysEquivalent: oasysEquivalentNoEmploymentData,
      })

      await navigateToSentencePlan(page, handoverLink)
      await page.goto('/sentence-plan/v1.0/goal/new/add-goal/employment-and-education')
      const createGoalPage = await CreateGoalPage.verifyOnPage(page)

      await expect(createGoalPage.assessmentInfoDetails).toBeVisible()
      expect(await createGoalPage.isAssessmentInfoCollapsed()).toBe(true)

      await createGoalPage.expandAssessmentInfo()
      await expect(createGoalPage.assessmentInfoContent).toMatchAriaSnapshot(`
        - strong: /Warning.*No information is available yet as the assessment has not been started/
      `)
    })
  })

  test.describe('API Error', () => {
    test('displays error warning when coordinator API fails', async ({ page, createSession }) => {
      const { handoverLink, sentencePlanId } = await createSession({ targetService: TargetService.SENTENCE_PLAN })

      await coordinatorApi.stubGetEntityAssessmentError(sentencePlanId)

      await navigateToSentencePlan(page, handoverLink)
      await page.goto('/sentence-plan/v1.0/goal/new/add-goal/accommodation')
      const createGoalPage = await CreateGoalPage.verifyOnPage(page)

      await expect(createGoalPage.assessmentInfoDetails).toBeVisible()
      expect(await createGoalPage.isAssessmentInfoCollapsed()).toBe(true)

      await createGoalPage.expandAssessmentInfo()
      await expect(createGoalPage.assessmentInfoContent).toMatchAriaSnapshot(`
        - strong: /Warning.*There is a problem getting this information/
      `)
    })
  })
})
