import { expect, type Page } from '@playwright/test'
import { test, TargetService, type SessionFixture } from '../../../support/fixtures'
import type { SentencePlanBuilderFactory } from '../../../builders/SentencePlanBuilder'
import AboutPage from '../../../pages/sentencePlan/aboutPage'
import { navigateToAboutPage } from '../sentencePlanUtils'
import coordinatorApi from '../../../mockApis/coordinatorApi'
import { createAssessmentData, type AreaOverrides } from '../../../builders/AssessmentDataFactories'

const setupAboutPage = async (
  page: Page,
  session: SessionFixture,
  sentencePlanBuilder: SentencePlanBuilderFactory,
  areaOverrides: AreaOverrides = {},
) => {
  await sentencePlanBuilder.extend(session.sentencePlanId).save()
  await coordinatorApi.stubGetEntityAssessment(session.sentencePlanId, {
    sanAssessmentData: createAssessmentData('incomplete', areaOverrides),
  })
  await navigateToAboutPage(page, session.handoverLink)
}

test.describe('About Page: incomplete assessment state', () => {
  test.describe('with default incomplete assessment data', () => {
    test.beforeEach(async ({ page, createSession, sentencePlanBuilder }) => {
      const session = await createSession({
        targetService: TargetService.SENTENCE_PLAN,
        assessmentType: 'SAN_SP',
      })
      await setupAboutPage(page, session, sentencePlanBuilder)
    })

    test.describe('Warning Banner', () => {
      test('displays incomplete assessment warning banner', async ({ page }) => {
        const aboutPage = await AboutPage.verifyOnPage(page)
        await expect(aboutPage.incompleteAssessmentWarning).toBeVisible()
      })
    })

    test.describe('Incomplete Areas Section', () => {
      test('displays incomplete areas heading', async ({ page }) => {
        const aboutPage = await AboutPage.verifyOnPage(page)
        await expect(aboutPage.incompleteAreasHeading).toBeVisible()
        await expect(aboutPage.incompleteAreasHeading).toHaveText('Incomplete areas')
      })

      test('displays incomplete areas accordion', async ({ page }) => {
        const aboutPage = await AboutPage.verifyOnPage(page)
        await expect(aboutPage.incompleteAreasAccordion).toBeVisible()
      })

      // incomplete areas from default 'incomplete' config: Drug use, Employment and education, Thinking, Finances, Health and wellbeing
      // sorted alphabetically
      test('displays incomplete areas in alphabetical order', async ({ page }) => {
        const aboutPage = await AboutPage.verifyOnPage(page)
        const incompleteAreas = await aboutPage.getAccordionAreaTitles(aboutPage.incompleteAreasAccordion)

        expect(incompleteAreas).toEqual([
          'Drug use',
          'Employment and education',
          'Finances',
          'Health and wellbeing',
          'Thinking, behaviours and attitudes',
        ])
      })
    })

    test.describe('No areas in section messages', () => {
      test('shows "No high-scoring areas at the moment." message when none exist', async ({
        page,
        createSession,
        sentencePlanBuilder,
      }) => {
        const session = await createSession({
          targetService: TargetService.SENTENCE_PLAN,
          assessmentType: 'SAN_SP',
          criminogenicNeedsData: {
            accommodation: {
              accLinkedToHarm: 'NO',
              accLinkedToReoffending: 'NO',
              accStrengths: 'NO',
              accOtherWeightedScore: '1',
            },
            educationTrainingEmployability: {
              eteLinkedToHarm: 'NO',
              eteLinkedToReoffending: 'NO',
              eteStrengths: 'NO',
              eteOtherWeightedScore: '0',
            },
            drugMisuse: {
              drugLinkedToHarm: 'NO',
              drugLinkedToReoffending: 'NO',
              drugStrengths: 'NO',
              drugOtherWeightedScore: '0',
            },
            alcoholMisuse: {
              alcoholLinkedToHarm: 'NO',
              alcoholLinkedToReoffending: 'NO',
              alcoholStrengths: 'NO',
              alcoholOtherWeightedScore: '1',
            },
            personalRelationshipsAndCommunity: {
              relLinkedToHarm: 'NO',
              relLinkedToReoffending: 'NO',
              relStrengths: 'NO',
              relOtherWeightedScore: '0',
            },
            thinkingBehaviourAndAttitudes: {
              thinkLinkedToHarm: 'NO',
              thinkLinkedToReoffending: 'NO',
              thinkStrengths: 'NO',
              thinkOtherWeightedScore: '0',
            },
          },
        })
        await setupAboutPage(page, session, sentencePlanBuilder)

        const aboutPage = await AboutPage.verifyOnPage(page)
        await expect(aboutPage.highScoringAreasHeading).toBeVisible()
        await expect(aboutPage.getNoAreasMessage('high-scoring')).toBeVisible()
        await expect(aboutPage.getNoAreasMessage('high-scoring')).toHaveText('No high-scoring areas at the moment.')
      })

      test('shows "No low-scoring areas" message when none exist', async ({
        page,
        createSession,
        sentencePlanBuilder,
      }) => {
        const session = await createSession({
          targetService: TargetService.SENTENCE_PLAN,
          assessmentType: 'SAN_SP',
          criminogenicNeedsData: {
            accommodation: {
              accLinkedToHarm: 'YES',
              accLinkedToReoffending: 'YES',
              accStrengths: 'NO',
              accOtherWeightedScore: '3',
            },
            educationTrainingEmployability: {
              eteLinkedToHarm: 'YES',
              eteLinkedToReoffending: 'YES',
              eteStrengths: 'NO',
              eteOtherWeightedScore: '6',
            },
            drugMisuse: {
              drugLinkedToHarm: 'YES',
              drugLinkedToReoffending: 'YES',
              drugStrengths: 'NO',
              drugOtherWeightedScore: '6',
            },
            alcoholMisuse: {
              alcoholLinkedToHarm: 'YES',
              alcoholLinkedToReoffending: 'YES',
              alcoholStrengths: 'NO',
              alcoholOtherWeightedScore: '3',
            },
            personalRelationshipsAndCommunity: {
              relLinkedToHarm: 'YES',
              relLinkedToReoffending: 'YES',
              relStrengths: 'NO',
              relOtherWeightedScore: '6',
            },
            thinkingBehaviourAndAttitudes: {
              thinkLinkedToHarm: 'YES',
              thinkLinkedToReoffending: 'YES',
              thinkStrengths: 'NO',
              thinkOtherWeightedScore: '4',
            },
          },
        })
        await setupAboutPage(page, session, sentencePlanBuilder)

        const aboutPage = await AboutPage.verifyOnPage(page)
        await expect(aboutPage.lowScoringAreasHeading).toBeVisible()
        await expect(aboutPage.getNoAreasMessage('low-scoring')).toBeVisible()
        await expect(aboutPage.getNoAreasMessage('low-scoring')).toHaveText('No low-scoring areas at the moment.')
      })
    })
  })
})
