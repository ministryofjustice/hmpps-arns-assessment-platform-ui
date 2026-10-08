import { expect, Page, Request } from '@playwright/test'
import { test, TargetService } from '../../support/fixtures'
import { alcohol, navigateToStrengthsAndNeeds, offence, sanFormPath, v1Path } from './sanUtils'
import OffenceAnalysisPage from '../../pages/strengthsAndNeeds/offenceAnalysisPage';
import AlcoholUsePage from '../../pages/strengthsAndNeeds/alcoholUsePage';

const AUTOSAVE_TIMEOUT = 30_000
const textCode = 'offence_analysis_description_of_offence'

const openOffenceAnalysis = async (page: Page, baseURL: string, handoverLink: string, assessmentId: string) => {
  await navigateToStrengthsAndNeeds(page, handoverLink)
  await page.goto(`${baseURL}${sanFormPath}${v1Path}/edit/${assessmentId}${offence}/offence-analysis`)
  return page.getByTestId('main-form')
}

// The text field's value in an autosave request, or null for any other request.
const autosavedValue = (request: Request) => {
  const body = new URLSearchParams(request.postData() ?? '')
  return request.method() === 'POST' && body.get('action') === 'autosave' ? body.get(textCode) : null
}

test.describe('Autosave', () => {
  test('autosaves once editing stops', async ({ page, baseURL, createSession, strengthsAndNeedsBuilder }) => {
    const { handoverLink, sanAssessmentId } = await createSession({ targetService: TargetService.STRENGTHS_AND_NEEDS })
    await strengthsAndNeedsBuilder.fresh().save()
    const form = await openOffenceAnalysis(page, baseURL, handoverLink, sanAssessmentId)

    const sent: string[] = []
    page.on('request', request => {
      const value = autosavedValue(request)
      if (value !== null) sent.push(value)
    })

    await form.locator(`[name="${textCode}"]`).pressSequentially('Typed', { delay: 50 })
    await expect(form).toHaveAttribute('data-autosave-state', 'pending')
    await expect(form).toHaveAttribute('data-autosave-state', 'saved', { timeout: AUTOSAVE_TIMEOUT })

    // Debounced: one request for the whole edit, carrying the final value.
    expect(sent).toEqual(['Typed'])
  })

  test('autosaves immediately when the user leaves the page', async ({
    page,
    baseURL,
    createSession,
    strengthsAndNeedsBuilder,
  }) => {
    const { handoverLink, sanAssessmentId } = await createSession({ targetService: TargetService.STRENGTHS_AND_NEEDS })
    await strengthsAndNeedsBuilder.fresh().save()
    const form = await openOffenceAnalysis(page, baseURL, handoverLink, sanAssessmentId)

    // enter a value to test
    await form.locator(`[name="${textCode}"]`).fill('Walked away from')
    await expect(form).toHaveAttribute('data-autosave-state', 'pending')

    // walk away
    await page.goto(`${baseURL}${sanFormPath}${v1Path}/edit/${sanAssessmentId}${alcohol}/alcohol-use-status`)
    await AlcoholUsePage.verifyOnPage(page, 'Has Test ever drunk alcohol')

    // come back
    await page.goto(`${baseURL}${sanFormPath}${v1Path}/edit/${sanAssessmentId}${offence}/offence-analysis`)
    const offenceAnalysisPage = await OffenceAnalysisPage.verifyOnPage(page, 'Offence analysis')

    // check autosaved value is persisted
    await expect(offenceAnalysisPage.questions.offence_analysis_description_of_offence.input).toHaveValue('Walked away from')
  })

  test('is off in a read-only session', async ({ page, createSession, strengthsAndNeedsBuilder }) => {
    const { handoverLink } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
      accessMode: 'READ_ONLY',
      planAccessMode: 'READ_WRITE',
    })
    await strengthsAndNeedsBuilder.fresh().save()

    // A read only session is redirected to the section's analysis page.
    await navigateToStrengthsAndNeeds(page, handoverLink, 'accommodation-analysis')

    await expect(page.getByTestId('main-form')).toHaveAttribute('data-autosave', 'false')
  })
})
