import { expect } from '@playwright/test'
import FinancesPage from 'pages/strengthsAndNeeds/financesPage'
import { test, TargetService } from '../../support/fixtures'
import { buildPageTitle, checkAccessibility, sanPageTitles } from './sanUtils'

test.describe('Finances Page', () => {
  test.describe('Questions', () => {
    test('shows finance', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
      const { handoverLink } = await createSession({ targetService: TargetService.STRENGTHS_AND_NEEDS })
      await strengthsAndNeedsBuilder.fresh().save()

      await FinancesPage.navigateToFinances(page, handoverLink, baseURL)

      const financesPage = await FinancesPage.verifyOnPage(page, 'currently get their money')

      await expect(page).toHaveTitle(buildPageTitle(sanPageTitles.finances))

      await expect(financesPage.mainSection).toMatchAriaSnapshot(`
        - group "Where does Test currently get their money from?":
          - text: Where does Test currently get their money from? Select all that apply.
          - checkbox "Carer’s allowance"
          - text: Carer’s allowance
          - checkbox "Disability benefits"
          - text: Disability benefits For example, Personal Independence Payment (PIP) (also known as Disability Living Allowance) or Severe Disablement Allowance.
          - checkbox "Employment"
          - text: Employment
          - checkbox "Family or friends"
          - text: Family or friends
          - checkbox "Offending"
          - text: Offending
          - checkbox "Pension"
          - text: Pension
          - checkbox "Student loan"
          - text: Student loan
          - checkbox "Undeclared (includes cash in hand)"
          - text: Undeclared (includes cash in hand)
          - checkbox "Work related benefits"
          - text: Work related benefits For example, Universal Credit or Jobseeker’s Allowance (JSA).
          - checkbox "Other"
          - text: Other
          - checkbox "Unknown"
          - text: Unknown or
          - checkbox "No money"
          - text: No money
        - group "Does Test have their own bank account?":
          - text: Does Test have their own bank account?
          - radio "Yes"
          - text: "Yes"
          - radio "No"
          - text: "No"
          - radio "Unknown"
          - text: Unknown
        - group "How good is Test at managing their money?":
          - text: How good is Test at managing their money? This includes things like budgeting, prioritising bills and paying rent.
          - radio "Able to manage their money well and is a strength"
          - text: Able to manage their money well and is a strength
          - radio "Able to manage their money for everyday necessities"
          - text: Able to manage their money for everyday necessities
          - radio "Unable to manage their money well"
          - text: Unable to manage their money well
          - radio "Unable to manage their money which is creating other problems"
          - text: Unable to manage their money which is creating other problems
        - group "Is Test affected by gambling?":
          - text: Is Test affected by gambling? Select all that apply.
          - checkbox "Yes, their own gambling"
          - text: Yes, their own gambling
          - checkbox "Yes, someone else’s gambling"
          - text: Yes, someone else’s gambling or
          - checkbox "No"
          - text: "No"
          - checkbox "Unknown"
          - text: Unknown
        - group "Is Test affected by debt?":
          - text: Is Test affected by debt?
          - checkbox "Yes, their own debt"
          - text: Yes, their own debt
          - checkbox "Yes, someone else’s debt"
          - text: Yes, someone else’s debt or
          - checkbox "No"
          - text: "No"
          - checkbox "Unknown"
          - text: Unknown
        - group "Does Test want to make changes to their finances?":
          - text: Does Test want to make changes to their finances? Test must answer this question.
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

    test('validation finance options', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
      const { handoverLink } = await createSession({
        targetService: TargetService.STRENGTHS_AND_NEEDS,
      })
      await strengthsAndNeedsBuilder.fresh().save()

      await FinancesPage.navigateToFinances(page, handoverLink, baseURL)

      const financesPage = await FinancesPage.verifyOnPage(page, 'currently get their money')

      await financesPage.saveAndContinue.click()

      await financesPage.selectIfHaveOwn.click()
      await expect(financesPage.yes).toBeFocused()
      await financesPage.selectWhereTheyCurrently.click()
      await expect(financesPage.carersAllowance).toBeFocused()
      await financesPage.selectHowGoodTheyAreAtManaging.click()
      await expect(financesPage.ableToManageTheirMoney).toBeFocused()
      await financesPage.selectIfAffectedByGambling.click()
      await expect(financesPage.yesTheirOwnGambling).toBeFocused()
      await financesPage.selectIfAffectedByDebt.click()
      await expect(financesPage.yesTheirOwnDebt).toBeFocused()
    })
  })

  test.describe('Summary', () => {
    test('shows summary page', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
      const { handoverLink, sanAssessmentId } = await createSession({
        targetService: TargetService.STRENGTHS_AND_NEEDS,
      })
      await strengthsAndNeedsBuilder
        .extend(sanAssessmentId).withAnswers([
          { question: 'finance_income', value: ['CARERS_ALLOWANCE'] },
          { question: 'finance_bank_account', value: 'YES' },
          { question: 'finance_money_management', value: 'GOOD' },
          { question: 'finance_money_management_good_details', value: '' },
          { question: 'finance_gambling', value: ['YES_THEIR_GAMBLING'] },
          { question: 'finance_gambling_yes_their_gambling_details', value: '' },
          { question: 'finance_debt', value: ['NO'] },
          { question: 'finance_changes', value: 'NOT_PRESENT' },
        ]).save()

      await FinancesPage.navigateToFinances(page, handoverLink, baseURL, 'finance-summary')

      const financesPage = await FinancesPage.verifyOnPage(page, 'Summary')

      await expect(financesPage.summary).toMatchAriaSnapshot(`
        - tabpanel "Summary":
          - term: Where does Test currently get their money from?
          - definition:
            - paragraph: Carer’s allowance
            - paragraph
            - paragraph
          - definition:
            - link "Change":
              - /url: finance
          - term: Does Test have their own bank account?
          - definition:
            - paragraph: "Yes"
          - definition:
            - link "Change":
              - /url: finance
          - term: How good is Test at managing their money?
          - definition:
            - paragraph: Able to manage their money well and is a strength
            - paragraph
            - paragraph
            - paragraph
            - paragraph
          - definition:
            - link "Change":
              - /url: finance
          - term: Is Test affected by gambling?
          - definition:
            - paragraph: Yes, their own gambling
            - paragraph
            - paragraph
            - paragraph
          - definition:
            - link "Change":
              - /url: finance
          - term: Is Test affected by debt?
          - definition:
            - paragraph
            - paragraph
            - paragraph
            - paragraph
            - paragraph: "No"
            - paragraph
          - definition:
            - link "Change":
              - /url: finance
          - term: Does Test want to make changes to their finances?
          - definition:
            - paragraph
            - paragraph
            - paragraph
            - paragraph
            - paragraph
            - paragraph
            - paragraph
            - paragraph: Test is not present
          - definition:
            - link "Change":
              - /url: finance
          - button "Go to practitioner analysis"
      `)
    })
  })

  test.describe('Accessibility', () => {
    test('should be accessible', async ({ page, createSession, baseURL }) => {
      const { handoverLink } = await createSession({ targetService: TargetService.STRENGTHS_AND_NEEDS })

      await FinancesPage.navigateToFinances(page, handoverLink, baseURL)
      await checkAccessibility(page, {
        // https://github.com/alphagov/govuk-design-system-backlog/issues/59#issuecomment-2854891330
        disableRules: ['aria-allowed-attr'],
      })
    })
  })
})
