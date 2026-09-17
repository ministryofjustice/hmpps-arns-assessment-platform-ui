import { expect } from '@playwright/test'
import FinancesPage from 'pages/strengthsAndNeeds/financesPage'
import { test, TargetService } from '../../../support/fixtures'
import { buildPageTitle, sanPageTitles } from '../sanUtils'

test.describe('Questions', () => {
  test('shows finance', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder.fresh().save()

    await FinancesPage.navigateToFinances(page, handoverLink, baseURL, sanAssessmentId)

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
})
