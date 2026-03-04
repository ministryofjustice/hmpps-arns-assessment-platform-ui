import logger from '../../../../../logger'
import { SentencePlanContext, SentencePlanEffectsDeps } from '../types'

// loads sentence information from Delius API if not already present via CRN access route:
export const loadSentenceInformation = (deps: SentencePlanEffectsDeps) => async (context: SentencePlanContext) => {
  const session = context.getSession()
  const caseDetails = session.caseDetails

  if (!caseDetails?.crn) {
    logger.error('Cannot load sentence information: missing CRN in session')
    return
  }

  if (caseDetails.sentences && caseDetails.sentences.length > 0) {
    logger.info('Sentence information already loaded, skipping Delius API call')
    return
  }

  try {
    const deliusCaseDetails = await deps.deliusApi.getCaseDetails(caseDetails.crn)
    session.caseDetails = {
      ...caseDetails,
      sentences: deliusCaseDetails.sentences,
    }
    context.setData('caseData', session.caseDetails)
  } catch (error) {
    logger.error('Error in loadSentenceInformation, failed to load sentence information from Delius: ', error)
  }
}
