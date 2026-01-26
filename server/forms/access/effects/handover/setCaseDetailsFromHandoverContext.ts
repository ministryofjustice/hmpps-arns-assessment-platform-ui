import { InternalServerError } from 'http-errors'
import { AccessContext } from '../types'

/**
 * Set case details from handover context.
 *
 * Must be called after loadHandoverContext has populated the session
 * with handover context data.
 */
export const setCaseDetailsFromHandoverContext = () => (context: AccessContext) => {
  const session = context.getSession()
  const handoverContext = session?.handoverContext

  if (!handoverContext) {
    throw new InternalServerError('Handover context is required - ensure loadHandoverContext runs first')
  }

  const { subject } = handoverContext

  session.caseDetails = {
    name: {
      forename: subject.givenName,
      middleName: '',
      surname: subject.familyName,
    },
    crn: subject.crn,
    pnc: subject.pnc,
    dateOfBirth: subject.dateOfBirth,
    nomisId: subject.nomisId,
    location: subject.location,
    sexuallyMotivatedOffenceHistory: subject.sexuallyMotivatedOffenceHistory,
    tier: '',
    region: '',
    sentences: [],
  }
}
