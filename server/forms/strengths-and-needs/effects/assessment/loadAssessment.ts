import { SanitisedError } from '@ministryofjustice/hmpps-rest-client'
import { BadRequest, InternalServerError, NotFound } from 'http-errors'
import { unwrapAll } from '../../../../data/aap-api/wrappers'
import { AssessmentVersionQuery } from '../../../../interfaces/aap-api/query'
import { QueryError } from '../../../../errors/aap-api/QueryError'
import { StrengthsAndNeedsContext, StrengthsAndNeedsEffectsDeps } from '../types'
import { AssessmentVersionQueryResult } from '../../../../interfaces/aap-api/queryResult'
import { HandoverContext } from '../../../../interfaces/handover-api/response'

const isMissingAssessmentQueryError = (error: unknown): boolean =>
  error instanceof QueryError && error.queryType === 'AssessmentVersionQuery' && error.result === undefined

const isNotFoundApiError = (error: unknown): boolean => error instanceof SanitisedError && error.responseStatus === 404

export const loadAssessmentQuery = async (deps: StrengthsAndNeedsEffectsDeps, query: AssessmentVersionQuery) => {
  try {
    return await deps.api.executeQuery(query)
  } catch (error) {
    if (isMissingAssessmentQueryError(error) || isNotFoundApiError(error)) {
      return undefined
    }

    throw error
  }
}

/**
 * Validates that the fetched assessment matches the one specified in the handover context.
 * This prevents users from accessing assessments they shouldn't have access to.
 */
const validateAssessmentMatchesHandoverContext = (
  assessment: AssessmentVersionQueryResult,
  handoverContext: HandoverContext,
) => {
  if (!handoverContext?.assessmentContext?.assessmentId) {
    return
  }

  const handoverAssessmentId = handoverContext.assessmentContext.assessmentId
  const fetchedAssessmentId = assessment.assessmentUuid

  if (handoverAssessmentId !== fetchedAssessmentId) {
    throw new BadRequest(`Assessment ID mismatch: expected ${handoverAssessmentId}, but fetched ${fetchedAssessmentId}`)
  }
}

export const loadAssessment = (deps: StrengthsAndNeedsEffectsDeps) => async (context: StrengthsAndNeedsContext) => {
  const user = context.getState('user')
  const session = context.getSession()
  const sessionDetails = session.sessionDetails
  const caseDetails = session.caseDetails

  if (!user) {
    throw new InternalServerError('User is required to load a strengths and needs assessment')
  }

  if (!sessionDetails?.assessmentIdentifier) {
    throw new InternalServerError('Assessment identifier is required in session details')
  }

  const query: AssessmentVersionQuery = {
    type: 'AssessmentVersionQuery',
    user,
    assessmentIdentifier: sessionDetails.assessmentIdentifier,
  }

  // Only a view-historic URL selects a previous version (resolved by resolveHistoricVersion). A version
  // requested by the handover is turned into a view-historic URL on entry
  // (extractModeAndVersionUuidFromHandoverContext), so edit and view URLs always load the current assessment.
  const historicVersion = context.getData('historicVersion')

  if (historicVersion) {
    query.timestamp = historicVersion.updatedAt
  }

  let assessment = await loadAssessmentQuery(deps, query)

  if (!assessment && query.timestamp) {
    // Never fall back to the current assessment when a previous version was asked for.
    throw new NotFound(`No assessment found at version timestamp ${query.timestamp}`)
  }

  if (!assessment) {
    if (!caseDetails?.crn) {
      throw new InternalServerError('CRN is required to create a strengths and needs assessment')
    }

    assessment = await deps.api.executeQuery({
      type: 'AssessmentVersionQuery',
      user,
      assessmentIdentifier: session.sessionDetails.assessmentIdentifier,
    })

    if (session.handoverContext) {
      session.handoverContext = {
        ...session.handoverContext,
        assessmentContext: {
          ...session.handoverContext.assessmentContext,
          assessmentId: assessment.assessmentUuid,
          assessmentVersion: undefined,
        },
      }
    }
  }

  // Validate that the fetched assessment matches the handover context
  validateAssessmentMatchesHandoverContext(assessment, session.handoverContext)

  context.setData('assessment', assessment)
  context.setData('assessmentUuid', assessment.assessmentUuid)
  context.setData('sessionDetails', session.sessionDetails)
  session.assessmentUuid = assessment.assessmentUuid

  const answers = unwrapAll<Record<string, unknown>>(assessment.answers)
  const properties = unwrapAll<Record<string, unknown>>(assessment.properties)

  Object.entries(answers).forEach(([code, value]) => {
    context.setAnswer(code, value)
  })

  Object.entries(properties).forEach(([code, value]) => {
    context.setData(code, value)
  })
}
