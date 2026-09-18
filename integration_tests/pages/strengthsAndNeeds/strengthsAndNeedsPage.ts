import { expect, Locator, Page } from '@playwright/test'
import { questionIdOf } from '@server/forms/strengths-and-needs/constants/questionContent'
import { navigateToStrengthsAndNeeds, sanFormPath, v1Path } from 'specs/strengthsAndNeeds/sanUtils'
import AbstractPage from '../abstractPage'

type PageQuestion = {
  input: Locator
  errorLink: Locator
  option: (label: string) => Locator
}

/** A section's questions, keyed by server question code. Templated codes (`..._%1`) take the value to fill in. */
type Questions<Codes extends Record<string, string>> = {
  [Key in keyof Codes]: Codes[Key] extends `${string}%1${string}` ? (value: string) => PageQuestion : PageQuestion
}

export default class StrengthsAndNeedsPage extends AbstractPage {
  static readonly section: string

  static readonly firstStep: string

  readonly complete = this.page.locator('[data-complete="YES"]')

  readonly mainForm = this.page.getByTestId('main-form')

  /**
   * Opens the assessment via the handover link, handling the privacy screen, then goes to a step
   * of the page object's section (its first step by default).
   */
  static async navigateTo(
    page: Page,
    handoverLink: string,
    baseUrl: string,
    assessmentId: string,
    step: string = this.firstStep,
  ): Promise<void> {
    await navigateToStrengthsAndNeeds(page, handoverLink)
    await page.goto(`${baseUrl}${sanFormPath}${v1Path}/edit/${assessmentId}${this.section}/${step}`)
    expect(page.url()).toContain(step)
  }

  /** Checks the page shows the heading, and returns the page object for it. */
  static async verifyOnPage<SectionPage extends StrengthsAndNeedsPage>(
    this: new (page: Page) => SectionPage,
    page: Page,
    heading: string,
  ): Promise<SectionPage> {
    const sectionPage = new this(page)
    await expect(page.getByText(heading)).toBeVisible()
    return sectionPage
  }

  /** A question, by its server question code */
  protected question(code: string): PageQuestion {
    const root = this.page.locator(`#${questionIdOf(code)}`)
    return {
      input: this.page.locator(`#${code}`),
      errorLink: this.alert.locator(`a[href="#${code}"]`),
      option: label =>
        root
          .getByRole('radio', { name: label, exact: true })
          .or(root.getByRole('checkbox', { name: label, exact: true })),
    }
  }

  /** Every question in a section's server question codes */
  protected questionsOf<const Codes extends Record<string, string>>(codes: Codes): Questions<Codes> {
    const questionFor = (code: string) => {
      if (code.includes('%1')) {
        return (value: string) => this.question(code.replace('%1', value.toLowerCase()))
      }

      return this.question(code)
    }

    return Object.fromEntries(Object.entries(codes).map(([key, code]) => [key, questionFor(code)])) as Questions<Codes>
  }
}
