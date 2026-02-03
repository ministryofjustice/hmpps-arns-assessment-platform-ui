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
})
