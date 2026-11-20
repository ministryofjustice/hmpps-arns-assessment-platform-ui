import { expect } from '@playwright/test'
import { Option } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/finance/constants/option'
import { Question } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/finance/constants/question'
import { Step } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/finance/constants/step'
import FinancesPage from 'pages/strengthsAndNeedsV2/financesPage'
import { test, TargetService } from '../../../../support/fixtures'

test.describe('Validation', () => {
  test('validation: finance income page requires a selection', async ({
    page,
    createSession,
    strengthsAndNeedsBuilder,
    baseURL,
  }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder.fresh().save()

    await FinancesPage.navigateTo(page, handoverLink, baseURL, sanAssessmentId)

    const financesPage = await FinancesPage.verifyOnPage(page, 'currently get their money')

    const { questions } = financesPage

    await financesPage.saveAndContinue.click()
    await expect(financesPage.alert).toMatchAriaSnapshot(`
      - alert:
        - heading "There is a problem" [level=2]
        - list:
          - /children: equal
          - listitem:
            - link "Select where they currently get their money from, or select 'No money'":
              - /url: "#finance_income"
    `)

    await questions.finance_income.errorLink.click()
    await expect(questions.finance_income.input).toBeFocused()
  })

  test('validation: finance concerns page requires a selection', async ({
    page,
    createSession,
    strengthsAndNeedsBuilder,
    baseURL,
  }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId)
      .withAnswers([{ question: Question.finance_income, value: [Option.employment] }])
      .withUserSubmittedSteps([Step.finance_income.code, Step.finance_concerns.code])
      .save()

    await FinancesPage.navigateTo(page, handoverLink, baseURL, sanAssessmentId, 'finance-concerns')

    const financesPage = await FinancesPage.verifyOnPage(page, 'financial issues or worries')

    const { questions } = financesPage

    await financesPage.saveAndContinue.click()
    await expect(financesPage.alert).toMatchAriaSnapshot(`
      - alert:
        - heading "There is a problem" [level=2]
        - list:
          - /children: equal
          - listitem:
            - link "Select if they have any financial issues or worries":
              - /url: "#finance_concerns"
    `)

    await questions.finance_concerns.errorLink.click()
    await expect(questions.finance_concerns.input).toBeFocused()
  })

  test('validation: over reliant on family or friends page requires a selection', async ({
    page,
    createSession,
    strengthsAndNeedsBuilder,
    baseURL,
  }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId)
      .withAnswers([{ question: Question.finance_income, value: [Option.family_or_friends] }])
      .withUserSubmittedSteps([Step.finance_income.code, Step.community_finance_income_friends_family.code])
      .save()

    await FinancesPage.navigateTo(
      page,
      handoverLink,
      baseURL,
      sanAssessmentId,
      'community-finance-income-friends-family',
    )

    const financesPage = await FinancesPage.verifyOnPage(page, 'over reliant on family or friends')

    const { questions } = financesPage

    await financesPage.saveAndContinue.click()
    await expect(financesPage.alert).toMatchAriaSnapshot(`
      - alert:
        - heading "There is a problem" [level=2]
        - list:
          - /children: equal
          - listitem:
            - link "Select if they are over reliant on family or friends for money":
              - /url: "#community_finance_income_friends_family"
    `)

    await questions.community_finance_income_friends_family.errorLink.click()
    await expect(questions.community_finance_income_friends_family.input).toBeFocused()
  })
})
