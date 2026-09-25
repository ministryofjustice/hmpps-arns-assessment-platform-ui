import { CommonOption } from '@server/forms/strengths-and-needs/versions/v1.0/constants/commonOption'
import { Option } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/alcohol-use/constants/option'
import { Question } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/alcohol-use/constants/question'
import { expect } from '@playwright/test'
import AlcoholUsePage from 'pages/strengthsAndNeeds/alcoholUsePage'
import { test, TargetService } from '../../../support/fixtures'
import { buildPageTitle, sanPageTitles } from '../sanUtils'

test.describe('Questions', () => {
  test('shows the alcohol use question', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder.fresh().save()

    await AlcoholUsePage.navigateTo(page, handoverLink, baseURL, sanAssessmentId)

    const alcoholUsePage = await AlcoholUsePage.verifyOnPage(page, 'Has Test ever drunk alcohol?')

    await expect(page).toHaveTitle(buildPageTitle(sanPageTitles.alcoholUse))

    await expect(alcoholUsePage.mainForm).toMatchAriaSnapshot(`
      - group /Has Test ever drunk alcohol?/:
        - text: /Has Test ever drunk alcohol?/
        - radio "Yes, including the last 3 months"
        - text: Yes, including the last 3 months
        - radio "Yes, but not in the last 3 months"
        - text: Yes, but not in the last 3 months
        - radio "No"
        - text: "No"
      - button "Save and continue"
    `)
  })

  test('shows the questions when they have drunk alcohol in the last 3 months', async ({
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
      .withAnswers([{ question: Question.alcohol_use, value: Option.yes_within_last_three_months }])
      .withAnswers([{ question: Question.alcohol_binge_drinking, value: 'YES' }])
      .save()

    await AlcoholUsePage.navigateTo(page, handoverLink, baseURL, sanAssessmentId, 'alcohol-use-details')
    const alcoholUsePage = await AlcoholUsePage.verifyOnPage(page, 'Alcohol use')
    await page.getByText('Help with alcohol units').click()

    await expect(alcoholUsePage.mainForm).toMatchAriaSnapshot(`
      - group "How often has Test drunk alcohol in the last 3 months?":
        - text: How often has Test drunk alcohol in the last 3 months?
        - radio "Once a month or less"
        - text: Once a month or less
        - radio "2 to 4 times a month"
        - text: 2 to 4 times a month
        - radio "2 to 3 times a week"
        - text: 2 to 3 times a week
        - radio "More than 4 times a week"
        - text: More than 4 times a week
      - group "How many units of alcohol does Test have on a typical day of drinking?":
        - text: How many units of alcohol does Test have on a typical day of drinking?
        - group:
          - text: Help with alcohol units
          - table:
            - rowgroup:
              - row "Type of drink Number of alcohol units":
                - columnheader "Type of drink"
                - columnheader "Number of alcohol units"
            - rowgroup:
              - row "Single small shot of spirits (25ml, ABV 40%) For example, whisky or vodka. 1 unit":
                - cell "Single small shot of spirits (25ml, ABV 40%) For example, whisky or vodka."
                - cell "1 unit"
              - row "Alcopop (275ml, ABV 5.5%) 1.5 units":
                - cell "Alcopop (275ml, ABV 5.5%)"
                - cell "1.5 units"
              - row "Small glass of red/white/rosé wine (125ml, ABV 12%) 1.5 units":
                - cell "Small glass of red/white/rosé wine (125ml, ABV 12%)"
                - cell "1.5 units"
              - row "Bottle of lager/beer/cider (330ml, ABV 5%) 1.7 units":
                - cell "Bottle of lager/beer/cider (330ml, ABV 5%)"
                - cell "1.7 units"
              - row "Can of lager/beer/cider (440ml, ABV 5.5%) 2.4 units":
                - cell "Can of lager/beer/cider (440ml, ABV 5.5%)"
                - cell "2.4 units"
              - row "Pint of lower-strength lager/ beer/cider (ABV 3.6%) 2 units":
                - cell "Pint of lower-strength lager/ beer/cider (ABV 3.6%)"
                - cell "2 units"
              - row "Standard glass of red/white/rosé wine (175ml, ABV 12%) 2.1 units":
                - cell "Standard glass of red/white/rosé wine (175ml, ABV 12%)"
                - cell "2.1 units"
              - row "Pint of higher-strength lager/ beer/cider (ABV 5.2%) 3 units":
                - cell "Pint of higher-strength lager/ beer/cider (ABV 5.2%)"
                - cell "3 units"
              - row "Large glass of red/white/rosé wine (250ml, ABV 12%) 3 units":
                - cell "Large glass of red/white/rosé wine (250ml, ABV 12%)"
                - cell "3 units"
        - radio "1 to 2 units"
        - text: 1 to 2 units
        - radio "3 to 4 units"
        - text: 3 to 4 units
        - radio "5 to 6 units"
        - text: 5 to 6 units
        - radio "7 to 9 units"
        - text: 7 to 9 units
        - radio "10 or more units"
        - text: 10 or more units
      - group "Has Test had 8 or more units within a single day of drinking in the last 3 months?":
        - text: Has Test had 8 or more units within a single day of drinking in the last 3 months?
        - radio "Yes" [checked]
        - text: "Yes"
        - group "Select how often":
          - text: Select how often
          - radio "Less than a month"
          - text: Less than a month
          - radio "Monthly"
          - text: Monthly
          - radio "Weekly"
          - text: Weekly
          - radio "Daily or almost daily"
          - text: Daily or almost daily
        - radio "No"
        - text: "No"
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
      - group "Why does Test drink alcohol?":
        - text: Why does Test drink alcohol? Select all that apply.
        - checkbox "Cultural or religious practice"
        - text: Cultural or religious practice
        - checkbox "Curiosity or experimentation"
        - text: Curiosity or experimentation
        - checkbox "Enjoyment"
        - text: Enjoyment
        - checkbox "Manage stress or emotional issues"
        - text: Manage stress or emotional issues
        - checkbox "On special occasions"
        - text: On special occasions
        - checkbox "Peer pressure or social influence"
        - text: Peer pressure or social influence
        - checkbox "Self-medication or mood altering"
        - text: Self-medication or mood altering Includes pain management or emotional regulation.
        - checkbox "Socially"
        - text: Socially
        - checkbox "Other"
        - text: Other
      - group "What's the impact of Test drinking alcohol?":
        - text: What's the impact of Test drinking alcohol? Select all that apply.
        - checkbox "Behavioural"
        - text: Behavioural Includes unemployment, disruption on education or lack of productivity.
        - checkbox "Community"
        - text: Community Includes limited opportunities or judgement from others.
        - checkbox "Finances"
        - text: Finances Includes having no money or difficulties.
        - checkbox "Links to offending"
        - text: Links to offending
        - checkbox "Physical or mental health"
        - text: Physical or mental health Includes overdose.
        - checkbox "Relationships"
        - text: Relationships Includes isolation or neglecting responsibilities.
        - checkbox "Other"
        - text: Other or
        - checkbox "No impact"
        - text: No impact
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
      - button "Save and continue"`)
  })

  test('hides the last-3-months questions when they have not drunk alcohol recently', async ({
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
      .withAnswers([{ question: Question.alcohol_use, value: Option.yes_not_in_last_three_months }])
      .save()

    await AlcoholUsePage.navigateTo(page, handoverLink, baseURL, sanAssessmentId, 'alcohol-use-details')
    const alcoholUsePage = await AlcoholUsePage.verifyOnPage(page, 'Alcohol use')

    await expect(alcoholUsePage.mainForm).toMatchAriaSnapshot(`
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
      - group "Why does Test drink alcohol?":
        - text: Why does Test drink alcohol? Select all that apply.
        - checkbox "Cultural or religious practice"
        - text: Cultural or religious practice
        - checkbox "Curiosity or experimentation"
        - text: Curiosity or experimentation
        - checkbox "Enjoyment"
        - text: Enjoyment
        - checkbox "Manage stress or emotional issues"
        - text: Manage stress or emotional issues
        - checkbox "On special occasions"
        - text: On special occasions
        - checkbox "Peer pressure or social influence"
        - text: Peer pressure or social influence
        - checkbox "Self-medication or mood altering"
        - text: Self-medication or mood altering Includes pain management or emotional regulation.
        - checkbox "Socially"
        - text: Socially
        - checkbox "Other"
        - text: Other
      - group "What's the impact of Test drinking alcohol?":
        - text: What's the impact of Test drinking alcohol? Select all that apply.
        - checkbox "Behavioural"
        - text: Behavioural Includes unemployment, disruption on education or lack of productivity.
        - checkbox "Community"
        - text: Community Includes limited opportunities or judgement from others.
        - checkbox "Finances"
        - text: Finances Includes having no money or difficulties.
        - checkbox "Links to offending"
        - text: Links to offending
        - checkbox "Physical or mental health"
        - text: Physical or mental health Includes overdose.
        - checkbox "Relationships"
        - text: Relationships Includes isolation or neglecting responsibilities.
        - checkbox "Other"
        - text: Other or
        - checkbox "No impact"
        - text: No impact
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
      - button "Save and continue"`)

  })

  test('shows a minimal summary and no usage questions when they have never drunk alcohol', async ({
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
      .withAnswers([{ question: Question.alcohol_use, value: CommonOption.no }])
      .save()

    // "No" skips the usage questions and routes straight to the summary.
    await AlcoholUsePage.navigateTo(page, handoverLink, baseURL, sanAssessmentId, 'alcohol-use-summary')

    const alcoholUsePage = await AlcoholUsePage.verifyOnPage(page, 'Alcohol use')

    await expect(alcoholUsePage.summary).toMatchAriaSnapshot(`
      - tabpanel "Summary":
        - term: Has Test ever drunk alcohol?
        - definition:
          - paragraph: "No"
        - definition:
          - link "Change Has Test ever drunk alcohol?":
            - /url: alcohol-use#alcohol_use-question
        - button "Go to practitioner analysis"
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
        { question: Question.alcohol_use, value: CommonOption.no },
        {
          question: Question.alcohol_use_practitioner_analysis_strengths_or_protective_factors,
          value: CommonOption.no,
        },
        { question: Question.alcohol_use_practitioner_analysis_risk_of_serious_harm, value: CommonOption.no },
        { question: Question.alcohol_use_practitioner_analysis_risk_of_reoffending, value: CommonOption.no },
      ])
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

  test('reveals the details field when a past issue with alcohol is selected', async ({
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
        { question: Question.alcohol_use, value: Option.yes_not_in_last_three_months },
        { question: Question.alcohol_past_issues, value: CommonOption.yes },
      ])
      .save()

    await AlcoholUsePage.navigateTo(page, handoverLink, baseURL, sanAssessmentId, 'alcohol-use-details')

    await expect(page.getByRole('textbox', { name: 'Give details' }).first()).toBeVisible()
  })
})
