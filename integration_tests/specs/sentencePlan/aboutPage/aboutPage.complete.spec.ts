import { expect, type Page } from '@playwright/test'
import type { CriminogenicNeedsData } from '@server/interfaces/handover-api/shared'
import { test, TargetService, type SessionFixture } from '../../../support/fixtures'
import type { SentencePlanBuilderFactory } from '../../../builders/SentencePlanBuilder'
import AboutPage from '../../../pages/sentencePlan/aboutPage'
import { navigateToAboutPage } from '../sentencePlanUtils'
import coordinatorApi from '../../../mockApis/coordinatorApi'
import {
  createAssessmentData,
  type AssessmentCompleteness,
  type AreaOverrides,
} from '../../../builders/AssessmentDataFactories'
import CreateGoalPage from '../../../pages/sentencePlan/createGoalPage'

const setupAboutPage = async (
  page: Page,
  session: SessionFixture,
  sentencePlanBuilder: SentencePlanBuilderFactory,
  completeness: AssessmentCompleteness = 'complete',
  areaOverrides: AreaOverrides = {},
) => {
  await sentencePlanBuilder.extend(session.sentencePlanId).save()
  await coordinatorApi.stubGetEntityAssessment(session.sentencePlanId, {
    sanAssessmentData: createAssessmentData(completeness, areaOverrides),
  })
  await navigateToAboutPage(page, session.handoverLink)
}

