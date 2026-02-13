import { expect } from '@playwright/test'
import { test, TargetService } from '../../../support/fixtures'
import CreateGoalPage from '../../../pages/sentencePlan/createGoalPage'
import ChangeGoalPage from '../../../pages/sentencePlan/changeGoalPage'
import AddStepsPage from '../../../pages/sentencePlan/addStepsPage'
import PlanOverviewPage from '../../../pages/sentencePlan/planOverviewPage'
import { navigateToSentencePlan, getDatePlusDaysAsISO } from '../sentencePlanUtils'
import coordinatorApi, { SanAssessmentData } from '../../../mockApis/coordinatorApi'

test.describe('Assessment Info Details - Complete Section', () => {
  test('displays assessment info collapsed when section is complete with all data', async ({ page, createSession }) => {
    const { handoverLink, sentencePlanId } = await createSession({ targetService: TargetService.SENTENCE_PLAN })

    const completeAccommodationData: SanAssessmentData = {
      accommodation_section_complete: { value: 'YES' },
      accommodation_practitioner_analysis_risk_of_serious_harm: { value: 'YES' },
      accommodation_practitioner_analysis_risk_of_serious_harm_yes_details: {
        value: 'Risk of serious harm related to accommodation instability.',
      },
      accommodation_practitioner_analysis_risk_of_reoffending: { value: 'YES' },
      accommodation_practitioner_analysis_risk_of_reoffending_yes_details: {
        value: 'Accommodation instability is linked to reoffending.',
      },
      accommodation_practitioner_analysis_strengths_or_protective_factors: { value: 'YES' },
      accommodation_practitioner_analysis_strengths_or_protective_factors_yes_details: {
        value: 'Has maintained tenancy previously for 2 years.',
      },
      accommodation_changes: { value: 'WANT_TO_MAKE_CHANGES' },
    }

    await coordinatorApi.stubGetEntityAssessment(sentencePlanId, {
      sanAssessmentData: completeAccommodationData,
    })

    await navigateToSentencePlan(page, handoverLink)
    await page.goto('/sentence-plan/v1.0/goal/new/add-goal/accommodation')
    const createGoalPage = await CreateGoalPage.verifyOnPage(page)

    await expect(createGoalPage.assessmentInfoDetails).toBeVisible()
    expect(await createGoalPage.isAssessmentInfoCollapsed()).toBe(true)

    await createGoalPage.expandAssessmentInfo()

    // Verify RoSH section
    await expect(createGoalPage.assessmentInfoContent).toContainText('This area is linked to RoSH')
    await expect(createGoalPage.assessmentInfoContent).toContainText('Risk of serious harm related to accommodation')

    // Verify reoffending section
    await expect(createGoalPage.assessmentInfoContent).toContainText('This area is linked to risk of reoffending')
    await expect(createGoalPage.assessmentInfoContent).toContainText(
      'Accommodation instability is linked to reoffending',
    )

    // Verify motivation section
    await expect(createGoalPage.assessmentInfoContent).toContainText('Motivation to make changes')
    await expect(createGoalPage.assessmentInfoContent).toContainText('wants to make changes and knows how to')

    // Verify strengths section
    await expect(createGoalPage.assessmentInfoContent).toContainText('There are strengths or protective factors')
    await expect(createGoalPage.assessmentInfoContent).toContainText('Has maintained tenancy previously')
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

    const customSanAssessmentData: SanAssessmentData = {
      drug_use_section_complete: { value: 'YES' },
      // No motivation - person didn't have to answer
    }

    await coordinatorApi.stubGetEntityAssessment(sentencePlanId, {
      sanAssessmentData: customSanAssessmentData,
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

  test.describe('Assessment Info on Change Goal Page', () => {
    test('displays assessment info on change-goal page', async ({ page, createSession, sentencePlanBuilder }) => {
      const { handoverLink, sentencePlanId } = await createSession({ targetService: TargetService.SENTENCE_PLAN })

      // Create a goal in accommodation area
      await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals([
          {
            title: 'Test Goal for Change',
            areaOfNeed: 'accommodation',
            status: 'ACTIVE',
            targetDate: getDatePlusDaysAsISO(90),
          },
        ])
        .save()

      const completeAccommodationData: SanAssessmentData = {
        accommodation_section_complete: { value: 'YES' },
        accommodation_practitioner_analysis_risk_of_serious_harm: { value: 'YES' },
        accommodation_practitioner_analysis_risk_of_serious_harm_yes_details: {
          value: 'Risk of serious harm related to accommodation.',
        },
        accommodation_practitioner_analysis_risk_of_reoffending: { value: 'NO' },
        accommodation_practitioner_analysis_strengths_or_protective_factors: { value: 'YES' },
        accommodation_practitioner_analysis_strengths_or_protective_factors_yes_details: {
          value: 'Has family support.',
        },
        accommodation_changes: { value: 'MAKING_CHANGES' },
      }

      await coordinatorApi.stubGetEntityAssessment(sentencePlanId, {
        sanAssessmentData: completeAccommodationData,
      })

      await navigateToSentencePlan(page, handoverLink)

      // Navigate to change goal
      await PlanOverviewPage.verifyOnPage(page)
      await page.getByRole('link', { name: 'Change goal' }).click()

      const changeGoalPage = await ChangeGoalPage.verifyOnPage(page)

      // Verify assessment info is visible and collapsed
      await expect(changeGoalPage.assessmentInfoDetails).toBeVisible()
      expect(await changeGoalPage.isAssessmentInfoCollapsed()).toBe(true)

      // Expand and verify content
      await changeGoalPage.expandAssessmentInfo()
      await expect(changeGoalPage.assessmentInfoContent).toContainText('This area is linked to RoSH')
      await expect(changeGoalPage.assessmentInfoContent).toContainText('Risk of serious harm related to accommodation')
    })
  })

  test.describe('Assessment Info on Add Steps Page', () => {
    test('displays assessment info on add-steps page', async ({ page, createSession, sentencePlanBuilder }) => {
      const { handoverLink, sentencePlanId } = await createSession({
        targetService: TargetService.SENTENCE_PLAN,
        criminogenicNeedsData: {
          accommodation: {
            accLinkedToHarm: 'NO',
            accLinkedToReoffending: 'YES',
            accStrengths: 'NO',
          },
        },
      })

      // Create a goal in accommodation area
      await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals([
          {
            title: 'Test Goal for Steps',
            areaOfNeed: 'accommodation',
            status: 'ACTIVE',
            targetDate: getDatePlusDaysAsISO(90),
          },
        ])
        .save()

      const completeAccommodationData: SanAssessmentData = {
        accommodation_section_complete: { value: 'YES' },
        accommodation_practitioner_analysis_risk_of_serious_harm: { value: 'NO' },
        accommodation_practitioner_analysis_risk_of_reoffending: { value: 'YES' },
        accommodation_practitioner_analysis_risk_of_reoffending_yes_details: {
          value: 'Linked to reoffending risk.',
        },
        accommodation_practitioner_analysis_strengths_or_protective_factors: { value: 'NO' },
        accommodation_changes: { value: 'WANT_TO_MAKE_CHANGES' },
      }

      await coordinatorApi.stubGetEntityAssessment(sentencePlanId, {
        sanAssessmentData: completeAccommodationData,
      })

      await navigateToSentencePlan(page, handoverLink)

      // Navigate to add steps via the goal card
      await PlanOverviewPage.verifyOnPage(page)
      await page.getByRole('link', { name: 'Add steps' }).click()

      const addStepsPage = await AddStepsPage.verifyOnPage(page)

      // Verify assessment info is visible and collapsed
      await expect(addStepsPage.assessmentInfoDetails).toBeVisible()
      expect(await addStepsPage.isAssessmentInfoCollapsed()).toBe(true)

      // Expand and verify content
      await addStepsPage.expandAssessmentInfo()
      await expect(addStepsPage.assessmentInfoContent).toContainText('This area is not linked to RoSH')
      await expect(addStepsPage.assessmentInfoContent).toContainText('This area is linked to risk of reoffending')
      await expect(addStepsPage.assessmentInfoContent).toContainText('Linked to reoffending risk')
    })
  })
})
