import { expect } from '@playwright/test'
import { Option } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/finance/constants/option'
import { Question } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/finance/constants/question'
import { Step } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/finance/constants/step'
import { CommonOption } from '@server/forms/strengths-and-needs/versions/v2.0/constants/commonOption'
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

  test('validation: over reliant on family or friends requires details when Yes is selected', async ({
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
      Step.community_finance_income_friends_family.path,
    )

    const financesPage = new FinancesPage(page)
    const overReliant = financesPage.questions.community_finance_income_friends_family
    await overReliant.option(CommonOption.yes).check()
    await financesPage.saveAndContinue.click()

    await expect(financesPage.alert).toMatchAriaSnapshot(`
      - alert:
        - heading "There is a problem" [level=2]
        - list:
          - /children: equal
          - listitem:
            - link "Give details on how they are over reliant on family or friends for money":
              - /url: "#community_finance_income_friends_family_yes_details"
    `)
  })

  test('validation: money management page requires answers to both questions', async ({
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
      .withAnswers([
        { question: Question.finance_income, value: [Option.employment] },
        { question: Question.finance_concerns, value: CommonOption.yes },
      ])
      .withUserSubmittedSteps([
        Step.finance_income.code,
        Step.finance_concerns.code,
        Step.finance_money_management.code,
      ])
      .save()

    await FinancesPage.navigateTo(page, handoverLink, baseURL, sanAssessmentId, Step.finance_money_management.path)

    const financesPage = new FinancesPage(page)
    await financesPage.saveAndContinue.click()
    await expect(financesPage.alert).toMatchAriaSnapshot(`
      - alert:
        - heading "There is a problem" [level=2]
        - list:
          - /children: equal
          - listitem:
            - link "Select how good they are at managing their money":
              - /url: "#finance_money_management"
          - listitem:
            - link "Select if they are affected by debt":
              - /url: "#finance_debt"
    `)
  })

  test('validation: finance debt page requires a debt type', async ({
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
      .withAnswers([
        { question: Question.finance_income, value: [Option.employment] },
        { question: Question.finance_concerns, value: CommonOption.yes },
        { question: Question.finance_money_management, value: Option.good },
        { question: Question.finance_debt, value: Option.yes_their_debt },
      ])
      .withUserSubmittedSteps([
        Step.finance_income.code,
        Step.finance_concerns.code,
        Step.finance_money_management.code,
        Step.finance_debt.code,
      ])
      .save()

    await FinancesPage.navigateTo(page, handoverLink, baseURL, sanAssessmentId, Step.finance_debt.path)

    const financesPage = new FinancesPage(page)
    await financesPage.saveAndContinue.click()
    await expect(financesPage.alert).toMatchAriaSnapshot(`
      - alert:
        - heading "There is a problem" [level=2]
        - list:
          - /children: equal
          - listitem:
            - link "Select type of debt":
              - /url: "#yes_type_of_debt"
    `)
  })

  test('validation: finance changes page requires a selection', async ({
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

    const financesPage = new FinancesPage(page)
    await financesPage.questions.finance_income.option(Option.employment).check()
    await financesPage.saveAndContinue.click()
    await financesPage.questions.finance_concerns.option(CommonOption.yes).check()
    await financesPage.saveAndContinue.click()
    await financesPage.questions.finance_money_management.option(Option.good).check()
    await financesPage.questions.finance_debt.option(CommonOption.no).check()
    await financesPage.saveAndContinue.click()

    await expect(page).toHaveURL(new RegExp(Step.finance_changes.path))
    await financesPage.saveAndContinue.click()
    await expect(financesPage.alert).toMatchAriaSnapshot(`
      - alert:
        - heading "There is a problem" [level=2]
        - list:
          - /children: equal
          - listitem:
            - link "Select if they want to make changes to their finances":
              - /url: "#finance_changes"
    `)
  })
})