test.describe('About Page: complete assessment state', () => {
  test.describe('with default and custom criminogenic needs data', () => {
    test.beforeEach(async ({ page, createSession, sentencePlanBuilder }) => {
      const session = await createSession({
        targetService: TargetService.SENTENCE_PLAN,
        assessmentType: 'SAN_SP',
      })
      await setupAboutPage(page, session, sentencePlanBuilder)
    })

    test.describe('Page Layout', () => {
      test('displays page heading with person name', async ({ page }) => {
        const aboutPage = await AboutPage.verifyOnPage(page)
        await expect(aboutPage.pageHeading).toContainText('About Test')
      })

      test('does not show incomplete assessment warning when all sections complete', async ({ page }) => {
        const aboutPage = await AboutPage.verifyOnPage(page)
        await expect(aboutPage.incompleteAssessmentWarning).not.toBeVisible()
      })

      test('displays assessment last updated date', async ({ page }) => {
        const aboutPage = await AboutPage.verifyOnPage(page)
        await expect(aboutPage.assessmentLastUpdated).toBeVisible()
      })

      test('does not show incomplete areas section when all sections complete', async ({ page }) => {
        const aboutPage = await AboutPage.verifyOnPage(page)
        await expect(aboutPage.incompleteAreasHeading).not.toBeVisible()
        await expect(aboutPage.incompleteAreasAccordion).not.toBeVisible()
      })
    })

    // sentence information from default wiremock stub:
    // - "Custodial Sentence", 2024-11-06 to 2029-01-12, 10 unpaid work hours, 3 RAR days
    // - "ORA Community Order", 2024-11-19 to 2025-05-18, 0 unpaid work hours, no RAR
    test.describe('Sentence Information table', () => {
      test('displays sentence table with correct headers and both sentences', async ({ page }) => {
        const aboutPage = await AboutPage.verifyOnPage(page)

        await expect(aboutPage.sentenceHeading).toBeVisible()
        await expect(aboutPage.sentenceTable).toBeVisible()

        await expect(aboutPage.sentenceTable.getByRole('columnheader', { name: 'Sentence' })).toBeVisible()
        await expect(aboutPage.sentenceTable.getByRole('columnheader', { name: 'Expected end date' })).toBeVisible()
        await expect(aboutPage.sentenceTable.getByRole('columnheader', { name: 'Unpaid work' })).toBeVisible()
        await expect(
          aboutPage.sentenceTable.getByRole('columnheader', { name: 'RAR (Rehabilitation activity requirement)' }),
        ).toBeVisible()

        const rowCount = await aboutPage.getSentenceRowCount()
        expect(rowCount).toBe(2)
      })

      test('displays first sentence with description and duration, end date, unpaid work hours and RAR days', async ({
        page,
      }) => {
        const aboutPage = await AboutPage.verifyOnPage(page)

        const sentenceCell = await aboutPage.getSentenceCellText(0, 0)
        expect(sentenceCell).toContain('Custodial Sentence')
        expect(sentenceCell).toContain('(4 years, 2 months and 6 days)')

        const endDateCell = await aboutPage.getSentenceCellText(0, 1)
        expect(endDateCell).toBe('12 January 2029')

        const unpaidWorkCell = await aboutPage.getSentenceCellText(0, 2)
        expect(unpaidWorkCell).toBe('10 hours')

        const rarCell = await aboutPage.getSentenceCellText(0, 3)
        expect(rarCell).toBe('3 days')
      })

      test('displays second sentence with description and duration, end date, unpaid work hours and RAR days', async ({
        page,
      }) => {
        const aboutPage = await AboutPage.verifyOnPage(page)

        const sentenceCell = await aboutPage.getSentenceCellText(1, 0)
        expect(sentenceCell).toContain('ORA Community Order')
        expect(sentenceCell).toContain('(5 months and 29 days)')

        const endDateCell = await aboutPage.getSentenceCellText(1, 1)
        expect(endDateCell).toBe('18 May 2025')

        const unpaidWorkCell = await aboutPage.getSentenceCellText(1, 2)
        expect(unpaidWorkCell).toBe('No')

        const rarCell = await aboutPage.getSentenceCellText(1, 3)
        expect(rarCell).toBe('No')
      })
    })

    test.describe('Assessment Area Sections', () => {
      test("displays area sections' headings", async ({ page }) => {
        const aboutPage = await AboutPage.verifyOnPage(page)
        await expect(aboutPage.highScoringAreasHeading).toBeVisible()
        await expect(aboutPage.lowScoringAreasHeading).toBeVisible()
        await expect(aboutPage.otherAreasHeading).toBeVisible()
      })

      test('accordion sections contain create goal link when expanded', async ({ page }) => {
        const aboutPage = await AboutPage.verifyOnPage(page)

        const sectionAreasCount = await aboutPage.getAccordionSectionCount(aboutPage.highScoringAreasAccordion)
        if (sectionAreasCount > 0) {
          await aboutPage.expandAccordionSection(aboutPage.highScoringAreasAccordion, 0)

          const createGoalLink = aboutPage.getCreateGoalLinkInSection(aboutPage.highScoringAreasAccordion, 0)
          await expect(createGoalLink).toBeVisible()
          await expect(createGoalLink).toHaveText(/Create .+ goal/i)

          await aboutPage.clickCreateGoalInSection(aboutPage.highScoringAreasAccordion, 0)
          await CreateGoalPage.verifyOnPage(page)
          await expect(page.locator('.govuk-caption-l')).toContainText('Drug use')
        }
      })

      test('accordion sections display correct risk badges', async ({ page }) => {
        const aboutPage = await AboutPage.verifyOnPage(page)

        const hasRoshBadge = await aboutPage.accordionSectionHasBadge(
          aboutPage.highScoringAreasAccordion,
          0,
          'RoSH (Risk of Serious Harm)',
        )
        const hasReoffendingBadge = await aboutPage.accordionSectionHasBadge(
          aboutPage.highScoringAreasAccordion,
          0,
          'Risk of reoffending',
        )
        expect(hasRoshBadge).toBe(true)
        expect(hasReoffendingBadge).toBe(true)
      })

      test('displays text for other areas section', async ({ page }) => {
        const aboutPage = await AboutPage.verifyOnPage(page)
        await expect(aboutPage.otherAreasHeading).toHaveText('Areas without a need score')
        await expect(
          page.getByText(
            'Health and wellbeing, and finances never have a need score. When other information is available for those areas, you can see it here.',
          ),
        ).toBeVisible()
      })

      // also tests: lifestyle sub-area pushing thinking to high-scoring and affecting sort order
      test('applies sorting criteria correctly: risk flags then score distance then alphabetical', async ({
        page,
        createSession,
        sentencePlanBuilder,
      }) => {
        // tier 3 (RoSH AND Reoffending):
        //   - Accommodation: distance 5
        //   - Drug use: distance 5 (alphabetical: A < D)
        // tier 2 (RoSH only):
        //   - Alcohol use: distance 4
        //   - Thinking: distance 4 - main score 2 at threshold, but lifestyle (score 4, threshold 1) pushes to high-scoring
        // tier 1 (Reoffending only):
        //   - Employment: distance 3
        // tier 0 (no flags):
        //   - Personal relationships: distance 5
        const criminogenicNeedsData: CriminogenicNeedsData = {
          accommodation: {
            accLinkedToHarm: 'YES',
            accLinkedToReoffending: 'YES', // tier 3
            accStrengths: 'NO',
            accOtherWeightedScore: '6', // threshold 1, distance = 5
          },
          educationTrainingEmployability: {
            eteLinkedToHarm: 'NO',
            eteLinkedToReoffending: 'YES', // tier 1
            eteStrengths: 'NO',
            eteOtherWeightedScore: '4', // threshold 1, distance = 3
          },
          drugMisuse: {
            drugLinkedToHarm: 'YES',
            drugLinkedToReoffending: 'YES', // tier 3
            drugStrengths: 'NO',
            drugOtherWeightedScore: '5', // threshold 0, distance = 5
          },
          alcoholMisuse: {
            alcoholLinkedToHarm: 'YES',
            alcoholLinkedToReoffending: 'NO', // tier 2
            alcoholStrengths: 'NO',
            alcoholOtherWeightedScore: '5', // threshold 1, distance = 4
          },
          personalRelationshipsAndCommunity: {
            relLinkedToHarm: 'NO',
            relLinkedToReoffending: 'NO', // tier 0
            relStrengths: 'NO',
            relOtherWeightedScore: '6', // threshold 1, distance = 5
          },
          thinkingBehaviourAndAttitudes: {
            thinkLinkedToHarm: 'YES',
            thinkLinkedToReoffending: 'NO', // tier 2
            thinkStrengths: 'NO',
            thinkOtherWeightedScore: '2', // at threshold 2, main distance = 0 (would be low-scoring alone)
          },
          lifestyleAndAssociates: {
            lifestyleLinkedToHarm: 'YES',
            lifestyleLinkedToReoffending: 'NO',
            lifestyleStrengths: 'NO',
            lifestyleOtherWeightedScore: '4', // above threshold 1, sub distance = 3, pushes thinking to high-scoring
          },
          finance: {
            financeLinkedToHarm: 'NO',
            financeLinkedToReoffending: 'NO',
            financeStrengths: 'NO',
          },
          healthAndWellbeing: {
            emoLinkedToHarm: 'NO',
            emoLinkedToReoffending: 'NO',
            emoStrengths: 'NO',
          },
        }

        const session = await createSession({
          targetService: TargetService.SENTENCE_PLAN,
          assessmentType: 'SAN_SP',
          criminogenicNeedsData,
        })
        await setupAboutPage(page, session, sentencePlanBuilder)

        const aboutPage = await AboutPage.verifyOnPage(page)
        const highScoringAreas = await aboutPage.getAccordionAreaTitles(aboutPage.highScoringAreasAccordion)

        // expected order applying all criteria:
        // tier 3: Accommodation (d=5) then Drug use (d=5, alphabetical: A < D)
        // tier 2: Alcohol use (d=4) then Thinking (effective d=3 from lifestyle)
        // tier 1: Employment (d=3)
        // tier 0: Personal relationships (d=5)
        expect(highScoringAreas).toEqual([
          'Accommodation',
          'Drug use',
          'Alcohol use',
          'Thinking, behaviours and attitudes',
          'Employment and education',
          'Personal relationships and community',
        ])

        const otherAreas = await aboutPage.getAccordionAreaTitles(aboutPage.otherAreasAccordion)
        expect(otherAreas).toEqual(['Finances', 'Health and wellbeing'])
      })
    })
  })

  test.describe('no areas in section messages', () => {
    test('shows "No high-scoring areas." message when none exist', async ({
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
            accOtherWeightedScore: '0',
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
            alcoholOtherWeightedScore: '0',
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
      await expect(aboutPage.getNoAreasMessage('high-scoring')).toHaveText('No high-scoring areas.')
    })

    test('shows "No low-scoring areas." message when none exist', async ({
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
            accOtherWeightedScore: '6',
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
            alcoholOtherWeightedScore: '6',
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
            thinkOtherWeightedScore: '6',
          },
        },
      })
      await setupAboutPage(page, session, sentencePlanBuilder)

      const aboutPage = await AboutPage.verifyOnPage(page)
      await expect(aboutPage.lowScoringAreasHeading).toBeVisible()
      await expect(aboutPage.getNoAreasMessage('low-scoring')).toBeVisible()
      await expect(aboutPage.getNoAreasMessage('low-scoring')).toHaveText('No low-scoring areas.')
    })
  })
})
