import { CommonOption } from '@server/forms/strengths-and-needs/versions/v1.0/constants/commonOption'
import { Section } from '@server/forms/strengths-and-needs/versions/v1.0/constants/section'
import { AxeBuilder } from '@axe-core/playwright'
import { expect, Page } from '@playwright/test'
import PrivacyScreenPage from '../../pages/sentencePlan/privacyScreenPage'

// strengths and needs V1 URLs for use in playwright testing suits:
export const sanFormPath = '/strengths-and-needs'
export const v1Path = '/v1.0'
const privacyStepPath = '/privacy'
export const accommodation = Section.accommodation.path
export const employment = Section.employment_and_education.path
export const health = Section.health_and_wellbeing.path
export const offence = Section.offence_analysis.path
export const drugUse = Section.drug_use.path
export const alcohol = Section.alcohol_use.path
export const personal = Section.personal_relationships_and_community.path
export const thinking = Section.thinking_behaviours_and_attitudes.path
export const finances = Section.finance.path
export const viewAllAnswers = '/view-all-answers'

export const sentencePlanV1URLs = {
  PRIVACY_SCREEN: `${sanFormPath}${privacyStepPath}`,
  ACCOMODATION: sanFormPath + v1Path + accommodation,
  EMPLOYMENT_AND_EDUCATION: sanFormPath + v1Path + employment,
  ALCOHOL_USE: sanFormPath + v1Path + alcohol,
}

// Page titles for san
export const sanPageTitles = {
  accommodation: 'Accommodation',
  employmentAndEducation: 'Employment and education',
  healthAndWellbeing: 'Health and wellbeing',
  drugUse: 'Drug use',
  personal: 'Personal relationships and community',
  thinking: 'Thinking, behaviours and attitudes',
  alcoholUse: 'Alcohol use',
  finances: 'Finances',
  offenceAnalysis: 'Offence analysis',
}

/** Every option of the "do they want to make changes" question each section ends with. */
export const changeOptions = [
  CommonOption.made_changes,
  CommonOption.making_changes,
  CommonOption.want_to_make_changes,
  CommonOption.needs_help_to_make_changes,
  CommonOption.thinking_about_making_changes,
  CommonOption.does_not_want_to_make_changes,
  CommonOption.does_not_want_to_answer,
]

export const forDrug = (code: string, drug: string) => code.replace('%1', drug.toLowerCase())

export const sanServiceName = 'Strengths and needs'

type AccessibilityCheckOptions = {
  include?: string
  disableRules?: string[]
}

// constructs page title:
export const buildPageTitle = (stepTitle: string, serviceName: string = sanServiceName): string =>
  `${stepTitle} - ${serviceName}`

// constructs page error title:
export const buildErrorPageTitle = (stepTitle: string, serviceName: string = sanServiceName): string =>
  `Error: ${buildPageTitle(stepTitle, serviceName)}`

/**
 * Runs the standard WCAG Axe scan for a sentence plan page and expects no violations.
 * By default it scans the main form area, but pages can override the selector if needed.
 */
export const checkAccessibility = async (
  page: Page,
  { include = '[data-qa="main-form"]', disableRules = [] }: AccessibilityCheckOptions = {},
): Promise<void> => {
  let axeBuilder = new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).include(include)

  if (disableRules.length > 0) {
    axeBuilder = axeBuilder.disableRules(disableRules)
  }

  const accessibilityScanResults = await axeBuilder.analyze()
  expect(accessibilityScanResults.violations).toEqual([])
}

/**
 * Handles the privacy screen if it appears, confirming and continuing.
 */
export const handlePrivacyScreenIfPresent = async (page: Page): Promise<void> => {
  if (page.url().includes('/privacy')) {
    const privacyPage = await PrivacyScreenPage.verifyOnPage(page)
    await privacyPage.confirmAndContinue()
  }
}

/**
 * Navigates to a strengths and needs via handover link and handles the privacy screen.
 * Use this for tests that need to get to the San assessment via OASys handover.
 */
export const navigateToStrengthsAndNeeds = async (
  page: Page,
  handoverLink: string,
  expectedPath: string = 'current-accommodation',
): Promise<void> => {
  await page.goto(handoverLink)
  await handlePrivacyScreenIfPresent(page)
  // Wait for the redirect from the handover link to land on the expected page
  await page.waitForURL(url => url.pathname.includes(expectedPath))
}

/**
 * Navigates to a strengths and needs read-only.
 */
export const navigateToStrengthsAndNeedsReadOnly = async (
  page: Page,
  handoverLink: string,
  expectedPath: string = 'accommodation-analysis',
): Promise<void> => {
  await page.goto(handoverLink)
  // Wait for the redirect from the handover link to land on the expected page
  await page.waitForURL(url => url.pathname.includes(expectedPath))
}
