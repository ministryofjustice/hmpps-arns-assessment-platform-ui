import { AxeBuilder } from '@axe-core/playwright'
import { expect, Page } from '@playwright/test'
import PrivacyScreenPage from '../../pages/sentencePlan/privacyScreenPage'

// strengths and needs V1 URLs for use in playwright testing suits:
export const sanFormPath = '/strengths-and-needs'
export const v1Path = '/v1.0'
const privacyStepPath = '/privacy'
export const accommodation = '/accommodation'
export const employment = '/employment-and-education'
export const health = '/health-and-wellbeing'

export const sentencePlanV1URLs = {
  PRIVACY_SCREEN: `${sanFormPath}${privacyStepPath}`,
  ACCOMODATION: sanFormPath + v1Path + accommodation,
  EMPLOYMENT_AND_EDUCATION: sanFormPath + v1Path + employment,
}

// Page titles for san
export const sanPageTitles = {
  accommodation: 'Current accommodation',
  employmentAndEducation: 'Employed',
  healthAndWellbeing: 'Health Wellbeing',
}

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
  url: string = 'current-accommodation',
): Promise<void> => {
  await page.goto(handoverLink)
  await handlePrivacyScreenIfPresent(page)
  expect(page.url()).toContain(url)
}
