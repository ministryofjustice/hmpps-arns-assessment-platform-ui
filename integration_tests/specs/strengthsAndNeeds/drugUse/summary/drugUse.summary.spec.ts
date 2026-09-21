import { Question } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/drug-use/constants/question'
import { CommonOption } from '@server/forms/strengths-and-needs/versions/v1.0/constants/commonOption'
import { expect } from '@playwright/test'
import DrugUsePage from 'pages/strengthsAndNeeds/drugUsePage'
import { test, TargetService } from '../../../../support/fixtures'

test.describe('Summary', () => {
  test('shows summary page, never misused drugs', async ({
    page,
    createSession,
    strengthsAndNeedsBuilder,
    baseURL,
  }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId).withAnswers([{ question: Question.drug_use, value: CommonOption.no }]).save()

    await DrugUsePage.navigateTo(page, handoverLink, baseURL, sanAssessmentId, 'drug-use-summary')

    const drugUsePage = await DrugUsePage.verifyOnPage(page, 'Summary')

    await expect(drugUsePage.summary).toMatchAriaSnapshot(`
      - tabpanel "Summary":
        - term: Has Test ever misused drugs?
        - definition:
          - paragraph: "No"
        - definition:
          - link "Change Has Test ever misused drugs?":
            - /url: drug-use#drug_use-question
        - heading [level=2]
        - heading [level=2]
        - button "Go to practitioner analysis"
    `)
  })

  test('practitioner analysis', async ({ baseURL, page, createSession, strengthsAndNeedsBuilder }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId).withAnswers([{ question: Question.drug_use, value: CommonOption.no }]).save()

    await DrugUsePage.navigateTo(page, handoverLink, baseURL, sanAssessmentId, 'drug-use-summary')

    const drugUsePage = await DrugUsePage.verifyOnPage(page, 'Summary')

    await drugUsePage.goToPractitionerAnalysis.click()
    await expect(page.getByText('Are there any strengths or protective factors')).toBeVisible()
  })

  test('mark complete', async ({ baseURL, page, createSession, strengthsAndNeedsBuilder }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId).withAnswers([
        { question: Question.drug_use, value: CommonOption.no },
        { question: Question.drug_use_practitioner_analysis_strengths_or_protective_factors, value: CommonOption.no },
        { question: Question.drug_use_practitioner_analysis_strengths_or_protective_factors_no_details, value: '' },
        { question: Question.drug_use_practitioner_analysis_risk_of_serious_harm, value: CommonOption.no },
        { question: Question.drug_use_practitioner_analysis_risk_of_serious_harm_no_details, value: '' },
      ]).save()

    await DrugUsePage.navigateTo(page, handoverLink, baseURL, sanAssessmentId, 'drug-use-summary#practitioner-analysis')

    const drugUsePage = await DrugUsePage.verifyOnPage(page, 'strengths or protective factors')

    await drugUsePage.questions.drug_use_practitioner_analysis_risk_of_reoffending.option(CommonOption.no)
      .click()
    await drugUsePage.markComplete.click()
    await expect(drugUsePage.complete).toBeVisible()
    expect(page.url()).toContain('drug-use-analysis')
  })
})
