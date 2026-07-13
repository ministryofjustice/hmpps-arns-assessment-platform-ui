import { expect } from '@playwright/test'
import HealthAndWellbeingPage from 'pages/strengthsAndNeeds/healthAndWellbeingPage'
import { test, TargetService } from '../../support/fixtures'
import { buildPageTitle, checkAccessibility, sanPageTitles } from './sanUtils'

test.describe('Health and wellbeing Page', () => {
  test.describe('Questions', () => {
    test('shows physical health and mental health', async ({
      page,
      createSession,
      strengthsAndNeedsBuilder,
      baseURL,
    }) => {
      const { handoverLink } = await createSession({ targetService: TargetService.STRENGTHS_AND_NEEDS })
      await strengthsAndNeedsBuilder.fresh().save()

      await HealthAndWellbeingPage.navigateToHealthAndWellbeing(page, handoverLink, baseURL)

      const healthAndWellbeingPage = await HealthAndWellbeingPage.verifyOnPage(page, 'any physical health conditions')

      await expect(page).toHaveTitle(buildPageTitle(sanPageTitles.healthAndWellbeing))

      await expect(healthAndWellbeingPage.currentEmploymentStatus).toMatchAriaSnapshot(`
          - group /have any physical health conditions?/:
            - text: /have any physical health conditions?/
            - radio "Yes"
            - text: "Yes"
            - radio "No"
            - text: "No"
            - radio "Unknown"
            - text: Unknown
          - group /have any diagnosed or documented mental health problems?/:
            - text: /have any diagnosed or documented mental health problems?/
            - radio "Yes, ongoing - severe and documented over a prolonged period of times"
            - text: Yes, ongoing - severe and documented over a prolonged period of times
            - radio "Yes, ongoing - duration is not known or there is no link to offending"
            - text: Yes, ongoing - duration is not known or there is no link to offending
            - radio "Yes, in the past"
            - text: Yes, in the past
            - radio "No"
            - text: "No"
            - radio "Unknown"
            - text: Unknown
          - button "Save and continue"
      `)
    })

    test('shows physical mental health questions', async ({
      page,
      createSession,
      strengthsAndNeedsBuilder,
      baseURL,
    }) => {
      const { handoverLink, sanAssessmentId } = await createSession({
        targetService: TargetService.STRENGTHS_AND_NEEDS,
      })
      await strengthsAndNeedsBuilder
        .extend(sanAssessmentId).withAnswers([
          { question: 'health_conditions', value: 'YES' },
          { question: 'has_health_conditions_details', value: '' },
          { question: 'mental_health_problems', value: 'YES_ONGOING_SEVERE' },
          { question: 'severe_mental_health_problems_details', value: '' },
        ]).save()

      await HealthAndWellbeingPage.navigateToHealthAndWellbeing(page, handoverLink, baseURL, 'physical-mental-health')

      const healthAndWellbeingPage = await HealthAndWellbeingPage.verifyOnPage(
        page,
        'physical health conditions (optional)',
      )

      await expect(healthAndWellbeingPage.mainSection).toMatchAriaSnapshot(`
        - text: Give details if Test is on prescribed medication or treatment for physical health conditions (optional)
        - textbox "Give details if Test is on prescribed medication or treatment for physical health conditions (optional)"
        - text: You can enter up to 2000 characters You have 2,000 characters remaining Give details if Test is on prescribed medication or treatment for mental health problems (optional)
        - textbox "Give details if Test is on prescribed medication or treatment for mental health problems (optional)"
        - text: You can enter up to 2000 characters You have 2,000 characters remaining
        - group "Is Test currently having psychiatric treatment?":
          - text: Is Test currently having psychiatric treatment?
          - radio "Yes"
          - text: "Yes"
          - radio "Pending treatment"
          - text: Pending treatment
          - radio "No"
          - text: "No"
          - radio "Unknown"
          - text: Unknown
        - group "Has Test had a head injury or any illness affecting the brain?":
          - text: Has Test had a head injury or any illness affecting the brain?
          - paragraph: "This includes:"
          - list:
            - listitem: traumatic brain injury
            - listitem: acquired brain injury
            - listitem: having fits
            - listitem: significant episodes of unconsciousness as a result of a head injury
          - radio "Yes"
          - text: "Yes"
          - radio "No"
          - text: "No"
          - radio "Unknown"
          - text: Unknown
        - group "Does Test have any neurodiverse conditions?":
          - text: Does Test have any neurodiverse conditions? Include diagnosis and neurodiverse characteristics.
          - radio "Yes"
          - text: "Yes"
          - radio "No"
          - text: "No"
          - radio "Unknown"
          - text: Unknown
        - group "Does Test have any conditions or disabilities that impact their ability to learn? (optional)":
          - text: Does Test have any conditions or disabilities that impact their ability to learn? (optional) This refers to both learning disabilities (reduced intellectual ability) and learning difficulties (such as dyslexia or ADHD).
          - radio "Yes, their ability to learn is significantly impacted"
          - text: Yes, their ability to learn is significantly impacted
          - radio "Yes, their ability to learn is slightly impacted"
          - text: Yes, their ability to learn is slightly impacted
          - radio "No, they do not have any conditions or disabilities that impact their ability to learn"
          - text: No, they do not have any conditions or disabilities that impact their ability to learn
        - group "Is Test able to cope with day-to-day life?":
          - text: Is Test able to cope with day-to-day life?
          - radio "Yes, able to cope well"
          - text: Yes, able to cope well
          - radio "Has some difficulties coping"
          - text: Has some difficulties coping
          - radio "Not able to cope"
          - text: Not able to cope
        - group "What is Test's attitude towards themselves?":
          - text: What is Test's attitude towards themselves?
          - radio "Positive and reasonably happy"
          - text: Positive and reasonably happy
          - radio "There are some aspects they would like to change or do not like"
          - text: There are some aspects they would like to change or do not like
          - radio "Negative self-image and unhappy"
          - text: Negative self-image and unhappy This includes if they have an overly positive or unrealistic self-image which in reality is not true.
        - group "Has Test ever self-harmed?":
          - text: Has Test ever self-harmed? Consider what factors or circumstances are associated and if it's recurring.
          - radio "Yes"
          - text: "Yes"
          - radio "No"
          - text: "No"
        - group "Has Test ever attempted suicide or had suicidal thoughts?":
          - text: Has Test ever attempted suicide or had suicidal thoughts? Consider what factors or circumstances are associated and if it's recurring.
          - radio "Yes"
          - text: "Yes"
          - radio "No"
          - text: "No"
        - group "How does Test feel about their future?":
          - text: How does Test feel about their future? Test must answer this question
          - radio "Optimistic and has a positive outlook about their future"
          - text: Optimistic and has a positive outlook about their future
          - radio "Not sure and thinks their future could get better or worse"
          - text: Not sure and thinks their future could get better or worse
          - radio "Not optimistic and thinks their future will not get better or may get worse"
          - text: Not optimistic and thinks their future will not get better or may get worse or
          - radio "Test does not want to answer"
          - text: Test does not want to answer
          - radio "Test is not present"
          - text: Test is not present
        - group "What's helped Test during periods of good health and wellbeing? (optional)":
          - text: What's helped Test during periods of good health and wellbeing? (optional) Consider what's helped them feel more hopeful. Select all that apply.
          - checkbox "Accommodation"
          - text: Accommodation
          - checkbox "Employment"
          - text: Employment
          - checkbox "Faith or religion"
          - text: Faith or religion
          - checkbox "Feeling part of a community or giving back"
          - text: Feeling part of a community or giving back
          - checkbox "Medication and treatment"
          - text: Medication and treatment
          - checkbox "Money"
          - text: Money
          - checkbox "Relationships"
          - text: Relationships
          - checkbox "Other"
          - text: Other
        - group "Does Test want to make changes to their health and wellbeing?":
          - text: Does Test want to make changes to their health and wellbeing? Test must answer this question.
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

    test('shows no physical mental health questions', async ({
      page,
      createSession,
      strengthsAndNeedsBuilder,
      baseURL,
    }) => {
      const { handoverLink, sanAssessmentId } = await createSession({
        targetService: TargetService.STRENGTHS_AND_NEEDS,
      })
      await strengthsAndNeedsBuilder
        .extend(sanAssessmentId).withAnswers([
          { question: 'health_conditions', value: 'NO' },
          { question: 'mental_health_problems', value: 'NO' },
        ]).save()

      await HealthAndWellbeingPage.navigateToHealthAndWellbeing(page, handoverLink, baseURL, 'physical-mental-health')

      const healthAndWellbeingPage = await HealthAndWellbeingPage.verifyOnPage(page, 'any illness affecting the brain')

      await expect(healthAndWellbeingPage.mainSection).toMatchAriaSnapshot(`
        - /children: equal
        - link "Back"
        - text: Health and wellbeing
        - strong: Incomplete
        - group "Has Test had a head injury or any illness affecting the brain?"
        - group "Does Test have any neurodiverse conditions?"
        - group "Does Test have any conditions or disabilities that impact their ability to learn? (optional)"
        - group "Is Test able to cope with day-to-day life?"
        - group "What is Test's attitude towards themselves?"
        - group "Has Test ever self-harmed?"
        - group "Has Test ever attempted suicide or had suicidal thoughts?"
        - group "How does Test feel about their future?"
        - group "What's helped Test during periods of good health and wellbeing? (optional)"
        - group "Does Test want to make changes to their health and wellbeing?"
        - button "Save and continue"
      `)
    })
  })

  test.describe('Accessibility', () => {
    test('should be accessible', async ({ page, createSession, baseURL }) => {
      const { handoverLink } = await createSession({ targetService: TargetService.STRENGTHS_AND_NEEDS })

      await HealthAndWellbeingPage.navigateToHealthAndWellbeing(page, handoverLink, baseURL)
      await checkAccessibility(page, {
        // https://github.com/alphagov/govuk-design-system-backlog/issues/59#issuecomment-2854891330
        disableRules: ['aria-allowed-attr'],
      })
    })
  })
})
