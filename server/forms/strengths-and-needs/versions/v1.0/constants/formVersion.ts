import { Data, Transformer } from '@ministryofjustice/hmpps-forge/core/authoring';

export const formVersion = 'v1.0'
/**
 * Centralised data accessors for case data.
 * Use these throughout the form configuration so if paths change, we only update here.
 */
export const CaseData = {
  Forename: Data('caseData.name.forename'),
  ForenamePossessive: Data('caseData.name.forename').pipe(Transformer.String.Possessive()),
  Surname: Data('caseData.name.surname'),
}
export const basePath = `/strengths-and-needs/${formVersion}`
