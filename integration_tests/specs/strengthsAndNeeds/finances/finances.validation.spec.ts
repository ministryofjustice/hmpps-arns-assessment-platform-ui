import { expect } from '@playwright/test'
import FinancesPage from 'pages/strengthsAndNeeds/financesPage'
import { test, TargetService } from '../../../support/fixtures'

test.describe('Validation', () => {
  test('validation finance options', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder.fresh().save()

    await FinancesPage.navigateToFinances(page, handoverLink, baseURL, sanAssessmentId)

    const financesPage = await FinancesPage.verifyOnPage(page, 'currently get their money')

    await financesPage.saveAndContinue.click()
    await expect(financesPage.alert).toMatchAriaSnapshot(`
      - alert:
        - heading "There is a problem" [level=2]
        - list:
          - /children: equal
          - listitem:
            - link "Select where they currently get their money from, or select 'No money'":
              - /url: "#finance_income"
          - listitem:
            - link "Select if they have their own personal bank account":
              - /url: "#finance_bank_account"
          - listitem:
            - link "Select how good they are at managing their money":
              - /url: "#finance_money_management"
          - listitem:
            - link "Select if they are affected by gambling":
              - /url: "#finance_gambling"
          - listitem:
            - link "Select if they are affected by debt":
              - /url: "#finance_debt"
          - listitem:
            - link "Select if they want to make changes to their finances":
              - /url: "#finance_changes"
    `)

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
    await financesPage.errorWantsToMakeChanges.click()
    await expect(financesPage.yesAlreadyMadePositiveChanges).toBeFocused()
  })
})
