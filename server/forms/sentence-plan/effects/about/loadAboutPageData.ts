import { SentencePlanContext, SentencePlanEffectsDeps } from '../types'
import { mockAssessmentData } from './mockAssessmentData'
import { CaseDetails, CaseDetailsSentence } from '../../../../interfaces/delius-api/caseDetails'

/**
 * Formats an ISO date string to UK long date format
 * @param isoDate - Date in YYYY-MM-DD format
 * @returns Formatted date like "15 January 2025" or empty string if invalid
 */
function formatISODateToUKLong(isoDate: string | null | undefined): string {
  if (!isoDate) return ''
  const date = new Date(isoDate)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/**
 * Calculates sentence length from start and end dates
 * @param startDate - Start date in ISO format
 * @param endDate - End date in ISO format
 * @returns Formatted length like "12 months" or "2 years" or empty string
 */
function calculateSentenceLength(startDate: string, endDate: string): string {
  if (!startDate || !endDate) return ''
  const start = new Date(startDate)
  const end = new Date(endDate)
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return ''

  const diffMs = end.getTime() - start.getTime()
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))
  const diffMonths = Math.round(diffDays / 30.44)
  const diffYears = Math.round(diffDays / 365.25)

  if (diffYears >= 2) {
    return `${diffYears} years`
  }
  if (diffMonths >= 1) {
    return `${diffMonths} month${diffMonths === 1 ? '' : 's'}`
  }
  return `${diffDays} day${diffDays === 1 ? '' : 's'}`
}

/**
 * Processed sentence data for display
 */
export interface FormattedSentence {
  description: string
  sentenceLength: string
  endDate: string
  unpaidWorkHours: number | null
  rarDays: number | null
  hasUnpaidWork: boolean
  hasRar: boolean
}

/**
 * Transform raw sentence data for display
 */
function formatSentenceData(sentence: CaseDetailsSentence): FormattedSentence {
  return {
    description: sentence.description,
    sentenceLength: calculateSentenceLength(sentence.startDate, sentence.endDate),
    endDate: formatISODateToUKLong(sentence.endDate),
    unpaidWorkHours: sentence.unpaidWorkHoursOrdered ?? null,
    rarDays: sentence.rarDaysOrdered ?? null,
    hasUnpaidWork: (sentence.unpaidWorkHoursOrdered ?? 0) > 0,
    hasRar: sentence.rarRequirement,
  }
}

/**
 * Load About page data
 *
 * Loads assessment data (mocked) and sets error flags based on data availability.
 * The sentence data comes from caseData which is already loaded by loadPersonByCrn.
 *
 * Sets the following data:
 * - assessmentInfo: Assessment data grouped by scoring (currently mocked)
 * - formattedSentences: Sentence data with formatted dates
 * - deliusDataError: true if case data is unavailable or has no sentences
 * - assessmentDataError: true if assessment data is unavailable (for future API integration)
 */
export const loadAboutPageData = (_deps: SentencePlanEffectsDeps) => async (context: SentencePlanContext) => {
  // Get case data (already loaded by journey-level loadPersonByCrn)
  const caseData = context.getData('caseData') as CaseDetails | undefined

  // Check if Delius data is available
  const hasDeliusData = caseData?.sentences && caseData.sentences.length > 0
  context.setData('deliusDataError', !hasDeliusData)

  // Format sentence data for display
  const formattedSentences = hasDeliusData ? caseData!.sentences.map(formatSentenceData) : []
  context.setData('formattedSentences', formattedSentences)

  // Set mocked assessment data
  // TODO: Replace with real API call when available
  context.setData('assessmentInfo', mockAssessmentData)
  context.setData('assessmentDataError', false)
}
