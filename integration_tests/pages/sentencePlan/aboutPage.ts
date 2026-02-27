import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from '../abstractPage'

export default class AboutPage extends AbstractPage {
  readonly pageHeading: Locator

  readonly incompleteAssessmentWarning: Locator

  readonly assessmentLastUpdated: Locator

  readonly sentenceHeading: Locator

  readonly sentenceTable: Locator

  readonly sentenceTableRows: Locator

  readonly noSentenceInfoWarning: Locator

  readonly noAssessmentDataWarning: Locator

  readonly incompleteAreasHeading: Locator

  readonly incompleteAreasAccordion: Locator

  readonly highScoringAreasHeading: Locator

  readonly highScoringAreasAccordion: Locator

  readonly lowScoringAreasHeading: Locator

  readonly lowScoringAreasAccordion: Locator

  readonly otherAreasHeading: Locator

  readonly otherAreasAccordion: Locator

  readonly returnToOasysButton: Locator

  readonly primaryNavigation: Locator

  private constructor(page: Page) {
    super(page)
    this.pageHeading = page.locator('h1')
    this.incompleteAssessmentWarning = page.getByTestId('incomplete-assessment-warning')
    this.assessmentLastUpdated = page.getByText(/assessment was last updated on/i)
    this.sentenceHeading = page.getByRole('heading', { name: 'Sentence information' })
    this.sentenceTable = page.getByTestId('sentence-table')
    this.sentenceTableRows = this.sentenceTable.locator('tbody tr')
    this.noSentenceInfoWarning = page.getByTestId('no-sentence-info-warning')
    this.noAssessmentDataWarning = page.getByTestId('no-assessment-data-warning')
    this.incompleteAreasHeading = page.getByRole('heading', { name: 'Incomplete areas' })
    this.incompleteAreasAccordion = page.locator('#incomplete-areas-accordion')
    this.highScoringAreasHeading = page.getByRole('heading', { name: 'High-scoring areas from the assessment' })
    this.highScoringAreasAccordion = page.locator('#high-scoring-areas-accordion')
    this.lowScoringAreasHeading = page.getByRole('heading', { name: 'Low-scoring areas from the assessment' })
    this.lowScoringAreasAccordion = page.locator('#low-scoring-areas-accordion')
    this.otherAreasHeading = page.getByRole('heading', { name: 'Areas without a need score' })
    this.otherAreasAccordion = page.locator('#other-areas-accordion')
    this.returnToOasysButton = page.getByRole('button', { name: /return to oasys/i })
    this.primaryNavigation = page.getByLabel('Primary navigation')
  }

  static async verifyOnPage(page: Page): Promise<AboutPage> {
    const aboutPage = new AboutPage(page)
    await expect(aboutPage.pageHeading).toContainText(/About|Sorry, there is a problem/i)
    return aboutPage
  }

  async getSentenceRowCount(): Promise<number> {
    return this.sentenceTableRows.count()
  }

  async getSentenceCellText(rowIndex: number, cellIndex: number): Promise<string> {
    const row = this.sentenceTableRows.nth(rowIndex)
    const cell = row.locator('td').nth(cellIndex)
    return (await cell.textContent()) ?? ''
  }

  async getAccordionSectionCount(accordion: Locator): Promise<number> {
    return accordion.locator('.govuk-accordion__section').count()
  }

  async expandAccordionSection(accordion: Locator, index: number): Promise<void> {
    const section = accordion.locator('.govuk-accordion__section').nth(index)
    const isExpanded = await section.getAttribute('class')
    if (!isExpanded?.includes('govuk-accordion__section--expanded')) {
      const button = section.locator('.govuk-accordion__section-button')
      await button.click()
    }
  }

  async accordionSectionHasBadge(accordion: Locator, index: number, badgeText: string): Promise<boolean> {
    const section = accordion.locator('.govuk-accordion__section').nth(index)
    const badge = section.locator('.moj-badge', { hasText: badgeText })
    return (await badge.count()) > 0
  }

  getCreateGoalLinkInSection(accordion: Locator, index: number): Locator {
    const section = accordion.locator('.govuk-accordion__section').nth(index)
    return section.locator('.add-goal-link a')
  }

  async clickCreateGoalInSection(accordion: Locator, index: number): Promise<void> {
    const link = this.getCreateGoalLinkInSection(accordion, index)
    await link.click()
  }

  getNoAreasMessage(sectionType: 'high-scoring' | 'low-scoring'): Locator {
    return this.page.getByText(new RegExp(`No ${sectionType} areas`, 'i'))
  }

  async getAccordionAreaTitles(accordion: Locator): Promise<string[]> {
    const sections = await accordion.locator('.govuk-accordion__section').all()

    return Promise.all(
      sections.map(async section => {
        const headingText = await section.locator('.govuk-accordion__section-heading-text').textContent()
        const heading = headingText ?? ''
        return heading.split('RoSH')[0].split('Risk of reoffending')[0].trim()
      }),
    )
  }
}
