import { CommonOption } from '@server/forms/strengths-and-needs/versions/v2.0/constants/commonOption'
import { Option } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/alcohol-use/constants/option'
import { Question } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/alcohol-use/constants/question'
import { expect } from '@playwright/test'
import AlcoholUsePage from 'pages/strengthsAndNeedsV2/alcoholUsePage'
import { Step } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/alcohol-use/constants/step'
import { test, TargetService } from '../../../support/fixtures'
import { buildPageTitle, sanPageTitles } from '../sanUtils'

test.describe('Questions', () => {
  test('shows the alcohol current issues question', async ({
    page,
    createSession,
    strengthsAndNeedsBuilder,
    baseURL,
  }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder.fresh().save()

    await AlcoholUsePage.navigateTo(page, handoverLink, baseURL, sanAssessmentId)

    const alcoholUsePage = await AlcoholUsePage.verifyOnPage(page, 'Does Test have any current issues with alcohol?')

    await expect(page).toHaveTitle(buildPageTitle(sanPageTitles.alcoholUse))

    await expect(alcoholUsePage.mainForm).toMatchAriaSnapshot(`
      - group "Does Test have any current issues with alcohol?":
        - text: Does Test have any current issues with alcohol?
        - radio "Significant"
        - text: Significant
        - radio "Some problems"
        - text: Some problems
        - radio "No current problems"
        - text: No current problems
        - radio "Has never drank"
        - text: Has never drank
      - group "Has Test shown evidence of binge drinking or excessive alcohol use in the last 6 months?":
        - text: Has Test shown evidence of binge drinking or excessive alcohol use in the last 6 months?
        - radio "No evidence of binge drinking or excessive alcohol use"
        - text: No evidence of binge drinking or excessive alcohol use
        - radio "Some evidence of binge drinking or excessive alcohol use"
        - text: Some evidence of binge drinking or excessive alcohol use There is a pattern of alcohol use but has not caused any serious problems.
        - radio "Evidence of binge drinking or excessive alcohol use"
        - text: Evidence of binge drinking or excessive alcohol use There is a detrimental effect on other areas of their life and is often directly related to offending.
      - group "Does Test have any past issues with alcohol?":
        - text: Does Test have any past issues with alcohol?
        - radio "Yes"
        - text: "Yes"
        - radio "No"
        - text: "No"
      - group "Has anything helped Test to stop or reduce drinking alcohol in the past?":
        - text: Has anything helped Test to stop or reduce drinking alcohol in the past? Consider strategies, people or support networks that may have helped.
        - radio "Yes"
        - text: "Yes"
        - radio "No"
        - text: "No"
      - group "Does Test want to make changes to their alcohol use?":
        - text: Does Test want to make changes to their alcohol use? Test must answer this question.
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

  test('go to practitioner analysis button works on the analysis page after the section is marked complete', async ({
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
        { question: Question.alcohol_current_issues, value: Option.significant },
        { question: Question.alcohol_evidence_of_excess_drinking, value: Option.yes_with_evidence },
        { question: Question.alcohol_past_issues, value: CommonOption.yes },
        { question: Question.alcohol_past_issues_yes_details, value: 'Some details' },
        { question: Question.alcohol_stopped_or_reduced, value: CommonOption.yes },
        { question: Question.alcohol_stopped_or_reduced_yes_details, value: 'Some details' },
        { question: Question.alcohol_use_changes, value: CommonOption.does_not_want_to_make_changes },
        { question: Question.alcohol_use_changes_does_not_want_to_make_changes_details, value: 'Some details' },
        {
          question: Question.alcohol_use_practitioner_analysis_strengths_or_protective_factors,
          value: CommonOption.no,
        },
        { question: Question.alcohol_use_practitioner_analysis_risk_of_serious_harm, value: CommonOption.no },
        { question: Question.alcohol_use_practitioner_analysis_risk_of_reoffending, value: CommonOption.no },
      ])
      .withUserSubmittedSteps([Step.alcohol_use_details.code, Step.alcohol_use_summary.code])
      .save()

    // Reach the analysis page via the real flow: summary -> practitioner tab -> Mark as complete.
    await AlcoholUsePage.navigateTo(page, handoverLink, baseURL, sanAssessmentId, 'alcohol-use-summary')
    await page.getByRole('button', { name: 'Go to practitioner analysis' }).click()
    await page.getByRole('button', { name: 'Mark as complete' }).click()

    // Lands focused on the read only practitioner analysis tab, not the editable form.
    await expect(page).toHaveURL(/\/alcohol-use-analysis#practitioner-analysis$/)
    await expect(page.locator('#practitioner-analysis')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Mark as complete' })).toBeHidden()

    // The Summary tabs button returns to that same read only view on the same page.
    await page.getByRole('tab', { name: 'Summary' }).click()
    await page.getByRole('button', { name: 'Go to practitioner analysis' }).click()
    await expect(page.locator('#practitioner-analysis')).toBeVisible()
    await expect(page).toHaveURL(/\/alcohol-use-analysis#practitioner-analysis$/)
  })
})
