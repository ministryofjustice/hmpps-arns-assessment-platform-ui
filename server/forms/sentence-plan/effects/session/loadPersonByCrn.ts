import { SentencePlanContext, SentencePlanEffectsDeps } from '../types'

/**
 * Load person/case data from Delius by CRN
 *
 * Fetches case details including name, sentences, and other data.
 * Stores the result as 'caseData' in context for use in form fields.
 */
export const loadPersonByCrn = (deps: SentencePlanEffectsDeps) => async (context: SentencePlanContext) => {
  // TODO: Remove hardcoded fallback CRN once we have a proper mechanism
  //  for the OASys path to provide person identification
  const crn = context.getRequestParam('crn') ?? 'X123456'

  const caseData = await deps.deliusApi.getCaseDetails(crn)
  context.setData('caseData', caseData)
}
