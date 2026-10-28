import { SanitisedError } from '@ministryofjustice/hmpps-rest-client'
import { BadRequest, InternalServerError, NotFound } from 'http-errors'
import { DateTime } from 'luxon'
import { unwrapAll } from '../../../../data/aap-api/wrappers'
import { AssessmentVersionQuery } from '../../../../interfaces/aap-api/query'
import { QueryError } from '../../../../errors/aap-api/QueryError'
import { StrengthsAndNeedsContext, StrengthsAndNeedsEffectsDeps } from '../types'
import { AssessmentVersionQueryResult } from '../../../../interfaces/aap-api/queryResult'
import { HandoverContext } from '../../../../interfaces/handover-api/response'
import { storePreviousVersionsInSession } from './loadPreviousVersions'

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

  // Only the URL selects a previous version. A version requested by the handover is turned into a
  // view-historic URL on entry (extractModeAndVersionUuidFromHandoverContext), so edit and view
  // URLs always load the current assessment.
  const mode = context.getRequestParam('mode')
  const uuid = context.getRequestParam('uuid')

  if (uuid && mode && ['view-historic'].includes(mode)) {
    if (!session.unaggregatedVersions) {
      // session.uuid holds a version UUID after a historic handover, so prefer the handover's assessment ID
      const assessmentUuid = session.handoverContext?.assessmentContext?.assessmentId ?? session.uuid
      await storePreviousVersionsInSession(deps, assessmentUuid, session)
    }

    const previousVersion = session.unaggregatedVersions.find(it => it.entityType === 'AAP_SAN' && it.uuid === uuid)

    if (!previousVersion) {
      const validUuids = session.unaggregatedVersions.map(it => it.uuid).join(', ')
      throw new NotFound(`Invalid assessment version UUID: ${uuid}. Valid UUIDs: ${validUuids}`)
    }

    query.timestamp = previousVersion.updatedAt
    // Coordinator timestamps are UTC; don't let an offset-less value be read in the server's time zone.
    context.setData('previousVersionDate', DateTime.fromISO(previousVersion.updatedAt, { zone: 'utc' }).toMillis())
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
  session.uuid = assessment.assessmentUuid

  const answers = unwrapAll<Record<string, unknown>>(assessment.answers)
  const properties = unwrapAll<Record<string, unknown>>(assessment.properties)

  Object.entries(answers).forEach(([code, value]) => {
    context.setAnswer(code, value)
  })

  Object.entries(properties).forEach(([code, value]) => {
    context.setData(code, value)
  })
}
